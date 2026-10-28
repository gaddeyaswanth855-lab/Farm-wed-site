import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';
import { pestDiagnosisRequestSchema } from '../validators/agriSchemas.js';
import { ai, AGRI_MODEL, isGeminiConfigured } from '../config/gemini.js';
import {
  PEST_DIAGNOSIS_PROMPT,
  pestDiagnosisResponseSchema,
  generateDeterministicPestDiagnosis
} from '../prompts/pestDoctorPrompts.js';
import { AGRI_SYSTEM_PROMPT } from '../prompts/chatPrompts.js';

export async function diagnosePest(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const validated = pestDiagnosisRequestSchema.parse(req.body);

    let diagnosisData: any = null;

    if (isGeminiConfigured && ai) {
      try {
        const promptText = PEST_DIAGNOSIS_PROMPT(validated);
        const contents: any[] = [{ text: promptText }];

        if (validated.imageBase64) {
          const match = validated.imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
          const mimeType = match ? match[1] : 'image/jpeg';
          const base64Data = match ? match[2] : validated.imageBase64;

          contents.push({
            inlineData: {
              mimeType,
              data: base64Data
            }
          });
        }

        const response = await ai.models.generateContent({
          model: AGRI_MODEL,
          contents,
          config: {
            systemInstruction: AGRI_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: pestDiagnosisResponseSchema,
            temperature: 0.2
          }
        });

        if (response.text) {
          diagnosisData = JSON.parse(response.text);
        }
      } catch (geminiErr) {
        console.warn('Gemini Multimodal Pest Diagnosis error, using pathology fallback:', geminiErr);
        diagnosisData = null;
      }
    }

    if (!diagnosisData) {
      diagnosisData = generateDeterministicPestDiagnosis(validated);
    }

    // Persist diagnosis
    const insertQuery = `
      INSERT INTO pest_diagnoses (
        user_id, plot_id, crop_name, symptoms_text, image_url,
        diagnosis_name, pathogen_type, severity_level, organic_remedies,
        chemical_remedies, prevention_tips
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      userId,
      validated.plotId || null,
      validated.cropName,
      validated.symptomsText,
      validated.imageBase64 ? validated.imageBase64.substring(0, 100) + '...' : null,
      diagnosisData.diagnosisName,
      diagnosisData.pathogenType.toLowerCase().replace(/\s+/g, '_'),
      diagnosisData.severityLevel.toLowerCase(),
      diagnosisData.organicRemedies,
      diagnosisData.chemicalRemedies,
      diagnosisData.preventativeMeasuresNextSeason
    ]);

    return res.status(200).json({
      success: true,
      data: {
        diagnosisId: result.rows[0].id,
        cropName: validated.cropName,
        plantPart: validated.plantPart,
        ...diagnosisData
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getPestHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const result = await db.query(
      `SELECT * FROM pest_diagnoses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
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
