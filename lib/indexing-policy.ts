import { ContentLocale, Locale } from '@/lib/types';

export const indexedRouteSlugs = [
  'btc-to-thb',
  'usdt-to-thb',
  'usd-cash-to-thb',
  'bangkok-airport-money-exchange-guide',
] as const;

export const indexedLegalSlugs = ['methodology', 'disclaimer'] as const;

// Locales that carry a complete route guide for the slugs above. Route title, summary,
// intro, audience and checks are required in th/en/zh by CopyGroup, the route page's own
// uiCopy has full th and zh blocks, and middleware already serves detail pages only in
// en/th/zh (other locales 307 to en). Verified against the rendered pages on 2026-10-07:
// /th/routes/* and /zh/routes/* return 200 with the native headline and were previously
// marked noindex, while only the en variants were advertised in the sitemap.
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
