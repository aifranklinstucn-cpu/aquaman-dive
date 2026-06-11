import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n/request';

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="text-2xl font-bold text-cyan-600">
            AQUAMAN
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}`} className="text-zinc-700 hover:text-cyan-600 transition-colors">
              {t('home')}
            </Link>
            <Link href={`/${locale}/courses`} className="text-zinc-700 hover:text-cyan-600 transition-colors">
              {t('courses')}
            </Link>
            <Link href={`/${locale}/booking`} className="text-zinc-700 hover:text-cyan-600 transition-colors">
              {t('booking')}
            </Link>
            <Link href={`/${locale}/gallery`} className="text-zinc-700 hover:text-cyan-600 transition-colors">
              {t('gallery')}
            </Link>
            <Link href={`/${locale}/about`} className="text-zinc-700 hover:text-cyan-600 transition-colors">
              {t('about')}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    l === locale
                      ? 'bg-cyan-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
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
  );
}