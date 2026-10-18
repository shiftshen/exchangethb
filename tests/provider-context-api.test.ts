import { beforeEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/providers/[kind]/[slug]/route';
import { cashLicenseLookup, licenseLookup } from '@/lib/provider-evidence';
import { getGooglePlace } from '@/lib/google-places';
import { readAdminConfig } from '@/lib/content-store';

vi.mock('@/lib/content-store', () => ({ readAdminConfig: vi.fn(async () => ({ branchOverrides: {}, evidence: {} })) }));
vi.mock('@/lib/google-places', () => ({ getGooglePlace: vi.fn(async () => ({ status: 'limited' })) }));
vi.mock('@/lib/prisma', () => ({ getPrismaClient: vi.fn(() => null) }));
beforeEach(() => vi.clearAllMocks());

it('shows unverified cash licensing independently of exhausted Google reviews', async () => {
  const response = await GET(new NextRequest('http://localhost/api/providers/cash/superrich-thailand?branch=sr-th-pratunam'), { params: Promise.resolve({ kind: 'cash', slug: 'superrich-thailand' }) });
  const payload = await response.json();
  expect(payload.data.evidence).toEqual([{ key: 'license', state: 'unknown', sourceUrl: cashLicenseLookup, checkedAt: null, expiresAt: null, note: '' }]);
  expect(payload.data.google.status).toBe('limited');
  expect(response.headers.get('cache-control')).toBe('private, no-store');
});

it.each(['sia', 'vasu'])('rejects removed provider %s before reading private configuration or calling Google', async slug => {
  const response = await GET(new NextRequest(`http://localhost/api/providers/cash/${slug}`), { params: Promise.resolve({ kind: 'cash', slug }) });
  expect(response.status).toBe(404);
  expect(readAdminConfig).not.toHaveBeenCalled();
  expect(getGooglePlace).not.toHaveBeenCalled();
});

it('keeps exchange licensing separate from money changer licensing', async () => {
  const response = await GET(new NextRequest('http://localhost/api/providers/crypto/bitkub'), { params: Promise.resolve({ kind: 'crypto', slug: 'bitkub' }) });
  const payload = await response.json();
  expect(payload.data.evidence.find((row: { key: string }) => row.key === 'license').sourceUrl).toBe(licenseLookup);
  expect(payload.data.google).toBeNull();
});

it('rejects unknown providers without inventing a licensed business', async () => {
  const response = await GET(new NextRequest('http://localhost/api/providers/cash/unknown'), { params: Promise.resolve({ kind: 'cash', slug: 'unknown' }) });
  expect(response.status).toBe(404);
});
