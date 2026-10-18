import { moneyChangerProfileSlugs } from '@/lib/money-changer-seo';
import type { RateTable } from '@/lib/rate-table';

// SEO-30: the "three changers" table on the money changer profiles. It is built from
// the same USD comparison rows the page already loaded through getRateTable(), i.e.
// the same cash cache /cash renders, so the table and the comparison tool cannot
// disagree. Each row keeps its own observedAt so the page can show the stamp.

export interface PeerComparisonRow {
  slug: string;
  buyRate: number | null;
  observedAt: string | null;
}

export function buildPeerComparisonRows(comparisons: RateTable['comparisons']): PeerComparisonRow[] {
  const usd = comparisons.find((item) => item.currency === 'USD');
  return [...moneyChangerProfileSlugs].map((slug) => {
    const row = usd?.all.find((item) => item.providerSlug === slug);
    return {
      slug,
      buyRate: row && Number.isFinite(row.buyRate) ? row.buyRate : null,
      observedAt: row?.observedAt ?? null,
    };
  });
}
