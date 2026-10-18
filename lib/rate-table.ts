import { cache } from 'react';
import { compareCashLive } from '@/lib/cash-live';
import { cashCurrencies, type CurrencyCode } from '@/lib/types';

// SEO-24: the first-screen "today's observed rates" table on the Ratchada profile.
// Every number comes from compareCashLive(), i.e. the same cash cache and the same
// per-provider pick that /cash renders, so the table and /cash cannot disagree.
// A currency with no usable quote has null fields and is rendered as "暂无"/"N/A";
// nothing is estimated or filled in.

export interface RateTableRow {
  currency: CurrencyCode;
  denomination: string | null;
  buyRate: number | null;
  sellRate: number | null;
  observedAt: string | null;
  timestampKind: string | null;
  current: boolean;
}

export interface RateTable {
  rows: RateTableRow[];
  /** Most recent observedAt among the available rows. */
  latestObservedAt: string | null;
  /** When the shared cash cache was last written (the collector's last good run). */
  checkedAt: string | null;
  available: number;
  /** Full per-currency comparison results, reused by the page for peers and AI answers. */
  comparisons: Array<{ currency: CurrencyCode; all: Awaited<ReturnType<typeof compareCashLive>>['all'] }>;
}

const emptyTable: RateTable = { rows: [], latestObservedAt: null, checkedAt: null, available: 0, comparisons: [] };

async function loadRateTable(slug: string, currencies: readonly CurrencyCode[]): Promise<RateTable> {
  const comparisons = await Promise.all(currencies.map(async (currency) => {
    const result = await compareCashLive({ currency, amount: 1000, maxDistanceKm: 100 }).catch(() => null);
    return result ? { currency, all: result.all, checkedAt: result.cacheGeneratedAt } : null;
  }));
  const present = comparisons.filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (!present.length) return emptyTable;
  const rows: RateTableRow[] = currencies.map((currency) => {
    const row = present.find((item) => item.currency === currency)?.all.find((item) => item.providerSlug === slug);
    if (!row || !Number.isFinite(row.buyRate) || !Number.isFinite(row.sellRate) || row.buyRate <= 0) {
      return { currency, denomination: null, buyRate: null, sellRate: null, observedAt: null, timestampKind: null, current: false };
    }
    return {
      currency,
      denomination: row.denomination && row.denomination !== '-' ? String(row.denomination) : null,
      buyRate: row.buyRate,
      // sellRate 0 means the source did not publish a sell side.
      sellRate: row.sellRate > 0 ? row.sellRate : null,
      observedAt: row.observedAt,
      timestampKind: row.timestampKind ?? null,
      current: Boolean(row.current),
    };
  });
  const stamps = rows.map((row) => (row.observedAt ? Date.parse(row.observedAt) : NaN)).filter(Number.isFinite);
  const latest = stamps.length ? new Date(Math.max(...stamps)).toISOString() : null;
  return {
    rows,
    latestObservedAt: latest,
    checkedAt: present.find((item) => item.checkedAt)?.checkedAt ?? null,
    available: rows.filter((row) => row.buyRate !== null).length,
    comparisons: present.map(({ currency, all }) => ({ currency, all })),
  };
}

/** Request-scoped: generateMetadata and the page share one read of the cache. */
export const getRateTable = cache(async (slug: string, wide: boolean): Promise<RateTable> =>
  loadRateTable(slug, wide ? cashCurrencies : (['USD', 'EUR', 'JPY', 'CNY', 'GBP'] as const)));

