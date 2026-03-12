'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const statusKey = 'admin_dashboard_health_status';
const criticalKey = 'admin_dashboard_critical_only';

function useFilterNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const applyFilters = (nextStatus: string, nextCritical: boolean, replace?: boolean) => {
    const params = new URLSearchParams();
    if (nextStatus !== 'all') params.set('status', nextStatus);
    if (nextCritical) params.set('critical', '1');
    localStorage.setItem(statusKey, nextStatus);
    localStorage.setItem(criticalKey, nextCritical ? '1' : '0');
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (replace) {
      router.replace(url, { scroll: false });
      return;
    }
    router.push(url, { scroll: false });
  };
  return { applyFilters };
}

export function DashboardFilterBootstrap({ statusFilter, criticalOnly }: { statusFilter: string; criticalOnly: boolean }) {
  const { applyFilters } = useFilterNavigation();
  useEffect(() => {
    const hasQuery = statusFilter !== 'all' || criticalOnly;
    if (hasQuery) {
      localStorage.setItem(statusKey, statusFilter);
      localStorage.setItem(criticalKey, criticalOnly ? '1' : '0');
      return;
    }
    const rememberedStatus = localStorage.getItem(statusKey);
    const rememberedCritical = localStorage.getItem(criticalKey);
    const nextStatus = rememberedStatus && ['all', 'healthy', 'degraded', 'down'].includes(rememberedStatus) ? rememberedStatus : 'all';
    const nextCritical = rememberedCritical === '1';
    if (nextStatus === 'all' && !nextCritical) return;
    applyFilters(nextStatus, nextCritical, true);
  }, [statusFilter, criticalOnly, applyFilters]);
  return null;
}

export function HealthStatusFilters({ statusFilter, criticalOnly }: { statusFilter: string; criticalOnly: boolean }) {
  const { applyFilters } = useFilterNavigation();
  const filterClass = (active: boolean) => active ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700';
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {['all', 'healthy', 'degraded', 'down'].map((status) => (
        <button key={status} type="button" onClick={() => applyFilters(status, criticalOnly)} className={`rounded-full px-3 py-1 text-xs font-medium ${filterClass(statusFilter === status)}`}>
          {status === 'all' ? '全部' : status === 'healthy' ? '正常' : status === 'degraded' ? '降级' : '故障'}
        </button>
      ))}
    </div>
  );
}

export function AlertScopeFilters({ statusFilter, criticalOnly }: { statusFilter: string; criticalOnly: boolean }) {
  const { applyFilters } = useFilterNavigation();
  const filterClass = (active: boolean) => active ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700';
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" onClick={() => applyFilters(statusFilter, false)} className={`rounded-full px-3 py-1 text-xs font-medium ${filterClass(!criticalOnly)}`}>全部异常</button>
      <button type="button" onClick={() => applyFilters(statusFilter, true)} className={`rounded-full px-3 py-1 text-xs font-medium ${filterClass(criticalOnly)}`}>仅严重异常</button>
    </div>
  );
}
