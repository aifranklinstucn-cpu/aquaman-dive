import { getRequestConfig } from 'next-intl/server';

export const locales = ['zh', 'en', 'th'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  th: 'ภาษาไทย',
};

export const defaultLocale: Locale = 'zh';

export default getRequestConfig(async () => {
  const locale = 'zh';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});