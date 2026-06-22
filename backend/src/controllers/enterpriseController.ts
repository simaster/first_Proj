import { Request, Response } from 'express';
import { EnterpriseService } from '../services/enterpriseService';

const enterpriseService = new EnterpriseService();

export const getAllEnterprises = async (req: Request, res: Response) => {
  try {
    const enterprises = await enterpriseService.getAllEnterprises();

    res.status(200).json({
      status: 'success',
      data: enterprises,
    });
  } catch (error) {
    throw error;
  }
};

export const getEnterpriseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enterprise = await enterpriseService.getEnterpriseById(id);

    res.status(200).json({
      status: 'success',
      data: enterprise,
    });
  } catch (error) {
    throw error;
  }
};

export const createEnterprise = async (req: Request, res: Response) => {
  try {
    const enterprise = await enterpriseService.createEnterprise(req.body);

    res.status(201).json({
      status: 'success',
      data: enterprise,
    });
  } catch (error) {
    throw error;
  }
};

export const updateEnterprise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enterprise = await enterpriseService.updateEnterprise(id, req.body);

    res.status(200).json({
      status: 'success',
      data: enterprise,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteEnterprise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await enterpriseService.deleteEnterprise(id);

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};
