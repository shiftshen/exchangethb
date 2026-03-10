import { promises as fs } from 'fs';
import path from 'path';
import { cashBranches, cashProviders, cashRates } from '@/data/site';
import { CurrencyCode, Locale } from '@/lib/types';
import { runCashScrapers, ScrapeResult } from '@/lib/scrapers/cash';

const cachePath = path.join(process.cwd(), 'content', 'cash-scrape-cache.json');
const minScrapeIntervalMinutes = Number(process.env.CASH_SCRAPE_MIN_INTERVAL_MINUTES || '5');
const staleThresholdMinutes = Number(process.env.CASH_CACHE_STALE_MINUTES || '30');

async function readCache(): Promise<{ generatedAt: string | null; results: ScrapeResult[] }> {
  try {
    const raw = await fs.readFile(cachePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { generatedAt: null, results: [] };
  }
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
  await fs.writeFile(cachePath, JSON.stringify(payload, null, 2));
  return payload;
}

export async function compareCashLive(input: { currency: CurrencyCode; amount: number; prioritizeNearest?: boolean; maxDistanceKm?: number; locale?: Locale; }) {
  const cache = await readCache();
  const cacheAgeMinutes = cache.generatedAt ? Math.max(0, (Date.now() - Date.parse(cache.generatedAt)) / 60000) : null;
  const cacheStale = typeof cacheAgeMinutes === 'number' && Number.isFinite(cacheAgeMinutes) ? cacheAgeMinutes > staleThresholdMinutes : true;
  const liveRows = cache.results.flatMap((result) => result.rates || []).filter((rate) => rate.currency === input.currency);
  const staticRows = cashRates.filter((rate) => rate.currency === input.currency);
  const liveProviderSlugs = new Set(liveRows.map((rate) => rate.providerSlug));
  const mergedRows = [
    ...liveRows,
    ...staticRows.filter((rate) => !liveProviderSlugs.has(cashBranches.find((entry) => entry.id === rate.branchId)!.providerSlug)),
  ];

  const hydrated = mergedRows.map((rate) => {
    const providerSlug = 'providerSlug' in rate ? rate.providerSlug : cashBranches.find((entry) => entry.id === rate.branchId)!.providerSlug;
    const provider = cashProviders.find((entry) => entry.slug === providerSlug)!;
    const branch = 'branchId' in rate
      ? cashBranches.find((entry) => entry.id === rate.branchId)!
      : cashBranches.find((entry) => entry.providerSlug === providerSlug)!;
    const observedAt = rate.observedAt;
    const sourceType = 'providerSlug' in rate
      ? (rate.sourceKind === 'hybrid' ? 'hybrid' : 'live')
      : 'fallback';
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
      observedAt,
      live: 'providerSlug' in rate && rate.sourceKind !== 'hybrid',
      denomination: rate.denomination,
      sourceType,
    };
  }).filter((row) => row.distanceKm <= (input.maxDistanceKm || Infinity));

  const expectedProviderSlugs = new Set(staticRows.map((rate) => cashBranches.find((entry) => entry.id === rate.branchId)!.providerSlug));
  const presentProviderSlugs = new Set(hydrated.map((row) => row.providerSlug));
  const missingProviders = [...expectedProviderSlugs].filter((slug) => !presentProviderSlugs.has(slug));
  const staticBaselineMap = new Map(staticRows.map((rate) => {
    const branch = cashBranches.find((entry) => entry.id === rate.branchId)!;
    return [`${branch.providerSlug}:${rate.denomination}`, rate.buyRate] as const;
  }));
  const anomalies = hydrated
    .filter((row) => row.live)
    .map((row) => {
      const baseline = staticBaselineMap.get(`${row.providerSlug}:${row.denomination}`);
      if (!baseline || baseline <= 0) return null;
      const deviationPct = Math.abs((row.buyRate - baseline) / baseline) * 100;
      if (deviationPct < 8) return null;
      return `${row.providerSlug} ${row.denomination} deviation ${deviationPct.toFixed(2)}%`;
    })
    .filter((item): item is string => Boolean(item));

  const bestRate = [...hydrated].sort((a, b) => b.buyRate - a.buyRate);
  const nearestGood = [...hydrated].sort((a, b) => (a.distanceKm * 0.7 - a.buyRate * 0.3) - (b.distanceKm * 0.7 - b.buyRate * 0.3));
  const liveHydratedRows = hydrated.filter((row) => row.live);
  const fallbackHydratedRows = hydrated.filter((row) => !row.live);
  const providerUniverse = new Set<string>([
    ...expectedProviderSlugs,
    ...hydrated.map((row) => row.providerSlug),
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
    cacheGeneratedAt: cache.generatedAt,
    cacheAgeMinutes,
    cacheStale,
    quality: {
      liveRows: liveHydratedRows.length,
      fallbackRows: fallbackHydratedRows.length,
      liveProviderCount: new Set(liveHydratedRows.map((row) => row.providerSlug)).size,
      fallbackProviderCount: new Set(fallbackHydratedRows.map((row) => row.providerSlug)).size,
      missingProviders,
      providerHealth,
      anomalyCount: anomalies.length,
      anomalies: anomalies.slice(0, 5),
    },
  };
}
