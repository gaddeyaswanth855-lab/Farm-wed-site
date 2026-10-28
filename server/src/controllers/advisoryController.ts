import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';
import { cropPlanRequestSchema } from '../validators/agriSchemas.js';
import { ai, AGRI_MODEL, isGeminiConfigured } from '../config/gemini.js';
import {
  CROP_PLANNER_PROMPT,
  cropPlannerResponseSchema,
  generateDeterministicCropPlan
} from '../prompts/cropPlannerPrompts.js';
import { AGRI_SYSTEM_PROMPT } from '../prompts/chatPrompts.js';

export async function generateCropPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const validated = cropPlanRequestSchema.parse(req.body);

    let planData: any = null;

    if (isGeminiConfigured && ai) {
      try {
        const promptText = CROP_PLANNER_PROMPT(validated);
        const response = await ai.models.generateContent({
          model: AGRI_MODEL,
          contents: promptText,
          config: {
            systemInstruction: AGRI_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: cropPlannerResponseSchema,
            temperature: 0.2
          }
        });

        if (response.text) {
          planData = JSON.parse(response.text);
        }
      } catch (geminiErr) {
        console.warn('Gemini API call encountered error, using deterministic agronomic fallback:', geminiErr);
        planData = null;
      }
    }

    if (!planData) {
      planData = generateDeterministicCropPlan(validated);
    }

    // Calculate aggregated metrics
    const topCrop = planData.recommendedCrops[0] || {};
    const totalEstimatedCost = (topCrop.estimatedCostPerAcreINR || 15000) * validated.sizeAcres;
    const expectedNetMargin = topCrop.estimatedNetProfitINR || (totalEstimatedCost * 1.8);
    const climateRiskScore = planData.climateRiskIndex || 5;

    // Persist advisory
    const insertQuery = `
      INSERT INTO crop_advisories (
        user_id, plot_id, season, recommended_crops, water_budget_analysis,
        total_estimated_cost, expected_net_margin, climate_risk_score, ai_raw_response
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      userId,
      validated.plotId || null,
      validated.season,
      planData.recommendedCrops,
      { note: planData.waterBudgetingNote },
      totalEstimatedCost,
      expectedNetMargin,
      climateRiskScore,
      planData
    ]);

    return res.status(200).json({
      success: true,
      data: {
        advisoryId: result.rows[0].id,
        season: validated.season,
        plotId: validated.plotId,
        totalEstimatedCost,
        expectedNetMargin,
        climateRiskScore,
        ...planData
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisoryHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const result = await db.query(
      `SELECT * FROM crop_advisories WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
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
