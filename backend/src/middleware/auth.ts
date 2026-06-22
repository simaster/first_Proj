import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'ADMIN' | 'USER';
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };

    req.userId = decoded.userId;
    req.userRole = decoded.role as 'ADMIN' | 'USER';

    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};

export const authorize = (roles: ('ADMIN' | 'USER')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
};
