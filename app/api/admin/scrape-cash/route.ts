import { appendAuditLog } from '@/lib/audit-log';
import { fail, ok } from '@/lib/api-response';
import { getAdminSession } from '@/lib/auth';
import { refreshCashScrapeCache } from '@/lib/cash-live';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return fail('unauthorized', 401);
  try {
    const data = await refreshCashScrapeCache();
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    await appendAuditLog({ actor: session, action: 'admin.cash.refresh', target: 'cash-scrape-cache', ip });
    return ok(data);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('admin_cash_refresh_failed', 500, undefined, detail);
  }
}
