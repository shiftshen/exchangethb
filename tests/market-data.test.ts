import { describe, expect, it } from 'vitest';
import { describeMarketSource } from '@/lib/market-data';

describe('market source description', () => {
  it('returns live label for live snapshots', () => {
    const source = describeMarketSource({
      exchange: 'bitkub',
      symbol: 'BTC',
      asks: [{ price: 1, quantity: 1 }],
      bids: [{ price: 1, quantity: 1 }],
      lastUpdated: new Date().toISOString(),
      source: 'live',
    });
    expect(source.live).toBe(true);
    expect(source.label).toContain('Official API');
    expect(source.fallbackReason).toBeNull();
  });

  it('returns fallback reason for fallback snapshots', () => {
    const source = describeMarketSource({
      exchange: 'orbix',
      symbol: 'BTC',
      asks: [{ price: 1, quantity: 1 }],
      bids: [{ price: 1, quantity: 1 }],
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      fallbackReason: 'Network timeout',
    });
    expect(source.live).toBe(false);
    expect(source.fallbackReason).toBe('Network timeout');
  });
});
