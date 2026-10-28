import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';
import { chatMessageSchema } from '../validators/agriSchemas.js';
import { ai, AGRI_MODEL, isGeminiConfigured } from '../config/gemini.js';
import {
  AGRI_SYSTEM_PROMPT,
  checkDistressSentiment,
  EMERGENCY_HELPLINE_DATA
} from '../prompts/chatPrompts.js';

export async function sendChatMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const validated = chatMessageSchema.parse(req.body);

    const isDistress = checkDistressSentiment(validated.messageText);

    // Save user message
    const insertUserSql = `
      INSERT INTO chat_messages (user_id, sender, message_text, distress_flag)
      VALUES ($1, 'user', $2, $3)
      RETURNING *
    `;
    await db.query(insertUserSql, [userId, validated.messageText, isDistress]);

    let replyText = '';
    let actionablePayload: any = null;

    if (isDistress) {
      replyText = `Namaste Farmer Brother / Sister. I hear your pain and deep stress, but please know that no financial debt, crop failure, or pressure from money recovery agents is worth your life. Your family and community need you alive. 

There are strong institutional protections created specifically for farmers facing debt crises, including statutory moratoriums on recovery under the Debt Relief Acts and immediate emergency relief funds.

Please reach out to the toll-free counselors and agricultural crisis lines below right now. They are free, confidential, and available in your mother tongue:`;
      actionablePayload = EMERGENCY_HELPLINE_DATA;
    } else {
      // Fetch user plots context for personalized advisory
      const plotsResult = await db.query(`SELECT * FROM plots WHERE user_id = $1`, [userId]);
      const plots = plotsResult.rows;
      const plotsContext = plots.map(p => 
        `- Plot "${p.plot_name}": ${p.size_acres} acres, ${p.soil_type} soil, ${p.irrigation_type} water source, Current Crop: ${p.current_crop || 'Fallow'}`
      ).join('\n');

      if (isGeminiConfigured && ai) {
        try {
          const userContextPrompt = `
Farmer Plots & Operational Context:
${plotsContext || 'Smallholder farmer, 5 acres mixed holding.'}

Farmer Question / Query:
"${validated.messageText}"

Please provide a clear, empathetic, pragmatic, and actionable response suitable for Indian rural agronomy. Include specific seed varieties, dosages in metric units, biological IPM methods, and realistic market perspectives where relevant.
`;
          const response = await ai.models.generateContent({
            model: AGRI_MODEL,
            contents: userContextPrompt,
            config: {
              systemInstruction: AGRI_SYSTEM_PROMPT,
              temperature: 0.4
            }
          });

          replyText = response.text || 'I am ready to assist you with your farming and crop questions.';
        } catch (geminiErr) {
          console.warn('Gemini chat error, fallback to conversational heuristic:', geminiErr);
          replyText = generateFallbackChatResponse(validated.messageText, plots);
        }
      } else {
        replyText = generateFallbackChatResponse(validated.messageText, plots);
      }
    }

    // Save assistant message
    const insertAssistantSql = `
      INSERT INTO chat_messages (user_id, sender, message_text, distress_flag, actionable_payload)
      VALUES ($1, 'assistant', $2, $3, $4)
      RETURNING *
    `;
    const assistantRecord = await db.query(insertAssistantSql, [
      userId,
      replyText,
      isDistress,
      actionablePayload ? JSON.stringify(actionablePayload) : null
    ]);

    return res.status(200).json({
      success: true,
      data: {
        id: assistantRecord.rows[0].id,
        sender: 'assistant',
        messageText: replyText,
        distressFlag: isDistress,
        actionablePayload,
        createdAt: assistantRecord.rows[0].created_at
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getChatHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const result = await db.query(
      `SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC LIMIT 50`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

function generateFallbackChatResponse(query: string, plots: any[]): string {
  const q = query.toLowerCase();

  if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('dose')) {
    return `For balanced nutrient application, avoid applying all Urea at once which leads to volatilization and leaf scorch. Split Nitrogen into 3 equal applications: 1/3rd at sowing alongside DAP and MOP, 1/3rd at active tillering (30-35 days), and 1/3rd at flower emergence. Ensure soil contains adequate organic carbon (FYM or compost) so chemical nutrients do not leach away.`;
  }

  if (q.includes('pest') || q.includes('spray') || q.includes('insect') || q.includes('worm')) {
    return `To control pests without destroying beneficial predatory insects, start with 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 10,000 ppm (3ml/L) and install yellow/blue sticky traps. If caterpillar infestation exceeds 10% damage threshold, use biological Bt (Bacillus thuringiensis 2g/L) before turning to targeted synthetic chemicals.`;
  }

  if (q.includes('water') || q.includes('irrigate') || q.includes('drought') || q.includes('rain')) {
    return `During moisture stress, create shallow dust mulches or spread crop residues along rows to arrest capillary evaporation. If using drip systems, schedule irrigation during early mornings (5 AM - 8 AM) to minimize 30% solar evaporation loss.`;
  }

  if (q.includes('mandi') || q.includes('price') || q.includes('sell') || q.includes('market')) {
    return `Before taking produce to the local Mandi, check modal prices at nearby district APMCs on our Mandi Intelligence tab. If prices are suppressed by middleman cartels during peak arrivals, consider holding dried produce for 60-90 days using hermetic storage bags or local WDRA warehouses to pledge for a 75% low-interest cash advance.`;
  }

  if (q.includes('subsidy') || q.includes('scheme') || q.includes('loan') || q.includes('kcc')) {
    return `You have high eligibility for PM-KISAN (₹6,000/yr), Kisan Credit Card (4% interest up to ₹3 Lakh), and the PM-KUSUM 60% Solar Pump subsidy. Check the 'Govt Schemes' tab in our app for direct document checklists and one-click application links.`;
  }

  return `Namaste! I am your Kisan Bandhu AI assistant. I can assist you with customized crop planning, pest and disease remedy schedules, fertilizer bag calculations (Urea/DAP/MOP), Mandi price trends, and government welfare subsidies. How can I help your farm today?`;
}
