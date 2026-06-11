'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('admin');
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
      case 'liveaboard': return '🚢 ' + t('liveaboard');
      case 'course': return '📚 ' + t('course');
      case 'trip': return '🏊 ' + t('trip');
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
        <h1 className="text-3xl font-bold text-zinc-900">{t('bookings')}</h1>

        <div className="flex gap-4">
          <Select
            value={filter.type}
            onValueChange={(v) => setFilter({ ...filter, type: v || 'all' })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="liveaboard">{t('liveaboard')}</SelectItem>
              <SelectItem value="course">{t('course')}</SelectItem>
              <SelectItem value="trip">{t('trip')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.status}
            onValueChange={(v) => setFilter({ ...filter, status: v || 'all' })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatus')}</SelectItem>
              <SelectItem value="pending">{t('pending')}</SelectItem>
              <SelectItem value="confirmed">{t('confirmed')}</SelectItem>
              <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
              <SelectItem value="completed">{t('completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-zinc-500">
            {t('noBookings')}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-zinc-50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('bookingNo')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('customer')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('type')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('date')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('guestsLabel')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('amount')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('status')}</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-zinc-500">{t('action')}</th>
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
                          {t(booking.status)}
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
                            <SelectItem value="pending">{t('pending')}</SelectItem>
                            <SelectItem value="confirmed">{t('confirmed')}</SelectItem>
                            <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                            <SelectItem value="completed">{t('completed')}</SelectItem>
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