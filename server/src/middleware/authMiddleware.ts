import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorMiddleware.js';

export interface AuthenticatedUser {
  id: string;
  phone?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const DEFAULT_DEMO_USER: AuthenticatedUser = {
  id: 'e2b34a15-0819-4a94-984e-3755c91b1001',
  phone: '9876543210',
  name: 'Rameshwar "Ramesh" Patil'
};

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      req.user = {
        id: decoded.sub || decoded.id,
        phone: decoded.phone,
        name: decoded.name
      };
      return next();
    } catch (err) {
      // In production reject, but fallback to demo in dev for seamless experience
      if (env.NODE_ENV === 'production') {
        return next(new AppError(401, 'Invalid or expired authorization token', 'UNAUTHORIZED'));
      }
    }
  }

  // Seamless fallback to pre-configured primary farmer profile
  req.user = DEFAULT_DEMO_USER;
  next();
}
