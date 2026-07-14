import { ContentLocale, Locale } from '@/lib/types';

export const indexedRouteSlugs = [
  'btc-to-thb',
  'usdt-to-thb',
  'usd-cash-to-thb',
  'bangkok-airport-money-exchange-guide',
] as const;

export const indexedLegalSlugs = ['methodology', 'disclaimer'] as const;

export function shouldIndexRoute(locale: Locale, slug: string) {
  return locale === 'en' && isIndexedRouteSlug(slug);
}

export function isIndexedRouteSlug(slug: string) {
  return indexedRouteSlugs.includes(slug as typeof indexedRouteSlugs[number]);
}

export function shouldIndexExchangeProfile(locale: Locale) {
  return locale === 'en';
}

export function shouldIndexMoneyChangerProfile(locale: Locale, slug: string) {
  if (locale === 'en') return true;
  return locale === 'th' && ['ratchada', 'sia', 'superrich-thailand'].includes(slug);
}

export function shouldIndexLegalPage(locale: Locale, slug: string) {
  return ['en', 'th', 'zh'].includes(locale)
    && indexedLegalSlugs.includes(slug as typeof indexedLegalSlugs[number]);
}

export function shouldIndexHub() {
  return false;
}

export const coreIndexLocales: ContentLocale[] = ['en', 'th', 'zh'];
