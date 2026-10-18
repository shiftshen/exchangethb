import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cashBranches, cashProviders, publicCashProviderSlugs } from '@/data/site';
import { buildCashHubContent, cashHubFaqJsonLd, cashHubLocales, getCashHubChangers, isCashHubLocale } from '@/lib/cash-hub-seo';
import { cashCurrencies } from '@/lib/types';
import { organizationId } from '@/lib/seo';

const pageSource = readFileSync('app/[locale]/cash/page.tsx', 'utf8');
const componentSource = readFileSync('components/cash-hub.tsx', 'utf8');
const forbidden = /(best rate|cheapest|lowest|highest|guarantee|最佳汇率|最便宜|最划算|保证|ดีที่สุด|ถูกที่สุด|เรทดีที่สุด)/i;

// Strips everything the copy may derive from data (changer names/areas/hours, currency count).
function staticCopy(locale: 'en' | 'th' | 'zh') {
  const content = buildCashHubContent(locale);
  const changers = getCashHubChangers(locale);
  let text = [content.metaTitle, content.metaDescription, content.answerHeading, content.answer, content.faqHeading,
    ...Object.values(content.currencies).flatMap((c) => [c.heading, c.intro, c.cta]),
    ...content.faqs.flatMap((f) => [f.question, f.answer]), ...Object.values(content.labels)].join('\n');
  for (const c of changers) text = text.split(c.hours).join('').split(c.name).join('').split(c.area).join('');
  return text.split(`${cashCurrencies.length}`).join('');
}

describe('/cash hub copy', () => {
  it('covers en/th/zh only and builds from the public providers in data/site.ts', () => {
    expect(cashHubLocales).toEqual(['en', 'th', 'zh']);
    expect(isCashHubLocale('ja')).toBe(false);
    const changers = getCashHubChangers('en');
    expect(changers.map((c) => c.slug)).toEqual([...publicCashProviderSlugs]);
    for (const c of changers) {
      expect(c.name).toBe(cashProviders.find((p) => p.slug === c.slug)!.name);
      expect(c.area).toBe(cashBranches.find((b) => b.providerSlug === c.slug)!.area);
    }
  });

  it('ships at least five distinct FAQs, with question headings, in each locale', () => {
    for (const locale of cashHubLocales) {
      const content = buildCashHubContent(locale);
      expect(content.faqs.length).toBeGreaterThanOrEqual(5);
      expect(new Set(content.faqs.map((f) => f.question)).size).toBe(content.faqs.length);
      for (const f of content.faqs) { expect(f.question.length).toBeGreaterThan(5); expect(f.answer.length).toBeGreaterThan(20); }
      expect(content.answerHeading).toMatch(/[?？]$/);
      for (const c of Object.values(content.currencies)) expect(c.heading).toMatch(/[?？]$/);
      expect(Object.keys(content.currencies)).toEqual(['USD', 'EUR', 'JPY', 'CNY']);
    }
  });

  it('writes no hard-coded numbers: every digit in the copy comes from data/site.ts', () => {
    for (const locale of cashHubLocales) expect(staticCopy(locale), locale).not.toMatch(/\d/);
  });

  it('derives hours and the currency count from data', () => {
    for (const locale of cashHubLocales) {
      const content = buildCashHubContent(locale);
      for (const c of getCashHubChangers(locale)) {
        expect(c.hours).toMatch(/\d{2}:\d{2}/);
        expect(content.answer).toContain(c.hours);
        expect(content.faqs[1].answer).toContain(c.hours);
      }
      expect(content.faqs[7].answer).toContain(String(cashCurrencies.length));
    }
  });

  it('makes no unverifiable superlative claims (D3)', () => {
    for (const locale of cashHubLocales) expect(staticCopy(locale), locale).not.toMatch(forbidden);
    expect(componentSource).not.toMatch(forbidden);
  });

  it('keeps titles within 60 characters and descriptions snippet-sized', () => {
    for (const locale of cashHubLocales) {
      const { metaTitle, metaDescription } = buildCashHubContent(locale);
      expect([...metaTitle].length, metaTitle).toBeLessThanOrEqual(60);
      expect([...metaDescription].length, metaDescription).toBeLessThanOrEqual(190);
      expect(locale === 'zh' ? metaTitle : metaTitle + metaDescription).toMatch(locale === 'zh' ? /人民币/ : /CNY/);
    }
  });

  it('emits FAQPage JSON-LD tied to #organization whose entries equal the visible FAQ', () => {
    for (const locale of cashHubLocales) {
      const { faqs } = buildCashHubContent(locale);
      const ld = cashHubFaqJsonLd(locale, faqs);
      expect(ld['@type']).toBe('FAQPage');
      expect(ld.publisher).toEqual({ '@id': organizationId() });
      expect(ld.mainEntity.map((q) => q.name)).toEqual(faqs.map((f) => f.question));
      expect(ld.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(faqs.map((f) => f.answer));
    }
    // the visible FAQ component renders question and answer as plain text, not inside <details>
    expect(componentSource).toMatch(/<h3>\{item\.question\}<\/h3>/);
    expect(componentSource).toMatch(/<p>\{item\.answer\}<\/p>/);
    expect(componentSource).not.toContain('<details');
  });

  it('leaves canonical, query rules and the other locales untouched', () => {
    expect(pageSource).toContain("localeMetadataAlternates(locale, '/cash')");
    expect(pageSource).toContain('localeRobots(locale)');
    expect(pageSource).toContain('ru: additionalCopy.ru.pages.cash');
    expect(componentSource).toContain('if (!isCashHubLocale(locale)) return null');
  });
});
