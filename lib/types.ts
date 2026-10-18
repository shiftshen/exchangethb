export type Locale = 'th' | 'en' | 'zh' | 'ja' | 'ru' | 'ko' | 'fr' | 'de' | 'id' | 'vi';
export type ContentLocale = Locale;
export type AffiliateStatus = 'reward_available' | 'campaign_only' | 'official_only';
export type ExchangeSlug = 'binance-th' | 'bitkub' | 'upbit-thailand' | 'orbix';
export const cashCurrencies = ['USD','EUR','JPY','CNY','GBP','AUD','CAD','SGD','HKD','CHF','NZD','KRW','TWD','MYR','INR'] as const;
export type CurrencyCode = typeof cashCurrencies[number];
export const cryptoSymbols = ['USDT','BTC','ETH','SOL','XRP','DOGE','USDC','ADA','BNB','AVAX','DOT','LINK','LTC','TRX','NEAR'] as const;
export type CryptoSymbol = typeof cryptoSymbols[number];

export interface CopyGroup {
  th: string;
  en: string;
  zh: string;
  ja?: string;
  ko?: string;
  de?: string;
  ru?: string;
  fr?: string;
  id?: string;
  vi?: string;
}
export interface NavItem { href: string; label: CopyGroup; }
export interface AffiliateLink { status: AffiliateStatus; trackingUrl?: string; officialUrl: string; disclosure: CopyGroup; startAt?: string; endAt?: string; }
export interface ExchangeFee { tradingFeePct: number; tradingFeeAsset?: 'received'; thbWithdraw: number; thbWithdrawKnown?: boolean; networks: Record<string, number>; }
export interface ExchangeRecord {
  slug: ExchangeSlug;
  name: string;
  license: string;
  summary: CopyGroup;
  strengths: CopyGroup[];
  cautions: CopyGroup[];
  affiliate: AffiliateLink;
  fee: ExchangeFee;
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
  source?: 'live' | 'fallback';
  fallbackReason?: string;
  fetchedAt?: string;
  timestampKind?: 'published' | 'collected';
}
export interface CashBranch {
  id: string;
  providerSlug: string;
  name: string;
  area: string;
  address: string;
  mapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  hours: string;
  isOpen: boolean;
  distanceKm: number;
  locationPrecision?: 'exact' | 'address' | 'reference';
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
