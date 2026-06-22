import api from './api';
import type { Machine, MonitoringData } from '../types';

export const machineService = {
  async getAll(): Promise<Machine[]> {
    const response = await api.get('/machines');
    return response.data.data;
  },

  async getById(id: string): Promise<Machine> {
    const response = await api.get(`/machines/${id}`);
    return response.data.data;
  },

  async create(data: Omit<Machine, 'id' | 'createdAt' | 'updatedAt' | 'enterprise' | 'monitoringData'>): Promise<Machine> {
    const response = await api.post('/machines', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<Machine>): Promise<Machine> {
    const response = await api.put(`/machines/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/machines/${id}`);
  },

  async getMonitoringData(id: string, limit?: number): Promise<MonitoringData[]> {
    const response = await api.get(`/machines/${id}/monitoring`, {
      params: { limit },
    });
    return response.data.data;
  },
};
