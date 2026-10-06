import { cryptoSymbols, ExchangeSlug, MarketSnapshot } from '@/lib/types';
import { validateMarketSnapshot, recent } from '@/lib/data-quality';
import { sourceJson } from '@/lib/source-http';

const BINANCE_SYMBOL_MAP: Record<string, string> = Object.fromEntries(cryptoSymbols.map(symbol => [symbol, `${symbol}THB`]));

const BITKUB_SYMBOL_MAP: Record<string, string> = Object.fromEntries(cryptoSymbols.map(symbol => [symbol, `${symbol.toLowerCase()}_thb`]));

const UPBIT_SYMBOL_MAP: Record<string, string> = Object.fromEntries(cryptoSymbols.map(symbol => [symbol, `THB-${symbol}`]));

const ORBIX_SYMBOL_MAP: Record<string, string> = Object.fromEntries(cryptoSymbols.map(symbol => [symbol, `${symbol.toLowerCase()}_thb`]));

type ExchangeLiveFetcher = {
  slug: ExchangeSlug;
  fetchSnapshot: (symbol: string) => Promise<MarketSnapshot | null>;
};

async function fetchBinance(symbol: string): Promise<MarketSnapshot | null> {
  const pair = BINANCE_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const data = await sourceJsonWithRetry(`https://api.binance.th/api/v1/depth?symbol=${pair}&limit=100`);
  return {
    exchange: 'binance-th',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: (data.asks || []).map(([price, quantity]: [string, string]) => ({ price: Number(price), quantity: Number(quantity) })),
    bids: (data.bids || []).map(([price, quantity]: [string, string]) => ({ price: Number(price), quantity: Number(quantity) })),
    lastUpdated: new Date().toISOString(),
    source: 'live',
    fetchedAt: new Date().toISOString(), timestampKind: 'collected',
  };
}

async function fetchBitkub(symbol: string): Promise<MarketSnapshot | null> {
  const pair = BITKUB_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const data = await sourceJsonWithRetry(`https://api.bitkub.com/api/v3/market/depth?sym=${pair}&lmt=100`);
  if (data.error !== 0 || !data.result) return null;
  return {
    exchange: 'bitkub',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: (data.result.asks || []).map((row: [number, number]) => ({ price: Number(row[0]), quantity: Number(row[1]) })),
    bids: (data.result.bids || []).map((row: [number, number]) => ({ price: Number(row[0]), quantity: Number(row[1]) })),
    lastUpdated: new Date().toISOString(),
    source: 'live',
    fetchedAt: new Date().toISOString(), timestampKind: 'collected',
  };
}

async function fetchUpbit(symbol: string): Promise<MarketSnapshot | null> {
  const pair = UPBIT_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const payload = await sourceJsonWithRetry(`https://th-api.upbit.com/v1/orderbook?markets=${pair}`);
  const row = Array.isArray(payload) ? payload[0] : null;
  const units = row?.orderbook_units || [];
  return {
    exchange: 'upbit-thailand',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: units.filter((unit: { ask_price: number; ask_size: number }) => !(Number(unit.ask_price) === 0 && Number(unit.ask_size) === 0)).map((unit: { ask_price: number; ask_size: number }) => ({ price: Number(unit.ask_price), quantity: Number(unit.ask_size) })),
    bids: units.filter((unit: { bid_price: number; bid_size: number }) => !(Number(unit.bid_price) === 0 && Number(unit.bid_size) === 0)).map((unit: { bid_price: number; bid_size: number }) => ({ price: Number(unit.bid_price), quantity: Number(unit.bid_size) })),
    lastUpdated: typeof row?.timestamp === 'number' ? new Date(row.timestamp).toISOString() : new Date().toISOString(),
    source: 'live',
    fetchedAt: new Date().toISOString(), timestampKind: typeof row?.timestamp === 'number' ? 'published' : 'collected',
  };
}

async function fetchOrbix(symbol: string): Promise<MarketSnapshot | null> {
  const pair = ORBIX_SYMBOL_MAP[symbol];
  if (!pair) return null;
  const data = await sourceJsonWithRetry(`https://www.orbixtrade.com/api/v3/depth?symbol=${pair}&limit=100`);
  return {
    exchange: 'orbix',
    symbol: symbol as MarketSnapshot['symbol'],
    asks: (data.asks || []).map((row: [string, string]) => ({ price: Number(row[0]), quantity: Number(row[1]) })),
    bids: (data.bids || []).map((row: [string, string]) => ({ price: Number(row[0]), quantity: Number(row[1]) })),
    lastUpdated: new Date().toISOString(),
    source: 'live',
    fetchedAt: new Date().toISOString(), timestampKind: 'collected',
  };
}

function marketFailureReason(error: unknown) {
  if (error instanceof Error) {
    if (/^(invalid_orderbook|crossed_orderbook|stale_orderbook|source_http_\d{3})$/.test(error.message)) return error.message;
    if (error.name === 'AbortError' || error.name === 'TimeoutError') return 'source_timeout';
    const cause = (error as Error & { cause?: { code?: string } }).cause?.code;
    if (cause === 'EAI_AGAIN' || cause === 'ENOTFOUND') return 'source_dns_failure';
  }
  return 'source_unavailable';
}

/**
 * Transient market-source failures observed in production (worker flapping between
 * degraded and ok): DNS hiccups and read timeouts. Policy denials (403) and client
 * errors are decisions, not transients, and are never retried.
 */
function isTransientMarketFailure(error: unknown) {
  if (!(error instanceof Error)) return false;
  if (error.name === 'AbortError' || error.name === 'TimeoutError') return true;
  const code = (error as Error & { cause?: { code?: string } }).cause?.code;
  if (code && ['EAI_AGAIN', 'ENOTFOUND', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT'].includes(code)) return true;
  const status = /^source_http_(\d{3})$/.exec(error.message);
  return Boolean(status && Number(status[1]) >= 500);
}

/**
 * One bounded retry against the identical host and path: the order book endpoints
 * are public and idempotent, and the retry is only attempted for transient
 * failures, so a policy denial still fails closed on the first response.
 */
async function sourceJsonWithRetry(url: string) {
  try {
    return await sourceJson(url);
  } catch (error) {
    if (!isTransientMarketFailure(error)) throw error;
    return await sourceJson(url);
  }
}

export async function getMarketSnapshotReport(symbol: string) {
  const fetchers: ExchangeLiveFetcher[] = [
    { slug: 'binance-th', fetchSnapshot: fetchBinance },
    { slug: 'bitkub', fetchSnapshot: fetchBitkub },
    { slug: 'upbit-thailand', fetchSnapshot: fetchUpbit },
    { slug: 'orbix', fetchSnapshot: fetchOrbix },
  ];
  const settled = await Promise.allSettled(fetchers.map(async (fetcher) => {
    const snapshot = await fetcher.fetchSnapshot(symbol);
    return snapshot ? validateMarketSnapshot(snapshot) : null;
  }));
  const snapshots = settled.flatMap((item) => {
    if (item.status === 'fulfilled' && item.value) return [item.value];
    return [];
  });
  // Only validated official observations are quotes. Static examples have no
  // verifiable provenance and must never fill an unavailable exchange market.
  const sources = settled.map((item, index) => ({
    exchange: fetchers[index].slug,
    symbol,
    status: item.status === 'fulfilled' && item.value ? 'current' as const : 'unavailable' as const,
    reason: item.status === 'rejected' ? marketFailureReason(item.reason) : item.value ? null : 'market_unavailable',
  }));
  return { snapshots, sources };
}

export async function getLiveMarketSnapshots(symbol: string): Promise<MarketSnapshot[]> {
  return (await getMarketSnapshotReport(symbol)).snapshots;
}

export function describeMarketSource(snapshot: MarketSnapshot) {
  const live = snapshot.source === 'live' && recent(snapshot.lastUpdated,120_000);
  return {
    live,
    label: live ? 'Official API + rules engine' : 'Reviewed fallback dataset',
    freshness: live ? 'Official orderbook fetched for this comparison' : 'Reference snapshot; not current',
    fallbackReason: live ? null : snapshot.fallbackReason || 'Live source unavailable; fallback snapshot is shown.',
  };
}

export async function getAdapterHealth() {
  const symbols = ['BTC', 'USDT'];
  const checks = await Promise.allSettled(symbols.map((symbol) => getMarketSnapshotReport(symbol)));
  const hasLive = (exchange: ExchangeSlug) =>
    checks.some((check) => check.status === 'fulfilled' && check.value.snapshots.some((row) => row.exchange === exchange && row.source === 'live'));
  const allSnapshots = checks.flatMap((check) => check.status === 'fulfilled' ? check.value.snapshots : []);
  return {
    binance: hasLive('binance-th'),
    bitkub: hasLive('bitkub'),
    upbitThailand: hasLive('upbit-thailand'),
    orbix: hasLive('orbix'),
    fallbackOnly: allSnapshots.length > 0 && allSnapshots.every((row) => row.source !== 'live'),
    sourceChecks: checks.flatMap(check => check.status === 'fulfilled' ? check.value.sources : []),
  };
}
