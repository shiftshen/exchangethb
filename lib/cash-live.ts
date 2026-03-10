import { promises as fs } from 'fs';
import path from 'path';
import { cashBranches, cashProviders, cashRates } from '@/data/site';
import { CurrencyCode, Locale } from '@/lib/types';
import { runCashScrapers, ScrapeResult } from '@/lib/scrapers/cash';

const cachePath = path.join(process.cwd(), 'content', 'cash-scrape-cache.json');

async function readCache(): Promise<{ generatedAt: string | null; results: ScrapeResult[] }> {
  try {
    const raw = await fs.readFile(cachePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { generatedAt: null, results: [] };
  }
}

export async function refreshCashScrapeCache() {
  const results = await runCashScrapers();
  const payload = { generatedAt: new Date().toISOString(), results };
  await fs.writeFile(cachePath, JSON.stringify(payload, null, 2));
  return payload;
}

export async function compareCashLive(input: { currency: CurrencyCode; amount: number; prioritizeNearest?: boolean; maxDistanceKm?: number; locale?: Locale; }) {
  const cache = await readCache();
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
      live: 'providerSlug' in rate,
      denomination: rate.denomination,
    };
  }).filter((row) => row.distanceKm <= (input.maxDistanceKm || Infinity));

  const bestRate = [...hydrated].sort((a, b) => b.buyRate - a.buyRate);
  const nearestGood = [...hydrated].sort((a, b) => (a.distanceKm * 0.7 - a.buyRate * 0.3) - (b.distanceKm * 0.7 - b.buyRate * 0.3));

  return {
    bestRate: bestRate[0] || null,
    nearestGood: nearestGood[0] || null,
    all: input.prioritizeNearest ? nearestGood : bestRate,
    source: liveRows.length ? 'Official scraping with fallback completion' : 'Reviewed fallback dataset',
    cacheGeneratedAt: cache.generatedAt,
  };
}
