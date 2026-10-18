import type { ExchangeSlug, MarketSnapshot } from '@/lib/types';

// SEO-30: "THB estimate" block on the btc-to-thb route page. It reuses the market
// snapshots the page already fetched for its "latest data reference" line; it adds
// no new source and makes no network call of its own. A snapshot only counts when
// the visible order book can fill the requested amount, and the quote is the
// cheapest full fill. When nothing qualifies the caller renders "暂无".

export interface ThbRouteEstimate {
  exchange: ExchangeSlug;
  /** Baht needed to buy the requested coin amount at the visible ask levels. */
  thb: number;
  averagePrice: number;
  filled: number;
  /** The snapshot's own timestamp; the page shows it as the "last updated" stamp. */
  updatedAt: string;
}

function usableAsks(snapshot: MarketSnapshot) {
  return snapshot.asks
    .filter((level) => Number.isFinite(level.price) && Number.isFinite(level.quantity) && level.price > 0 && level.quantity > 0)
    .sort((left, right) => left.price - right.price);
}

export function estimateBuyThb(snapshots: readonly MarketSnapshot[], coinAmount: number): ThbRouteEstimate | null {
  if (!Number.isFinite(coinAmount) || coinAmount <= 0) return null;
  let best: ThbRouteEstimate | null = null;
  for (const snapshot of snapshots) {
    const asks = usableAsks(snapshot);
    if (!asks.length) continue;
    let remaining = coinAmount;
    let spent = 0;
    for (const level of asks) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, level.quantity);
      spent += take * level.price;
      remaining -= take;
    }
    // Partial depth cannot price the whole amount, so it is not shown as an estimate.
    if (remaining > 1e-12) continue;
    if (!Number.isFinite(spent) || spent <= 0) continue;
    if (!best || spent < best.thb) {
      best = {
        exchange: snapshot.exchange,
        thb: spent,
        averagePrice: spent / coinAmount,
        filled: coinAmount,
        updatedAt: snapshot.lastUpdated,
      };
    }
  }
  return best;
}
