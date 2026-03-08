import { marketSnapshots } from '@/data/site';
import { ExchangeSlug, MarketSnapshot } from '@/lib/types';

const BINANCE_SYMBOL_MAP: Record<string, string> = {
  BTC: 'BTCTHB', ETH: 'ETHTHB', USDT: 'USDTTHB', XRP: 'XRPTHB', DOGE: 'DOGETHB', SOL: 'SOLTHB'
};

const BITKUB_SYMBOL_MAP: Record<string, string> = {
  BTC: 'THB_BTC', ETH: 'THB_ETH', USDT: 'THB_USDT', XRP: 'THB_XRP', DOGE: 'THB_DOGE', SOL: 'THB_SOL'
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
  };
}

export async function getLiveMarketSnapshots(symbol: string): Promise<MarketSnapshot[]> {
  const settled = await Promise.allSettled([fetchBinance(symbol), fetchBitkub(symbol)]);
  const live = settled.flatMap((item) => item.status === 'fulfilled' && item.value ? [item.value] : []);
  const fallback = marketSnapshots.filter((item) => item.symbol === symbol && !live.some((liveItem) => liveItem.exchange === item.exchange));
  return [...live, ...fallback];
}

export async function getAdapterHealth() {
  const symbols = ['BTC', 'USDT'];
  const checks = await Promise.allSettled(symbols.map((symbol) => getLiveMarketSnapshots(symbol)));
  return {
    binance: checks.some((check) => check.status === 'fulfilled' && check.value.some((row) => row.exchange === 'binance-th')),
    bitkub: checks.some((check) => check.status === 'fulfilled' && check.value.some((row) => row.exchange === 'bitkub')),
    fallbackOnly: checks.every((check) => check.status === 'fulfilled' && check.value.every((row) => row.exchange !== 'binance-th' && row.exchange !== 'bitkub')),
  };
}
