import { cashBranches, cashProviders, cashRates, publicCashProviderSlugs } from '@/data/site';
import { readCashCache, rollbackCashCache, writeCashCache } from '@/lib/cash-cache-store';
import { getBangkokReferenceDistanceKm, getUserDistanceKm } from '@/lib/cash-entities';
import { readAdminConfig } from '@/lib/content-store';
import { CurrencyCode, Locale } from '@/lib/types';
import { runCashScrapers, ScrapeResult } from '@/lib/scrapers/cash';

const minScrapeIntervalMinutes = Number(process.env.CASH_SCRAPE_MIN_INTERVAL_MINUTES || '5');
const staleThresholdMinutes = Number(process.env.CASH_CACHE_STALE_MINUTES || '30');

async function readCache(): Promise<{ generatedAt: string | null; results: ScrapeResult[] }> {
  return readCashCache();
}

function sourceRank(sourceType: 'live' | 'hybrid' | 'fallback') {
  if (sourceType === 'live') return 3;
  if (sourceType === 'hybrid') return 2;
  return 1;
}

export async function refreshCashScrapeCache() {
  const previousCache = await readCache();
  const previousGeneratedAtTs = previousCache.generatedAt ? Date.parse(previousCache.generatedAt) : NaN;
  if (Number.isFinite(previousGeneratedAtTs)) {
    const ageMinutes = (Date.now() - previousGeneratedAtTs) / 60000;
    if (ageMinutes < minScrapeIntervalMinutes) {
      return previousCache;
    }
  }
  const results = await runCashScrapers();
  const hasAnyRates = results.some((result) => (result.rates || []).length > 0);
  if (!hasAnyRates && previousCache.results.length > 0) {
    return previousCache;
  }
  const payload = { generatedAt: new Date().toISOString(), results };
  await writeCashCache(payload, previousCache.results.length > 0 ? previousCache : null);
  return payload;
}

export async function rollbackCashScrapeCache() {
  return rollbackCashCache();
}

export async function compareCashLive(input: {
  currency: CurrencyCode;
  amount: number;
  prioritizeNearest?: boolean;
  maxDistanceKm?: number;
  locale?: Locale;
  userLatitude?: number | null;
  userLongitude?: number | null;
  includeUnstableProviders?: boolean;
}) {
  const hasUserLocation = Number.isFinite(input.userLatitude) && Number.isFinite(input.userLongitude);
  const userLocation = hasUserLocation
    ? { latitude: Number(input.userLatitude), longitude: Number(input.userLongitude) }
    : null;
  const adminConfig = await readAdminConfig();
  const visibleProviderSet = input.includeUnstableProviders
    ? null
    : new Set<string>(publicCashProviderSlugs);
  const effectiveBranches = cashBranches
    .filter((branch) => (visibleProviderSet ? visibleProviderSet.has(branch.providerSlug) : true))
    .map((branch) => {
      const override = adminConfig.branchOverrides[branch.id] || {};
      return {
        ...branch,
        name: override.name || branch.name,
        address: override.address || branch.address,
        hours: override.hours || branch.hours,
        mapsUrl: override.mapsUrl || branch.mapsUrl,
        isVisible: override.isVisible ?? true,
        distanceKm: userLocation ? getUserDistanceKm(branch, userLocation) : getBangkokReferenceDistanceKm(branch),
      };
    })
    .filter((branch) => branch.isVisible);
  const cache = await readCache();
  const cacheAgeMinutes = cache.generatedAt ? Math.max(0, (Date.now() - Date.parse(cache.generatedAt)) / 60000) : null;
  const cacheStale = typeof cacheAgeMinutes === 'number' && Number.isFinite(cacheAgeMinutes) ? cacheAgeMinutes > staleThresholdMinutes : true;
  const liveRows = cache.results
    .flatMap((result) => result.rates || [])
    .filter((rate) => rate.currency === input.currency)
    .filter((rate) => (visibleProviderSet ? visibleProviderSet.has(rate.providerSlug) : true));
  const staticRows = cashRates.filter((rate) => rate.currency === input.currency);
  const liveProviderSlugs = new Set(liveRows.map((rate) => rate.providerSlug));
  const mergedRows = [
    ...liveRows,
    ...staticRows.filter((rate) => {
      const branch = effectiveBranches.find((entry) => entry.id === rate.branchId);
      return branch ? !liveProviderSlugs.has(branch.providerSlug) : false;
    }),
  ];

  const hydrated = mergedRows.map((rate) => {
    const providerSlug = 'providerSlug' in rate ? rate.providerSlug : effectiveBranches.find((entry) => entry.id === rate.branchId)!.providerSlug;
    const provider = cashProviders.find((entry) => entry.slug === providerSlug)!;
    const branch = 'branchId' in rate
      ? effectiveBranches.find((entry) => entry.id === rate.branchId)!
      : effectiveBranches.find((entry) => entry.providerSlug === providerSlug)!;
    const observedAt = rate.observedAt;
    const sourceType: 'live' | 'hybrid' | 'fallback' = 'providerSlug' in rate
      ? (rate.sourceKind === 'hybrid' ? 'hybrid' : 'live')
      : 'fallback';
    return {
      provider: provider.name,
      providerSlug: provider.slug,
      branchName: branch.name,
      area: branch.area,
      distanceKm: branch.distanceKm,
      distanceOrigin: userLocation ? 'user' : 'reference',
      locationPrecision: branch.locationPrecision || 'reference',
      isOpen: branch.isOpen,
      hours: branch.hours,
      buyRate: rate.buyRate,
      estimatedThb: rate.buyRate * input.amount,
      mapsUrl: branch.mapsUrl,
      officialUrl: provider.officialUrl,
      disclosure: provider.affiliate.disclosure,
      observedAt,
      live: 'providerSlug' in rate && rate.sourceKind !== 'hybrid',
      denomination: rate.denomination,
      sourceType,
    };
  }).map((row) => {
    const reviewMode = adminConfig.scrapeReview.providerModes[row.providerSlug] || 'auto';
    if (reviewMode === 'force_fallback') return { ...row, live: false, sourceType: 'fallback' as const };
    if (reviewMode === 'force_live') return { ...row, live: true, sourceType: 'live' as const };
    return row;
  }).filter((row) => row.distanceKm <= (input.maxDistanceKm || Infinity));

  const expectedProviderSlugs = new Set(staticRows.map((rate) => effectiveBranches.find((entry) => entry.id === rate.branchId)?.providerSlug).filter((slug): slug is string => Boolean(slug)));
  const presentProviderSlugs = new Set(hydrated.map((row) => row.providerSlug));
  const missingProviders = [...expectedProviderSlugs].filter((slug) => !presentProviderSlugs.has(slug));

  const comparisonRows = hydrated
    .sort((a, b) => {
      const sourceDiff = sourceRank(b.sourceType) - sourceRank(a.sourceType);
      if (sourceDiff !== 0) return sourceDiff;
      if (b.buyRate !== a.buyRate) return b.buyRate - a.buyRate;
      return a.distanceKm - b.distanceKm;
    })
    .reduce<typeof hydrated>((rows, row) => {
      if (!rows.some((item) => item.providerSlug === row.providerSlug)) {
        rows.push(row);
      }
      return rows;
    }, []);

  const anomalies = cache.results
    .flatMap((result) => (result.notes || []).map((note) => ({ provider: result.provider, note })))
    .filter((item) => {
      const lower = item.note.toLowerCase();
      return !lower.startsWith('parsed ') && !lower.includes('latest branch rate update marker');
    })
    .map((item) => `${item.provider} ${item.note}`)
    .filter((item) => !adminConfig.scrapeReview.hiddenAlerts.includes(item));

  const bestRate = [...comparisonRows].sort((a, b) => b.buyRate - a.buyRate);
  const nearestGood = [...comparisonRows].sort((a, b) => (a.distanceKm * 0.7 - a.buyRate * 0.3) - (b.distanceKm * 0.7 - b.buyRate * 0.3));
  const liveHydratedRows = hydrated.filter((row) => row.sourceType === 'live');
  const hybridHydratedRows = hydrated.filter((row) => row.sourceType === 'hybrid');
  const fallbackHydratedRows = hydrated.filter((row) => row.sourceType === 'fallback');
  const providerUniverse = new Set<string>([
    ...expectedProviderSlugs,
    ...comparisonRows.map((row) => row.providerSlug),
  ]);
  const providerHealth = [...providerUniverse].map((providerSlug) => {
    const rows = hydrated.filter((row) => row.providerSlug === providerSlug);
    const hasLive = rows.some((row) => row.sourceType === 'live');
    const hasHybrid = rows.some((row) => row.sourceType === 'hybrid');
    const hasFallback = rows.some((row) => row.sourceType === 'fallback');
    const status = hasLive
      ? (cacheStale ? 'degraded' : 'healthy')
      : (hasHybrid || hasFallback ? 'degraded' : 'down');
    const reason = hasLive
      ? (cacheStale ? 'live_stale' : 'live_fresh')
      : (hasHybrid ? 'hybrid_feed' : (hasFallback ? 'fallback_dataset' : 'missing'));
    return { providerSlug, status, reason };
  });

  return {
    bestRate: bestRate[0] || null,
    nearestGood: nearestGood[0] || null,
    all: input.prioritizeNearest ? nearestGood : bestRate,
    source: liveRows.length
      ? (cacheStale ? 'Stale live snapshot with fallback completion' : 'Official scraping with fallback completion')
      : 'Reviewed fallback dataset',
    distanceOrigin: userLocation ? 'user' : 'reference',
    cacheGeneratedAt: cache.generatedAt,
    cacheAgeMinutes,
    cacheStale,
    quality: {
      liveRows: liveHydratedRows.length,
      hybridRows: hybridHydratedRows.length,
      fallbackRows: fallbackHydratedRows.length,
      liveProviderCount: new Set(liveHydratedRows.map((row) => row.providerSlug)).size,
      hybridProviderCount: new Set(hybridHydratedRows.map((row) => row.providerSlug)).size,
      fallbackProviderCount: new Set(fallbackHydratedRows.map((row) => row.providerSlug)).size,
      missingProviders,
      providerHealth,
      anomalyCount: anomalies.length,
      anomalies: anomalies.slice(0, 5),
    },
  };
}
