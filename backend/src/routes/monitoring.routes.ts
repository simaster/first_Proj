import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  getMonitoringData,
  createMonitoringData,
  getMonitoringStats,
} from '../controllers/monitoring.controller'

const router = Router()

router.get('/data', authenticate, getMonitoringData)
router.post('/data', authenticate, createMonitoringData)
router.get('/stats', authenticate, getMonitoringStats)

export default router
