import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  getMachineMonitoring,
} from '../controllers/machine.controller'

const router = Router()

router.get('/', authenticate, getMachines)
router.get('/:id', authenticate, getMachineById)
router.post('/', authenticate, authorize('ADMIN'), createMachine)
router.put('/:id', authenticate, authorize('ADMIN'), updateMachine)
router.delete('/:id', authenticate, authorize('ADMIN'), deleteMachine)
router.get('/:id/monitoring', authenticate, getMachineMonitoring)

export default router
