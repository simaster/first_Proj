import { Request, Response } from 'express'

// Mock machine storage (replace with database in production)
const machines: any[] = [
  { id: '1', name: '기계 A-001', code: 'M001', enterpriseId: '1', status: 'ONLINE' },
  { id: '2', name: '기계 A-002', code: 'M002', enterpriseId: '1', status: 'ONLINE' },
  { id: '3', name: '기계 B-001', code: 'M003', enterpriseId: '2', status: 'MAINTENANCE' },
  { id: '4', name: '기계 B-002', code: 'M004', enterpriseId: '2', status: 'ONLINE' },
  { id: '5', name: '기계 C-001', code: 'M005', enterpriseId: '3', status: 'OFFLINE' },
]

export async function getMachines(req: Request, res: Response) {
  const { enterpriseId } = req.query
  
  let filteredMachines = machines
  if (enterpriseId) {
    filteredMachines = machines.filter((m) => m.enterpriseId === enterpriseId)
  }
  
  res.json(filteredMachines)
}

export async function getMachineById(req: Request, res: Response) {
  const { id } = req.params
  const machine = machines.find((m) => m.id === id)
  
  if (!machine) {
    return res.status(404).json({ message: 'Machine not found' })
  }
  
  res.json(machine)
}

export async function createMachine(req: Request, res: Response) {
  const { name, code, enterpriseId, status } = req.body
  
  const newMachine = {
    id: Date.now().toString(),
    name,
    code,
    enterpriseId,
    status: status || 'OFFLINE',
  }
  
  machines.push(newMachine)
  res.status(201).json(newMachine)
}

export async function updateMachine(req: Request, res: Response) {
  const { id } = req.params
  const { name, code, enterpriseId, status } = req.body
  
  const index = machines.findIndex((m) => m.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Machine not found' })
  }
  
  machines[index] = { ...machines[index], name, code, enterpriseId, status }
  res.json(machines[index])
}

export async function deleteMachine(req: Request, res: Response) {
  const { id } = req.params
  const index = machines.findIndex((m) => m.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Machine not found' })
  }
  
  machines.splice(index, 1)
  res.json({ message: 'Machine deleted successfully' })
}

export async function getMachineMonitoring(req: Request, res: Response) {
  const { id } = req.params
  const machine = machines.find((m) => m.id === id)
  
  if (!machine) {
    return res.status(404).json({ message: 'Machine not found' })
  }
  
  // Mock monitoring data
  const monitoringData = [
    { id: '1', machineId: id, temperature: 185.5, pressure: 1200, cycleTime: 45, timestamp: new Date().toISOString() },
    { id: '2', machineId: id, temperature: 190.2, pressure: 1250, cycleTime: 47, timestamp: new Date(Date.now() - 60000).toISOString() },
  ]
  
  res.json(monitoringData)
}
