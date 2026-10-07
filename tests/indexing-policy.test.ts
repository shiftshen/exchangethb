import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import {
  indexedExchangeLocales,
  indexedMoneyChangerLocales,
  indexedRouteLocales,
  routeAlternateLocales,
  shouldIndexExchangeProfile,
  shouldIndexMoneyChangerProfile,
  shouldIndexRoute,
} from '@/lib/indexing-policy';

describe('detail page indexing policy', () => {
  it('indexes exchange profiles only where a full translation exists', () => {
    expect(indexedExchangeLocales).toEqual(['en', 'zh']);
    expect(shouldIndexExchangeProfile('en')).toBe(true);
    expect(shouldIndexExchangeProfile('zh')).toBe(true);
    for (const locale of ['th', 'ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi'] as const) {
      expect(shouldIndexExchangeProfile(locale), locale).toBe(false);
    }
  });

  it('indexes money changer profiles for public providers in en/th/zh', () => {
    expect(indexedMoneyChangerLocales).toEqual(['en', 'th', 'zh']);
    for (const locale of ['en', 'th', 'zh'] as const) {
      expect(shouldIndexMoneyChangerProfile(locale, 'ratchada'), locale).toBe(true);
      expect(shouldIndexMoneyChangerProfile(locale, 'twelve-victory'), locale).toBe(true);
    }
    expect(shouldIndexMoneyChangerProfile('th', 'sia')).toBe(false);
    expect(shouldIndexMoneyChangerProfile('zh', 'sia')).toBe(false);
    expect(shouldIndexMoneyChangerProfile('ja', 'ratchada')).toBe(false);
  });

  it('keeps secondary locales out of the exchange profile set', () => {
    expect(shouldIndexExchangeProfile('ja')).toBe(false);
    expect(shouldIndexExchangeProfile('ru')).toBe(false);
  });

  it('indexes route guides in the locales that carry complete copy', () => {
    expect(indexedRouteLocales).toEqual(['en', 'th', 'zh']);
    for (const locale of ['en', 'th', 'zh'] as const) {
      expect(shouldIndexRoute(locale, 'usd-cash-to-thb'), locale).toBe(true);
      expect(shouldIndexRoute(locale, 'btc-to-thb'), locale).toBe(true);
    }
    for (const locale of ['ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi'] as const) {
      expect(shouldIndexRoute(locale, 'usd-cash-to-thb'), locale).toBe(false);
    }
  });

  it('never indexes the 301 alias route slugs', () => {
    for (const locale of ['en', 'th', 'zh'] as const) {
      expect(shouldIndexRoute(locale, 'eth-to-thb'), locale).toBe(false);
      expect(shouldIndexRoute(locale, 'nana-money-exchange-guide'), locale).toBe(false);
      expect(routeAlternateLocales('eth-to-thb')).toEqual([]);
    }
  });
});

describe('sitemap detail coverage', () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it('lists the Chinese detail pages that now carry full copy', () => {
    expect(urls.some((url) => url.endsWith('/zh/money-changers/ratchada'))).toBe(true);
    expect(urls.some((url) => url.endsWith('/zh/exchanges/bitkub'))).toBe(true);
    expect(urls.some((url) => url.endsWith('/th/money-changers/ratchada'))).toBe(true);
  });

  it('emits reciprocal hreflang alternates for the Chinese money changer page', () => {
    const entry = entries.find((item) => item.url.endsWith('/zh/money-changers/ratchada'));
    expect(entry).toBeDefined();
    const languages = entry?.alternates?.languages as Record<string, string>;
    expect(languages.en).toMatch(/\/en\/money-changers\/ratchada$/);
    expect(languages.th).toMatch(/\/th\/money-changers\/ratchada$/);
    expect(languages.zh).toMatch(/\/zh\/money-changers\/ratchada$/);
    expect(languages['x-default']).toMatch(/\/en\/money-changers\/ratchada$/);
  });

  it('emits English and Chinese alternates for the exchange profile', () => {
    const entry = entries.find((item) => item.url.endsWith('/zh/exchanges/bitkub'));
    expect(entry).toBeDefined();
    const languages = entry?.alternates?.languages as Record<string, string>;
    expect(languages.en).toMatch(/\/en\/exchanges\/bitkub$/);
    expect(languages.zh).toMatch(/\/zh\/exchanges\/bitkub$/);
    expect(languages.th).toBeUndefined();
  });

  it('keeps the sitemap at the expected size after adding zh detail pages', () => {
    expect(entries.length).toBe(79);
  });

  it('lists the Thai and Chinese route guides that already carry full copy', () => {
    for (const url of [
      '/en/routes/usd-cash-to-thb',
      '/th/routes/usd-cash-to-thb',
      '/zh/routes/usd-cash-to-thb',
      '/th/routes/btc-to-thb',
      '/zh/routes/bangkok-airport-money-exchange-guide',
    ]) {
      expect(urls.some((entry) => entry.endsWith(url)), url).toBe(true);
    }
    expect(urls.some((url) => url.endsWith('/en/routes/eth-to-thb'))).toBe(false);
  });

  it('emits reciprocal en/th/zh alternates on every route entry', () => {
    const routeEntries = entries.filter((entry) => entry.url.includes('/routes/'));
    expect(routeEntries).toHaveLength(12);
    for (const entry of routeEntries) {
      const languages = entry.alternates?.languages as Record<string, string>;
      for (const locale of ['en', 'th', 'zh']) {
        expect(languages[locale], `${entry.url} ${locale}`).toMatch(new RegExp(`/${locale}/routes/`));
      }
      expect(languages['x-default']).toMatch(/\/en\/routes\//);
    }
  });
});
