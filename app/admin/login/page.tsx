export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const invalid = params.error === 'invalid';

  return (
    <main className="container-shell flex min-h-[80vh] items-center justify-center py-20">
      <div className="card w-full max-w-md p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold">ExchangeTHB control room</h1>
        <p className="mt-3 text-stone-600">Single-admin email + password flow for `admin@exchangethb.com` with protected dashboard access.</p>
        <form action="/api/admin/login" method="post" className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-stone-500">Email</label>
            <input name="email" defaultValue="admin@exchangethb.com" className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>
          <div>
            <label className="text-sm text-stone-500">Password</label>
            <input name="password" type="password" placeholder="Enter password" className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>
          {invalid ? <p className="text-sm text-red-600">Invalid admin credentials.</p> : null}
          <button className="block w-full rounded-full bg-brand-700 px-5 py-3 text-center font-medium text-white">Enter dashboard</button>
        </form>
      </div>
    </main>
  );
}
