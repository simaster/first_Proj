import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { enterpriseService } from '../services/enterpriseService';
import { machineService } from '../services/machineService';
import type { Enterprise, Machine } from '../types';

export default function Machines() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    enterpriseId: '',
    status: 'OFFLINE' as 'ONLINE' | 'OFFLINE' | 'MAINTENANCE',
  });

  const { data: enterprises } = useQuery({
    queryKey: ['enterprises'],
    queryFn: enterpriseService.getAll,
  });

  const { data: machines, isLoading } = useQuery({
    queryKey: ['machines'],
    queryFn: machineService.getAll,
  });

  const filteredMachines = searchParams.get('enterprise')
    ? machines?.filter(m => m.enterpriseId === searchParams.get('enterprise'))
    : machines;

  const createMutation = useMutation({
    mutationFn: machineService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      setIsCreating(false);
      setFormData({ name: '', code: '', enterpriseId: '', status: 'OFFLINE' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: machineService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' }) =>
      machineService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'OFFLINE': return 'bg-gray-400';
      case 'MAINTENANCE': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button variant="ghost">← Back to Dashboard</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Machine Management</h1>
            <Button onClick={() => setIsCreating(true)}>Add Machine</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Machine</CardTitle>
              <CardDescription>Add a new machine to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Code</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Enterprise</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.enterpriseId}
                    onChange={(e) => setFormData({ ...formData, enterpriseId: e.target.value })}
                    required
                  >
                    <option value="">Select Enterprise</option>
                    {enterprises?.map((e: Enterprise) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="OFFLINE">Offline</option>
                    <option value="ONLINE">Online</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines?.map((machine: Machine) => (
              <Card key={machine.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{machine.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`}></div>
                  </div>
                  <CardDescription>Code: {machine.code}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      🏢 {machine.enterprise?.name || 'Unknown Enterprise'}
                    </p>
                    <p className="text-sm text-gray-600">
                      📊 {machine.monitoringData?.length || 0} data points
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {machine.status}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <select
                      className="w-full p-2 border rounded-md text-sm"
                      value={machine.status}
                      onChange={(e) => updateStatusMutation.mutate({
                        id: machine.id,
                        status: e.target.value as any
                      })}
                    >
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                    <div className="flex space-x-2">
                      <Link to={`/monitoring?machine=${machine.id}`}>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Data
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(machine.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredMachines?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No machines found. Click "Add Machine" to create one.
          </div>
        )}
      </main>
    </div>
  );
}
