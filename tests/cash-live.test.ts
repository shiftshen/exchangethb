import { describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(async () => JSON.stringify({
      generatedAt: new Date().toISOString(),
      results: [
        {
          provider: 'ratchada',
          ok: true,
          observedAt: '2026-03-10T00:00:00.000Z',
          notes: ['ok'],
          rates: [
            {
              providerSlug: 'ratchada',
              currency: 'USD',
              denomination: '100',
              buyRate: 31.46,
              sellRate: 31.62,
              observedAt: '2026-03-10T00:00:00.000Z',
              sourceUrl: 'https://www.ratchadaexchange.com/',
            },
            {
              providerSlug: 'superrich-1965',
              currency: 'USD',
              denomination: '100',
              buyRate: 31.59,
              sellRate: 31.75,
              observedAt: '2026-03-10T00:00:00.000Z',
              sourceUrl: 'https://www.superrich1965.com/',
              sourceKind: 'hybrid',
            },
          ],
        },
      ],
    })),
  },
}));

import { compareCashLive } from '@/lib/cash-live';

describe('compareCashLive merge strategy', () => {
  it('keeps only stable public providers on the frontend listing', async () => {
    const result = await compareCashLive({ currency: 'USD', amount: 1000, maxDistanceKm: 10 });
    const providerSet = new Set(result.all.map((row) => row.providerSlug));
    expect(providerSet.has('ratchada')).toBe(true);
    expect(providerSet.has('superrich-1965')).toBe(false);
    expect(providerSet.has('superrich-thailand')).toBe(true);
    expect(providerSet.has('sia')).toBe(true);
    expect(result.source).toBe('Official scraping with fallback completion');
    expect(result.quality.liveRows).toBeGreaterThan(0);
    expect(result.quality.fallbackRows).toBeGreaterThan(0);
    expect(Array.isArray(result.quality.missingProviders)).toBe(true);
    const healthMap = new Map(result.quality.providerHealth.map((item) => [item.providerSlug, item.status]));
    expect(healthMap.get('ratchada')).toBe('healthy');
    expect(healthMap.get('superrich-1965')).toBeUndefined();
  });

  it('can still include unstable providers for backend monitoring', async () => {
    const result = await compareCashLive({ currency: 'USD', amount: 1000, maxDistanceKm: 10, includeUnstableProviders: true });
    const providerSet = new Set(result.all.map((row) => row.providerSlug));
    expect(providerSet.has('superrich-1965')).toBe(true);
    const healthMap = new Map(result.quality.providerHealth.map((item) => [item.providerSlug, item.status]));
    expect(healthMap.get('superrich-1965')).toBe('degraded');
  });

  it('returns one comparison row per provider on the main listing', async () => {
    const result = await compareCashLive({ currency: 'USD', amount: 1000, maxDistanceKm: 10 });
    const providerRows = result.all.filter((row) => row.providerSlug === 'ratchada');
    expect(providerRows).toHaveLength(1);
    expect(providerRows[0].sourceType).toBe('live');
  });
});
