import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { liveaboardTrips, cabinTypes } from '@/data/liveaboard';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'liveaboard' });

  return {
    title: `AQUAMAN - ${t('title')}`,
    description: t('subtitle'),
  };
}

export default async function LiveaboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'liveaboard' });
  const tNav = await getTranslations({ locale: lang, namespace: 'nav' });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-[url('/liveaboard-hero.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">{t('subtitle')}</p>
          <Link
            href={`/${lang}/liveaboard/booking`}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
          >
            {t('bookNow')}
          </Link>
        </div>
      </section>

      {/* Trip Options */}
      <section className="py-16 px-4 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4 text-center">{t('trips')}</h2>
          <p className="text-zinc-600 mb-12 text-center">{t('tripsSubtitle')}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {liveaboardTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-6xl">🚢</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-zinc-900">{trip.duration}</h3>
                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                      {trip.divesCount} {lang === 'zh' ? '次潜水' : lang === 'en' ? 'dives' : 'การดำน้ำ'}
                    </span>
                  </div>
                  <p className="text-zinc-600 mb-4">{trip.description[lang as 'zh' | 'en' | 'th']}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-zinc-800 mb-2">
                      {lang === 'zh' ? '亮点' : lang === 'en' ? 'Highlights' : 'ไฮไลท์'}
                    </h4>
                    <ul className="space-y-1">
                      {trip.highlights[lang as 'zh' | 'en' | 'th'].map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-zinc-600">
                          <span className="text-cyan-500">✓</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-zinc-500 mb-2">{lang === 'zh' ? '价格起' : lang === 'en' ? 'From' : 'จาก'}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-cyan-600">฿{trip.price.standard.toLocaleString()}</span>
                      <span className="text-zinc-500">/ {lang === 'zh' ? '人' : lang === 'en' ? 'person' : 'คน'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cabin Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4 text-center">{t('cabins')}</h2>
          <p className="text-zinc-600 mb-12 text-center">{t('cabinsSubtitle')}</p>

          <div className="grid md:grid-cols-3 gap-6">
            {cabinTypes.map((cabin) => (
              <div key={cabin.id} className="bg-zinc-50 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">
                  {cabin.id === 'standard' ? '🛏️' : cabin.id === 'premium' ? '🌊' : '👑'}
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">{cabin.label[lang as 'zh' | 'en' | 'th']}</h3>
                <p className="text-zinc-600 text-sm">{cabin.description[lang as 'zh' | 'en' | 'th']}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('included')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="font-semibold mb-2">{t('meals')}</h3>
              <p className="text-blue-200 text-sm">{t('mealsDesc')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤿</div>
              <h3 className="font-semibold mb-2">{t('diving')}</h3>
              <p className="text-blue-200 text-sm">{t('divingDesc')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏨</div>
              <h3 className="font-semibold mb-2">{t('accommodation')}</h3>
              <p className="text-blue-200 text-sm">{t('accommodationDesc')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚐</div>
              <h3 className="font-semibold mb-2">{t('transfer')}</h3>
              <p className="text-blue-200 text-sm">{t('transferDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-cyan-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">{t('ready')}</h2>
          <p className="text-xl mb-8 text-cyan-100">{t('readySubtitle')}</p>
          <Link
            href={`/${lang}/liveaboard/booking`}
            className="inline-flex items-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-zinc-100 transition-colors"
          >
            {t('bookNow')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}