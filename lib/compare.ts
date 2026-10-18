import { exchanges } from '@/data/site';
import { resolveAffiliateLink } from '@/lib/affiliate';
import { compareCashLive } from '@/lib/cash-live';
import { describeMarketSource, getLiveMarketSnapshots } from '@/lib/market-data';
import { readAdminConfig } from '@/lib/content-store';
import { CryptoSymbol, CurrencyCode, ExchangeRecord, Locale } from '@/lib/types';
import { cleanOrderbook, finitePositive } from '@/lib/data-quality';
import { evidenceState } from '@/lib/provider-evidence';
import { fiatWithdrawalFee } from '@/lib/fiat-withdrawal-fee';

function estimateFromOrderbook(levels: { price: number; quantity: number }[], amount: number) {
  let remaining = amount;
  let spent = 0;

  for (const level of levels) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, level.quantity);
    spent += take * level.price;
    remaining -= take;
  }

  const filled = amount - remaining;
  return { filled, averagePrice: filled ? spent / filled : 0, gross: spent, liquidityGap: remaining };
}

export async function compareCrypto(input: {
  symbol: CryptoSymbol;
  side: 'buy' | 'sell';
  amount: number;
  quoteMode: 'coin' | 'thb';
  network?: string;
  includeWithdrawal?: boolean;
  withdrawThb?: boolean;
}) {
  const [snapshots, adminConfig] = await Promise.all([getLiveMarketSnapshots(input.symbol), readAdminConfig()]);

  return snapshots.filter(snapshot => {
    try { cleanOrderbook(input.side==='buy'?snapshot.asks:snapshot.bids,input.side==='buy'?'asks':'bids'); return true; } catch { return false; }
  }).map((snapshot) => {
    const exchange = exchanges.find((item) => item.slug === snapshot.exchange) as ExchangeRecord;
    const book = cleanOrderbook(input.side === 'buy' ? snapshot.asks : snapshot.bids, input.side === 'buy' ? 'asks' : 'bids');
    const coinAmount = input.quoteMode === 'coin' ? input.amount : input.amount / book[0].price;
    const depth = estimateFromOrderbook(book, coinAmount);
    const fillRatio = coinAmount > 0 ? depth.filled / coinAmount : 0;
    const feeOverrideKey = `${exchange.slug}:${input.symbol}:tradingFeePct`;
    const effectiveTradingFeePct = adminConfig.feeOverrides[feeOverrideKey] ?? exchange.fee.tradingFeePct;
    const tradingFee = depth.gross * (effectiveTradingFeePct / 100);
    const buyFeeInAsset = input.side === 'buy' && exchange.fee.tradingFeeAsset === 'received';
    const tradingFeeAsset = buyFeeInAsset ? depth.filled * effectiveTradingFeePct / 100 : 0;
    const assetWithdrawalFee = adminConfig.feeOverrides[`${exchange.slug}:${input.network || input.symbol}:networkFee`] ?? exchange.fee.networks[input.network || input.symbol];
    const withdrawalSupported = assetWithdrawalFee !== undefined;
    const networkFee = input.includeWithdrawal ? assetWithdrawalFee || 0 : 0;
    const override = adminConfig.feeOverrides[`${exchange.slug}:THB:withdrawFee`];
    const fiatAmount = Math.max(0, depth.gross - tradingFee);
    const publishedAmountRange = exchange.slug === 'binance-th' ? fiatAmount >= 100 : exchange.slug === 'bitkub' ? fiatAmount >= 21 && fiatAmount <= 20_000_000 : true;
    const thbWithdrawKnown = !input.withdrawThb || override !== undefined || (exchange.fee.thbWithdrawKnown !== false && publishedAmountRange);
    const withdrawalRange = !input.withdrawThb || !thbWithdrawKnown ? { min: 0, max: 0 } : override !== undefined ? { min: override, max: override } : fiatWithdrawalFee(exchange.slug, Math.max(0, depth.gross - tradingFee), exchange.fee.thbWithdraw);
    const thbWithdraw = withdrawalRange.max;
    const estimatedReceive = Math.max(0, input.side === 'buy' ? depth.filled - tradingFeeAsset - networkFee : depth.gross - tradingFee - thbWithdraw);
    const totalCost = input.side === 'buy' ? depth.gross + (buyFeeInAsset ? 0 : tradingFee) : tradingFee + thbWithdraw;
    const source = describeMarketSource(snapshot);
    const effectiveAffiliate = resolveAffiliateLink(adminConfig.affiliateLinks[exchange.slug] || exchange.affiliate);
    return {
      exchange: exchange.name,
      slug: exchange.slug,
      estimatedReceive,
      estimatedReceiveMax: input.side === 'sell' ? Math.max(0, depth.gross - tradingFee - withdrawalRange.min) : estimatedReceive,
      estimatedTotalCost: totalCost,
      averagePrice: depth.averagePrice,
      requestedAmount: coinAmount,
      filledAmount: depth.filled,
      fillRatio,
      liquidityGap: depth.liquidityGap,
      tradingFee,
      tradingFeeAsset,
      networkFee,
      thbWithdraw,
      thbWithdrawMin: withdrawalRange.min,
      thbWithdrawKnown,
      license: exchange.license,
      affiliate: effectiveAffiliate,
      affiliateUrl: effectiveAffiliate.outboundUrl,
      affiliateStatus: effectiveAffiliate.effectiveStatus,
      affiliateDowngraded: effectiveAffiliate.downgraded,
      updatedAt: snapshot.lastUpdated,
      source: source.label,
      live: source.live,
      freshness: source.freshness,
      fallbackReason: source.fallbackReason,
      timestampKind: snapshot.timestampKind || 'collected',
      fetchedAt: snapshot.fetchedAt || snapshot.lastUpdated,
      feeStatus: evidenceState(adminConfig.evidence?.[exchange.slug]?.fees),
      feeCheckedAt: adminConfig.evidence?.[exchange.slug]?.fees?.checkedAt || null,
      withdrawalFeeKnown: !input.includeWithdrawal || withdrawalSupported,
    };
  }).filter(row => finitePositive(row.averagePrice) && Number.isFinite(row.estimatedReceive) && Number.isFinite(row.estimatedTotalCost)).sort((a, b) => {
    if (a.live !== b.live) return Number(b.live) - Number(a.live);
    if (b.fillRatio !== a.fillRatio) return b.fillRatio - a.fillRatio;
    if (input.side === 'buy') {
      const aUnitCost = a.estimatedReceive > 0 ? a.estimatedTotalCost / a.estimatedReceive : Infinity;
      const bUnitCost = b.estimatedReceive > 0 ? b.estimatedTotalCost / b.estimatedReceive : Infinity;
      return aUnitCost - bUnitCost;
    }
    return b.estimatedReceive - a.estimatedReceive;
  });
}

export async function compareCash(input: { currency: CurrencyCode; amount: number; prioritizeNearest?: boolean; maxDistanceKm?: number; locale?: Locale; }) {
  return compareCashLive(input);
}
