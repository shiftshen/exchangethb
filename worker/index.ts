import { getAdapterHealth } from '@/lib/market-data';
import { cycleStatus, summarizeCashSources, workerInterval } from '@/lib/data-status';
import { refreshCashScrapeCache } from '@/lib/cash-live';
import { readCashCache } from '@/lib/cash-cache-store';
import fs from 'node:fs/promises';
import path from 'node:path';

const shouldLoop = process.env.WORKER_LOOP === '1';
const intervalMinutes = workerInterval(process.env.CASH_SCRAPE_INTERVAL_MINUTES);
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
    try {
      // Check all exchanges once, avoiding four copies of the same health requests.
      const [marketHealth, cashHealth] = await Promise.all([getAdapterHealth(), process.env.CASH_COLLECTION_MODE === 'external' ? readCashCache() : refreshCashScrapeCache()]);
      const market = { binance: marketHealth.binance, bitkub: marketHealth.bitkub, upbit: marketHealth.upbitThailand, orbix: marketHealth.orbix };
      const status = cycleStatus(market, cashHealth);
      const cashSources = summarizeCashSources(cashHealth);
      await writeHeartbeat({ status, startedAt, marketHealth, cashSources });
      console.log(JSON.stringify({ status, marketHealth, cashSources, ranAt: startedAt, loop: shouldLoop, intervalMinutes }));
    } catch {
      await writeHeartbeat({ status: 'error', startedAt, message: 'Update cycle failed; retry on next scheduled cycle.' });
      if (!shouldLoop) process.exitCode = 1;
    }
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
