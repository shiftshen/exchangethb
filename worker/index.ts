import { exchangeAdapters } from '@/lib/adapters/exchanges';
import { refreshCashScrapeCache } from '@/lib/cash-live';
import fs from 'node:fs/promises';
import path from 'node:path';

const shouldLoop = process.env.WORKER_LOOP === '1';
const intervalMinutes = Math.max(1, Number(process.env.CASH_SCRAPE_INTERVAL_MINUTES || '10'));
const heartbeatPath = process.env.WORKER_HEARTBEAT_PATH || path.join('/tmp', 'exchangethb-worker-heartbeat.json');

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeHeartbeat(extra: Record<string, unknown> = {}) {
  await fs.writeFile(heartbeatPath, JSON.stringify({
    updatedAt: new Date().toISOString(),
    loop: shouldLoop,
    intervalMinutes,
    ...extra,
  }));
}

async function main() {
  do {
    const startedAt = new Date().toISOString();
    await writeHeartbeat({ status: 'running', startedAt });
    const marketHealth = await Promise.all(exchangeAdapters.map((adapter) => adapter.checkHealth()));
    const cashHealth = await refreshCashScrapeCache();
    await writeHeartbeat({ status: 'ok', startedAt, marketHealth, cashHealth });
    console.log(JSON.stringify({ marketHealth, cashHealth, ranAt: startedAt, loop: shouldLoop, intervalMinutes }, null, 2));
    if (!shouldLoop) break;
    await sleep(intervalMinutes * 60 * 1000);
  } while (true);
}

main().catch((error) => {
  writeHeartbeat({
    status: 'error',
    message: error instanceof Error ? error.message : 'unknown',
  }).catch(() => {});
  console.error(error);
  process.exit(1);
});
