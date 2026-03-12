import { cashBranches, cashProviders, cashRates, exchanges } from '@/data/site';
import { resolveAffiliateLink } from '@/lib/affiliate';
import { getBangkokReferenceDistanceKm } from '@/lib/cash-entities';
import { describeMarketSource, getLiveMarketSnapshots } from '@/lib/market-data';
import { readAdminConfig } from '@/lib/content-store';
import { CryptoSymbol, CurrencyCode, ExchangeRecord, Locale } from '@/lib/types';

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

  return snapshots.map((snapshot) => {
    const exchange = exchanges.find((item) => item.slug === snapshot.exchange) as ExchangeRecord;
    const book = input.side === 'buy' ? snapshot.asks : snapshot.bids;
    const coinAmount = input.quoteMode === 'coin' ? input.amount : input.amount / book[0].price;
    const depth = estimateFromOrderbook(book, coinAmount);
    const fillRatio = coinAmount > 0 ? depth.filled / coinAmount : 0;
    const feeOverrideKey = `${exchange.slug}:${input.symbol}:tradingFeePct`;
    const effectiveTradingFeePct = adminConfig.feeOverrides[feeOverrideKey] ?? exchange.fee.tradingFeePct;
    const tradingFee = depth.gross * (effectiveTradingFeePct / 100);
    const networkFee = input.includeWithdrawal ? exchange.fee.networks[input.network || input.symbol] || 0 : 0;
    const thbWithdraw = input.withdrawThb ? exchange.fee.thbWithdraw : 0;
    const estimatedReceive = input.side === 'buy' ? depth.filled - networkFee : depth.gross - tradingFee - thbWithdraw;
    const totalCost = input.side === 'buy' ? depth.gross + tradingFee : tradingFee + thbWithdraw;
    const source = describeMarketSource(snapshot);
    const effectiveAffiliate = resolveAffiliateLink(adminConfig.affiliateLinks[exchange.slug] || exchange.affiliate);
    return {
      exchange: exchange.name,
      slug: exchange.slug,
      estimatedReceive,
      estimatedTotalCost: totalCost,
      averagePrice: depth.averagePrice,
      requestedAmount: coinAmount,
      filledAmount: depth.filled,
      fillRatio,
      liquidityGap: depth.liquidityGap,
      tradingFee,
      networkFee,
      thbWithdraw,
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
    };
  }).sort((a, b) => {
    if (b.fillRatio !== a.fillRatio) return b.fillRatio - a.fillRatio;
    if (input.side === 'buy') return a.estimatedTotalCost - b.estimatedTotalCost;
    return b.estimatedReceive - a.estimatedReceive;
  });
}

export async function compareCash(input: { currency: CurrencyCode; amount: number; prioritizeNearest?: boolean; maxDistanceKm?: number; locale?: Locale; }) {
  const adminConfig = await readAdminConfig();
  const effectiveBranches = cashBranches
    .map((branch) => {
      const override = adminConfig.branchOverrides[branch.id] || {};
      return {
        ...branch,
        name: override.name || branch.name,
        address: override.address || branch.address,
        hours: override.hours || branch.hours,
        mapsUrl: override.mapsUrl || branch.mapsUrl,
        isVisible: override.isVisible ?? true,
        distanceKm: getBangkokReferenceDistanceKm(branch),
      };
    })
    .filter((branch) => branch.isVisible);
  const results = cashRates
    .filter((rate) => rate.currency === input.currency)
    .map((rate) => {
      const branch = effectiveBranches.find((entry) => entry.id === rate.branchId);
      if (!branch) return null;
      const provider = cashProviders.find((entry) => entry.slug === branch.providerSlug)!;
      return {
        provider: provider.name,
        providerSlug: provider.slug,
        branchName: branch.name,
        area: branch.area,
        distanceKm: branch.distanceKm,
        isOpen: branch.isOpen,
        hours: branch.hours,
        buyRate: rate.buyRate,
        estimatedThb: rate.buyRate * input.amount,
        mapsUrl: branch.mapsUrl,
        officialUrl: provider.officialUrl,
        disclosure: provider.affiliate.disclosure,
        observedAt: rate.observedAt,
      } as const;
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
    .filter((row) => row.distanceKm <= (input.maxDistanceKm || Infinity));

  const bestRate = [...results].sort((a, b) => b.buyRate - a.buyRate);
  const nearestGood = [...results].sort((a, b) => {
    const scoreA = a.distanceKm * 0.7 - a.buyRate * 0.3;
    const scoreB = b.distanceKm * 0.7 - b.buyRate * 0.3;
    return scoreA - scoreB;
  });

  return {
    bestRate: bestRate[0] || null,
    nearestGood: nearestGood[0] || null,
    all: input.prioritizeNearest ? nearestGood : bestRate,
    source: 'Official website scraping + manual review',
  };
}
