import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMarketSnapshotReport } from '@/lib/market-data';

const goodDepth = { asks: [['30', '1']], bids: [['29', '1']] };
const goodBitkub = { error: 0, result: { asks: [[30, 1]], bids: [[29, 1]] } };
const goodUpbit = [{ orderbook_units: [{ ask_price: 30, ask_size: 1, bid_price: 29, bid_size: 1 }], timestamp: Date.now() }];

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

function dnsError() {
  return Object.assign(new Error('fetch failed'), { cause: { code: 'EAI_AGAIN' } });
}

describe('market source transient retry', () => {
  const calls: string[] = [];

  beforeEach(() => {
    calls.length = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('retries exactly once on a transient DNS failure against the identical endpoint', async () => {
    let binanceAttempts = 0;
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);
      if (url.includes('binance.th')) {
        binanceAttempts += 1;
        if (binanceAttempts === 1) throw dnsError();
        return jsonResponse(goodDepth);
      }
      if (url.includes('bitkub')) return jsonResponse(goodBitkub);
      if (url.includes('upbit')) return jsonResponse(goodUpbit);
      return jsonResponse(goodDepth);
    }));

    const report = await getMarketSnapshotReport('BTC');
    const binanceCalls = calls.filter((url) => url.includes('binance.th'));

    expect(binanceAttempts).toBe(2);
    expect(binanceCalls).toHaveLength(2);
    expect(new Set(binanceCalls).size).toBe(1);
    expect(report.sources.find((source) => source.exchange === 'binance-th')?.status).toBe('current');
    expect(report.snapshots.some((row) => row.exchange === 'binance-th')).toBe(true);
  });

  it('does not retry a policy denial', async () => {
    let binanceAttempts = 0;
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);
      if (url.includes('binance.th')) {
        binanceAttempts += 1;
        return jsonResponse({ message: 'Forbidden' }, 403);
      }
      if (url.includes('bitkub')) return jsonResponse(goodBitkub);
      if (url.includes('upbit')) return jsonResponse(goodUpbit);
      return jsonResponse(goodDepth);
    }));

    const report = await getMarketSnapshotReport('BTC');
    const source = report.sources.find((item) => item.exchange === 'binance-th');

    expect(binanceAttempts).toBe(1);
    expect(source?.status).toBe('unavailable');
    expect(source?.reason).toBe('source_http_403');
  });

  it('retries once on a timeout and gives up after the second failure', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);
      if (url.includes('orbix')) {
        attempts += 1;
        const error = new Error('This operation was aborted');
        error.name = 'AbortError';
        throw error;
      }
      if (url.includes('bitkub')) return jsonResponse(goodBitkub);
      if (url.includes('upbit')) return jsonResponse(goodUpbit);
      return jsonResponse(goodDepth);
    }));

    const report = await getMarketSnapshotReport('BTC');
    const source = report.sources.find((item) => item.exchange === 'orbix');

    expect(attempts).toBe(2);
    expect(source?.status).toBe('unavailable');
    expect(source?.reason).toBe('source_timeout');
  });

  it('retries a 5xx once and then surfaces the failure without a third attempt', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);
      if (url.includes('bitkub')) {
        attempts += 1;
        return jsonResponse({ message: 'upstream error' }, 503);
      }
      if (url.includes('upbit')) return jsonResponse(goodUpbit);
      return jsonResponse(goodDepth);
    }));

    const report = await getMarketSnapshotReport('BTC');
    const source = report.sources.find((item) => item.exchange === 'bitkub');

    expect(attempts).toBe(2);
    expect(source?.reason).toBe('source_http_503');
  });
});
