import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { enterpriseService } from '../services/enterpriseService';
import type { Enterprise } from '../types';

export default function Enterprises() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    contact: '',
  });

  const { data: enterprises, isLoading } = useQuery({
    queryKey: ['enterprises'],
    queryFn: enterpriseService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: enterpriseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprises'] });
      setIsCreating(false);
      setFormData({ name: '', code: '', address: '', contact: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: enterpriseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprises'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this enterprise?')) {
      deleteMutation.mutate(id);
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
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Management</h1>
            <Button onClick={() => setIsCreating(true)}>Add Enterprise</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Enterprise</CardTitle>
              <CardDescription>Add a new enterprise to the system</CardDescription>
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
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
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
            {enterprises?.map((enterprise: Enterprise) => (
              <Card key={enterprise.id}>
                <CardHeader>
                  <CardTitle>{enterprise.name}</CardTitle>
                  <CardDescription>Code: {enterprise.code}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {enterprise.address && (
                      <p className="text-sm text-gray-600">📍 {enterprise.address}</p>
                    )}
                    {enterprise.contact && (
                      <p className="text-sm text-gray-600">📞 {enterprise.contact}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      🏭 {enterprise.machines?.length || 0} machines
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/machines?enterprise=${enterprise.id}`}>
                      <Button size="sm" variant="outline">View Machines</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(enterprise.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && enterprises?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No enterprises found. Click "Add Enterprise" to create one.
          </div>
        )}
      </main>
    </div>
  );
}
