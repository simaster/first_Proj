import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class MachineService {
  async getAllMachines() {
    return prisma.machine.findMany({
      include: {
        enterprise: true,
        monitoringData: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 10,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getMachineById(id: string) {
    const machine = await prisma.machine.findUnique({
      where: { id },
      include: {
        enterprise: true,
        monitoringData: {
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    if (!machine) {
      throw new AppError('Machine not found', 404);
    }

    return machine;
  }

  async createMachine(data: {
    name: string;
    code: string;
    enterpriseId: string;
    status?: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  }) {
    const existingMachine = await prisma.machine.findUnique({
      where: { code: data.code },
    });

    if (existingMachine) {
      throw new AppError('Machine code already exists', 409);
    }

    const enterprise = await prisma.enterprise.findUnique({
      where: { id: data.enterpriseId },
    });

    if (!enterprise) {
      throw new AppError('Enterprise not found', 404);
    }

    return prisma.machine.create({
      data,
    });
  }

  async updateMachine(
    id: string,
    data: {
      name?: string;
      status?: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
    }
  ) {
    const machine = await prisma.machine.findUnique({
      where: { id },
    });

    if (!machine) {
      throw new AppError('Machine not found', 404);
    }

    return prisma.machine.update({
      where: { id },
      data,
    });
  }

  async deleteMachine(id: string) {
    const machine = await prisma.machine.findUnique({
      where: { id },
    });

    if (!machine) {
      throw new AppError('Machine not found', 404);
    }

    await prisma.machine.delete({
      where: { id },
    });
  }

  async getMachineMonitoringData(id: string, limit: number = 100) {
    const machine = await prisma.machine.findUnique({
      where: { id },
    });

    if (!machine) {
      throw new AppError('Machine not found', 404);
    }

    return prisma.monitoringData.findMany({
      where: { machineId: id },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }
}
