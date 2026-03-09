import crypto from 'crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { createSession, verifyAdminPassword, verifySession } from '@/lib/auth';

afterEach(() => {
  delete process.env.ADMIN_PASSWORD_HASH;
  delete process.env.ADMIN_PASSWORD;
});

describe('admin session auth', () => {
  it('creates and verifies session token', () => {
    const token = createSession('admin@exchangethb.com');
    expect(verifySession(token)).toBe('admin@exchangethb.com');
  });

  it('rejects invalid session token', () => {
    expect(verifySession('invalid.token')).toBeNull();
  });

  it('verifies scrypt password hash when provided', () => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('secret-123', Buffer.from(salt, 'hex'), 64).toString('hex');
    process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt}:${hash}`;
    expect(verifyAdminPassword('secret-123')).toBe(true);
    expect(verifyAdminPassword('wrong')).toBe(false);
  });
});
