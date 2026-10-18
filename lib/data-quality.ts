import type { MarketSnapshot, OrderLevel } from '@/lib/types';

export function recent(value: string | null | undefined, maxAgeMs: number, now = Date.now()) {
  const age = now - Date.parse(value || '');
  return Number.isFinite(age) && age >= -60_000 && age <= maxAgeMs;
}

export function cashQuoteCurrent(row: { observedAt: string; fetchedAt?: string; timestampKind?: string; sourceType?: string; sourceKind?: string }, now = Date.now()) {
  if ((row.sourceType || row.sourceKind || 'live') !== 'live') return false;
  if (!recent(row.fetchedAt || row.observedAt, 30 * 60_000, now)) return false;
  return recent(row.observedAt, row.timestampKind === 'published' ? 36 * 60 * 60_000 : 30 * 60_000, now);
}

export function cleanOrderbook(levels: OrderLevel[], side: 'asks' | 'bids') {
  if (!Array.isArray(levels) || !levels.length || levels.some(row => !Number.isFinite(row.price) || row.price <= 0 || !Number.isFinite(row.quantity) || row.quantity <= 0)) throw new Error('invalid_orderbook');
  return [...levels].sort((a, b) => side === 'asks' ? a.price - b.price : b.price - a.price);
}

export function validateMarketSnapshot(snapshot: MarketSnapshot, now = Date.now()): MarketSnapshot {
  const asks = cleanOrderbook(snapshot.asks, 'asks');
  const bids = cleanOrderbook(snapshot.bids, 'bids');
  if (bids[0].price > asks[0].price) throw new Error('crossed_orderbook');
  if (!recent(snapshot.lastUpdated, 2 * 60_000, now)) throw new Error('stale_orderbook');
  return { ...snapshot, asks, bids };
}

export function finitePositive(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

export function banknoteMatches(denomination: string, faceValue?: number) {
  if (faceValue === undefined) return true;
  const numbers = denomination.replace(/,/g,'').match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  return numbers.length > 0 && faceValue >= Math.min(...numbers) && faceValue <= Math.max(...numbers);
}
