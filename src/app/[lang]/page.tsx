import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'hero' });

  return {
    title: `AQUAMAN - ${t('title')}`,
    description: t('subtitle'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'hero' });
  const tNav = await getTranslations({ locale: lang, namespace: 'nav' });
  const tCourses = await getTranslations({ locale: lang, namespace: 'courses' });

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl md:text-2xl mb-8 text-cyan-100">{t('subtitle')}</p>
          <Link
            href={`/${lang}/booking`}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
          >
            {t('cta')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">{tCourses('title')}</h2>
            <p className="text-xl text-zinc-600">{tCourses('subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-4 flex items-center justify-center text-white text-6xl">
                🌊
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Open Water Diver</h3>
              <p className="text-zinc-600 mb-4">从零开始，成为认证潜水员</p>
              <Link
                href={`/${lang}/courses/open-water`}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                了解更多 →
              </Link>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mb-4 flex items-center justify-center text-white text-6xl">
                🤿
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Advanced Diver</h3>
              <p className="text-zinc-600 mb-4">提升技能，探索更深的世界</p>
              <Link
                href={`/${lang}/courses/advanced`}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                了解更多 →
              </Link>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl mb-4 flex items-center justify-center text-white text-6xl">
                🐠
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Fun Dive</h3>
              <p className="text-zinc-600 mb-4">持证潜水员的一日潜水体验</p>
              <Link
                href={`/${lang}/courses/fun-dive`}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                了解更多 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-cyan-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">准备好开始你的潜水之旅了吗？</h2>
          <p className="text-xl mb-8 text-cyan-100">联系我们或直接在线预订</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/contact`}
              className="bg-white text-cyan-600 px-8 py-3 rounded-full font-semibold hover:bg-zinc-100 transition-colors"
            >
              {tNav('contact')}
            </Link>
            <Link
              href={`/${lang}/booking`}
              className="bg-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-cyan-700 transition-colors"
            >
              {tNav('booking')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}