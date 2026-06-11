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

interface Ship {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  facilities: string | null;
  isActive: boolean;
  displayOrder: number;
  cabins: Cabin[];
}

interface Cabin {
  id: string;
  name: string;
  description: string | null;
  maxGuests: number;
}

export default function ShipsPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShip, setEditingShip] = useState<Ship | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    facilities: '',
    isActive: true,
    displayOrder: 0,
  });

  const [cabins, setCabins] = useState<{ name: string; maxGuests: number; description: string }[]>([
    { name: '', maxGuests: 2, description: '' },
  ]);

  useEffect(() => {
    fetchShips();
  }, []);

  async function fetchShips() {
    try {
      const res = await fetch('/api/admin/ships');
      const data = await res.json();
      setShips(data);
    } catch (error) {
      console.error('Failed to fetch ships:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(ship?: Ship) {
    if (ship) {
      setEditingShip(ship);
      setFormData({
        name: ship.name,
        description: ship.description || '',
        image: ship.image || '',
        facilities: ship.facilities || '',
        isActive: ship.isActive,
        displayOrder: ship.displayOrder,
      });
      setCabins(ship.cabins.map(c => ({ name: c.name, maxGuests: c.maxGuests, description: c.description || '' })));
    } else {
      setEditingShip(null);
      setFormData({ name: '', description: '', image: '', facilities: '', isActive: true, displayOrder: 0 });
      setCabins([{ name: '', maxGuests: 2, description: '' }]);
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingShip(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editingShip ? 'PUT' : 'POST';
    const url = editingShip ? `/api/admin/ships/${editingShip.id}` : '/api/admin/ships';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cabins }),
      });

      if (res.ok) {
        fetchShips();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save ship:', error);
    }
  }

  async function toggleActive(ship: Ship) {
    try {
      await fetch(`/api/admin/ships/${ship.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ship, isActive: !ship.isActive }),
      });
      fetchShips();
    } catch (error) {
      console.error('Failed to toggle ship:', error);
    }
  }

  function addCabin() {
    setCabins([...cabins, { name: '', maxGuests: 2, description: '' }]);
  }

  function removeCabin(index: number) {
    setCabins(cabins.filter((_, i) => i !== index));
  }

  function updateCabin(index: number, field: string, value: string | number) {
    const updated = [...cabins];
    updated[index] = { ...updated[index], [field]: value };
    setCabins(updated);
  }

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">船只管理</h1>
        <Button onClick={() => openModal()} className="bg-cyan-600 hover:bg-cyan-700">
          + 添加船只
        </Button>
      </div>

      {ships.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            还没有船只，点击上方按钮添加第一条船
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ships.map((ship) => (
            <Card key={ship.id} className={!ship.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{ship.name}</CardTitle>
                  <span className={`px-2 py-1 rounded text-xs ${ship.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {ship.isActive ? '启用' : '禁用'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {ship.image && (
                  <img src={ship.image} alt={ship.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <p className="text-zinc-600 text-sm mb-4 line-clamp-2">
                  {ship.description || '暂无描述'}
                </p>
                <div className="text-sm text-zinc-500 mb-4">
                  舱位数量: {ship.cabins.length}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openModal(ship)}>
                    编辑
                  </Button>
                  <Button
                    variant={ship.isActive ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => toggleActive(ship)}
                  >
                    {ship.isActive ? '禁用' : '启用'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingShip ? '编辑船只' : '添加船只'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>船只名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="例如: MV Similan Dream"
                />
              </div>

              <div className="space-y-2">
                <Label>描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="船只介绍..."
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

              <div className="space-y-2">
                <Label>设施 (JSON格式)</Label>
                <Textarea
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder='["空调", "WiFi", "热水"]'
                  rows={2}
                />
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

              {/* Cabins */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg">舱位类型</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCabin}>
                    + 添加舱位
                  </Button>
                </div>
                <div className="space-y-3">
                  {cabins.map((cabin, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 bg-zinc-50 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="舱位名称 (例如: 标准舱)"
                          value={cabin.name}
                          onChange={(e) => updateCabin(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="描述"
                          value={cabin.description}
                          onChange={(e) => updateCabin(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="人数"
                          value={cabin.maxGuests}
                          onChange={(e) => updateCabin(index, 'maxGuests', parseInt(e.target.value) || 2)}
                        />
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeCabin(index)}>
                        ✕
                      </Button>
                    </div>
                  ))}
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