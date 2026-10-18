import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { exchanges } from '@/data/site';
import { buildExchangeSeo, exchangeFaqJsonLd, exchangeSeoLocales, exchangeServiceJsonLd, getExchangeFacts } from '@/lib/exchange-seo';
import { shouldIndexExchangeProfile } from '@/lib/indexing-policy';
import { organizationId } from '@/lib/seo';

const locales = exchangeSeoLocales;
const pageSource = readFileSync('app/[locale]/exchanges/[slug]/page.tsx', 'utf8');

function allText(slug: string, locale: 'en' | 'th' | 'zh') {
  const seo = buildExchangeSeo(slug, locale)!;
  const c = seo.content;
  return [c.metaTitle, c.metaDescription, c.answer, ...c.differentiators, ...c.faqs.flatMap((f) => [f.question, f.answer])].join('\n');
}

describe('exchange profile SEO copy', () => {
  it('covers the four exchanges in three locales (12 pages)', () => {
    expect(exchanges.map((e) => e.slug)).toEqual(['binance-th', 'bitkub', 'upbit-thailand', 'orbix']);
    for (const exchange of exchanges) for (const locale of locales) expect(buildExchangeSeo(exchange.slug, locale)).not.toBeNull();
    expect(buildExchangeSeo('unknown', 'en')).toBeNull();
  });

  it('starts every title with the exchange name, stays within 60 characters and is unique', () => {
    const titles = new Set<string>();
    for (const exchange of exchanges) {
      for (const locale of locales) {
        const { metaTitle } = buildExchangeSeo(exchange.slug, locale)!.content;
        expect(metaTitle.startsWith(exchange.name), metaTitle).toBe(true);
        expect([...metaTitle].length, metaTitle).toBeLessThanOrEqual(60);
        expect(titles.has(metaTitle), metaTitle).toBe(false);
        titles.add(metaTitle);
      }
    }
    expect(buildExchangeSeo('bitkub', 'th')!.content.metaTitle).toContain('ค่าธรรมเนียม');
    expect(buildExchangeSeo('bitkub', 'zh')!.content.metaTitle).toContain('手续费');
    expect(buildExchangeSeo('bitkub', 'en')!.content.metaTitle).toContain('Fees');
  });

  it('keeps descriptions short enough for a snippet and distinct per exchange', () => {
    const seen = new Set<string>();
    for (const exchange of exchanges) {
      for (const locale of locales) {
        const { metaDescription } = buildExchangeSeo(exchange.slug, locale)!.content;
        expect([...metaDescription].length, metaDescription).toBeLessThanOrEqual(190);
        expect(seen.has(metaDescription)).toBe(false);
        seen.add(metaDescription);
      }
    }
  });

  it('ships at least five FAQs and 2–3 exchange-specific points per page', () => {
    for (const exchange of exchanges) {
      for (const locale of locales) {
        const { content } = buildExchangeSeo(exchange.slug, locale)!;
        expect(content.faqs.length).toBeGreaterThanOrEqual(5);
        expect(new Set(content.faqs.map((f) => f.question)).size).toBe(content.faqs.length);
        expect(content.differentiators.length).toBeGreaterThanOrEqual(2);
        expect(content.differentiators.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it('renders every FAQ question and answer visibly and feeds the same list to the FAQPage markup', () => {
    // The page maps content.faqs to visible h3/p and builds the JSON-LD from the same array.
    expect(pageSource).toContain('content.faqs.map((item)');
    expect(pageSource).toContain('<h3 className="font-semibold text-white">{item.question}</h3>');
    expect(pageSource).toContain('exchangeFaqJsonLd({ locale, slug, faqs: content.faqs })');
    for (const exchange of exchanges) {
      for (const locale of locales) {
        const { content } = buildExchangeSeo(exchange.slug, locale)!;
        const ld = exchangeFaqJsonLd({ locale, slug: exchange.slug, faqs: content.faqs });
        expect(ld.mainEntity.map((q) => q.name)).toEqual(content.faqs.map((f) => f.question));
        expect(ld.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(content.faqs.map((f) => f.answer));
        expect(ld.publisher).toEqual({ '@id': organizationId() });
      }
    }
  });

  it('states only facts that data/site.ts holds', () => {
    for (const exchange of exchanges) {
      const facts = getExchangeFacts(exchange.slug)!;
      expect(facts.tradingFeePct).toBe(exchange.fee.tradingFeePct);
      expect(facts.pairs).toEqual(exchange.pairs);
      for (const locale of locales) {
        const text = allText(exchange.slug, locale);
        expect(text).toContain(`${exchange.fee.tradingFeePct}%`);
        for (const pair of exchange.pairs) expect(text).toContain(pair);
        if (exchange.fee.thbWithdrawKnown === false) {
          expect(facts.thbWithdraw).toBeNull();
          // An unknown withdrawal fee must never be written as a baht amount or as "free".
          expect(text).not.toContain(`฿${exchange.fee.thbWithdraw}`);
          expect(text.toLowerCase()).not.toMatch(/free of charge|no withdrawal fee|withdrawals? (?:is|are) free|free withdrawal|ถอนฟรี|ฟรีค่า|免费提现|提现免费|免手续费/);
        } else {
          expect(text).toContain(`฿${exchange.fee.thbWithdraw}`);
        }
        if (exchange.fee.tradingFeeAsset === 'received') {
          expect(text).toMatch(/taken from the asset you receive|หักจากสินทรัพย์ที่ได้รับ|从收到的资产中扣除/);
        } else {
          expect(text).not.toMatch(/taken from the asset you receive|หักจากสินทรัพย์ที่ได้รับ|从收到的资产中扣除/);
        }
      }
    }
  });

  it('uses no number that is not derived from data/site.ts', () => {
    for (const exchange of exchanges) {
      const allowed = new Set<string>();
      const add = (value: string | number) => String(value).match(/\d+(?:\.\d+)?/g)?.forEach((n) => allowed.add(n));
      add(exchange.fee.tradingFeePct);
      add(exchange.fee.thbWithdraw);
      add(exchange.lastUpdated.slice(0, 10));
      // Other exchanges' fees appear in the fee-comparison FAQ, and names carry no digits.
      exchanges.forEach((other) => add(other.fee.tradingFeePct));
      for (const locale of locales) {
        const found = allText(exchange.slug, locale).match(/\d+(?:\.\d+)?/g) || [];
        for (const number of found) expect(allowed.has(number), `${exchange.slug}/${locale}: ${number}`).toBe(true);
      }
    }
  });

  it('answers the deposit question without inventing steps', () => {
    const bitkub = buildExchangeSeo('bitkub', 'en')!.content.faqs.find((f) => f.question.includes('deposit'))!;
    expect(bitkub.answer).toContain('supports THB deposits');
    for (const slug of ['binance-th', 'upbit-thailand', 'orbix']) {
      const entry = buildExchangeSeo(slug, 'en')!.content.faqs.find((f) => f.question.includes('deposit'))!;
      expect(entry.answer).toContain('does not list');
    }
  });

  it('names the lowest fee only where the data says so', () => {
    const fees = exchanges.map((e) => e.fee.tradingFeePct);
    const lowest = Math.min(...fees);
    expect(exchanges.filter((e) => e.fee.tradingFeePct === lowest).map((e) => e.slug)).toEqual(['upbit-thailand']);
    expect(buildExchangeSeo('upbit-thailand', 'en')!.content.metaDescription).toContain('lowest');
    expect(buildExchangeSeo('bitkub', 'en')!.content.metaDescription).not.toContain('lowest');
  });

  it('emits a FinancialService node with only supported fields', () => {
    const facts = getExchangeFacts('bitkub')!;
    const ld = exchangeServiceJsonLd({ facts, locale: 'th', description: 'x' });
    expect(ld['@type']).toBe('FinancialService');
    expect(ld.url).toMatch(/\/th\/exchanges\/bitkub$/);
    expect(ld.sameAs).toEqual(['https://www.bitkub.com']);
    expect(Object.keys(ld).sort()).toEqual(['@context', '@id', '@type', 'areaServed', 'description', 'name', 'sameAs', 'url']);
  });

  it('indexes and lists all twelve exchange pages with reciprocal hreflang', () => {
    for (const locale of locales) expect(shouldIndexExchangeProfile(locale)).toBe(true);
    const entries = sitemap();
    for (const exchange of exchanges) {
      for (const locale of locales) {
        const entry = entries.find((item) => item.url.endsWith(`/${locale}/exchanges/${exchange.slug}`));
        expect(entry, `${locale}/${exchange.slug}`).toBeDefined();
        const languages = entry!.alternates!.languages as Record<string, string>;
        expect(Object.keys(languages).sort()).toEqual(['en', 'th', 'x-default', 'zh']);
      }
    }
  });
});
