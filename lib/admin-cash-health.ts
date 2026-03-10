import { promises as fs } from 'fs';
import path from 'path';
import { compareCashLive } from '@/lib/cash-live';
import { CurrencyCode } from '@/lib/types';

const cachePath = path.join(process.cwd(), 'content', 'cash-scrape-cache.json');
const currencies: CurrencyCode[] = ['USD', 'CNY', 'EUR', 'JPY', 'GBP'];

type HealthStatus = 'healthy' | 'degraded' | 'down';

function statusScore(status: HealthStatus) {
  if (status === 'down') return 2;
  if (status === 'degraded') return 1;
  return 0;
}

function readStatusByScore(score: number): HealthStatus {
  if (score >= 2) return 'down';
  if (score === 1) return 'degraded';
  return 'healthy';
}

export interface AdminCashHealthRow {
  providerSlug: string;
  status: HealthStatus;
  reasons: string[];
  currencies: CurrencyCode[];
}

export interface AdminCashAlert {
  provider: string;
  message: string;
  critical: boolean;
}

export async function getAdminCashHealth() {
  const compareResults = await Promise.all(currencies.map((currency) => compareCashLive({ currency, amount: 1000, maxDistanceKm: 100 })));
  const providerMap = new Map<string, { score: number; reasons: Set<string>; currencies: Set<CurrencyCode> }>();
  for (let index = 0; index < compareResults.length; index += 1) {
    const currency = currencies[index];
    const result = compareResults[index];
    for (const item of result.quality.providerHealth) {
      const status = item.status as HealthStatus;
      const score = statusScore(status);
      const current = providerMap.get(item.providerSlug) || { score: 0, reasons: new Set<string>(), currencies: new Set<CurrencyCode>() };
      current.score = Math.max(current.score, score);
      current.reasons.add(item.reason);
      current.currencies.add(currency);
      providerMap.set(item.providerSlug, current);
    }
  }
  const providerHealth: AdminCashHealthRow[] = [...providerMap.entries()]
    .map(([providerSlug, value]) => ({
      providerSlug,
      status: readStatusByScore(value.score),
      reasons: [...value.reasons],
      currencies: [...value.currencies],
    }))
    .sort((a, b) => statusScore(b.status) - statusScore(a.status) || a.providerSlug.localeCompare(b.providerSlug));

  let cacheJson: { generatedAt?: string; results?: Array<{ provider?: string; ok?: boolean; notes?: string[] }> } = {};
  try {
    cacheJson = JSON.parse(await fs.readFile(cachePath, 'utf8'));
  } catch {
    cacheJson = {};
  }
  const alerts = (cacheJson.results || []).flatMap((item) => {
    const notes = item.notes || [];
    if (!notes.length) {
      return item.ok === false ? [{ provider: item.provider || 'unknown', message: 'scrape_failed_without_notes', critical: true }] : [];
    }
    return notes.map((note) => ({ provider: item.provider || 'unknown', message: note, critical: item.ok === false }));
  });
  return {
    generatedAt: cacheJson.generatedAt || null,
    providerHealth,
    alerts,
    anyCacheStale: compareResults.some((result) => result.cacheStale),
    newestCacheAgeMinutes: compareResults.reduce<number | null>((best, row) => {
      if (typeof row.cacheAgeMinutes !== 'number') return best;
      if (best === null) return row.cacheAgeMinutes;
      return Math.min(best, row.cacheAgeMinutes);
    }, null),
  };
}
