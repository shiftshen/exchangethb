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

// Detail-page locales that carry fully localized copy (verified against the rendered pages):
// exchange profiles have complete Chinese copy; money changer profiles complete Thai and Chinese copy.
export const indexedExchangeLocales: Locale[] = ['en', 'zh'];
export const indexedMoneyChangerLocales: Locale[] = ['en', 'th', 'zh'];
export const indexedMoneyChangerSlugs = ['ratchada', 'superrich-thailand', 'twelve-victory'] as const;

export function shouldIndexExchangeProfile(locale: Locale) {
  return indexedExchangeLocales.includes(locale);
}

export function shouldIndexMoneyChangerProfile(locale: Locale, slug: string) {
  if (locale === 'en') return true;
  return indexedMoneyChangerLocales.includes(locale)
    && indexedMoneyChangerSlugs.includes(slug as typeof indexedMoneyChangerSlugs[number]);
}

export function shouldIndexLegalPage(locale: Locale, slug: string) {
  return ['th', 'en', 'zh', 'ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi'].includes(locale)
    && indexedLegalSlugs.includes(slug as typeof indexedLegalSlugs[number]);
}

export function shouldIndexHub() {
  return false;
}

export const coreIndexLocales: ContentLocale[] = ['th', 'en', 'zh', 'ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi'];
