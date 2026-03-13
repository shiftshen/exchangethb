import { fail, ok } from '@/lib/api-response';
import { getAdminSession } from '@/lib/auth';
import { getAdapterHealth } from '@/lib/market-data';
import { getRuntimeConfigWarnings } from '@/lib/runtime-config';
import { runCashScrapers } from '@/lib/scrapers/cash';
import { getStorageStatus } from '@/lib/storage-status';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return fail('unauthorized', 401);
  try {
    const [health, cash, storage] = await Promise.all([getAdapterHealth(), runCashScrapers(), getStorageStatus()]);
    return ok({
      status: 'ok',
      services: ['web', 'worker', 'postgres'],
      configWarnings: getRuntimeConfigWarnings(),
      storage,
      marketAdapters: health,
      cashScrapers: cash.map((item) => ({ provider: item.provider, ok: item.ok, notes: item.notes })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('admin_health_failed', 500, undefined, detail);
  }
}
