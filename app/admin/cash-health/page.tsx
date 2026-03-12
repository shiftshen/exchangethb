import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAdminCashHealth } from '@/lib/admin-cash-health';

const pageSize = 10;
const ranges = ['1h', '24h', '7d', 'all'] as const;
const exportFields = ['type', 'provider', 'status', 'trend', 'trendReason', 'alertCount', 'severity', 'reasons', 'currencies', 'observedAt', 'message'] as const;

function statusClass(status: string) {
  if (status === 'healthy') return 'bg-emerald-100 text-emerald-700';
  if (status === 'degraded') return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
}

function trendClass(trend: string) {
  if (trend === 'improving') return 'bg-emerald-100 text-emerald-700';
  if (trend === 'worsening') return 'bg-rose-100 text-rose-700';
  return 'bg-stone-100 text-stone-700';
}

function buildHref(status: string, criticalOnly: boolean, page: number, range: string, fields: string[]) {
  const params = new URLSearchParams();
  if (status !== 'all') params.set('status', status);
  if (criticalOnly) params.set('critical', '1');
  if (range !== 'all') params.set('range', range);
  if (fields.length && fields.length !== exportFields.length) params.set('fields', fields.join(','));
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/admin/cash-health?${query}` : '/admin/cash-health';
}

function parseFields(input?: string) {
  const requested = (input || '').split(',').map((item) => item.trim()).filter(Boolean);
  const allowed = requested.filter((item): item is typeof exportFields[number] => exportFields.includes(item as typeof exportFields[number]));
  if (!allowed.length) return [...exportFields];
  return [...new Set(allowed)];
}

function toggleFields(fields: string[], field: string) {
  if (fields.includes(field)) {
    const next = fields.filter((item) => item !== field);
    return next.length ? next : [...exportFields];
  }
  return [...fields, field];
}

export default async function AdminCashHealthPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const query = await searchParams;
  const statusFilterRaw = typeof query.status === 'string' ? query.status : 'all';
  const statusFilter = ['all', 'healthy', 'degraded', 'down'].includes(statusFilterRaw) ? statusFilterRaw : 'all';
  const criticalOnly = query.critical === '1';
  const rangeRaw = typeof query.range === 'string' ? query.range : 'all';
  const rangeFilter = ranges.includes(rangeRaw as typeof ranges[number]) ? rangeRaw : 'all';
  const fieldsRaw = typeof query.fields === 'string' ? query.fields : '';
  const selectedFields = parseFields(fieldsRaw);
  const pageRaw = Number(typeof query.page === 'string' ? query.page : '1');
  const currentPage = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const data = await getAdminCashHealth({ range: rangeFilter });
  const providerRows = data.providerHealth.filter((item) => statusFilter === 'all' || item.status === statusFilter);
  const alerts = data.alerts.filter((item) => !criticalOnly || item.critical);
  const pageCount = Math.max(1, Math.ceil(alerts.length / pageSize));
  const safePage = Math.min(currentPage, pageCount);
  const offset = (safePage - 1) * pageSize;
  const pagedAlerts = alerts.slice(offset, offset + pageSize);
  const exportHref = `/api/admin/cash-health/export${buildHref(statusFilter, criticalOnly, 1, rangeFilter, selectedFields).replace('/admin/cash-health', '')}`;

  return (
    <main className="container-shell space-y-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">后台</p>
          <h1 className="text-4xl font-semibold tracking-tight">现金数据健康中心</h1>
          <p className="max-w-3xl text-stone-600">查看换汇 provider 的健康分级、缓存新鲜度、同步备注和真实异常，并支持筛选与导出。</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/dashboard" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">返回后台首页</Link>
          <Link href="/admin/dashboard#audit-logs" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">查看审计日志</Link>
          <Link href={exportHref} className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white">导出 CSV</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-stone-500">已跟踪 provider</p><p className="mt-2 text-2xl font-semibold">{data.providerHealth.length}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">当前异常数</p><p className="mt-2 text-2xl font-semibold">{alerts.length}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">同步备注数</p><p className="mt-2 text-2xl font-semibold">{data.infoNotes.length}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">缓存新鲜度</p><p className="mt-2 text-2xl font-semibold">{data.anyCacheStale ? '已过期' : '新鲜'}</p><p className="mt-1 text-xs text-stone-500">更新时间 {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : '-'}</p></div>
        <div className="card p-5"><p className="text-sm text-stone-500">恶化信号</p><p className="mt-2 text-2xl font-semibold">{providerRows.filter((row) => row.trend === 'worsening').length} 个</p></div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">Provider 健康状态</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ranges.map((range) => (
            <Link key={range} href={buildHref(statusFilter, criticalOnly, 1, range, selectedFields)} className={`rounded-full px-3 py-1 text-xs font-medium ${rangeFilter === range ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {range}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['all', 'healthy', 'degraded', 'down'].map((status) => (
            <Link key={status} href={buildHref(status, criticalOnly, 1, rangeFilter, selectedFields)} className={`rounded-full px-3 py-1 text-xs font-medium ${statusFilter === status ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {status === 'all' ? '全部' : status === 'healthy' ? '正常' : status === 'degraded' ? '降级' : '故障'}
            </Link>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {providerRows.map((row) => (
            <div key={row.providerSlug} className="rounded-xl border border-stone-200 px-4 py-3 text-sm">
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(row.status)}`}>{row.status === 'healthy' ? '正常' : row.status === 'degraded' ? '降级' : '故障'}</span>
              <span className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${trendClass(row.trend)}`}>{row.trend === 'improving' ? '改善中' : row.trend === 'worsening' ? '恶化中' : '稳定'}</span>
              <span className="ml-2 font-semibold">{row.providerSlug}</span>
              <span className="ml-2 text-stone-600">原因: {row.reasons.join(', ')}</span>
              <span className="ml-2 text-stone-600">趋势原因: {row.trendReason}</span>
              <span className="ml-2 text-stone-600">异常数: {row.alertCount}</span>
              <span className="ml-2 text-stone-600">币种: {row.currencies.join(', ')}</span>
              <span className="ml-2 text-stone-600">观测时间: {row.observedAt ? new Date(row.observedAt).toLocaleString() : '-'}</span>
            </div>
          ))}
          {!providerRows.length ? <div className="rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-500">当前筛选条件下没有 provider。</div> : null}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold">同步备注</h2>
        <p className="mt-2 text-sm text-stone-600">这些是正常同步说明，不代表失败。主要用于展示抓到了多少数据，以及某个 provider 为什么被标成 hybrid。</p>
        <div className="mt-4 space-y-2">
          {data.infoNotes.map((note, index) => (
            <div key={`${note.provider}-${index}`} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
              <span className="font-semibold">{note.provider}</span> · {note.message}
              <span className="ml-2 text-xs opacity-80">{note.observedAt ? new Date(note.observedAt).toLocaleString() : '-'}</span>
            </div>
          ))}
          {!data.infoNotes.length ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">当前筛选下没有同步备注。</div> : null}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">抓取异常</h2>
          <div className="flex gap-2">
            <Link href={buildHref(statusFilter, false, 1, rangeFilter, selectedFields)} className={`rounded-full px-3 py-1 text-xs font-medium ${!criticalOnly ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700'}`}>全部异常</Link>
            <Link href={buildHref(statusFilter, true, 1, rangeFilter, selectedFields)} className={`rounded-full px-3 py-1 text-xs font-medium ${criticalOnly ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700'}`}>仅严重异常</Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {exportFields.map((field) => (
            <Link key={field} href={buildHref(statusFilter, criticalOnly, 1, rangeFilter, toggleFields(selectedFields, field))} className={`rounded-full px-3 py-1 text-xs font-medium ${selectedFields.includes(field) ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {field}
            </Link>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {pagedAlerts.map((alert, index) => (
            <div key={`${alert.provider}-${offset + index}`} className={`rounded-xl border px-4 py-3 text-sm ${alert.critical ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              <span className="font-semibold">{alert.provider}</span> · {alert.message}
              <span className="ml-2 text-xs opacity-80">{alert.observedAt ? new Date(alert.observedAt).toLocaleString() : '-'}</span>
            </div>
          ))}
          {!pagedAlerts.length ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">当前筛选下没有异常。</div> : null}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
          <span>第 {safePage} 页 / 共 {pageCount} 页</span>
          <div className="flex gap-2">
            <Link href={buildHref(statusFilter, criticalOnly, Math.max(1, safePage - 1), rangeFilter, selectedFields)} className="rounded-full border border-stone-300 px-3 py-1">上一页</Link>
            <Link href={buildHref(statusFilter, criticalOnly, Math.min(pageCount, safePage + 1), rangeFilter, selectedFields)} className="rounded-full border border-stone-300 px-3 py-1">下一页</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
