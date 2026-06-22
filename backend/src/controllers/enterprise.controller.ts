import { Request, Response } from 'express'

// Mock enterprise storage (replace with database in production)
const enterprises: any[] = [
  { id: '1', name: '삼성전자', code: 'S001', address: '수원시', contact: '02-1234-5678', machines: 8 },
  { id: '2', name: 'LG전자', code: 'L001', address: '창원시', contact: '055-1234-5678', machines: 6 },
  { id: '3', name: '현대자동차', code: 'H001', address: '울산시', contact: '052-1234-5678', machines: 12 },
  { id: '4', name: 'SK하이닉스', code: 'S002', address: '이천시', contact: '031-1234-5678', machines: 10 },
]

export async function getEnterprises(req: Request, res: Response) {
  res.json(enterprises)
}

export async function getEnterpriseById(req: Request, res: Response) {
  const { id } = req.params
  const enterprise = enterprises.find((e) => e.id === id)
  
  if (!enterprise) {
    return res.status(404).json({ message: 'Enterprise not found' })
  }
  
  res.json(enterprise)
}

export async function createEnterprise(req: Request, res: Response) {
  const { name, code, address, contact } = req.body
  
  const newEnterprise = {
    id: Date.now().toString(),
    name,
    code,
    address,
    contact,
    machines: 0,
  }
  
  enterprises.push(newEnterprise)
  res.status(201).json(newEnterprise)
}

export async function updateEnterprise(req: Request, res: Response) {
  const { id } = req.params
  const { name, code, address, contact } = req.body
  
  const index = enterprises.findIndex((e) => e.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Enterprise not found' })
  }
  
  enterprises[index] = { ...enterprises[index], name, code, address, contact }
  res.json(enterprises[index])
}

export async function deleteEnterprise(req: Request, res: Response) {
  const { id } = req.params
  const index = enterprises.findIndex((e) => e.id === id)
  
  if (index === -1) {
    return res.status(404).json({ message: 'Enterprise not found' })
  }
  
  enterprises.splice(index, 1)
  res.json({ message: 'Enterprise deleted successfully' })
}
