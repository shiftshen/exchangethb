import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/market-data', () => ({
  getLiveMarketSnapshots: vi.fn(async () => ([
    {
      exchange: 'binance-th',
      symbol: 'BTC',
      asks: [{ price: 1000000, quantity: 1 }],
      bids: [{ price: 999000, quantity: 1 }],
      lastUpdated: '2026-03-10T00:00:00.000Z',
      source: 'live',
    },
    {
      exchange: 'upbit-thailand',
      symbol: 'BTC',
      asks: [{ price: 1005000, quantity: 1 }],
      bids: [{ price: 998000, quantity: 1 }],
      lastUpdated: '2026-03-10T00:00:00.000Z',
      source: 'fallback',
      fallbackReason: 'Upstream unavailable',
    },
  ])),
  describeMarketSource: vi.fn((snapshot: { source: 'live' | 'fallback'; fallbackReason?: string }) => ({
    live: snapshot.source === 'live',
    label: snapshot.source === 'live' ? 'Official API + rules engine' : 'Reviewed fallback dataset',
    freshness: snapshot.source === 'live' ? 'Live orderbook (target 15s refresh)' : 'Fallback snapshot',
    fallbackReason: snapshot.source === 'live' ? null : snapshot.fallbackReason || null,
  })),
}));

vi.mock('@/lib/content-store', () => ({
  readAdminConfig: vi.fn(async () => ({
    feeOverrides: {},
    affiliateLinks: {},
  })),
}));

import { compareCrypto } from '@/lib/compare';

describe('compareCrypto fields', () => {
  it('includes source, live, freshness and fallbackReason', async () => {
    const rows = await compareCrypto({
      symbol: 'BTC',
      side: 'buy',
      amount: 0.5,
      quoteMode: 'coin',
      includeWithdrawal: true,
      withdrawThb: false,
    });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('source');
    expect(rows[0]).toHaveProperty('live');
    expect(rows[0]).toHaveProperty('freshness');
    expect(rows.some((row) => row.fallbackReason === 'Upstream unavailable')).toBe(true);
  });
});
