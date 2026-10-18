import { ok, fail } from '@/lib/api-response';
import { readCashCache } from '@/lib/cash-cache-store';
import { readAdminConfig } from '@/lib/content-store';
import { getRuntimeConfigWarnings } from '@/lib/runtime-config';
import { getStorageStatus } from '@/lib/storage-status';
import { summarizeCashSources } from '@/lib/data-status';

export async function GET() {
  try {
    const [adminConfigState, cashCacheState, storageStatus] = await Promise.allSettled([
      readAdminConfig(),
      readCashCache(),
      getStorageStatus(),
    ]);
    return ok({
      status: 'ok',
      app: 'exchangethb',
      timestamp: new Date().toISOString(),
      dataStatus: cashCacheState.status === 'fulfilled' ? {
        status: summarizeCashSources(cashCacheState.value).every(s=>s.status==='current') ? 'current' : 'degraded',
        cashSources: summarizeCashSources(cashCacheState.value),
      } : { status: 'unavailable', cashSources: [] },
      configWarnings: getRuntimeConfigWarnings(),
      storage: storageStatus.status === 'fulfilled' ? storageStatus.value : {
        mode: 'unknown',
        databaseConfigured: false,
        databaseReachable: false,
        files: {
          adminConfig: adminConfigState.status === 'fulfilled',
          cashCache: cashCacheState.status === 'fulfilled',
        },
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('health_check_failed', 500, undefined, detail);
  }
}
