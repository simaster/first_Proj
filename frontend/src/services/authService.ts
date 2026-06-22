import api from './api';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};
