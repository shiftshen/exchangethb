import { describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(async () => JSON.stringify({
      generatedAt: new Date().toISOString(),
      results: [
        {
          provider: 'vasu',
          ok: true,
          observedAt: '2026-03-10T00:00:00.000Z',
          notes: ['ok'],
          rates: [
            {
              providerSlug: 'vasu',
              currency: 'CNY',
              denomination: 'notes',
              buyRate: 5.05,
              sellRate: 5.09,
              observedAt: '2026-03-10T00:00:00.000Z',
              sourceUrl: 'https://www.vasuexchange.com/',
            },
          ],
        },
      ],
    })),
  },
}));

import { compareCashLive } from '@/lib/cash-live';

describe('compareCashLive merge strategy', () => {
  it('keeps live providers and backfills missing providers from fallback dataset', async () => {
    const result = await compareCashLive({ currency: 'CNY', amount: 1000, maxDistanceKm: 10 });
    const providerSet = new Set(result.all.map((row) => row.providerSlug));
    expect(providerSet.has('vasu')).toBe(true);
    expect(providerSet.has('superrich-1965')).toBe(true);
    expect(providerSet.has('ratchada')).toBe(true);
    expect(result.source).toBe('Official scraping with fallback completion');
    expect(result.quality.liveRows).toBeGreaterThan(0);
    expect(result.quality.fallbackRows).toBeGreaterThan(0);
    expect(Array.isArray(result.quality.missingProviders)).toBe(true);
  });
});
