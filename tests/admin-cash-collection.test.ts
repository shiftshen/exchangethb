import { afterEach, describe, expect, it, vi } from 'vitest';
const { session, scrape, audit } = vi.hoisted(() => ({
  session: vi.fn(), scrape: vi.fn(), audit: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getAdminSession: session }));
vi.mock('@/lib/cash-live', () => ({ refreshCashScrapeCache: scrape }));
vi.mock('@/lib/audit-log', () => ({ appendAuditLog: audit }));
import { POST } from '@/app/api/admin/scrape-cash/route';
describe('externally collected cash admin refresh', () => {
  afterEach(() => { vi.clearAllMocks(); delete process.env.CASH_COLLECTION_MODE; });
  it('rejects authenticated manual scraping without reporting a completed refresh', async () => {
    process.env.CASH_COLLECTION_MODE = 'external';
    session.mockResolvedValueOnce('admin');
    const response = await POST(new Request('http://localhost/api/admin/scrape-cash', { method: 'POST' }));
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ ok: false, error: 'external_cash_collection' });
    expect(scrape).not.toHaveBeenCalled();
    expect(audit).not.toHaveBeenCalled();
  });
  it('still requires authentication before reporting collection configuration', async () => {
    process.env.CASH_COLLECTION_MODE = 'external';
    session.mockResolvedValueOnce(null);
    expect((await POST(new Request('http://localhost/api/admin/scrape-cash', { method: 'POST' }))).status).toBe(401);
    expect(scrape).not.toHaveBeenCalled();
  });
});
