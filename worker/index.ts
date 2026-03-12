import { exchangeAdapters } from '@/lib/adapters/exchanges';
import { refreshCashScrapeCache } from '@/lib/cash-live';

const shouldLoop = process.env.WORKER_LOOP === '1';
const intervalMinutes = Math.max(1, Number(process.env.CASH_SCRAPE_INTERVAL_MINUTES || '10'));

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  do {
    const startedAt = new Date().toISOString();
    const marketHealth = await Promise.all(exchangeAdapters.map((adapter) => adapter.checkHealth()));
    const cashHealth = await refreshCashScrapeCache();
    console.log(JSON.stringify({ marketHealth, cashHealth, ranAt: startedAt, loop: shouldLoop, intervalMinutes }, null, 2));
    if (!shouldLoop) break;
    await sleep(intervalMinutes * 60 * 1000);
  } while (true);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
