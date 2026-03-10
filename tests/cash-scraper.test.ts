import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrapeSuperrich1965, scrapeSuperrichThailand } from '@/lib/scrapers/cash';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('scrapeSuperrichThailand', () => {
  it('parses structured rates from official API payload', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        data: {
          exchangeRate: [
            {
              cUnit: 'USD',
              rate: [
                { cBuying: 31.52, cSelling: 31.62, denom: '100', dateTime: '2026-03-10T00:00:00.000Z' },
              ],
            },
            {
              cUnit: 'CNY',
              rate: [
                { cBuying: 4.6, cSelling: 4.64, denom: '100', dateTime: '2026-03-10T00:00:00.000Z' },
              ],
            },
          ],
        },
      }),
    })));

    const result = await scrapeSuperrichThailand();
    expect(result.ok).toBe(true);
    expect(result.provider).toBe('superrich-thailand');
    expect((result.rates || []).length).toBe(2);
    expect(result.notes[0]).toContain('Parsed');
  });
});

describe('scrapeSuperrich1965', () => {
  it('reports gateway-signed authorization restriction when direct endpoint is rejected', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: 'test-token' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
      });
    vi.stubGlobal('fetch', fetchMock);

    const result = await scrapeSuperrich1965();
    expect(result.ok).toBe(false);
    expect(result.provider).toBe('superrich-1965');
    expect(result.notes.some((note) => note.includes('403'))).toBe(true);
  });
});
