import { ExchangeSlug } from '@/lib/types';
import { getAdapterHealth, getLiveMarketSnapshots } from '@/lib/market-data';

export interface ExchangeAdapter {
  slug: ExchangeSlug;
  fetchSnapshots(symbol: string): Promise<unknown[]>;
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
      const ok = slug === 'binance-th' ? health.binance : slug === 'bitkub' ? health.bitkub : false;
      return { slug, ok, note: ok ? 'Live market adapter responding.' : 'Using reviewed fallback dataset or adapter pending.' };
    },
  };
}

export const exchangeAdapters: ExchangeAdapter[] = [
  createAdapter('binance-th'),
  createAdapter('bitkub'),
  createAdapter('upbit-thailand'),
  createAdapter('orbix'),
];
