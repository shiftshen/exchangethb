import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cashBranches } from '@/data/site';
import { getAdminSession } from '@/lib/auth';
import { readAdminConfig } from '@/lib/content-store';
import { BranchManagerEditor } from '@/components/admin/branch-manager-editor';

export default async function AdminBranchManagerPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const config = await readAdminConfig();

  return (
    <main className="container-shell space-y-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">后台</p>
          <h1 className="text-4xl font-semibold tracking-tight">门店管理</h1>
          <p className="mt-2 max-w-3xl text-stone-600">维护换汇品牌门店的名称、地址、营业时间、地图链接和前台可见性。</p>
        </div>
        <Link href="/admin/dashboard" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium">返回后台首页</Link>
      </div>
      <div className="card p-6">
        <BranchManagerEditor initialConfig={config} branches={cashBranches.map((branch) => ({ id: branch.id, providerSlug: branch.providerSlug, name: branch.name, address: branch.address, hours: branch.hours, mapsUrl: branch.mapsUrl }))} />
      </div>
    </main>
  );
}
