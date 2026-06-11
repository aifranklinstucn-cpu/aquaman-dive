import { getTranslations } from 'next-intl/server';
import LiveaboardBookingForm from '@/components/LiveaboardBookingForm';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'liveaboard' });

  return {
    title: `AQUAMAN - ${t('bookTitle')}`,
    description: 'Book your Similan Islands liveaboard diving trip',
  };
}

export default async function LiveaboardBookingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'liveaboard' });

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">{t('bookTitle')}</h1>
        <p className="text-zinc-600 mb-8">{t('bookSubtitle')}</p>

        <LiveaboardBookingForm locale={lang as 'zh' | 'en' | 'th'} />
      </div>
    </div>
  );
}