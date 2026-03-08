export type Locale = 'th' | 'en' | 'zh';
export type AffiliateStatus = 'reward_available' | 'campaign_only' | 'official_only';
export type ExchangeSlug = 'binance-th' | 'bitkub' | 'upbit-thailand' | 'orbix';
export type CurrencyCode = 'USD' | 'CNY' | 'EUR' | 'JPY' | 'GBP';
export type CryptoSymbol = 'BTC' | 'ETH' | 'USDT' | 'XRP' | 'DOGE' | 'SOL';

export interface CopyGroup { th: string; en: string; zh: string; }
export interface NavItem { href: string; label: CopyGroup; }
export interface AffiliateLink { status: AffiliateStatus; trackingUrl?: string; officialUrl: string; disclosure: CopyGroup; }
export interface ExchangeFee { tradingFeePct: number; thbWithdraw: number; networks: Record<string, number>; }
export interface ExchangeScore { compliance: number; feeTransparency: number; apiQuality: number; thbFriendliness: number; executionQuality: number; operations: number; }
export interface ExchangeRecord {
  slug: ExchangeSlug;
  name: string;
  license: string;
  summary: CopyGroup;
  strengths: CopyGroup[];
  cautions: CopyGroup[];
  affiliate: AffiliateLink;
  fee: ExchangeFee;
  score: ExchangeScore;
  pairs: CryptoSymbol[];
  lastUpdated: string;
}
export interface OrderLevel { price: number; quantity: number; }
export interface MarketSnapshot {
  exchange: ExchangeSlug;
  symbol: CryptoSymbol;
  asks: OrderLevel[];
  bids: OrderLevel[];
  lastUpdated: string;
}
export interface CashBranch {
  id: string;
  providerSlug: string;
  name: string;
  area: string;
  address: string;
  mapsUrl: string;
  latitude: number;
  longitude: number;
  hours: string;
  isOpen: boolean;
  distanceKm: number;
}
export interface CashRate {
  branchId: string;
  currency: CurrencyCode;
  denomination: string;
  buyRate: number;
  sellRate: number;
  observedAt: string;
  isAnomalous?: boolean;
}
export interface CashProvider {
  slug: string;
  name: string;
  summary: CopyGroup;
  officialUrl: string;
  affiliate: AffiliateLink;
}
