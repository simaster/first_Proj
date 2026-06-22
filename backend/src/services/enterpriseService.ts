import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class EnterpriseService {
  async getAllEnterprises() {
    return prisma.enterprise.findMany({
      include: {
        machines: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getEnterpriseById(id: string) {
    const enterprise = await prisma.enterprise.findUnique({
      where: { id },
      include: {
        machines: true,
      },
    });

    if (!enterprise) {
      throw new AppError('Enterprise not found', 404);
    }

    return enterprise;
  }

  async createEnterprise(data: { name: string; code: string; address?: string; contact?: string }) {
    const existingEnterprise = await prisma.enterprise.findUnique({
      where: { code: data.code },
    });

    if (existingEnterprise) {
      throw new AppError('Enterprise code already exists', 409);
    }

    return prisma.enterprise.create({
      data,
    });
  }

  async updateEnterprise(id: string, data: { name?: string; address?: string; contact?: string }) {
    const enterprise = await prisma.enterprise.findUnique({
      where: { id },
    });

    if (!enterprise) {
      throw new AppError('Enterprise not found', 404);
    }

    return prisma.enterprise.update({
      where: { id },
      data,
    });
  }

  async deleteEnterprise(id: string) {
    const enterprise = await prisma.enterprise.findUnique({
      where: { id },
    });

    if (!enterprise) {
      throw new AppError('Enterprise not found', 404);
    }

    await prisma.enterprise.delete({
      where: { id },
    });
  }
}
