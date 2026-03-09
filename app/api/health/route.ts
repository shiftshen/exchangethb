import { promises as fs } from 'fs';
import path from 'path';
import { ok, fail } from '@/lib/api-response';

const adminConfigPath = path.join(process.cwd(), 'content', 'admin-config.json');
const cashCachePath = path.join(process.cwd(), 'content', 'cash-scrape-cache.json');

export async function GET() {
  try {
    const [adminConfigStat, cashCacheStat] = await Promise.allSettled([
      fs.stat(adminConfigPath),
      fs.stat(cashCachePath),
    ]);
    return ok({
      status: 'ok',
      app: 'exchangethb',
      timestamp: new Date().toISOString(),
      storage: {
        adminConfig: adminConfigStat.status === 'fulfilled',
        cashCache: cashCacheStat.status === 'fulfilled',
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('health_check_failed', 500, undefined, detail);
  }
}
