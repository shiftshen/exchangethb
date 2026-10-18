import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/compare/cash/route';
import { compareCashLive } from '@/lib/cash-live';
vi.mock('@/lib/cash-live', () => ({ compareCashLive: vi.fn().mockResolvedValue({ all: [] }) }));
describe('cash API sorting intent', () => {
  beforeEach(() => vi.clearAllMocks());
  it.each([['false', false], ['true', true]])('parses %s as a boolean', async (value, expected) => {
    const response = await GET(new NextRequest(`http://localhost/api/compare/cash?prioritizeNearest=${value}`));
    expect(response.status).toBe(200);
    expect(compareCashLive).toHaveBeenCalledWith(expect.objectContaining({ prioritizeNearest: expected }));
  });
  it('rejects invalid sort values instead of turning them on', async () => {
    expect((await GET(new NextRequest('http://localhost/api/compare/cash?prioritizeNearest=maybe'))).status).toBe(400);
    expect(compareCashLive).not.toHaveBeenCalled();
  });
});
