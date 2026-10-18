import { describe, expect, it } from 'vitest';
import { buildPeerComparisonRows } from '@/lib/profile-compare';
import type { RateTable } from '@/lib/rate-table';

// The page passes rateTable.comparisons (built from getRateTable -> compareCashLive,
// i.e. the same cash cache /cash renders). This test pins that the table values are
// read from those rows and never recomputed.
function comparisons(usdRows: Array<{ providerSlug: string; buyRate: number; observedAt: string }>, extraCurrency = 'EUR') {
  return [
    {
      currency: 'USD',
      all: usdRows.map((row) => ({ ...row, sellRate: row.buyRate + 0.1, denomination: '100', current: true, sourceType: 'live' })),
    },
    {
      currency: extraCurrency,
      all: [{ providerSlug: 'ratchada', buyRate: 999, sellRate: 999.1, observedAt: '2026-01-01T00:00:00.000Z', denomination: '100', current: true, sourceType: 'live' }],
    },
  ] as unknown as RateTable['comparisons'];
}

describe('SEO-30 three-changer comparison table', () => {
  it('returns the three public profiles in a stable order', () => {
    const rows = buildPeerComparisonRows(comparisons([]));
    expect(rows.map((row) => row.slug)).toEqual(['superrich-thailand', 'ratchada', 'twelve-victory']);
  });

  it('copies the USD buy rate and observedAt from the same comparison rows', () => {
    const source = [
      { providerSlug: 'superrich-thailand', buyRate: 33.33, observedAt: '2026-10-18T18:48:49.754Z' },
      { providerSlug: 'ratchada', buyRate: 33.41, observedAt: '2026-10-17T10:00:00.000Z' },
      { providerSlug: 'twelve-victory', buyRate: 33.2, observedAt: '2026-10-17T09:30:00.000Z' },
    ];
    const rows = buildPeerComparisonRows(comparisons(source));
    for (const expected of source) {
      const row = rows.find((item) => item.slug === expected.providerSlug)!;
      expect(row.buyRate).toBe(expected.buyRate);
      expect(row.observedAt).toBe(expected.observedAt);
    }
  });

  it('marks a provider without a USD row as unavailable instead of guessing', () => {
    const rows = buildPeerComparisonRows(comparisons([{ providerSlug: 'ratchada', buyRate: 33.41, observedAt: '2026-10-17T10:00:00.000Z' }]));
    expect(rows.find((row) => row.slug === 'superrich-thailand')).toEqual({ slug: 'superrich-thailand', buyRate: null, observedAt: null });
    expect(rows.find((row) => row.slug === 'twelve-victory')).toEqual({ slug: 'twelve-victory', buyRate: null, observedAt: null });
  });
});
