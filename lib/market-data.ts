import { marketSnapshots } from '@/data/site';
import { ExchangeSlug, MarketSnapshot } from '@/lib/types';

const BINANCE_SYMBOL_MAP: Record<string, string> = {
  BTC: 'BTCTHB', ETH: 'ETHTHB', USDT: 'USDTTHB', XRP: 'XRPTHB', DOGE: 'DOGETHB', SOL: 'SOLTHB'
};

const BITKUB_SYMBOL_MAP: Record<string, string> = {
  BTC: 'THB_BTC', ETH: 'THB_ETH', USDT: 'THB_USDT', XRP: 'THB_XRP', DOGE: 'THB_DOGE', SOL: 'THB_SOL'
};

const UPBIT_SYMBOL_MAP: Record<string, string> = {
  BTC: 'THB-BTC', ETH: 'THB-ETH', USDT: 'THB-USDT', XRP: 'THB-XRP', DOGE: 'THB-DOGE', SOL: 'THB-SOL'
};

const ORBIX_SYMBOL_MAP: Record<string, string> = {
  BTC: 'btc_thb', ETH: 'eth_thb', USDT: 'usdt_thb', XRP: 'xrp_thb', DOGE: 'doge_thb', SOL: 'sol_thb'
};

type ExchangeLiveFetcher = {
  slug: ExchangeSlug;
  fetchSnapshot: (symbol: string) => Promise<MarketSnapshot | null>;
};

async function fetchBinance(symbol: string): Promise<MarketSnapshot | null> {
  const pair = BINANCE_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const response = await fetch(`https://api.binance.th/api/v1/depth?symbol=${pair}&limit=20`, { next: { revalidate: 15 } });
  if (!response.ok) return null;
  const data = await response.json();
  return {
    exchange: 'binance-th',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: (data.asks || []).map(([price, quantity]: [string, string]) => ({ price: Number(price), quantity: Number(quantity) })),
    bids: (data.bids || []).map(([price, quantity]: [string, string]) => ({ price: Number(price), quantity: Number(quantity) })),
    lastUpdated: new Date().toISOString(),
    source: 'live',
  };
}

async function fetchBitkub(symbol: string): Promise<MarketSnapshot | null> {
  const pair = BITKUB_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const response = await fetch(`https://api.bitkub.com/api/market/books?sym=${pair}&lmt=20`, { next: { revalidate: 15 } });
  if (!response.ok) return null;
  const data = await response.json();
  if (data.error !== 0 || !data.result) return null;
  return {
    exchange: 'bitkub',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: (data.result.asks || []).map((row: [string, number, number, number, number]) => ({ price: Number(row[3]), quantity: Number(row[4]) })),
    bids: (data.result.bids || []).map((row: [string, number, number, number, number]) => ({ price: Number(row[3]), quantity: Number(row[4]) })),
    lastUpdated: new Date().toISOString(),
    source: 'live',
  };
}

async function fetchUpbit(symbol: string): Promise<MarketSnapshot | null> {
  const pair = UPBIT_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const response = await fetch(`https://th-api.upbit.com/v1/orderbook?markets=${pair}`, { next: { revalidate: 15 } });
  if (!response.ok) return null;
  const payload = await response.json();
  const row = Array.isArray(payload) ? payload[0] : null;
  const units = row?.orderbook_units || [];
  return {
    exchange: 'upbit-thailand',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: units.map((unit: { ask_price: number; ask_size: number }) => ({ price: Number(unit.ask_price), quantity: Number(unit.ask_size) })),
    bids: units.map((unit: { bid_price: number; bid_size: number }) => ({ price: Number(unit.bid_price), quantity: Number(unit.bid_size) })),
    lastUpdated: typeof row?.timestamp === 'number' ? new Date(row.timestamp).toISOString() : new Date().toISOString(),
    source: 'live',
  };
}

async function fetchOrbix(symbol: string): Promise<MarketSnapshot | null> {
  const pair = ORBIX_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const response = await fetch(`https://www.orbixtrade.com/api/orders/?pair=${pair}`, { next: { revalidate: 15 } });
  if (!response.ok) return null;
  const data = await response.json();
  return {
    exchange: 'orbix',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: (data.ask || []).map((row: { price: string; amount: string }) => ({ price: Number(row.price), quantity: Number(row.amount) })),
    bids: (data.bid || []).map((row: { price: string; amount: string }) => ({ price: Number(row.price), quantity: Number(row.amount) })),
    lastUpdated: new Date().toISOString(),
    source: 'live',
  };
}

export async function getLiveMarketSnapshots(symbol: string): Promise<MarketSnapshot[]> {
  const fetchers: ExchangeLiveFetcher[] = [
    { slug: 'binance-th', fetchSnapshot: fetchBinance },
    { slug: 'bitkub', fetchSnapshot: fetchBitkub },
    { slug: 'upbit-thailand', fetchSnapshot: fetchUpbit },
    { slug: 'orbix', fetchSnapshot: fetchOrbix },
  ];
  const settled = await Promise.allSettled(fetchers.map((fetcher) => fetcher.fetchSnapshot(symbol)));
  const failedByExchange = new Map<ExchangeSlug, string>();
  const live = settled.flatMap((item, index) => {
    if (item.status === 'fulfilled' && item.value) return [item.value];
    if (item.status === 'rejected') {
      const reason = item.reason instanceof Error ? item.reason.message : 'Live endpoint request failed';
      failedByExchange.set(fetchers[index].slug, reason);
    }
    return [];
  });
  const fallback = marketSnapshots
    .filter((item) => item.symbol === symbol && !live.some((liveItem) => liveItem.exchange === item.exchange))
    .map((item) => ({
      ...item,
      source: 'fallback' as const,
      fallbackReason: failedByExchange.get(item.exchange) || 'Live endpoint unavailable or symbol not supported; using reviewed fallback snapshot.',
    }));
  return [...live, ...fallback];
}

export function describeMarketSource(snapshot: MarketSnapshot) {
  const live = snapshot.source === 'live';
  return {
    live,
    label: live ? 'Official API + rules engine' : 'Reviewed fallback dataset',
    freshness: live ? 'Live orderbook (target 15s refresh)' : 'Fallback snapshot',
    fallbackReason: live ? null : snapshot.fallbackReason || 'Live source unavailable; fallback snapshot is shown.',
  };
}

export async function getAdapterHealth() {
  const symbols = ['BTC', 'USDT'];
  const checks = await Promise.allSettled(symbols.map((symbol) => getLiveMarketSnapshots(symbol)));
  const hasLive = (exchange: ExchangeSlug) =>
    checks.some((check) => check.status === 'fulfilled' && check.value.some((row) => row.exchange === exchange && row.source === 'live'));
  const allSnapshots = checks.flatMap((check) => check.status === 'fulfilled' ? check.value : []);
  return {
    binance: hasLive('binance-th'),
    bitkub: hasLive('bitkub'),
    upbitThailand: hasLive('upbit-thailand'),
    orbix: hasLive('orbix'),
    fallbackOnly: allSnapshots.length > 0 && allSnapshots.every((row) => row.source !== 'live'),
  };
}
