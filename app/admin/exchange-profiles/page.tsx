import Link from 'next/link';
import { redirect } from 'next/navigation';
import { exchanges } from '@/data/site';
import { getAdminSession } from '@/lib/auth';
import { readAdminConfig } from '@/lib/content-store';
import { ExchangeProfilesEditor } from '@/components/admin/exchange-profiles-editor';

export default async function AdminExchangeProfilesPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const config = await readAdminConfig();

  return (
    <main className="container-shell space-y-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">后台</p>
          <h1 className="text-4xl font-semibold tracking-tight">交易所资料与跳转链接</h1>
          <p className="mt-2 max-w-3xl text-stone-600">这里用来维护每家交易所的推荐状态、风险提示、官网链接、统计跳转链接、活动时间，以及中英泰按钮说明文案。</p>
        </div>
        <Link href="/admin/dashboard" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">返回后台首页</Link>
      </div>
      <div className="card p-6">
        <ExchangeProfilesEditor initialConfig={config} exchangeSlugs={exchanges.map((exchange) => exchange.slug)} />
      </div>
    </main>
  );
}
