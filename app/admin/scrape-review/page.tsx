import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cashProviders } from '@/data/site';
import { getAdminSession } from '@/lib/auth';
import { getAdminCashHealth } from '@/lib/admin-cash-health';
import { readAdminConfig } from '@/lib/content-store';
import { ScrapeReviewEditor } from '@/components/admin/scrape-review-editor';

export default async function AdminScrapeReviewPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const [config, health] = await Promise.all([readAdminConfig(), getAdminCashHealth({ range: '7d' })]);

  return (
    <main className="container-shell space-y-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">后台</p>
          <h1 className="text-4xl font-semibold tracking-tight">抓取审核</h1>
          <p className="mt-2 max-w-3xl text-stone-600">审核抓取异常、强制切换 provider 模式，并维护人工审核备注，用于运营兜底控制。</p>
        </div>
        <Link href="/admin/dashboard" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">返回后台首页</Link>
      </div>
      <div className="card p-6">
        <ScrapeReviewEditor initialConfig={config} providers={cashProviders.map((provider) => provider.slug)} alerts={health.alerts.slice(0, 60)} />
      </div>
    </main>
  );
}
