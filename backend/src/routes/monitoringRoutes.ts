import { Router } from 'express';
import {
  getMonitoringData,
  submitMonitoringData,
  getMonitoringStats,
} from '../controllers/monitoringController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/data', authenticate, getMonitoringData);
router.post('/data', authenticate, submitMonitoringData);
router.get('/stats', authenticate, getMonitoringStats);

export default router;
