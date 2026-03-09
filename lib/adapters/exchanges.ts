import { ExchangeSlug, MarketSnapshot } from '@/lib/types';
import { getAdapterHealth, getLiveMarketSnapshots } from '@/lib/market-data';

export interface ExchangeAdapter {
  slug: ExchangeSlug;
  fetchSnapshots(symbol: string): Promise<MarketSnapshot[]>;
  checkHealth(): Promise<{ slug: ExchangeSlug; ok: boolean; note: string }>;
}

function createAdapter(slug: ExchangeSlug): ExchangeAdapter {
  return {
    slug,
    async fetchSnapshots(symbol: string) {
      const snapshots = await getLiveMarketSnapshots(symbol);
      return snapshots.filter((item) => item.exchange === slug);
    },
    async checkHealth() {
      const health = await getAdapterHealth();
      const ok =
        slug === 'binance-th'
          ? health.binance
          : slug === 'bitkub'
            ? health.bitkub
            : slug === 'upbit-thailand'
              ? health.upbitThailand
              : health.orbix;
      return {
        slug,
        ok,
        note: ok
          ? 'Live market adapter responding.'
          : 'Official live endpoint is unavailable; comparison currently uses reviewed fallback snapshots.',
      };
    },
  };
}

export const exchangeAdapters: ExchangeAdapter[] = [
  createAdapter('binance-th'),
  createAdapter('bitkub'),
  createAdapter('upbit-thailand'),
  createAdapter('orbix'),
];
