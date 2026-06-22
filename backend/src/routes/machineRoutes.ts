import { Router } from 'express';
import {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  getMachineMonitoringData,
} from '../controllers/machineController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllMachines);
router.get('/:id', authenticate, getMachineById);
router.post('/', authenticate, authorize(['ADMIN']), createMachine);
router.put('/:id', authenticate, authorize(['ADMIN']), updateMachine);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteMachine);
router.get('/:id/monitoring', authenticate, getMachineMonitoringData);

export default router;
