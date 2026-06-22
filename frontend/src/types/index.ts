export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Enterprise {
  id: string;
  name: string;
  code: string;
  address?: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
  machines?: Machine[];
}

export interface Machine {
  id: string;
  name: string;
  code: string;
  enterpriseId: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
  enterprise?: Enterprise;
  monitoringData?: MonitoringData[];
}

export interface MonitoringData {
  id: string;
  machineId: string;
  temperature: number;
  pressure: number;
  cycleTime: number;
  timestamp: string;
  machine?: Machine;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface ApiError {
  status: 'error';
  message: string;
}
