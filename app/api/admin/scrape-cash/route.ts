import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { refreshCashScrapeCache } from '@/lib/cash-live';

export async function POST() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const data = await refreshCashScrapeCache();
  return NextResponse.json({ ok: true, data });
}
