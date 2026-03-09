import { describe, expect, it } from 'vitest';
import { resolveAffiliateLink } from '@/lib/affiliate';

describe('affiliate resolver', () => {
  it('downgrades campaign link when tracking url is missing', () => {
    const resolved = resolveAffiliateLink({
      status: 'campaign_only',
      officialUrl: 'https://official.example.com',
      trackingUrl: '',
      disclosure: { th: 'x', en: 'x', zh: 'x' },
    });
    expect(resolved.effectiveStatus).toBe('official_only');
    expect(resolved.outboundUrl).toBe('https://official.example.com');
    expect(resolved.downgraded).toBe(true);
  });

  it('keeps reward status during active campaign window', () => {
    const resolved = resolveAffiliateLink({
      status: 'reward_available',
      officialUrl: 'https://official.example.com',
      trackingUrl: 'https://tracking.example.com',
      startAt: '2026-03-01T00:00:00.000Z',
      endAt: '2026-03-30T00:00:00.000Z',
      disclosure: { th: 'x', en: 'x', zh: 'x' },
    }, new Date('2026-03-10T00:00:00.000Z'));
    expect(resolved.effectiveStatus).toBe('reward_available');
    expect(resolved.outboundUrl).toBe('https://tracking.example.com');
    expect(resolved.downgraded).toBe(false);
  });
});
