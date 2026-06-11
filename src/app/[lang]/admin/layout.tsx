import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'admin' });

  const navItems = [
    { href: `/${lang}/admin`, label: t('dashboard'), icon: '📊' },
    { href: `/${lang}/admin/ships`, label: t('ships'), icon: '🚢' },
    { href: `/${lang}/admin/courses`, label: t('courses'), icon: '📚' },
    { href: `/${lang}/admin/trips`, label: t('trips'), icon: '🏊' },
    { href: `/${lang}/admin/bookings`, label: t('bookings'), icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Admin Header */}
      <header className="bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${lang}/admin`} className="text-xl font-bold">
                AQUAMAN Admin
              </Link>
              <span className="text-zinc-400 text-sm">/</span>
              <span className="text-zinc-400 text-sm">{t('title')}</span>
            </div>
            <Link
              href={`/${lang}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← {t('backToSite')}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-700"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}