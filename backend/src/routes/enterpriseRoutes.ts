import { Router } from 'express';
import {
  getAllEnterprises,
  getEnterpriseById,
  createEnterprise,
  updateEnterprise,
  deleteEnterprise,
} from '../controllers/enterpriseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getAllEnterprises);
router.get('/:id', authenticate, getEnterpriseById);
router.post('/', authenticate, authorize(['ADMIN']), createEnterprise);
router.put('/:id', authenticate, authorize(['ADMIN']), updateEnterprise);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteEnterprise);

export default router;
