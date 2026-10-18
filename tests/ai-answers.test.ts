import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  buildBestPlaceAnswer, buildCashVsCryptoAnswer, buildCurrencyAnswer, buildRatchadaAnswer, buildVersusAnswer,
  currencyFaqQuestion, ratchadaFaqQuestion, type AnswerQuote,
} from '@/lib/ai-answers';
import { questionPages } from '@/lib/question-pages';
import { getCashHubChangers, cashHubLocales, type CashHubLocale } from '@/lib/cash-hub-seo';

const t0 = new Date(Date.now() - 5 * 60000).toISOString();
function quotes(offsetsMin: number[] = [0, 2, 4]): AnswerQuote[] {
  return getCashHubChangers('en').slice(0, 3).map((c, i) => ({
    slug: c.slug, name: c.name, buyRate: 32.5 + i / 10, denomination: '50-100', observedAt: new Date(Date.parse(t0) + offsetsMin[i] * 60000).toISOString(), current: true,
  }));
}
// Latin names and numbers count as one unit; Thai and Chinese are segmented by ICU word rules.
function units(text: string, locale: CashHubLocale) {
  const seg = new Intl.Segmenter(locale, { granularity: 'word' });
  return [...seg.segment(text)].filter((s) => s.isWordLike).length;
}
const forbidden = /(sia money|vasu|superrich 1965|superrich-1965|best rate|cheapest|guarantee(?!d)|最佳汇率|最便宜|最划算|ดีที่สุด|ถูกที่สุด)/i;

describe('SEO-19 direct answers', () => {
  it('best-place answers are 40-70 units, carry the data time and name the collected changers', () => {
    for (const locale of cashHubLocales) {
      const text = buildBestPlaceAnswer(locale, quotes())!;
      const n = units(text, locale);
      expect(n, `${locale} ${n}: ${text}`).toBeGreaterThanOrEqual(40);
      expect(n, `${locale} ${n}: ${text}`).toBeLessThanOrEqual(70);
      expect(text).toMatch(/2026/);
      expect(text).toMatch(/GMT\+7/);
      for (const c of getCashHubChangers(locale)) expect(text).toContain(c.name);
      expect(text).not.toMatch(forbidden);
    }
  });

  it('currency answers (USD en/th, CNY zh) are 40-70 units with a time', () => {
    for (const locale of cashHubLocales) {
      const spec = currencyFaqQuestion[locale];
      const text = buildCurrencyAnswer(locale, spec.code, quotes())!;
      const n = units(text, locale);
      expect(n, `${locale} ${n}: ${text}`).toBeGreaterThanOrEqual(40);
      expect(n, `${locale} ${n}: ${text}`).toBeLessThanOrEqual(70);
      expect(text).toMatch(/GMT\+7/);
      expect(text).not.toMatch(forbidden);
      expect(spec.question).toMatch(/[?？]$/);
    }
  });

  it('when quotes are not from one cycle, each carries its own time (no shared stamp)', () => {
    const text = buildBestPlaceAnswer('en', quotes([0, 2, 60]))!;
    expect(text).not.toContain('Data updated');
    expect(text.match(/\(observed /g)?.length).toBe(3);
  });

  it('says nothing when every quote is older than 48 hours, but still answers on recent-but-not-current quotes', () => {
    const recent = quotes().map((q) => ({ ...q, current: false }));
    expect(buildBestPlaceAnswer('en', recent)).toContain('Data updated');
    const stale = quotes().map((q) => ({ ...q, observedAt: new Date(Date.now() - 72 * 3600000).toISOString() }));
    expect(buildBestPlaceAnswer('en', stale)).toBeNull();
    expect(buildCurrencyAnswer('zh', 'CNY', stale)).toBeNull();
    expect(buildCashVsCryptoAnswer('en', stale)).toBeNull();
  });

  it('Ratchada profile answers (en/th) and the same-cycle comparison stay factual', () => {
    for (const locale of ['en', 'th'] as const) {
      const text = buildRatchadaAnswer(locale, quotes())!;
      const n = units(text, locale);
      expect(n, `${locale} ${n}: ${text}`).toBeGreaterThanOrEqual(40);
      expect(n, `${locale} ${n}: ${text}`).toBeLessThanOrEqual(70);
      expect(text).toMatch(/GMT\+7/);
      expect(text).not.toMatch(forbidden);
      expect(ratchadaFaqQuestion[locale]).toBeTruthy();
    }
    const same = buildVersusAnswer('en', quotes())!;
    expect(units(same, 'en')).toBeGreaterThanOrEqual(40);
    expect(units(same, 'en')).toBeLessThanOrEqual(70);
    expect(same).toContain('same ExchangeTHB observation');
    expect(same).not.toMatch(forbidden);
    const apart = buildVersusAnswer('en', quotes([0, 90, 0]))!;
    expect(apart).toContain('no direct comparison');
  });

  it('cash-vs-crypto answer is 40-70 words and recommends neither route', () => {
    const text = buildCashVsCryptoAnswer('en', quotes())!;
    expect(units(text, 'en')).toBeGreaterThanOrEqual(40);
    expect(units(text, 'en')).toBeLessThanOrEqual(70);
    expect(text).toContain('recommends neither');
  });

  it('llms.txt table covers 10 distinct questions with existing indexable pages and no hidden provider', () => {
    expect(questionPages).toHaveLength(10);
    expect(new Set(questionPages.map((q) => q.question)).size).toBe(10);
    for (const q of questionPages) expect(q.path).toMatch(/^\/(en|th|zh)\/(cash|crypto|money-changers\/(ratchada|superrich-thailand))$/);
    expect(JSON.stringify(questionPages)).not.toMatch(forbidden);
    expect(readFileSync('app/llms.txt/route.ts', 'utf8')).toContain('questionPages');
  });

  it('the answer helpers contain no hard-coded rate or price', () => {
    const src = readFileSync('lib/ai-answers.ts', 'utf8').replace(/\/\/.*$/gm, '');
    const literals = [...src.matchAll(/`([^`]*)`|'([^'\n]*)'/g)].map((m) => m[1] ?? m[2]).join('\n');
    expect(literals.replace(/\$\{[^}]*\}/g, '')).not.toMatch(/\d{2,}\.\d|฿\s?\d|\d+\s?baht/);
  });
});
