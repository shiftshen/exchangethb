import { publicCashProviders } from '@/data/site';
import type { CashCachePayload } from '@/lib/cash-cache-store';
import { cashQuoteCurrent } from '@/lib/data-quality';

export function summarizeCashSources(cache: CashCachePayload) {
  return publicCashProviders.map(provider => {
    const result = cache.results.find(r => r.provider === provider.slug);
    const currentCount = result?.ok ? (result.rates || []).filter(r => cashQuoteCurrent(r)).length : 0;
    return { slug: provider.slug, name: provider.name, officialUrl: provider.officialUrl,
      status: currentCount ? 'current' as const : result?.rates?.length ? 'reference' as const : 'unavailable' as const,
      currentCount, lastAttemptAt: result?.observedAt || null, lastSuccessAt: result?.lastSuccessAt || null,
      quoteTimes: [...new Set((result?.rates || []).map(r => r.observedAt))], lastAttemptSucceeded: result?.ok || false };
  });
}

export function workerInterval(value?: string) {
  const n = Number(value || '10');
  return Number.isFinite(n) && n >= 1 && n <= 120 ? n : 10;
}

export function cycleStatus(market: Record<string, boolean>, cash: CashCachePayload) {
  const statuses = summarizeCashSources(cash);
  return Object.values(market).every(Boolean) && statuses.every(r => r.status === 'current') ? 'ok' : 'degraded';
}
