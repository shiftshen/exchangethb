import { exchangeAdapters } from '@/lib/adapters/exchanges';
import { refreshCashScrapeCache } from '@/lib/cash-live';

async function main() {
  const marketHealth = await Promise.all(exchangeAdapters.map((adapter) => adapter.checkHealth()));
  const cashHealth = await refreshCashScrapeCache();
  console.log(JSON.stringify({ marketHealth, cashHealth, ranAt: new Date().toISOString() }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
