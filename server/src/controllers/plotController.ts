import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';
import { createPlotSchema } from '../validators/agriSchemas.js';
import { AppError } from '../middleware/errorMiddleware.js';

export async function getUserPlots(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const result = await db.query(
      `SELECT * FROM plots WHERE user_id = $1 ORDER BY created_at DESC`,
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

export async function createPlot(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const validated = createPlotSchema.parse(req.body);

    const insertQuery = `
      INSERT INTO plots (
        user_id, plot_name, size_acres, irrigation_type, soil_type, 
        organic_carbon_status, soil_ph, current_crop, sowing_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      userId,
      validated.plotName,
      validated.sizeAcres,
      validated.irrigationType,
      validated.soilType,
      validated.organicCarbonStatus,
      validated.soilPh,
      validated.currentCrop || null,
      validated.sowingDate || null
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

export async function deletePlot(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const plotId = req.params.id;

    // Strict tenant isolation guard
    const checkQuery = `SELECT * FROM plots WHERE id = $1 AND user_id = $2`;
    const checkResult = await db.query(checkQuery, [plotId, userId]);

    if (checkResult.rows.length === 0) {
      throw new AppError(404, 'Plot not found or unauthorized access', 'NOT_FOUND');
    }

    await db.query(`DELETE FROM plots WHERE id = $1 AND user_id = $2`, [plotId, userId]);

    return res.status(200).json({
      success: true,
      data: { message: 'Plot removed successfully', id: plotId }
    });
  } catch (err) {
    next(err);
  }
}
