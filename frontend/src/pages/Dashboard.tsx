import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { enterpriseService } from '../services/enterpriseService';
import { machineService } from '../services/machineService';
import { monitoringService } from '../services/monitoringService';
import type { Enterprise, Machine } from '../types';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const { data: enterprises } = useQuery({
    queryKey: ['enterprises'],
    queryFn: enterpriseService.getAll,
  });

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: machineService.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ['monitoring-stats'],
    queryFn: () => monitoringService.getStats({}),
  });

  const onlineMachines = machines?.filter(m => m.status === 'ONLINE').length || 0;
  const offlineMachines = machines?.filter(m => m.status === 'OFFLINE').length || 0;
  const maintenanceMachines = machines?.filter(m => m.status === 'MAINTENANCE').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">Injection Monitoring</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Enterprises</CardDescription>
              <CardTitle className="text-3xl">{enterprises?.length || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Machines</CardDescription>
              <CardTitle className="text-3xl">{machines?.length || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Online Machines</CardDescription>
              <CardTitle className="text-3xl text-green-600">{onlineMachines}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Monitoring Records</CardDescription>
              <CardTitle className="text-3xl">{stats?.count || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Machine Status Overview</CardTitle>
              <CardDescription>Current status of all machines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  <span className="text-2xl font-bold">{onlineMachines}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm">Offline</span>
                  </div>
                  <span className="text-2xl font-bold">{offlineMachines}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Maintenance</span>
                  </div>
                  <span className="text-2xl font-bold">{maintenanceMachines}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Metrics</CardTitle>
              <CardDescription>Current average performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Average Temperature</span>
                    <span className="text-2xl font-bold">{stats?.avgTemperature?.toFixed(1) || 0}°C</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Average Pressure</span>
                    <span className="text-2xl font-bold">{stats?.avgPressure?.toFixed(1) || 0} bar</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Average Cycle Time</span>
                    <span className="text-2xl font-bold">{stats?.avgCycleTime?.toFixed(1) || 0}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4">
          <Link to="/enterprises">
            <Button>Manage Enterprises</Button>
          </Link>
          <Link to="/machines">
            <Button variant="outline">Manage Machines</Button>
          </Link>
          <Link to="/monitoring">
            <Button variant="outline">View Monitoring Data</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
