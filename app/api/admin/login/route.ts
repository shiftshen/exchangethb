import { NextRequest, NextResponse } from 'next/server';
import { appendAuditLog } from '@/lib/audit-log';
import { adminCookieName, createSession, verifyAdminPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;

  const validEmail = process.env.ADMIN_EMAIL || 'admin@exchangethb.com';
  const passwordOk = verifyAdminPassword(password);

  if (email !== validEmail || !passwordOk) {
    await appendAuditLog({ actor: email || 'unknown', action: 'admin.login.failed', target: 'admin.auth', ip, note: 'Invalid credentials' });
    return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url));
  }

  const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
  response.cookies.set(adminCookieName, createSession(email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  await appendAuditLog({ actor: email, action: 'admin.login.success', target: 'admin.auth', ip });
  return response;
}
