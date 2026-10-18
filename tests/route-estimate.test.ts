import { describe, expect, it } from 'vitest';
import { estimateBuyThb } from '@/lib/route-estimate';
import type { MarketSnapshot } from '@/lib/types';

function snapshot(exchange: MarketSnapshot['exchange'], asks: Array<[number, number]>, updatedAt = '2026-10-19T00:00:00.000Z'): MarketSnapshot {
  return {
    exchange,
    symbol: 'BTC',
    asks: asks.map(([price, quantity]) => ({ price, quantity })),
    bids: [],
    lastUpdated: updatedAt,
    source: 'live',
    fetchedAt: updatedAt,
    timestampKind: 'collected',
  };
}

describe('SEO-30 btc-to-thb THB estimate', () => {
  it('takes the cheapest full fill across snapshots and keeps its timestamp', () => {
    const estimate = estimateBuyThb([
      snapshot('binance-th', [[2_300_000, 0.02]], '2026-10-19T01:00:00.000Z'),
      snapshot('bitkub', [[2_290_000, 0.02]], '2026-10-19T02:00:00.000Z'),
    ], 0.01);
    expect(estimate).toMatchObject({ exchange: 'bitkub', updatedAt: '2026-10-19T02:00:00.000Z' });
    expect(estimate?.thb).toBeCloseTo(22_900, 6);
  });

  it('walks multiple ask levels instead of using only the best price', () => {
    const estimate = estimateBuyThb([snapshot('bitkub', [[2_000_000, 0.005], [2_100_000, 0.005]])], 0.01);
    expect(estimate?.thb).toBeCloseTo(20_500, 6);
    expect(estimate?.averagePrice).toBeCloseTo(2_050_000, 6);
  });

  it('returns null when no snapshot can fill the amount', () => {
    expect(estimateBuyThb([], 0.01)).toBeNull();
    expect(estimateBuyThb([snapshot('binance-th', [[2_300_000, 0.001]])], 0.01)).toBeNull();
    expect(estimateBuyThb([snapshot('binance-th', [[0, 1]])], 0.01)).toBeNull();
  });
});
