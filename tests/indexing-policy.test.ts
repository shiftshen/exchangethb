import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import {
  indexedExchangeLocales,
  indexedMoneyChangerLocales,
  shouldIndexExchangeProfile,
  shouldIndexMoneyChangerProfile,
} from '@/lib/indexing-policy';

describe('detail page indexing policy', () => {
  it('indexes exchange profiles only where a full translation exists', () => {
    expect(indexedExchangeLocales).toEqual(['en', 'th', 'zh']);
    for (const locale of ['en', 'th', 'zh'] as const) expect(shouldIndexExchangeProfile(locale), locale).toBe(true);
    for (const locale of ['ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi'] as const) {
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

  it('emits reciprocal English, Thai and Chinese alternates for the exchange profile', () => {
    for (const locale of ['en', 'th', 'zh']) {
      const entry = entries.find((item) => item.url.endsWith(`/${locale}/exchanges/bitkub`));
      expect(entry).toBeDefined();
      const languages = entry?.alternates?.languages as Record<string, string>;
      expect(languages.en).toMatch(/\/en\/exchanges\/bitkub$/);
      expect(languages.th).toMatch(/\/th\/exchanges\/bitkub$/);
      expect(languages.zh).toMatch(/\/zh\/exchanges\/bitkub$/);
      expect(languages['x-default']).toMatch(/\/en\/exchanges\/bitkub$/);
    }
  });

  it('lists the Thai and Chinese route guides that carry native copy', () => {
    for (const locale of ['en', 'th', 'zh']) {
      for (const slug of ['btc-to-thb', 'usdt-to-thb', 'usd-cash-to-thb', 'bangkok-airport-money-exchange-guide']) {
        expect(urls.some((url) => url.endsWith(`/${locale}/routes/${slug}`)), `${locale}/${slug}`).toBe(true);
      }
    }
    expect(urls.some((url) => url.endsWith('/en/routes/eth-to-thb'))).toBe(false);
  });

  it('emits reciprocal alternates for the Thai route guide', () => {
    const entry = entries.find((item) => item.url.endsWith('/th/routes/usd-cash-to-thb'));
    expect(entry).toBeDefined();
    const languages = entry?.alternates?.languages as Record<string, string>;
    expect(languages.en).toMatch(/\/en\/routes\/usd-cash-to-thb$/);
    expect(languages.th).toMatch(/\/th\/routes\/usd-cash-to-thb$/);
    expect(languages.zh).toMatch(/\/zh\/routes\/usd-cash-to-thb$/);
    expect(languages['x-default']).toMatch(/\/en\/routes\/usd-cash-to-thb$/);
  });

  it('lists the exchanges and money-changers hubs in en/th/zh', () => {
    for (const locale of ['en', 'th', 'zh']) {
      for (const path of ['/exchanges', '/money-changers']) {
        expect(urls.some((url) => url.endsWith(`/${locale}${path}`)), `${locale}${path}`).toBe(true);
      }
    }
    expect(urls.some((url) => url.endsWith('/en/routes'))).toBe(false);
  });

  it('emits reciprocal alternates for the exchanges hub', () => {
    const entry = entries.find((item) => item.url.endsWith('/th/exchanges'));
    const languages = entry?.alternates?.languages as Record<string, string>;
    expect(languages.en).toMatch(/\/en\/exchanges$/);
    expect(languages.zh).toMatch(/\/zh\/exchanges$/);
  });

  it('keeps the sitemap at the expected size after adding the localised route guides and hubs', () => {
    expect(entries.length).toBe(92);
  });
});
