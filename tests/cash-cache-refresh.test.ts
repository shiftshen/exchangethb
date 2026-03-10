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
  });

  it('skips scrape when cache is fresh within interval', async () => {
    readFileMock.mockResolvedValueOnce(JSON.stringify({
      generatedAt: new Date().toISOString(),
      results: [{ provider: 'vasu', ok: true, observedAt: new Date().toISOString(), notes: ['ok'], rates: [{ providerSlug: 'vasu', currency: 'USD', denomination: '100', buyRate: 36, sellRate: 36.1, observedAt: new Date().toISOString(), sourceUrl: 'https://www.vasuexchange.com/' }] }],
    }));
    const payload = await refreshCashScrapeCache();
    expect(runCashScrapersMock).not.toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
    expect(payload.results.length).toBe(1);
  });

  it('keeps previous cache when all scrapers fail', async () => {
    const oldCache = {
      generatedAt: '2026-03-10T00:00:00.000Z',
      results: [{ provider: 'vasu', ok: true, observedAt: '2026-03-10T00:00:00.000Z', notes: ['ok'], rates: [{ providerSlug: 'vasu', currency: 'USD', denomination: '100', buyRate: 36, sellRate: 36.1, observedAt: '2026-03-10T00:00:00.000Z', sourceUrl: 'https://www.vasuexchange.com/' }] }],
    };
    readFileMock.mockResolvedValueOnce(JSON.stringify(oldCache));
    runCashScrapersMock.mockResolvedValueOnce([{ provider: 'vasu', ok: false, observedAt: new Date().toISOString(), notes: ['down'], rates: [] }]);
    const payload = await refreshCashScrapeCache();
    expect(payload.generatedAt).toBe(oldCache.generatedAt);
    expect(writeFileMock).not.toHaveBeenCalled();
  });
});
