import api from './api';
import type { Enterprise } from '../types';

export const enterpriseService = {
  async getAll(): Promise<Enterprise[]> {
    const response = await api.get('/enterprises');
    return response.data.data;
  },

  async getById(id: string): Promise<Enterprise> {
    const response = await api.get(`/enterprises/${id}`);
    return response.data.data;
  },

  async create(data: Omit<Enterprise, 'id' | 'createdAt' | 'updatedAt' | 'machines'>): Promise<Enterprise> {
    const response = await api.post('/enterprises', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<Enterprise>): Promise<Enterprise> {
    const response = await api.put(`/enterprises/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/enterprises/${id}`);
  },
};
