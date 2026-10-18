import { cashBranches, cashProviders, publicCashProviderSlugs } from '@/data/site';
import { readCashCache, rollbackCashCache, writeCashCache } from '@/lib/cash-cache-store';
import { effectiveBranchLocation, getVerifiedBranchMapsUrl, getBangkokReferenceDistanceKm, getUserDistanceKm, hasCoordinates } from '@/lib/cash-entities';
import { readAdminConfig } from '@/lib/content-store';
import { getBangkokOpenState } from '@/lib/opening-hours';
import { CurrencyCode, Locale } from '@/lib/types';
import { runCashScrapers, ScrapeResult } from '@/lib/scrapers/cash';
import { cashQuoteCurrent, finitePositive, banknoteMatches } from '@/lib/data-quality';
import type { CashCachePayload } from '@/lib/cash-cache-store';

const minScrapeIntervalMinutes = Number(process.env.CASH_SCRAPE_MIN_INTERVAL_MINUTES || '5');
const staleThresholdMinutes = Number(process.env.CASH_CACHE_STALE_MINUTES || '30');

async function readCache(): Promise<CashCachePayload> {
  return readCashCache();
}

function sourceRank(sourceType: 'live' | 'hybrid' | 'fallback') {
  if (sourceType === 'live') return 3;
  if (sourceType === 'hybrid') return 2;
  return 1;
}

export async function refreshCashScrapeCache() {
  const previousCache = await readCache();
  // External collection owns source access and writes. Never bypass its proxy or
  // overwrite its cache through an admin call, even when quotes are stale.
  if (process.env.CASH_COLLECTION_MODE === 'external') return previousCache;
  const previousGeneratedAtTs = Date.parse(previousCache.lastAttemptAt || previousCache.generatedAt || '');
  if (Number.isFinite(previousGeneratedAtTs)) {
    const ageMinutes = (Date.now() - previousGeneratedAtTs) / 60000;
    if (ageMinutes < minScrapeIntervalMinutes) {
      return previousCache;
    }
  }
  const attemptAt = new Date().toISOString();
  const attempts = await runCashScrapers();
  const results: ScrapeResult[] = attempts.map(result => {
    const rates = (result.rates || []).filter(rate => finitePositive(rate.buyRate) && Number.isFinite(rate.sellRate) && rate.sellRate >= 0 && (rate.sellRate === 0 || rate.sellRate >= rate.buyRate) && Number.isFinite(Date.parse(rate.observedAt)));
    if (result.ok && rates.length) return { ...result, rates, lastSuccessAt: attemptAt };
    const previous = previousCache.results.find(row => row.provider === result.provider);
    return { ...result, ok: false, rates: previous?.rates || [], lastSuccessAt: previous?.lastSuccessAt || previous?.observedAt,
      notes: [...result.notes, 'Last successful rates retained with original timestamps; refresh failed.'] };
  });
  // Preserve previous providers during upgrades if an adapter is absent from this cycle.
  for (const previous of previousCache.results) if (!results.some(row => row.provider === previous.provider)) results.push({ ...previous, ok: false, notes: ['Adapter not run in latest cycle; retained for reference.'] });
  const anySuccess = results.some(row => row.ok);
  const payload: CashCachePayload = { generatedAt: anySuccess ? attemptAt : previousCache.generatedAt, results, lastAttemptAt: attemptAt,
    lastAttempts: results.map(({ provider, ok, observedAt, notes }) => ({ provider, ok, observedAt, notes })) };
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
  side?: 'buy' | 'sell';
  banknote?: number;
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
    .filter((branch) => !['sia', 'vasu'].includes(branch.providerSlug) && (visibleProviderSet ? visibleProviderSet.has(branch.providerSlug) : true))
    .map((branch) => {
      const override = adminConfig.branchOverrides[branch.id] || {};
      const location = effectiveBranchLocation(branch, override);
      return {
        ...branch,
        ...location,
        name: override.name || branch.name,
        address: override.address || branch.address,
        hours: override.hours || branch.hours,
        mapsUrl: getVerifiedBranchMapsUrl(branch, override),
        isVisible: override.isVisible ?? true,
        distanceKm: userLocation ? getUserDistanceKm(location, userLocation) : getBangkokReferenceDistanceKm(location),
      };
    })
    .filter((branch) => branch.isVisible);
  const cache = await readCache();
  const cacheAgeMinutes = cache.generatedAt ? Math.max(0, (Date.now() - Date.parse(cache.generatedAt)) / 60000) : null;
  const cacheStale = typeof cacheAgeMinutes === 'number' && Number.isFinite(cacheAgeMinutes) ? cacheAgeMinutes > staleThresholdMinutes : true;
  const liveRows = cache.results
    .flatMap((result) => result.rates || [])
    .filter((rate) => rate.currency === input.currency && !['sia', 'vasu'].includes(rate.providerSlug))
    .filter((rate) => (visibleProviderSet ? visibleProviderSet.has(rate.providerSlug) : true));
  const mergedRows = liveRows;

  const hydrated = mergedRows.filter(rate => {
    if (!banknoteMatches(rate.denomination, input.banknote)) return false;
    const slug = rate.providerSlug;
    return Boolean(slug && cashProviders.some(p => p.slug === slug) && effectiveBranches.some(b => b.providerSlug === slug));
  }).map((rate) => {
    const providerSlug = rate.providerSlug;
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
      distanceKnown: hasCoordinates(branch),
      distanceOrigin: userLocation ? 'user' : 'reference',
      locationPrecision: branch.locationPrecision || 'reference',
      isOpen: getBangkokOpenState(branch.hours) ?? branch.isOpen,
      openingKnown: getBangkokOpenState(branch.hours) !== null,
      hours: branch.hours,
      buyRate: rate.buyRate,
      sellRate: rate.sellRate,
      estimatedThb: (input.side === 'buy' ? rate.sellRate : rate.buyRate) * input.amount,
      mapsUrl: branch.mapsUrl,
      officialUrl: provider.officialUrl,
      disclosure: provider.affiliate.disclosure,
      observedAt,
      live: 'providerSlug' in rate && rate.sourceKind !== 'hybrid',
      denomination: rate.denomination,
      sourceType,
      branchId: branch.id,
      sourceUrl: 'sourceUrl' in rate ? rate.sourceUrl : provider.officialUrl,
      fetchedAt: 'fetchedAt' in rate ? rate.fetchedAt : undefined,
      timestampKind: 'timestampKind' in rate ? rate.timestampKind : 'collected',
      current: 'providerSlug' in rate && cache.results.find(r => r.provider === providerSlug)?.ok !== false && cashQuoteCurrent({ ...rate, sourceType }),
    };
  }).map((row) => {
    const reviewMode = adminConfig.scrapeReview.providerModes[row.providerSlug] || 'auto';
    if (reviewMode === 'force_fallback') return { ...row, current: false, live: false, sourceType: 'fallback' as const };
    // force_live cannot promote inferred, old or fallback evidence into a live quote.
    return row;
  }).filter((row) => (!row.distanceKnown || row.distanceKm <= (input.maxDistanceKm || Infinity)) && finitePositive(input.side === 'buy' ? row.sellRate : row.buyRate));

  // Monitor configured sources even when a currency has no seed/reference rows.
  // Missing means no matching quote, not that a provider accepts this currency.
  const expectedProviderSlugs = new Set(effectiveBranches.map((branch) => branch.providerSlug));
  const presentProviderSlugs = new Set(hydrated.map((row) => row.providerSlug));
  const missingProviders = [...expectedProviderSlugs].filter((slug) => !presentProviderSlugs.has(slug));

  const comparisonRows = hydrated
    .sort((a, b) => {
      const currentDiff = Number(b.current) - Number(a.current);
      if (currentDiff) return currentDiff;
      const sourceDiff = sourceRank(b.sourceType) - sourceRank(a.sourceType);
      if (sourceDiff !== 0) return sourceDiff;
      if (input.side === 'buy' && a.sellRate !== b.sellRate) return a.sellRate - b.sellRate;
      if (input.side !== 'buy' && b.buyRate !== a.buyRate) return b.buyRate - a.buyRate;
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

  const bestRate = comparisonRows;
  const nearestGood = [...comparisonRows].sort((a, b) => Number(b.current) - Number(a.current) || Number(b.distanceKnown) - Number(a.distanceKnown) || a.distanceKm - b.distanceKm);
  const liveHydratedRows = hydrated.filter((row) => row.sourceType === 'live');
  const hybridHydratedRows = hydrated.filter((row) => row.sourceType === 'hybrid');
  const fallbackHydratedRows = hydrated.filter((row) => row.sourceType === 'fallback');
  const providerUniverse = new Set<string>([
    ...expectedProviderSlugs,
    ...comparisonRows.map((row) => row.providerSlug),
  ]);
  const providerHealth = [...providerUniverse].map((providerSlug) => {
    const rows = hydrated.filter((row) => row.providerSlug === providerSlug);
    const hasLive = rows.some((row) => row.current);
    const hasHybrid = rows.some((row) => row.sourceType === 'hybrid');
    const hasFallback = rows.some((row) => row.sourceType === 'fallback');
    const status = hasLive
      ? 'healthy'
      : (hasHybrid || hasFallback || rows.length ? 'degraded' : 'down');
    const reason = hasLive
      ? 'live_fresh'
      : (hasHybrid ? 'hybrid_feed' : (hasFallback ? 'fallback_dataset' : rows.length ? 'live_stale_or_failed' : 'missing'));
    return { providerSlug, status, reason };
  });

  return {
    bestRate: bestRate.find(row => row.current) || null,
    nearestGood: nearestGood.find(row => row.current) || null,
    all: input.prioritizeNearest ? nearestGood : bestRate,
    source: liveRows.length
      ? (cacheStale ? 'Stale official source observations' : 'Official source observations')
      : 'No verified source observations',
    distanceOrigin: userLocation ? 'user' : 'reference',
    cacheGeneratedAt: cache.generatedAt,
    cacheAgeMinutes,
    cacheStale,
    lastAttemptAt: cache.lastAttemptAt || null,
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
