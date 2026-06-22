import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class MonitoringService {
  async getMonitoringData(filters: {
    machineId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const { machineId, startDate, endDate, limit = 100 } = filters;

    const where: any = {};

    if (machineId) {
      where.machineId = machineId;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = startDate;
      }
      if (endDate) {
        where.timestamp.lte = endDate;
      }
    }

    return prisma.monitoringData.findMany({
      where,
      include: {
        machine: {
          include: {
            enterprise: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  async submitMonitoringData(data: {
    machineId: string;
    temperature: number;
    pressure: number;
    cycleTime: number;
  }) {
    const machine = await prisma.machine.findUnique({
      where: { id: data.machineId },
    });

    if (!machine) {
      throw new AppError('Machine not found', 404);
    }

    return prisma.monitoringData.create({
      data,
    });
  }

  async getMonitoringStats(filters: {
    machineId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { machineId, startDate, endDate } = filters;

    const where: any = {};

    if (machineId) {
      where.machineId = machineId;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = startDate;
      }
      if (endDate) {
        where.timestamp.lte = endDate;
      }
    }

    const data = await prisma.monitoringData.findMany({
      where,
    });

    if (data.length === 0) {
      return {
        count: 0,
        avgTemperature: 0,
        avgPressure: 0,
        avgCycleTime: 0,
        maxTemperature: 0,
        minTemperature: 0,
        maxPressure: 0,
        minPressure: 0,
      };
    }

    const temperatures = data.map((d) => d.temperature);
    const pressures = data.map((d) => d.pressure);
    const cycleTimes = data.map((d) => d.cycleTime);

    return {
      count: data.length,
      avgTemperature: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
      avgPressure: pressures.reduce((a, b) => a + b, 0) / pressures.length,
      avgCycleTime: cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length,
      maxTemperature: Math.max(...temperatures),
      minTemperature: Math.min(...temperatures),
      maxPressure: Math.max(...pressures),
      minPressure: Math.min(...pressures),
    };
  }
}
