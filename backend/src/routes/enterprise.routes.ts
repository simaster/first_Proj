import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import {
  getEnterprises,
  getEnterpriseById,
  createEnterprise,
  updateEnterprise,
  deleteEnterprise,
} from '../controllers/enterprise.controller'

const router = Router()

router.get('/', authenticate, getEnterprises)
router.get('/:id', authenticate, getEnterpriseById)
router.post('/', authenticate, authorize('ADMIN'), createEnterprise)
router.put('/:id', authenticate, authorize('ADMIN'), updateEnterprise)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteEnterprise)

export default router
