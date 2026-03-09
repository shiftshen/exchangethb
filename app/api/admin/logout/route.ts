import { NextRequest, NextResponse } from 'next/server';
import { appendAuditLog } from '@/lib/audit-log';
import { adminCookieName, getAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
  if (session) {
    await appendAuditLog({ actor: session, action: 'admin.logout', target: 'admin.auth', ip });
  }
  const response = NextResponse.redirect(new URL('/admin/login', request.url));
  response.cookies.set(adminCookieName, '', { path: '/', maxAge: 0 });
  return response;
}
