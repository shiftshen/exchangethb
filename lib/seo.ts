import { Locale } from '@/lib/types';

export const siteUrl = 'https://exchangethb.com';

export function withLocalePath(locale: Locale, path = '') {
  return `${siteUrl}/${locale}${path}`;
}

export function localeAlternates(path = '') {
  return {
    th: withLocalePath('th', path),
    en: withLocalePath('en', path),
    zh: withLocalePath('zh', path),
  };
}
