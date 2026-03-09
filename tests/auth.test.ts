import { describe, expect, it } from 'vitest';
import { createSession, verifySession } from '@/lib/auth';

describe('admin session auth', () => {
  it('creates and verifies session token', () => {
    const token = createSession('admin@exchangethb.com');
    expect(verifySession(token)).toBe('admin@exchangethb.com');
  });

  it('rejects invalid session token', () => {
    expect(verifySession('invalid.token')).toBeNull();
  });
});
