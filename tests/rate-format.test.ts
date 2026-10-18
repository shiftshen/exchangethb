import { describe, expect, it } from 'vitest';
import { formatBangkokStamp, ratchadaMeta } from '@/lib/rate-format';
import { buildMoneyChangerSeo } from '@/lib/money-changer-seo';

const len = (value: string) => [...value].length;

describe('formatBangkokStamp', () => {
  it('renders Bangkok wall-clock time regardless of the server timezone', () => {
    // 2026-10-17T10:00:00Z is 17:00 in Bangkok.
    expect(formatBangkokStamp('2026-10-17T10:00:00.000Z', 'en')).toBe('17 Oct 17:00');
    expect(formatBangkokStamp('2026-10-17T10:00:00.000Z', 'th')).toBe('17 ต.ค. 17:00');
    expect(formatBangkokStamp('2026-10-17T10:00:00.000Z', 'zh')).toBe('10月17日 17:00');
    // crosses midnight in Bangkok
    expect(formatBangkokStamp('2026-10-17T18:48:49.754Z', 'en')).toBe('18 Oct 01:48');
  });

  it('returns null instead of inventing a time', () => {
    expect(formatBangkokStamp(null, 'en')).toBeNull();
    expect(formatBangkokStamp('not a date', 'en')).toBeNull();
  });
});

describe('ratchadaMeta (SEO-24)', () => {
  const stamp = { en: '17 Oct 17:00', th: '17 ต.ค. 17:00', zh: '10月17日 17:00' } as const;

  it('puts the searched Thai spelling, the English name and the quote stamp in the Thai title', () => {
    const { title, description } = ratchadaMeta('th', stamp.th, 15);
    expect(title).toContain('รัชดาเอกเช้น');
    expect(title).toContain('Ratchada Exchange');
    expect(title).toContain(stamp.th);
    expect(description).toContain('รัชดาเอกเช้น');
    expect(description).toContain('Ratchada Exchange');
  });

  it('adds the Huai Khwang Chinese name and 今日汇率 to the Chinese title', () => {
    const { title } = ratchadaMeta('zh', stamp.zh, 15);
    expect(title).toContain('汇权');
    expect(title).toContain('ห้วยขวาง');
    expect(title).toContain('今日汇率');
    expect(title).toContain(stamp.zh);
  });

  it('leads the English title and description with today’s rate and the update time', () => {
    const { title, description } = ratchadaMeta('en', stamp.en, 15);
    expect(title).toMatch(/Rate Today/);
    expect(title).toContain(`Updated ${stamp.en}`);
    expect(description).toContain(`updated ${stamp.en}`);
    expect(description).toContain('15 currencies');
  });

  it('keeps titles and descriptions inside display limits', () => {
    for (const locale of ['en', 'th', 'zh'] as const) {
      for (const withData of [true, false]) {
        const { title, description } = ratchadaMeta(locale, withData ? stamp[locale] : null, withData ? 15 : 0);
        expect(len(title), `${locale} title ${title}`).toBeLessThanOrEqual(70);
        expect(len(description), `${locale} description ${description}`).toBeLessThanOrEqual(200);
      }
    }
  });

  it('never prints a stamp or a count when no quote exists', () => {
    for (const locale of ['en', 'th', 'zh'] as const) {
      const { title, description } = ratchadaMeta(locale, null, 0);
      expect((title + description).replaceAll('09:00–20:30', '')).not.toMatch(/\d{1,2}:\d{2}|currencies|สกุลเงิน|个币种/);
    }
  });

  it('is the static fallback used by the profile SEO bundle', () => {
    for (const locale of ['en', 'th', 'zh'] as const) {
      const seo = buildMoneyChangerSeo('ratchada', locale)!;
      expect(seo.content.metaTitle).toBe(ratchadaMeta(locale, null, 0).title);
    }
  });
});
