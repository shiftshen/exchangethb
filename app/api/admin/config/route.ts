import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readAdminConfig, writeAdminConfig } from '@/lib/content-store';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ data: await readAdminConfig() });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json();
  await writeAdminConfig(body);
  return NextResponse.json({ ok: true });
}
