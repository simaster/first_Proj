import { Request, Response } from 'express';
import { MachineService } from '../services/machineService';

const machineService = new MachineService();

export const getAllMachines = async (req: Request, res: Response) => {
  try {
    const machines = await machineService.getAllMachines();

    res.status(200).json({
      status: 'success',
      data: machines,
    });
  } catch (error) {
    throw error;
  }
};

export const getMachineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const machine = await machineService.getMachineById(id);

    res.status(200).json({
      status: 'success',
      data: machine,
    });
  } catch (error) {
    throw error;
  }
};

export const createMachine = async (req: Request, res: Response) => {
  try {
    const machine = await machineService.createMachine(req.body);

    res.status(201).json({
      status: 'success',
      data: machine,
    });
  } catch (error) {
    throw error;
  }
};

export const updateMachine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const machine = await machineService.updateMachine(id, req.body);

    res.status(200).json({
      status: 'success',
      data: machine,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteMachine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await machineService.deleteMachine(id);

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};

export const getMachineMonitoringData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const data = await machineService.getMachineMonitoringData(id, limit);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    throw error;
  }
};
