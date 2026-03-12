import Link from 'next/link';
import { redirect } from 'next/navigation';
import { readAuditLog } from '@/lib/audit-log';
import { getAdminSession } from '@/lib/auth';
import { readCashCache } from '@/lib/cash-cache-store';
import { readAdminConfig } from '@/lib/content-store';
import { getAdapterHealth } from '@/lib/market-data';
import { compareCashLive } from '@/lib/cash-live';
import { ConfigEditor } from '@/components/admin/config-editor';
import { AlertScopeFilters, DashboardFilterBootstrap, HealthStatusFilters } from '@/components/admin/dashboard-filters';

const modules = [
  { title: '数据源监控', body: '查看交易所 API、抓取新鲜度、失败情况和告警状态。', href: '/admin/cash-health' },
  { title: '规则与费用', body: '编辑交易手续费、THB 提现费、网络费和披露说明。', href: '/admin/dashboard' },
  { title: '跳转链接', body: '维护官网链接、统计链接、活动时间和前台按钮说明。', href: '/admin/exchange-profiles' },
  { title: '交易所资料', body: '维护推荐状态、风险提示和交易所展示元数据。', href: '/admin/exchange-profiles' },
  { title: '门店管理', body: '维护门店、营业时间、坐标、展示状态和地图链接。', href: '/admin/branch-manager' },
  { title: '抓取审核', body: '隐藏异常、保留最后一次有效汇率、恢复人工审核值。', href: '/admin/scrape-review' },
  { title: 'SEO 与法务', body: '维护路由页、FAQ、方法论、免责声明和隐私政策。', href: '/admin/dashboard' },
  { title: '审计日志', body: '查看后台修改记录、点击事件和运行备注。', href: '/admin/audit' },
];

async function getCachePreview() {
  try {
    return JSON.stringify(await readCashCache(), null, 2);
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
    compareCashLive({ currency: 'USD', amount: 1000, maxDistanceKm: 100, includeUnstableProviders: true }),
  ]);
  const cacheJson = (() => {
    try {
      return JSON.parse(cachePreview) as { generatedAt?: string; results?: Array<{ provider?: string; ok?: boolean; notes?: string[]; observedAt?: string }> };
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
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">后台首页</p>
          <h1 className="text-4xl font-semibold tracking-tight">运营管理面板</h1>
          <p className="max-w-3xl text-stone-600">当前登录账号：{session}。这里可以查看实时数据源状态、后台配置、抓取缓存和审计日志。</p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">退出登录</button>
        </form>
      </div>

      <div className="card flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-stone-500">现金汇率健康监控</p>
          <p className="mt-1 text-sm text-stone-600">打开专门页面查看 provider 分级、分页告警和 CSV 导出。</p>
        </div>
        <Link href="/admin/cash-health" className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white">打开模块</Link>
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

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Data source monitor</h2>
        <p className="mt-2 text-sm text-stone-600">Last success time, error count, and alert state for cash providers.</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                {['Provider', 'Status', 'Last success', 'Error count', 'Alert state'].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {(cacheJson.results || []).map((item, index) => {
                const errors = item.ok ? 0 : Math.max(1, (item.notes || []).length);
                const state = item.ok ? 'normal' : 'alert';
                return (
                  <tr key={`${item.provider || 'unknown'}-${index}`} className="border-t border-stone-100">
                    <td className="px-4 py-3">{item.provider || 'unknown'}</td>
                    <td className="px-4 py-3">{item.ok ? 'ok' : 'failed'}</td>
                    <td className="px-4 py-3">{item.observedAt ? new Date(item.observedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3">{errors}</td>
                    <td className="px-4 py-3">{state}</td>
                  </tr>
                );
              })}
              {!(cacheJson.results || []).length ? <tr><td colSpan={5} className="px-4 py-6 text-center text-stone-500">No monitor records yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((item) => (
          <div key={item.title} className="card p-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm text-stone-600">{item.body}</p>
            <Link href={item.href} className="mt-4 inline-flex rounded-full border border-stone-300 px-3 py-1 text-sm font-medium">Open</Link>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Admin configuration</h2>
        <p className="mt-2 text-sm text-stone-600">Edit outbound link policy, fee overrides, scraper review mode, and cash refresh controls from one place.</p>
        <div className="mt-6">
          <ConfigEditor initialConfig={config} initialCachePreview={cachePreview} />
        </div>
      </div>

      <div id="audit-logs" className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Recent audit logs</h2>
          <Link href="/admin/audit" className="rounded-full border border-stone-300 px-3 py-1 text-sm font-medium">Open full logs</Link>
        </div>
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
