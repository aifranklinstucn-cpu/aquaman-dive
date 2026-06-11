'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Trip {
  id: string;
  code: string;
  name: string;
  description: string | null;
  image: string | null;
  type: string;
  duration: string | null;
  isActive: boolean;
  displayOrder: number;
  prices: { price: number }[];
}

const tripTypes = [
  { value: 'fun-dive', label: 'Fun Dive', description: '持证潜水员一日游' },
  { value: 'dsd', label: 'DSD 体验潜水', description: '初次体验潜水' },
  { value: 'snorkeling', label: '浮潜', description: '浮潜行程' },
];

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    image: '',
    type: 'fun-dive',
    duration: '',
    price: 0,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      const res = await fetch('/api/admin/trips');
      const data = await res.json();
      setTrips(data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(trip?: Trip) {
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        code: trip.code,
        name: trip.name,
        description: trip.description || '',
        image: trip.image || '',
        type: trip.type,
        duration: trip.duration || '',
        price: trip.prices[0]?.price || 0,
        isActive: trip.isActive,
        displayOrder: trip.displayOrder,
      });
    } else {
      setEditingTrip(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        image: '',
        type: 'fun-dive',
        duration: '',
        price: 0,
        isActive: true,
        displayOrder: 0,
      });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTrip(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editingTrip ? 'PUT' : 'POST';
    const url = editingTrip ? `/api/admin/trips/${editingTrip.id}` : '/api/admin/trips';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchTrips();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save trip:', error);
    }
  }

  async function toggleActive(trip: Trip) {
    try {
      await fetch(`/api/admin/trips/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...trip, isActive: !trip.isActive }),
      });
      fetchTrips();
    } catch (error) {
      console.error('Failed to toggle trip:', error);
    }
  }

  function getTripTypeLabel(type: string) {
    const found = tripTypes.find(t => t.value === type);
    return found ? found.label : type;
  }

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">行程管理</h1>
          <p className="text-zinc-500 mt-1">Fun Dive / DSD 体验潜水 / 浮潜</p>
        </div>
        <Button onClick={() => openModal()} className="bg-cyan-600 hover:bg-cyan-700">
          + 添加行程
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            还没有行程，点击上方按钮添加第一个行程
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip.id} className={!trip.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{trip.name}</CardTitle>
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                      trip.type === 'fun-dive' ? 'bg-blue-100 text-blue-700' :
                      trip.type === 'dsd' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {getTripTypeLabel(trip.type)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${trip.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {trip.isActive ? '启用' : '禁用'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {trip.image && (
                  <img src={trip.image} alt={trip.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <p className="text-zinc-600 text-sm mb-4 line-clamp-2">
                  {trip.description || '暂无描述'}
                </p>
                <div className="text-sm text-zinc-500 mb-4">
                  时长: {trip.duration || '-'}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-cyan-600">฿{trip.prices[0]?.price?.toLocaleString() || 0}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openModal(trip)}>
                      编辑
                    </Button>
                    <Button
                      variant={trip.isActive ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleActive(trip)}
                    >
                      {trip.isActive ? '禁用' : '启用'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTrip ? '编辑行程' : '添加行程'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>行程代码</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                    required
                    placeholder="例如: fun-dive, dsd"
                    disabled={!!editingTrip}
                  />
                </div>
                <div className="space-y-2">
                  <Label>行程类型</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v || '' })}
                    disabled={!!editingTrip}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tripTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>行程名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="例如: Fun Dive 一日游"
                />
              </div>

              <div className="space-y-2">
                <Label>描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="行程介绍..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>图片 URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>时长</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="例如: 半天, 一天"
                  />
                </div>
                <div className="space-y-2">
                  <Label>价格 (฿)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>显示顺序</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>状态</Label>
                  <Select
                    value={formData.isActive ? 'true' : 'false'}
                    onValueChange={(v) => setFormData({ ...formData, isActive: v === 'true' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">启用</SelectItem>
                      <SelectItem value="false">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                取消
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                保存
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}