import api from './api';
import type { MonitoringData } from '../types';

export const monitoringService = {
  async getData(filters: {
    machineId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<MonitoringData[]> {
    const response = await api.get('/monitoring/data', { params: filters });
    return response.data.data;
  },

  async submitData(data: Omit<MonitoringData, 'id' | 'timestamp' | 'machine'>): Promise<MonitoringData> {
    const response = await api.post('/monitoring/data', data);
    return response.data.data;
  },

  async getStats(filters: {
    machineId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const response = await api.get('/monitoring/stats', { params: filters });
    return response.data.data;
  },
};
