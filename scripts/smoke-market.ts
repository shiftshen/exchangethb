import { compareCrypto } from '../lib/compare';
import { getLiveMarketSnapshots } from '../lib/market-data';

async function run() {
  const snapshots = await getLiveMarketSnapshots('BTC');
  const exchanges = ['binance-th', 'bitkub', 'upbit-thailand', 'orbix'];
  const missing = exchanges.filter((slug) => !snapshots.some((row) => row.exchange === slug));
  if (missing.length > 0) {
    throw new Error(`Missing BTC snapshots for: ${missing.join(', ')}`);
  }

  const compare = await compareCrypto({
    symbol: 'BTC',
    side: 'buy',
    amount: 1,
    quoteMode: 'coin',
    includeWithdrawal: true,
    withdrawThb: false,
  });

  const inconsistent = compare.filter((row) => row.live ? !row.source.includes('Official API') : !row.source.includes('fallback'));
  if (inconsistent.length > 0) {
    throw new Error(`Source/live mismatch on: ${inconsistent.map((row) => row.slug).join(', ')}`);
  }

  const withFreshness = compare.every((row) => typeof row.freshness === 'string' && row.freshness.length > 0);
  if (!withFreshness) {
    throw new Error('Freshness field is missing for one or more compare rows.');
  }

  console.log(JSON.stringify({
    snapshots: snapshots.map((row) => ({ exchange: row.exchange, source: row.source })),
    compare: compare.map((row) => ({
      slug: row.slug,
      source: row.source,
      live: row.live,
      freshness: row.freshness,
      fallbackReason: row.fallbackReason,
    })),
  }, null, 2));
}

run();
