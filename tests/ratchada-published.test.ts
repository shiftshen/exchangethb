import { describe, expect, it } from 'vitest';
import { extractRatchadaRates } from '@/lib/scrapers/cash';

const table = '<tr id="SGD"><td>100-2</td><td>26.05</td><td>26.30</td></tr>';
describe('Ratchada official publication evidence', () => {
  it('keeps the Thailand publication time separate from collection time', () => {
    const rows = extractRatchadaRates(`document.getElementById('rateTime').innerHTML= "2026-10-01 18:21:26";${table}`, '2026-10-01T21:00:00.000Z');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ currency: 'SGD', denomination: '100-2', buyRate: 26.05, sellRate: 26.30, observedAt: '2026-10-01T11:21:26.000Z', fetchedAt: '2026-10-01T21:00:00.000Z', timestampKind: 'published' });
  });
  it('does not invent a publication time for an undated table', () => {
    expect(extractRatchadaRates(table)).toEqual([]);
  });
});
