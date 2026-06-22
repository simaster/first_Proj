import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { z } from 'zod';

const authService = new AuthService();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const register = async (req: Request, res: Response) => {
  try {
    registerSchema.parse({ body: req.body });

    const tokens = await authService.register(req.body);

    res.status(201).json({
      status: 'success',
      data: tokens,
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    loginSchema.parse({ body: req.body });

    const tokens = await authService.login(req.body);

    res.status(200).json({
      status: 'success',
      data: tokens,
    });
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required',
      });
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).json({
      status: 'success',
      data: tokens,
    });
  } catch (error) {
    throw error;
  }
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};
