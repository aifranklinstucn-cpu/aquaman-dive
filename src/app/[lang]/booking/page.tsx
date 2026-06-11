import { getTranslations } from 'next-intl/server';
import BookingForm from '@/components/BookingForm';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'booking' });

  return {
    title: `AQUAMAN - ${t('title')}`,
    description: 'Book your diving experience in Phuket',
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'booking' });

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">{t('title')}</h1>
        <p className="text-zinc-600 mb-8">选择日期和时间，开始你的潜水之旅</p>

        <BookingForm locale={lang as 'zh' | 'en' | 'th'} />
      </div>
    </div>
  );
}