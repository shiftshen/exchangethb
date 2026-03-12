import crypto from 'crypto';
import { vi } from 'vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { createSession, verifyAdminPassword, verifySession } from '@/lib/auth';

afterEach(() => {
  delete process.env.ADMIN_PASSWORD_HASH;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_SESSION_SECRET;
  Object.assign(process.env, { NODE_ENV: 'test' });
  vi.useRealTimers();
});

describe('admin session auth', () => {
  it('creates and verifies session token', () => {
    const token = createSession('admin@exchangethb.com');
    expect(verifySession(token)).toBe('admin@exchangethb.com');
  });

  it('rejects invalid session token', () => {
    expect(verifySession('invalid.token')).toBeNull();
  });

  it('rejects expired session token', () => {
    const base = new Date('2026-03-10T00:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(base);
    const token = createSession('admin@exchangethb.com');
    vi.setSystemTime(new Date(base.getTime() + 1000 * 60 * 60 * 9));
    expect(verifySession(token)).toBeNull();
  });

  it('verifies scrypt password hash when provided', () => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('secret-123', Buffer.from(salt, 'hex'), 64).toString('hex');
    process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt}:${hash}`;
    expect(verifyAdminPassword('secret-123')).toBe(true);
    expect(verifyAdminPassword('wrong')).toBe(false);
  });

  it('rejects placeholder credentials in production mode', () => {
    Object.assign(process.env, { NODE_ENV: 'production' });
    process.env.ADMIN_EMAIL = 'admin@exchangethb.com';
    process.env.ADMIN_PASSWORD = 'replace_with_strong_password';
    process.env.ADMIN_PASSWORD_HASH = 'scrypt_replace_with_salt_and_hash';
    process.env.ADMIN_SESSION_SECRET = 'replace_with_long_random_secret';
    expect(verifyAdminPassword('replace_with_strong_password')).toBe(false);
  });
});
