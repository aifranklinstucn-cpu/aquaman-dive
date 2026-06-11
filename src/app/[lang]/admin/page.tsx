import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'admin' });

  // Get counts
  const [shipCount, courseCount, tripCount, bookingCount, recentBookings] = await Promise.all([
    prisma.ship.count({ where: { isActive: true } }),
    prisma.course.count({ where: { isActive: true } }),
    prisma.trip.count({ where: { isActive: true } }),
    prisma.booking.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { ship: true, course: true, trip: true },
    }),
  ]);

  const stats = [
    { label: t('ships'), value: shipCount, icon: '🚢', href: `/${lang}/admin/ships` },
    { label: t('courses'), value: courseCount, icon: '📚', href: `/${lang}/admin/courses` },
    { label: t('trips'), value: tripCount, icon: '🏊', href: `/${lang}/admin/trips` },
    { label: t('bookings'), value: bookingCount, icon: '📋', href: `/${lang}/admin/bookings` },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">{t('dashboard')}</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">{stat.label}</CardTitle>
                <span className="text-2xl">{stat.icon}</span>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-900">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentBookings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">{t('bookingNo')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">{t('customer')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">{t('type')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">{t('date')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">{t('status')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-500">{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500">
                      {t('noBookings')}
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-zinc-50">
                      <td className="py-3 px-4 font-mono text-sm">{booking.bookingNumber}</td>
                      <td className="py-3 px-4">{booking.customerName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-zinc-100 rounded text-sm">
                          {booking.type === 'liveaboard' && '🚢 ' + t('liveaboard')}
                          {booking.type === 'course' && '📚 ' + t('course')}
                          {booking.type === 'trip' && '🏊 ' + t('trip')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-zinc-100 text-zinc-700'
                        }`}>
                          {t(booking.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">฿{booking.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}