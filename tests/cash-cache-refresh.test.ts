import { beforeEach, describe, expect, it, vi } from 'vitest';

const { readFileMock, writeFileMock, runCashScrapersMock } = vi.hoisted(() => ({
  readFileMock: vi.fn(),
  writeFileMock: vi.fn(),
  runCashScrapersMock: vi.fn(),
}));

vi.mock('fs', () => ({
  promises: {
    readFile: readFileMock,
    writeFile: writeFileMock,
    mkdir: vi.fn(async () => {}),
  },
}));

vi.mock('@/lib/scrapers/cash', () => ({
  runCashScrapers: runCashScrapersMock,
}));

import { refreshCashScrapeCache } from '@/lib/cash-live';

describe('refreshCashScrapeCache safeguards', () => {
  beforeEach(() => {
    readFileMock.mockReset();
    writeFileMock.mockReset();
    runCashScrapersMock.mockReset();
    delete process.env.CASH_SCRAPE_MIN_INTERVAL_MINUTES;
    delete process.env.CASH_COLLECTION_MODE;
  });

  it('never scrapes or rewrites an expired externally collected cache', async () => {
    process.env.CASH_COLLECTION_MODE = 'external';
    const oldCache = { generatedAt: '2026-03-10T00:00:00.000Z', results: [] };
    readFileMock.mockResolvedValueOnce(JSON.stringify(oldCache));
    try {
      expect(await refreshCashScrapeCache()).toEqual(oldCache);
      expect(runCashScrapersMock).not.toHaveBeenCalled();
      expect(writeFileMock).not.toHaveBeenCalled();
    } finally { delete process.env.CASH_COLLECTION_MODE; }
  });

  it('skips scrape when cache is fresh within interval', async () => {
    readFileMock.mockResolvedValueOnce(JSON.stringify({
      generatedAt: new Date().toISOString(),
      results: [{ provider: 'ratchada', ok: true, observedAt: new Date().toISOString(), notes: ['ok'], rates: [{ providerSlug: 'ratchada', currency: 'USD', denomination: '100', buyRate: 31.46, sellRate: 31.62, observedAt: new Date().toISOString(), sourceUrl: 'https://www.ratchadaexchange.com/' }] }],
    }));
    const payload = await refreshCashScrapeCache();
    expect(runCashScrapersMock).not.toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
    expect(payload.results.length).toBe(1);
  });

  it('keeps original quote times and persists failed attempts when all scrapers fail', async () => {
    const oldCache = {
      generatedAt: '2026-03-10T00:00:00.000Z',
      results: [{ provider: 'ratchada', ok: true, observedAt: '2026-03-10T00:00:00.000Z', notes: ['ok'], rates: [{ providerSlug: 'ratchada', currency: 'USD', denomination: '100', buyRate: 31.46, sellRate: 31.62, observedAt: '2026-03-10T00:00:00.000Z', sourceUrl: 'https://www.ratchadaexchange.com/' }] }],
    };
    readFileMock.mockResolvedValueOnce(JSON.stringify(oldCache));
    runCashScrapersMock.mockResolvedValueOnce([{ provider: 'ratchada', ok: false, observedAt: new Date().toISOString(), notes: ['down'], rates: [] }]);
    const payload = await refreshCashScrapeCache();
    expect(payload.generatedAt).toBe(oldCache.generatedAt);
    expect(payload.results[0].rates?.[0].observedAt).toBe(oldCache.results[0].rates[0].observedAt);
    expect(payload.results[0].ok).toBe(false);
    expect(payload.lastAttemptAt).toBeTruthy();
    expect(writeFileMock).toHaveBeenCalled();
  });
});
