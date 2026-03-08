import { NextRequest, NextResponse } from 'next/server';
import { adminCookieName, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const validEmail = process.env.ADMIN_EMAIL || 'admin@exchangethb.com';
  const validPassword = process.env.ADMIN_PASSWORD || 'changeme';

  if (email !== validEmail || password !== validPassword) {
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
  return response;
}
