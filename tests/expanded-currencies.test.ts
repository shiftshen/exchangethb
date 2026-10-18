import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseAdditionalCash } from '@/lib/scrapers/additional-cash';
import { getLiveMarketSnapshots } from '@/lib/market-data';
import { cryptoSymbols, cashCurrencies } from '@/lib/types';

afterEach(() => vi.unstubAllGlobals());
describe('expanded currency coverage', () => {
  it('parses small-unit and regional cash quotes without inventing missing currencies', () => {
    const rows = parseAdditionalCash('<p>Latest Update : 2026-10-02 10:00</p><tr><td>SGD</td><td>SGD 100</td><td>25.2</td><td>25.4</td></tr><tr><td>KRW</td><td>KRW 10000</td><td>0.024</td><td>0.025</td></tr>', 'vasu');
    expect(rows.map(row => row.currency)).toEqual(['SGD', 'KRW']);
    expect(rows[1].buyRate).toBe(0.024);
    expect(rows.some(row => row.currency === 'AUD')).toBe(false);
  });
  it('returns no invented fallback prices when a newly selected market is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', {status: 404})));
    expect(await getLiveMarketSnapshots('USDC')).toEqual([]);
    expect(await getLiveMarketSnapshots('USDT')).toEqual([]);
    expect(await getLiveMarketSnapshots('BTC')).toEqual([]);
  });
  it('accepts an additional official orderbook only after numeric validation', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(JSON.stringify(url.includes('binance.th') ? {asks:[['34','1000']], bids:[['33.9','1000']]} : {}))));
    const rows = await getLiveMarketSnapshots('USDC');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({exchange:'binance-th',symbol:'USDC',source:'live'});
  });
  it('keeps advertised selections distinct and excludes unsupported arbitrary symbols', () => {
    expect(new Set(cashCurrencies).size).toBe(15);
    expect(new Set(cryptoSymbols).size).toBe(15);
    expect(cryptoSymbols).not.toContain('SCAM');
  });
});
