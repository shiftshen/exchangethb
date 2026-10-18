import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

// SEO-30: the SIA profile was taken offline by the owner on 2026-10-02 and the URL
// now permanently redirects to the cash comparison of the SAME language.
describe('SIA profile redirect', () => {
  for (const locale of ['en', 'th', 'zh', 'ja', 'ru']) {
    it(`301s /${locale}/money-changers/sia to /${locale}/cash`, () => {
      const response = middleware(new NextRequest(`https://www.exchangethb.com/${locale}/money-changers/sia`));
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe(`https://www.exchangethb.com/${locale}/cash`);
    });
  }

  it('keeps the remaining public money changer profiles untouched', () => {
    const response = middleware(new NextRequest('https://www.exchangethb.com/en/money-changers/ratchada'));
    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('does not create a same-language cash target for an unknown provider', () => {
    const response = middleware(new NextRequest('https://www.exchangethb.com/en/money-changers/not-a-provider'));
    expect(response.status).toBe(200);
  });
});
