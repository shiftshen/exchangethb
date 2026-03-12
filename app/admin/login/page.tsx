export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const invalid = params.error === 'invalid';
  const adminEmail = process.env.ADMIN_EMAIL || 'Shift';

  return (
    <main className="container-shell flex min-h-[80vh] items-center justify-center py-20">
      <div className="card w-full max-w-md p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">后台</p>
        <h1 className="mt-3 text-3xl font-semibold">ExchangeTHB 管理后台</h1>
        <p className="mt-3 text-stone-600">使用管理员账号和密码登录。当前本地管理员账号是 `{adminEmail}`。</p>
        <form action="/api/admin/login" method="post" className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-stone-500">管理员账号</label>
            <input name="email" defaultValue={adminEmail} className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>
          <div>
            <label className="text-sm text-stone-500">密码</label>
            <input name="password" type="password" placeholder="输入管理员密码" className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>
          {invalid ? <p className="text-sm text-red-600">管理员账号或密码错误。</p> : null}
          <button className="block w-full rounded-full bg-brand-700 px-5 py-3 text-center font-medium text-white">进入后台</button>
        </form>
      </div>
    </main>
  );
}
