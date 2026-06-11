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

interface BookingFormProps {
  locale: 'zh' | 'en' | 'th';
}

const timeSlots = [
  { id: 'morning', time: '08:00 - 11:00', label: { zh: '上午', en: 'Morning', th: 'เช้า' } },
  { id: 'afternoon', time: '13:00 - 16:00', label: { zh: '下午', en: 'Afternoon', th: 'บ่าย' } },
  { id: 'full_day', time: '08:00 - 16:00', label: { zh: '全天', en: 'Full Day', th: 'เต็มวัน' } },
];

const courses = [
  { id: 'open-water', label: { zh: '开放水域潜水员 (OW)', en: 'Open Water Diver (OW)', th: 'นักดำน้ำ Open Water (OW)' }, price: 3500 },
  { id: 'advanced', label: { zh: '进阶潜水员 (AOW)', en: 'Advanced Diver (AOW)', th: 'นักดำน้ำ Advanced (AOW)' }, price: 2800 },
  { id: 'fun-dive', label: { zh: 'Fun Dive 体验潜水', en: 'Fun Dive', th: 'Fun Dive' }, price: 1500 },
  { id: 'rescue', label: { zh: '救援潜水员', en: 'Rescue Diver', th: 'นักดำน้ำกู้ชีพ' }, price: 3200 },
];

export default function BookingForm({ locale }: BookingFormProps) {
  const t = useTranslations('booking');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedCourse || selectedCourse === '') {
      alert('请选择日期、时段和课程');
      return;
    }

    // TODO: 连接到后端 API
    console.log('Booking submission:', {
      date: selectedDate.toISOString(),
      time: selectedTime,
      course: selectedCourse,
      ...formData,
    });

    alert('预订请求已提交！我们会尽快联系您确认。');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>{t('selectDate')}</CardTitle>
          <CardDescription>选择您想要潜水的日期</CardDescription>
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
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>填写您的预订信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Time Slot Selection */}
            <div className="space-y-2">
              <Label>{t('selectTime')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={selectedTime === slot.id ? 'default' : 'outline'}
                    onClick={() => setSelectedTime(slot.id)}
                    className={selectedTime === slot.id ? 'bg-cyan-600' : ''}
                  >
                    {slot.label[locale]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Course Selection */}
            <div className="space-y-2">
              <Label>课程/套餐</Label>
              <Select value={selectedCourse} onValueChange={(value) => setSelectedCourse(value || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择课程" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.label[locale]} - ฿{course.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="guests">{t('guests')}</Label>
              <Select value={formData.guests} onValueChange={(v) => setFormData({ ...formData, guests: v || '1' })}>
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
                placeholder={locale === 'zh' ? '特殊要求或问题...' : locale === 'en' ? 'Special requests or questions...' : 'คำขอพิเศษหรือคำถาม...'}
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