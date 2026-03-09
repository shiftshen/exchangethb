import { fail, ok } from '@/lib/api-response';
import { getAdminSession } from '@/lib/auth';
import { getAdapterHealth } from '@/lib/market-data';
import { runCashScrapers } from '@/lib/scrapers/cash';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return fail('unauthorized', 401);
  try {
    const [health, cash] = await Promise.all([getAdapterHealth(), runCashScrapers()]);
    return ok({
      status: 'ok',
      services: ['web', 'worker', 'postgres', 'redis'],
      marketAdapters: health,
      cashScrapers: cash.map((item) => ({ provider: item.provider, ok: item.ok, notes: item.notes })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('admin_health_failed', 500, undefined, detail);
  }
}
