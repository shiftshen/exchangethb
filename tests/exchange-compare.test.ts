import { describe, expect, it } from 'vitest';
import { exchanges } from '@/data/site';
import { buildExchangeComparisonRows } from '@/lib/exchange-compare';

describe('SEO-30 /exchanges licensed venue table', () => {
  const rows = buildExchangeComparisonRows();

  it('renders exactly one row per exchange in data/site.ts', () => {
    expect(rows).toHaveLength(exchanges.length);
    expect(rows.map((row) => row.slug)).toEqual(exchanges.map((exchange) => exchange.slug));
  });

  it('takes every exchange fact from data/site.ts', () => {
    for (const exchange of exchanges) {
      const row = rows.find((item) => item.slug === exchange.slug)!;
      expect(row.name).toBe(exchange.name);
      expect(row.license).toBe(exchange.license);
      expect(row.thbPairs).toEqual(exchange.pairs.map((pair) => `${pair}/THB`));
      expect(row.officialUrl).toBe(exchange.affiliate.officialUrl);
    }
  });

  it('never turns an unpublished THB withdrawal fee into a number', () => {
    expect(rows.find((row) => row.slug === 'binance-th')?.thbWithdraw).toBe(20);
    expect(rows.find((row) => row.slug === 'bitkub')?.thbWithdraw).toBe(20);
    // data/site.ts marks these as thbWithdrawKnown: false
    expect(rows.find((row) => row.slug === 'upbit-thailand')?.thbWithdraw).toBeNull();
    expect(rows.find((row) => row.slug === 'orbix')?.thbWithdraw).toBeNull();
  });
});
