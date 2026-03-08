import crypto from 'crypto';
import { cookies } from 'next/headers';

const cookieName = 'exchangethb_admin_session';

function secret() {
  return process.env.ADMIN_SESSION_SECRET || 'dev-session-secret-change-me';
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createSession(email: string) {
  const payload = `${email}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token?: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 3) return null;
  const signature = parts.pop() as string;
  const payload = parts.join('.');
  const expected = sign(payload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const [email] = payload.split('.');
  return email;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(cookieName)?.value);
}

export const adminCookieName = cookieName;
