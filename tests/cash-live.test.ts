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
            ...['sia', 'vasu'].map(providerSlug => ({
              providerSlug, currency: 'USD', denomination: '100',
              buyRate: 40, sellRate: 41,
              observedAt: new Date().toISOString(),
              fetchedAt: new Date().toISOString(),
              timestampKind: 'collected', sourceKind: 'live',
            })),
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
  it('uses the counter sell rate when buying foreign cash and filters banknotes',async()=>{
    const buy=await compareCashLive({currency:'USD',amount:100,side:'buy',maxDistanceKm:10,banknote:100});
    const sell=await compareCashLive({currency:'USD',amount:100,side:'sell',maxDistanceKm:10,banknote:100});
    expect(buy.all.find(row=>row.providerSlug==='ratchada')?.estimatedThb).toBeCloseTo(3162);
    expect(sell.all.find(row=>row.providerSlug==='ratchada')?.estimatedThb).toBeCloseTo(3146);
    const small=await compareCashLive({currency:'USD',amount:100,banknote:20,maxDistanceKm:10});
    expect(small.all.some(row=>row.providerSlug==='ratchada')).toBe(false);
  });
  it('keeps only stable public providers on the frontend listing', async () => {
    const result = await compareCashLive({ currency: 'USD', amount: 1000, maxDistanceKm: 10 });
    const providerSet = new Set(result.all.map((row) => row.providerSlug));
    expect(providerSet.has('ratchada')).toBe(true);
    expect(providerSet.has('superrich-1965')).toBe(false);
    expect(providerSet.has('superrich-thailand')).toBe(false);
    expect(providerSet.has('sia')).toBe(false);
    expect(result.source).toBe('Official source observations');
    expect(result.quality.liveRows).toBeGreaterThan(0);
    expect(result.quality.fallbackRows).toBe(0);
    expect(Array.isArray(result.quality.missingProviders)).toBe(true);
    const healthMap = new Map(result.quality.providerHealth.map((item) => [item.providerSlug, item.status]));
    // A freshly generated cache cannot turn an old provider quote into live data.
    expect(healthMap.get('ratchada')).toBe('degraded');
    expect(result.bestRate).toBeNull();
    expect(healthMap.get('superrich-1965')).toBeUndefined();
  });

  it('can still include unstable providers for backend monitoring', async () => {
    const result = await compareCashLive({ currency: 'USD', amount: 1000, maxDistanceKm: 10, includeUnstableProviders: true });
    const providerSet = new Set(result.all.map((row) => row.providerSlug));
    expect(providerSet.has('superrich-1965')).toBe(true);
    expect(providerSet.has('sia')).toBe(false);
    expect(providerSet.has('vasu')).toBe(false);
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
