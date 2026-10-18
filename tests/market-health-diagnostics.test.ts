import { afterEach, expect, it, vi } from 'vitest';
import { sourceJson } from '@/lib/source-http';
import { getMarketSnapshotReport } from '@/lib/market-data';

vi.mock('@/lib/source-http', () => ({ sourceJson: vi.fn() }));
afterEach(() => vi.resetAllMocks());

it('keeps a valid market while explaining separate transport and validation failures', async () => {
  vi.mocked(sourceJson).mockImplementation(async url => {
    if (url.includes('binance.th')) throw new Error('source_http_429');
    if (url.includes('bitkub.com')) return { error: 0, result: { asks: [[10, 1]], bids: [[9, 2]] } };
    if (url.includes('upbit.com')) throw new DOMException('Request aborted', 'AbortError');
    return { asks: [['10', '1']], bids: [['11', '2']] };
  });
  const report = await getMarketSnapshotReport('BTC');
  expect(report.snapshots.map(row => row.exchange)).toEqual(['bitkub']);
  expect(report.sources).toEqual([
    { exchange: 'binance-th', symbol: 'BTC', status: 'unavailable', reason: 'source_http_429' },
    { exchange: 'bitkub', symbol: 'BTC', status: 'current', reason: null },
    { exchange: 'upbit-thailand', symbol: 'BTC', status: 'unavailable', reason: 'source_timeout' },
    { exchange: 'orbix', symbol: 'BTC', status: 'unavailable', reason: 'crossed_orderbook' },
  ]);
});

it('never copies upstream exception text or URLs into diagnostics', async () => {
  vi.mocked(sourceJson).mockImplementation(async url => {
    if (url.includes('orbixtrade.com')) throw Object.assign(new Error('private upstream details'), { cause: { code: 'EAI_AGAIN' } });
    throw new Error('https://upstream.example/private?token=secret');
  });
  const report = await getMarketSnapshotReport('BTC');
  expect(report.snapshots).toEqual([]);
  expect(report.sources.find(row => row.exchange === 'orbix')?.reason).toBe('source_dns_failure');
  expect(report.sources.filter(row => row.exchange !== 'orbix').every(row => row.reason === 'source_unavailable')).toBe(true);
  expect(JSON.stringify(report)).not.toContain('secret');
});
