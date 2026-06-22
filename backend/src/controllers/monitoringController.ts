import { Request, Response } from 'express';
import { MonitoringService } from '../services/monitoringService';

const monitoringService = new MonitoringService();

export const getMonitoringData = async (req: Request, res: Response) => {
  try {
    const filters = {
      machineId: req.query.machineId as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    };

    const data = await monitoringService.getMonitoringData(filters);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const submitMonitoringData = async (req: Request, res: Response) => {
  try {
    const data = await monitoringService.submitMonitoringData(req.body);

    res.status(201).json({
      status: 'success',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const getMonitoringStats = async (req: Request, res: Response) => {
  try {
    const filters = {
      machineId: req.query.machineId as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    };

    const stats = await monitoringService.getMonitoringStats(filters);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    throw error;
  }
};
