import { afterEach, expect, it, vi } from 'vitest';
const { session, scrape, cache, market, storage } = vi.hoisted(() => ({ session: vi.fn(), scrape: vi.fn(), cache: vi.fn(), market: vi.fn(), storage: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getAdminSession: session }));
vi.mock('@/lib/market-data', () => ({ getAdapterHealth: market }));
vi.mock('@/lib/scrapers/cash', () => ({ runCashScrapers: scrape }));
vi.mock('@/lib/cash-cache-store', () => ({ readCashCache: cache }));
vi.mock('@/lib/storage-status', () => ({ getStorageStatus: storage }));
vi.mock('@/lib/runtime-config', () => ({ getRuntimeConfigWarnings: () => [] }));
import { GET } from '@/app/api/admin/health/route';
afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });

it('reads existing external collection results without making native scraping requests or reviving removed sources', async () => {
  vi.stubEnv('CASH_COLLECTION_MODE', 'external');
  session.mockResolvedValue('admin'); market.mockResolvedValue({ orbix: false }); storage.mockResolvedValue({ mode: 'database' });
  cache.mockResolvedValue({ results: [
    { provider: 'ratchada', ok: true, notes: ['latest fixed-proxy collection'] },
    { provider: 'sia', ok: false, notes: ['old excluded source'] },
    { provider: 'vasu', ok: false, notes: ['old excluded source'] },
  ] });
  const response = await GET();
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ data: { cashCollectionMode: 'external', marketAdapters: { orbix: false }, cashScrapers: [{ provider: 'ratchada', ok: true, notes: ['latest fixed-proxy collection'] }] } });
  expect(scrape).not.toHaveBeenCalled();
});

it('does not inspect or fetch source data before admin authentication', async () => {
  vi.stubEnv('CASH_COLLECTION_MODE', 'external'); session.mockResolvedValue(null);
  expect((await GET()).status).toBe(401);
  expect(cache).not.toHaveBeenCalled(); expect(scrape).not.toHaveBeenCalled(); expect(market).not.toHaveBeenCalled();
});
