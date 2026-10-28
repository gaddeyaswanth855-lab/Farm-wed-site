import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';
import { userRegistrationSchema } from '../validators/agriSchemas.js';
import { AppError } from '../middleware/errorMiddleware.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export async function registerOrUpdateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = userRegistrationSchema.parse(req.body);

    // Check if user exists by phone
    const checkQuery = `SELECT * FROM users WHERE phone_number = $1`;
    const existing = await db.query(checkQuery, [validated.phoneNumber]);

    let user;
    if (existing.rows.length > 0) {
      const updateQuery = `
        UPDATE users 
        SET full_name = $1, state = $2, district = $3, taluka_block = $4, preferred_language = $5, total_land_acres = $6, updated_at = NOW()
        WHERE phone_number = $7
        RETURNING *
      `;
      const result = await db.query(updateQuery, [
        validated.fullName,
        validated.state,
        validated.district,
        validated.talukaBlock || null,
        validated.preferredLanguage,
        validated.totalLandAcres,
        validated.phoneNumber
      ]);
      user = result.rows[0];
    } else {
      const insertQuery = `
        INSERT INTO users (full_name, phone_number, state, district, taluka_block, preferred_language, total_land_acres)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const result = await db.query(insertQuery, [
        validated.fullName,
        validated.phoneNumber,
        validated.state,
        validated.district,
        validated.talukaBlock || null,
        validated.preferredLanguage,
        validated.totalLandAcres
      ]);
      user = result.rows[0];
    }

    const token = jwt.sign(
      { sub: user.id, phone: user.phone_number, name: user.full_name },
      env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);

    if (userResult.rows.length === 0) {
      throw new AppError(404, 'Farmer profile not found', 'USER_NOT_FOUND');
    }

    const user = userResult.rows[0];

    // Get aggregated farm metrics
    const plotsResult = await db.query(`SELECT * FROM plots WHERE user_id = $1`, [userId]);
    const plots = plotsResult.rows;

    const totalAcreage = plots.reduce((sum: number, p: any) => sum + Number(p.size_acres || 0), 0);
    const rainfedAcreage = plots
      .filter((p: any) => p.irrigation_type === 'rainfed')
      .reduce((sum: number, p: any) => sum + Number(p.size_acres || 0), 0);
    const rainDependencyRatio = totalAcreage > 0 ? Math.round((rainfedAcreage / totalAcreage) * 100) : 0;

    const lowCarbonPlots = plots.filter((p: any) => p.organic_carbon_status === 'low').length;
    const soilHealthScore = plots.length > 0 ? Math.max(10, 100 - (lowCarbonPlots / plots.length) * 45) : 75;

    return res.status(200).json({
      success: true,
      data: {
        user,
        plotsCount: plots.length,
        totalAcreage,
        rainDependencyRatio,
        soilHealthScore: Math.round(soilHealthScore),
        activeSeason: 'Kharif / Rabi Transition'
      }
    });
  } catch (err) {
    next(err);
  }
}
