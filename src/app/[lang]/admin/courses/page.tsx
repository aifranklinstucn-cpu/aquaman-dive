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

interface Course {
  id: string;
  code: string;
  name: string;
  description: string | null;
  image: string | null;
  duration: string | null;
  maxStudents: number;
  isActive: boolean;
  displayOrder: number;
  prices: { price: number }[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    image: '',
    duration: '',
    maxStudents: 4,
    price: 0,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(course?: Course) {
    if (course) {
      setEditingCourse(course);
      setFormData({
        code: course.code,
        name: course.name,
        description: course.description || '',
        image: course.image || '',
        duration: course.duration || '',
        maxStudents: course.maxStudents,
        price: course.prices[0]?.price || 0,
        isActive: course.isActive,
        displayOrder: course.displayOrder,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        image: '',
        duration: '',
        maxStudents: 4,
        price: 0,
        isActive: true,
        displayOrder: 0,
      });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingCourse(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editingCourse ? 'PUT' : 'POST';
    const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCourses();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  }

  async function toggleActive(course: Course) {
    try {
      await fetch(`/api/admin/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...course, isActive: !course.isActive }),
      });
      fetchCourses();
    } catch (error) {
      console.error('Failed to toggle course:', error);
    }
  }

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">课程管理</h1>
        <Button onClick={() => openModal()} className="bg-cyan-600 hover:bg-cyan-700">
          + 添加课程
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            还没有课程，点击上方按钮添加第一个课程
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className={!course.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <span className="text-sm text-zinc-500 font-mono">{course.code.toUpperCase()}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                    {course.isActive ? '启用' : '禁用'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {course.image && (
                  <img src={course.image} alt={course.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <p className="text-zinc-600 text-sm mb-4 line-clamp-2">
                  {course.description || '暂无描述'}
                </p>
                <div className="flex items-center justify-between text-sm text-zinc-500 mb-4">
                  <span>时长: {course.duration || '-'}</span>
                  <span>人数上限: {course.maxStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-cyan-600">฿{course.prices[0]?.price?.toLocaleString() || 0}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openModal(course)}>
                      编辑
                    </Button>
                    <Button
                      variant={course.isActive ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleActive(course)}
                    >
                      {course.isActive ? '禁用' : '启用'}
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
            <DialogTitle>{editingCourse ? '编辑课程' : '添加课程'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>课程代码</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                    required
                    placeholder="例如: ow, aow"
                    disabled={!!editingCourse}
                  />
                </div>
                <div className="space-y-2">
                  <Label>课程名称</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="例如: 开放水域潜水员"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="课程介绍..."
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>时长</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="例如: 3-4天"
                  />
                </div>
                <div className="space-y-2">
                  <Label>人数上限</Label>
                  <Input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 4 })}
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