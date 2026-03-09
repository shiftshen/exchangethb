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
  const payload = Buffer.from(JSON.stringify({ email, ts: Date.now() }), 'utf8').toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token?: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const signature = parts.pop() as string;
  const payload = parts.join('.');
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: string };
    return typeof decoded.email === 'string' ? decoded.email : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(cookieName)?.value);
}

export const adminCookieName = cookieName;

function safeEqualText(input: string, expected: string) {
  if (input.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(expected));
}

function verifyScryptHash(password: string, encodedHash: string) {
  if (!encodedHash.startsWith('scrypt:')) return false;
  const [, saltHex, keyHex] = encodedHash.split(':');
  if (!saltHex || !keyHex) return false;
  const derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64).toString('hex');
  return safeEqualText(derived, keyHex);
}

export function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash && verifyScryptHash(password, hash)) return true;
  const fallback = process.env.ADMIN_PASSWORD;
  if (!fallback) return false;
  return safeEqualText(password, fallback);
}
