import { exchanges } from '@/data/site';
import type { ExchangeSlug } from '@/lib/types';

// SEO-30: the first-screen table on /exchanges answers "which licensed Thai venue
// should I look at to turn crypto into THB cash". Every exchange fact below is
// derived from data/site.ts only; the cash column is a link to the site's cash
// comparison, not a claim about an exchange's own cash service.

export interface ExchangeComparisonRow {
  slug: ExchangeSlug;
  name: string;
  license: string;
  /** Crypto symbols the exchange pairs with THB, rendered as e.g. "BTC/THB". */
  thbPairs: string[];
  /** THB withdrawal fee in baht, or null when data/site.ts marks it as not published. */
  thbWithdraw: number | null;
  officialUrl: string;
}

export function buildExchangeComparisonRows(): ExchangeComparisonRow[] {
  return exchanges.map((exchange) => ({
    slug: exchange.slug,
    name: exchange.name,
    license: exchange.license,
    thbPairs: exchange.pairs.map((pair) => `${pair}/THB`),
    // thbWithdrawKnown === false means the reviewed data does not publish a fee.
    // A missing fee is never rendered as free.
    thbWithdraw: exchange.fee.thbWithdrawKnown === false ? null : exchange.fee.thbWithdraw,
    officialUrl: exchange.affiliate.officialUrl,
  }));
}
