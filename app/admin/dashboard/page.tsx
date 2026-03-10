import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';
import { readAuditLog } from '@/lib/audit-log';
import { getAdminSession } from '@/lib/auth';
import { readAdminConfig } from '@/lib/content-store';
import { getAdapterHealth } from '@/lib/market-data';
import { compareCashLive } from '@/lib/cash-live';
import { ConfigEditor } from '@/components/admin/config-editor';
import { AlertScopeFilters, DashboardFilterBootstrap, HealthStatusFilters } from '@/components/admin/dashboard-filters';

const modules = [
  ['Data source monitor', 'Track exchange APIs, scraper freshness, failures, and alert state.'],
  ['Rules and fees', 'Edit trading fees, THB withdrawals, network fees, and disclosure notes.'],
  ['Affiliate links', 'Manage official, campaign, and reward-available states with validity windows.'],
  ['Exchange scores', 'Update editorial scoring dimensions, tags, and recommendation status.'],
  ['Branch manager', 'Maintain branches, hours, coordinates, display state, and Maps links.'],
  ['Scrape review', 'Hide anomalies, keep last valid rates, and recover reviewed values.'],
  ['SEO and legal', 'Publish route pages, FAQs, methodology, disclaimer, and privacy updates.'],
  ['Audit log', 'Review admin changes, click events, and operational notes.'],
];

async function getCachePreview() {
  try {
    return await fs.readFile(path.join(process.cwd(), 'content', 'cash-scrape-cache.json'), 'utf8');
  } catch {
    return '{}';
  }
}

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const query = await searchParams;
  const [config, health, cachePreview, auditLogs, cashCompare] = await Promise.all([
    readAdminConfig(),
    getAdapterHealth(),
    getCachePreview(),
    readAuditLog(12),
    compareCashLive({ currency: 'USD', amount: 1000, maxDistanceKm: 100 }),
  ]);
  const cacheJson = (() => {
    try {
      return JSON.parse(cachePreview) as { generatedAt?: string; results?: Array<{ provider?: string; ok?: boolean; notes?: string[] }> };
    } catch {
      return { generatedAt: null, results: [] };
    }
  })();
  const cashAlerts = (cacheJson.results || []).flatMap((item) => {
    const notes = item.notes || [];
    if (!notes.length) {
      return item.ok === false ? [{ provider: item.provider || 'unknown', message: 'scrape_failed_without_notes', critical: true }] : [];
    }
    return notes.map((note) => ({ provider: item.provider || 'unknown', message: note, critical: item.ok === false }));
  }).slice(0, 12);
  const statusClass = (status: string) => {
    if (status === 'healthy') return 'bg-emerald-100 text-emerald-700';
    if (status === 'degraded') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };
  const statusFilterRaw = typeof query.status === 'string' ? query.status : 'all';
  const statusFilter = ['all', 'healthy', 'degraded', 'down'].includes(statusFilterRaw) ? statusFilterRaw : 'all';
  const criticalOnly = query.critical === '1';
  const filteredProviderHealth = cashCompare.quality.providerHealth.filter((item) => statusFilter === 'all' || item.status === statusFilter);
  const filteredAlerts = cashAlerts.filter((alert) => !criticalOnly || alert.critical);

  return (
    <main className="container-shell space-y-8 py-10">
      <DashboardFilterBootstrap statusFilter={statusFilter} criticalOnly={criticalOnly} />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight">Admin operations shell</h1>
          <p className="max-w-3xl text-stone-600">Signed in as {session}. This dashboard now reads live adapter health, fee overrides, and cash scrape cache.</p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">Log out</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="card p-5"><p className="text-sm text-stone-500">Binance adapter</p><p className="mt-2 text-2xl font-semibold">{health.binance ? 'Live' : 'Fallback'}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">Bitkub adapter</p><p className="mt-2 text-2xl font-semibold">{health.bitkub ? 'Live' : 'Fallback'}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">Upbit Thailand adapter</p><p className="mt-2 text-2xl font-semibold">{health.upbitThailand ? 'Live' : 'Fallback'}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">Orbix adapter</p><p className="mt-2 text-2xl font-semibold">{health.orbix ? 'Live' : 'Fallback'}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">Fallback-only state</p><p className="mt-2 text-2xl font-semibold">{health.fallbackOnly ? 'Yes' : 'No'}</p></div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Cash provider health</h2>
        <p className="mt-2 text-sm text-stone-600">Provider grading from compare pipeline: healthy/degraded/down with reason code.</p>
        <HealthStatusFilters statusFilter={statusFilter} criticalOnly={criticalOnly} />
        <div className="mt-4 flex flex-wrap gap-2">
          {filteredProviderHealth.map((item) => (
            <span key={item.providerSlug} className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(item.status)}`}>
              {item.providerSlug}: {item.status} ({item.reason})
            </span>
          ))}
          {!filteredProviderHealth.length ? <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">No providers in this filter.</span> : null}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Cash scrape alerts</h2>
        <p className="mt-2 text-sm text-stone-600">Latest notes from cached scraper results. Use this for degraded/down triage.</p>
        <AlertScopeFilters statusFilter={statusFilter} criticalOnly={criticalOnly} />
        <div className="mt-4 space-y-2">
          {filteredAlerts.map((alert, index) => (
            <div key={`${alert.provider}-${index}`} className={`rounded-xl border px-4 py-3 text-sm ${alert.critical ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              <span className="font-semibold">{alert.provider}</span> · {alert.message}
            </div>
          ))}
          {!filteredAlerts.length ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">No active cash scrape alerts.</div> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map(([title, body]) => (
          <div key={title} className="card p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 text-sm text-stone-600">{body}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Admin configuration</h2>
        <p className="mt-2 text-sm text-stone-600">Edit outbound link policy, trading fee overrides, and refresh cash scrapers from one place.</p>
        <div className="mt-6">
          <ConfigEditor initialConfig={config} initialCachePreview={cachePreview} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Recent audit logs</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                {['Time', 'Actor', 'Action', 'Target', 'IP'].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((row) => (
                <tr key={`${row.at}-${row.action}-${row.actor}`} className="border-t border-stone-100">
                  <td className="px-4 py-3">{new Date(row.at).toLocaleString()}</td>
                  <td className="px-4 py-3">{row.actor}</td>
                  <td className="px-4 py-3">{row.action}</td>
                  <td className="px-4 py-3">{row.target}</td>
                  <td className="px-4 py-3">{row.ip || '-'}</td>
                </tr>
              ))}
              {!auditLogs.length ? <tr><td colSpan={5} className="px-4 py-6 text-center text-stone-500">No audit records yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
