import { Request, Response } from 'express'

// Mock monitoring data storage (replace with database in production)
const monitoringData: any[] = [
  { id: '1', machineId: '1', temperature: 185.5, pressure: 1200, cycleTime: 45, timestamp: new Date().toISOString() },
  { id: '2', machineId: '1', temperature: 190.2, pressure: 1250, cycleTime: 47, timestamp: new Date(Date.now() - 60000).toISOString() },
  { id: '3', machineId: '2', temperature: 178.8, pressure: 1180, cycleTime: 43, timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: '4', machineId: '2', temperature: 192.1, pressure: 1280, cycleTime: 48, timestamp: new Date(Date.now() - 180000).toISOString() },
  { id: '5', machineId: '3', temperature: 0, pressure: 0, cycleTime: 0, timestamp: new Date(Date.now() - 240000).toISOString() },
]

export async function getMonitoringData(req: Request, res: Response) {
  const { machineId, startDate, endDate } = req.query
  
  let filteredData = monitoringData
  
  if (machineId) {
    filteredData = filteredData.filter((d) => d.machineId === machineId)
  }
  
  if (startDate) {
    filteredData = filteredData.filter((d) => new Date(d.timestamp) >= new Date(startDate as string))
  }
  
  if (endDate) {
    filteredData = filteredData.filter((d) => new Date(d.timestamp) <= new Date(endDate as string))
  }
  
  res.json(filteredData)
}

export async function createMonitoringData(req: Request, res: Response) {
  const { machineId, temperature, pressure, cycleTime } = req.body
  
  const newData = {
    id: Date.now().toString(),
    machineId,
    temperature,
    pressure,
    cycleTime,
    timestamp: new Date().toISOString(),
  }
  
  monitoringData.push(newData)
  res.status(201).json(newData)
}

export async function getMonitoringStats(req: Request, res: Response) {
  const { machineId } = req.query
  
  let filteredData = monitoringData
  if (machineId) {
    filteredData = filteredData.filter((d) => d.machineId === machineId)
  }
  
  const stats = {
    totalReadings: filteredData.length,
    averageTemperature: filteredData.reduce((sum, d) => sum + d.temperature, 0) / filteredData.length || 0,
    averagePressure: filteredData.reduce((sum, d) => sum + d.pressure, 0) / filteredData.length || 0,
    averageCycleTime: filteredData.reduce((sum, d) => sum + d.cycleTime, 0) / filteredData.length || 0,
  }
  
  res.json(stats)
}
