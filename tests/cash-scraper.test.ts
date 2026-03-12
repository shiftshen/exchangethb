import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrapeSia, scrapeSuperrich1965, scrapeSuperrichThailand } from '@/lib/scrapers/cash';

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
  it('parses hybrid rows from guest booking feed', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'guest-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            content: [
              { dynLastUpdate: '2026-03-10 18:00:00' },
            ],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            content: [
              {
                rateUpdateDate: 1773142000000,
                currencyList: [
                  {
                    currencyCode: 'USD',
                    denominationList: [
                      { denom: '100', sell: '36.70' },
                    ],
                  },
                  {
                    currencyCode: 'EUR',
                    denominationList: [
                      { denom: '500-100', sell: '39.40' },
                    ],
                  },
                ],
              },
            ],
          },
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    const result = await scrapeSuperrich1965();
    expect(result.ok).toBe(true);
    expect(result.provider).toBe('superrich-1965');
    expect((result.rates || []).length).toBeGreaterThan(1);
    expect(new Set((result.rates || []).map((rate) => rate.currency)).has('EUR')).toBe(true);
    expect((result.rates || [])[0].sourceKind).toBe('hybrid');
    expect((result.rates || [])[0].buyRate).toBeLessThan((result.rates || [])[0].sellRate);
    expect(result.notes[0]).toContain('Parsed');
  });
});

describe('scrapeSia', () => {
  it('parses supported currencies from the official rate page', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      text: async () => `
        <tr class="list-over">
          <td align="center">USA</td>
          <td align="center">USD 100</td>
          <td class="show-rate" align="center">31.53</td>
          <td class="show-rate" align="center">31.70</td>
        </tr>
        <tr class="list-none">
          <td align="center">China</td>
          <td align="center">CNY / RMB</td>
          <td class="show-rate" align="center">4.60</td>
          <td class="show-rate" align="center">4.64</td>
        </tr>
      `,
    })));

    const result = await scrapeSia();
    expect(result.ok).toBe(true);
    expect(result.provider).toBe('sia');
    expect((result.rates || []).length).toBe(2);
    expect((result.rates || [])[0].sourceKind).toBe('live');
    expect(result.notes[0]).toContain('Parsed');
  });
});
