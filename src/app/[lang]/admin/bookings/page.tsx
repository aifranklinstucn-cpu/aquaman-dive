'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Booking {
  id: string;
  bookingNumber: string;
  type: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  certification: string | null;
  bookingDate: string;
  guests: number;
  totalPrice: number;
  depositPaid: number;
  paymentStatus: string;
  notes: string | null;
  ship: { name: string } | null;
  course: { name: string } | null;
  trip: { name: string } | null;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ type: string; status: string }>({ type: 'all', status: 'all' });

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  async function fetchBookings() {
    try {
      const params = new URLSearchParams();
      if (filter.type !== 'all') params.set('type', filter.type);
      if (filter.status !== 'all') params.set('status', filter.status);

      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(booking: Booking, newStatus: string) {
    try {
      await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, status: newStatus }),
      });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case 'liveaboard': return '🚢 船宿';
      case 'course': return '📚 课程';
      case 'trip': return '🏊 行程';
      default: return type;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  }

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">预订管理</h1>

        <div className="flex gap-4">
          <Select
            value={filter.type}
            onValueChange={(v) => setFilter({ ...filter, type: v || 'all' })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="liveaboard">船宿</SelectItem>
              <SelectItem value="course">课程</SelectItem>
              <SelectItem value="trip">行程</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.status}
            onValueChange={(v) => setFilter({ ...filter, status: v || 'all' })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待确认</SelectItem>
              <SelectItem value="confirmed">已确认</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            暂无预订记录
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-zinc-50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">订单号</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">客户</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">类型</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">日期</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">人数</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">金额</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">状态</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-zinc-50">
                      <td className="py-4 px-6 font-mono text-sm">{booking.bookingNumber}</td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-sm text-zinc-500">{booking.customerEmail}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-zinc-100 rounded text-sm">
                          {getTypeLabel(booking.type)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm">{booking.guests}</td>
                      <td className="py-4 px-6 font-semibold">฿{booking.totalPrice.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(booking.status)}`}>
                          {booking.status === 'pending' && '待确认'}
                          {booking.status === 'confirmed' && '已确认'}
                          {booking.status === 'cancelled' && '已取消'}
                          {booking.status === 'completed' && '已完成'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Select
                          value={booking.status}
                          onValueChange={(v) => v && updateStatus(booking, v)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">待确认</SelectItem>
                            <SelectItem value="confirmed">已确认</SelectItem>
                            <SelectItem value="cancelled">已取消</SelectItem>
                            <SelectItem value="completed">已完成</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}