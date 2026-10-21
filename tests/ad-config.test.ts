import { afterEach, describe, expect, it } from 'vitest';
import { adZoneFor, networkEnabled } from '@/lib/ad-config';

const KEYS = ['NEXT_COINZILLA_ZONE_HOME', 'NEXT_COINZILLA_ZONE_CASH'] as const;

afterEach(() => {
  for (const key of KEYS) delete process.env[key];
});

describe('runtime ad configuration', () => {
  it('returns null for every slot when nothing is configured', () => {
    expect(adZoneFor('coinzilla', 'home')).toBeNull();
    expect(networkEnabled('coinzilla')).toBe(false);
    expect(networkEnabled('cointraffic')).toBe(false);
  });

  it('exposes a configured zone and enables the network script', () => {
    process.env.NEXT_COINZILLA_ZONE_HOME = 'abcd1234';
    expect(adZoneFor('coinzilla', 'home')).toEqual({ network: 'coinzilla', slot: 'home', zoneId: 'abcd1234' });
    expect(networkEnabled('coinzilla')).toBe(true);
    expect(networkEnabled('cointraffic')).toBe(false);
  });

  it('rejects unsafe or malformed zone ids so a typo cannot inject markup', () => {
    process.env.NEXT_COINZILLA_ZONE_HOME = '<script>alert(1)</script>';
    expect(adZoneFor('coinzilla', 'home')).toBeNull();
    process.env.NEXT_COINZILLA_ZONE_HOME = 'ab';
    expect(adZoneFor('coinzilla', 'home')).toBeNull();
  });
});
