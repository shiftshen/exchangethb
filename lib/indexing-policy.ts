import { ContentLocale, Locale } from '@/lib/types';

export const indexedRouteSlugs = [
  'btc-to-thb',
  'usdt-to-thb',
  'usd-cash-to-thb',
  'bangkok-airport-money-exchange-guide',
] as const;

export const indexedLegalSlugs = ['methodology', 'disclaimer'] as const;

// Locales that carry a complete route guide for the slugs above. Route title, summary,
// intro, audience and checks are required in th/en/zh by CopyGroup, and middleware already
// serves detail pages only in en/th/zh (other locales 307 to en). Verified against production
// on 2026-10-22: /th/routes/* and /zh/routes/* return 200 with native copy but were marked
// noindex with the canonical pointing at the English URL.
// The other 23 routeGuides slugs are 301 aliases in middleware.routeRedirects and never
// render a page, so they stay out of the index set by design.
export const indexedRouteLocales: Locale[] = ['en', 'th', 'zh'];

export function shouldIndexRoute(locale: Locale, slug: string) {
  return isIndexedRouteSlug(slug) && indexedRouteLocales.includes(locale);
}

/** Locales a route page should advertise as alternates, or none when the slug is not a live page. */
export function routeAlternateLocales(slug: string): Locale[] {
  return isIndexedRouteSlug(slug) ? indexedRouteLocales : [];
}

export function isIndexedRouteSlug(slug: string) {
  return indexedRouteSlugs.includes(slug as typeof indexedRouteSlugs[number]);
}

// Detail-page locales that carry fully localized copy (verified against the rendered pages):
// exchange and money changer profiles both carry hand-written English, Thai and Chinese copy.
export const indexedExchangeLocales: Locale[] = ['en', 'th', 'zh'];
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

// About page carries full hand-written copy in en/th/zh only; other locales stay noindex and canonical to en.
export const indexedAboutLocales: Locale[] = ['en', 'th', 'zh'];

export function shouldIndexAboutPage(locale: Locale) {
  return indexedAboutLocales.includes(locale);
}

export function shouldIndexHub() {
  return false;
}

export const coreIndexLocales: ContentLocale[] = ['th', 'en', 'zh', 'ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi'];
