import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { readAuditLog } from '@/lib/audit-log';

const pageSize = 30;

function buildHref(action: string, page: number) {
  const params = new URLSearchParams();
  if (action) params.set('action', action);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/admin/audit?${query}` : '/admin/audit';
}

export default async function AdminAuditPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const query = await searchParams;
  const action = typeof query.action === 'string' ? query.action : '';
  const pageRaw = Number(typeof query.page === 'string' ? query.page : '1');
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const logs = await readAuditLog(2000);
  const filtered = action ? logs.filter((row) => row.action.includes(action)) : logs;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const offset = (safePage - 1) * pageSize;
  const rows = filtered.slice(offset, offset + pageSize);

  return (
    <main className="container-shell space-y-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">后台</p>
          <h1 className="text-4xl font-semibold tracking-tight">审计日志</h1>
          <p className="mt-2 max-w-3xl text-stone-600">查询和回看管理员操作、抓取任务、配置更新以及回滚事件。</p>
        </div>
        <Link href="/admin/dashboard#audit-logs" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">返回后台首页</Link>
      </div>
      <div className="card p-6">
        <div className="flex flex-wrap gap-2">
          <Link href={buildHref('', 1)} className={`rounded-full px-3 py-1 text-xs font-medium ${!action ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700'}`}>全部</Link>
          {['admin.cash.refresh', 'admin.cash.rollback', 'admin.config.updated', 'admin.login.success', 'admin.login.failed'].map((item) => (
            <Link key={item} href={buildHref(item, 1)} className={`rounded-full px-3 py-1 text-xs font-medium ${action === item ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-700'}`}>{item}</Link>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                {['时间', '操作者', '动作', '目标', 'IP'].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.at}-${row.action}-${row.actor}`} className="border-t border-stone-100">
                  <td className="px-4 py-3">{new Date(row.at).toLocaleString()}</td>
                  <td className="px-4 py-3">{row.actor}</td>
                  <td className="px-4 py-3">{row.action}</td>
                  <td className="px-4 py-3">{row.target}</td>
                  <td className="px-4 py-3">{row.ip || '-'}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={5} className="px-4 py-6 text-center text-stone-500">当前筛选条件下没有日志。</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
          <span>第 {safePage} 页 / 共 {pageCount} 页</span>
          <div className="flex gap-2">
            <Link href={buildHref(action, Math.max(1, safePage - 1))} className="rounded-full border border-stone-300 px-3 py-1">上一页</Link>
            <Link href={buildHref(action, Math.min(pageCount, safePage + 1))} className="rounded-full border border-stone-300 px-3 py-1">下一页</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
