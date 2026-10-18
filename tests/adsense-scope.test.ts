import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('AdSense public page scope', () => {
  it('allows the public comparison route and overwrites a caller supplied scope', () => {
    const response = middleware(new NextRequest('https://www.exchangethb.com/zh/cash', {headers:{'x-public-adsense':'0'}}));
    expect(response.headers.get('x-middleware-request-x-public-adsense')).toBe('1');
  });
  it('keeps administrative pages outside AdSense even with a spoofed scope header', () => {
    const response = middleware(new NextRequest('https://www.exchangethb.com/admin/login', {headers:{'x-public-adsense':'1'}}));
    expect(response.headers.get('x-middleware-request-x-public-adsense')).toBe('0');
  });
});
