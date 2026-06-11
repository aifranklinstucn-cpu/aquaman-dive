'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { liveaboardTrips, cabinTypes } from '@/data/liveaboard';

interface LiveaboardBookingFormProps {
  locale: 'zh' | 'en' | 'th';
}

export default function LiveaboardBookingForm({ locale }: LiveaboardBookingFormProps) {
  const t = useTranslations('liveaboard');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [selectedCabin, setSelectedCabin] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    certification: '',
    notes: '',
  });

  const selectedTripData = liveaboardTrips.find((trip) => trip.id === selectedTrip);
  const price = selectedTripData && selectedCabin
    ? selectedTripData.price[selectedCabin as keyof typeof selectedTripData.price]
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTrip || !selectedCabin) {
      alert(locale === 'zh' ? '请选择出发日期、行程和舱位' : locale === 'en' ? 'Please select departure date, trip and cabin' : 'กรุณาเลือกวันออกเดินทาง ทริป และห้อง');
      return;
    }

    console.log('Liveaboard Booking submission:', {
      date: selectedDate.toISOString(),
      trip: selectedTrip,
      cabin: selectedCabin,
      ...formData,
    });

    alert(locale === 'zh' ? '预订请求已提交！我们会尽快联系您确认。' : locale === 'en' ? 'Booking request submitted! We will contact you soon to confirm.' : 'คำขอจองถูกส่งแล้ว! เราจะติดต่อคุณเร็วๆ นี้เพื่อยืนยัน');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>{t('selectDate')}</CardTitle>
          <CardDescription>{t('selectDateDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
          />
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('bookingDetails')}</CardTitle>
          <CardDescription>{t('fillDetails')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trip Selection */}
            <div className="space-y-2">
              <Label>{t('selectTrip')}</Label>
              <Select value={selectedTrip} onValueChange={(value) => setSelectedTrip(value || '')}>
                <SelectTrigger>
                  <SelectValue placeholder={locale === 'zh' ? '选择行程' : locale === 'en' ? 'Select trip' : 'เลือกทริป'} />
                </SelectTrigger>
                <SelectContent>
                  {liveaboardTrips.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.duration} - {trip.divesCount} {locale === 'zh' ? '次潜水' : locale === 'en' ? 'dives' : 'การดำน้ำ'} - ฿{trip.price.standard.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cabin Selection */}
            <div className="space-y-2">
              <Label>{t('selectCabin')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {cabinTypes.map((cabin) => (
                  <Button
                    key={cabin.id}
                    type="button"
                    variant={selectedCabin === cabin.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCabin(cabin.id)}
                    className={selectedCabin === cabin.id ? 'bg-cyan-600' : ''}
                  >
                    {cabin.label[locale]}
                  </Button>
                ))}
              </div>
              {selectedTripData && selectedCabin && (
                <p className="text-sm text-cyan-600 font-medium">
                  {locale === 'zh' ? '价格' : locale === 'en' ? 'Price' : 'ราคา'}: ฿{price.toLocaleString()} / {locale === 'zh' ? '人' : locale === 'en' ? 'person' : 'คน'}
                </p>
              )}
            </div>

            {/* Personal Info */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certification">{t('certification')}</Label>
              <Select value={formData.certification} onValueChange={(value) => setFormData({ ...formData, certification: value || '' })}>
                <SelectTrigger>
                  <SelectValue placeholder={locale === 'zh' ? '潜水证书级别' : locale === 'en' ? 'Certification level' : 'ระดับใบรับรอง'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ow">{locale === 'zh' ? '开放水域 (OW)' : locale === 'en' ? 'Open Water (OW)' : 'Open Water (OW)'}</SelectItem>
                  <SelectItem value="aow">{locale === 'zh' ? '进阶 (AOW)' : locale === 'en' ? 'Advanced (AOW)' : 'Advanced (AOW)'}</SelectItem>
                  <SelectItem value="rescue">{locale === 'zh' ? '救援潜水员' : locale === 'en' ? 'Rescue Diver' : 'Rescue Diver'}</SelectItem>
                  <SelectItem value="divemaster">{locale === 'zh' ? '潜水长' : locale === 'en' ? 'Divemaster' : 'Divemaster'}</SelectItem>
                  <SelectItem value="instructor">{locale === 'zh' ? '教练' : locale === 'en' ? 'Instructor' : 'Instructor'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">{t('guests')}</Label>
              <Select value={formData.guests} onValueChange={(value) => setFormData({ ...formData, guests: value || '1' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {locale === 'zh' ? '人' : locale === 'en' ? 'person' : 'คน'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={locale === 'zh' ? '特殊要求、饮食禁忌等...' : locale === 'en' ? 'Special requests, dietary restrictions...' : 'คำขอพิเศษ ข้อจำกัดด้านอาหาร...'}
              />
            </div>

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
              {t('submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}