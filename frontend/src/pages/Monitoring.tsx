import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { machineService } from '../services/machineService';
import { monitoringService } from '../services/monitoringService';
import type { MonitoringData, Machine } from '../types';

export default function Monitoring() {
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get('machine');

  const [selectedMachineId, setSelectedMachineId] = useState(machineId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    machineId: machineId || '',
    temperature: '',
    pressure: '',
    cycleTime: '',
  });

  const { data: machines } = useQuery({
    queryKey: ['machines'],
    queryFn: machineService.getAll,
  });

  const { data: monitoringData, isLoading } = useQuery({
    queryKey: ['monitoring-data', selectedMachineId],
    queryFn: () => monitoringService.getData({
      machineId: selectedMachineId || undefined,
      limit: 50,
    }),
    enabled: !!selectedMachineId,
  });

  const { data: stats } = useQuery({
    queryKey: ['monitoring-stats', selectedMachineId],
    queryFn: () => monitoringService.getStats({
      machineId: selectedMachineId || undefined,
    }),
    enabled: !!selectedMachineId,
  });

  const selectedMachine = machines?.find(m => m.id === selectedMachineId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await monitoringService.submitData({
        machineId: formData.machineId,
        temperature: parseFloat(formData.temperature),
        pressure: parseFloat(formData.pressure),
        cycleTime: parseInt(formData.cycleTime),
      });
      setFormData({ ...formData, temperature: '', pressure: '', cycleTime: '' });
      // In a real app, you'd invalidate the query here
      alert('Data submitted successfully!');
    } catch (error) {
      alert('Failed to submit data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = monitoringData?.slice().reverse().map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    temperature: d.temperature,
    pressure: d.pressure,
    cycleTime: d.cycleTime,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Button variant="ghost">← Back to Dashboard</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Monitoring Data</h1>
            <Button onClick={() => {
              setFormData({ ...formData, machineId: selectedMachineId });
            }}>
              Add Data Point
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Machine</CardTitle>
            <CardDescription>Choose a machine to view its monitoring data</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
            >
              <option value="">Select Machine</option>
              {machines?.map((m: Machine) => (
                <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
              ))}
            </select>
          </CardContent>
        </Card>

        {selectedMachine && formData.machineId === selectedMachineId && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Monitoring Data</CardTitle>
              <CardDescription>Submit new monitoring data for {selectedMachine.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-2 border rounded-md"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pressure (bar)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-2 border rounded-md"
                      value={formData.pressure}
                      onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cycle Time (s)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={formData.cycleTime}
                      onChange={(e) => setFormData({ ...formData, cycleTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Data'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, machineId: '' })}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {selectedMachine && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardDescription>Data Points</CardDescription>
                <CardTitle className="text-2xl">{stats.count}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Avg Temperature</CardDescription>
                <CardTitle className="text-2xl">{stats.avgTemperature?.toFixed(1)}°C</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Avg Pressure</CardDescription>
                <CardTitle className="text-2xl">{stats.avgPressure?.toFixed(1)} bar</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Avg Cycle Time</CardDescription>
                <CardTitle className="text-2xl">{stats.avgCycleTime?.toFixed(1)}s</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {selectedMachine && chartData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Temperature & Pressure Trends</CardTitle>
              <CardDescription>Recent monitoring data for {selectedMachine.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#2563eb" name="Temperature (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#16a34a" name="Pressure (bar)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {selectedMachine && chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cycle Time Trends</CardTitle>
              <CardDescription>Recent cycle times for {selectedMachine.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cycleTime" stroke="#9333ea" name="Cycle Time (s)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {!selectedMachine && (
          <div className="text-center py-8 text-gray-500">
            Select a machine to view its monitoring data.
          </div>
        )}

        {selectedMachine && isLoading && (
          <div className="text-center py-8">Loading monitoring data...</div>
        )}

        {selectedMachine && !isLoading && chartData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No monitoring data found for this machine. Add some data points to get started.
          </div>
        )}
      </main>
    </div>
  );
}
