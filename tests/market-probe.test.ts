import { describe, expect, it } from 'vitest';
import { evaluateMarketSources } from '@/lib/market-probe';

describe('market source probe evaluation', () => {
  it('passes when every symbol has enough live sources', () => {
    const result = evaluateMarketSources([
      { symbol: 'BTC', sources: [{ exchange: 'binance-th', live: true }, { exchange: 'bitkub', live: true }, { exchange: 'orbix', live: false }] },
      { symbol: 'USDT', sources: [{ exchange: 'binance-th', live: true }, { exchange: 'bitkub', live: true }] },
    ], 2);
    expect(result.ok).toBe(true);
    expect(result.perSymbol[0]).toMatchObject({ symbol: 'BTC', liveCount: 2, totalCount: 3, ok: true, unavailable: ['orbix'] });
  });

  it('fails and names the symbol when live sources drop below the threshold', () => {
    const result = evaluateMarketSources([
      { symbol: 'BTC', sources: [{ exchange: 'binance-th', live: true }, { exchange: 'bitkub', live: false }, { exchange: 'orbix', live: false }] },
      { symbol: 'USDT', sources: [{ exchange: 'binance-th', live: true }, { exchange: 'bitkub', live: true }] },
    ], 2);
    expect(result.ok).toBe(false);
    expect(result.failingSymbols).toEqual(['BTC']);
    expect(result.perSymbol[0].unavailable).toEqual(['bitkub', 'orbix']);
  });

  it('fails when a symbol has no reachable sources at all', () => {
    const result = evaluateMarketSources([{ symbol: 'BTC', sources: [] }], 2);
    expect(result.ok).toBe(false);
    expect(result.failingSymbols).toEqual(['BTC']);
  });

  it('treats the threshold as configurable', () => {
    const probes = [{ symbol: 'BTC', sources: [{ exchange: 'binance-th', live: true }, { exchange: 'bitkub', live: false }] }];
    expect(evaluateMarketSources(probes, 1).ok).toBe(true);
    expect(evaluateMarketSources(probes, 2).ok).toBe(false);
  });
});
