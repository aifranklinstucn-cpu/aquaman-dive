import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { locales, localeNames, type Locale } from '@/i18n/request';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const t = await getTranslations({ locale, namespace: 'admin' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const navItems = [
    { href: `/${locale}/admin`, label: t('dashboard'), icon: '📊' },
    { href: `/${locale}/admin/ships`, label: t('ships'), icon: '🚢' },
    { href: `/${locale}/admin/courses`, label: t('courses'), icon: '📚' },
    { href: `/${locale}/admin/trips`, label: t('trips'), icon: '🏊' },
    { href: `/${locale}/admin/bookings`, label: t('bookings'), icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Admin Header */}
      <header className="bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}/admin`} className="text-xl font-bold">
                AQUAMAN Admin
              </Link>
              <span className="text-zinc-400 text-sm">/</span>
              <span className="text-zinc-400 text-sm">{t('title')}</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}`}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                ← {t('backToSite')}
              </Link>
              <div className="flex items-center gap-1 ml-4">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}/admin`}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      l === locale
                        ? 'bg-cyan-600 text-white'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    {localeNames[l]}
                  </Link>
                ))}
              </div>
            </div>
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