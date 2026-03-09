import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';
import { readAuditLog } from '@/lib/audit-log';
import { getAdminSession } from '@/lib/auth';
import { readAdminConfig } from '@/lib/content-store';
import { getAdapterHealth } from '@/lib/market-data';
import { ConfigEditor } from '@/components/admin/config-editor';

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

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const [config, health, cachePreview, auditLogs] = await Promise.all([readAdminConfig(), getAdapterHealth(), getCachePreview(), readAuditLog(12)]);

  return (
    <main className="container-shell space-y-8 py-10">
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
