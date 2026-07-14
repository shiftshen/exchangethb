import { describe, expect, it } from 'vitest';
import { getBangkokOpenState } from '@/lib/opening-hours';

describe('getBangkokOpenState', () => {
  it('handles daily hours in Bangkok time', () => {
    expect(getBangkokOpenState('Open daily 09:00-20:30', new Date('2026-07-14T05:00:00Z'))).toBe(true);
    expect(getBangkokOpenState('Open daily 09:00-20:30', new Date('2026-07-14T15:00:00Z'))).toBe(false);
  });

  it('closes Monday-Saturday branches on Sunday', () => {
    expect(getBangkokOpenState('Mon-Sat 09:00-18:00, Sun closed', new Date('2026-07-12T05:00:00Z'))).toBe(false);
    expect(getBangkokOpenState('Monday-Saturday 09:00-16:30', new Date('2026-07-13T05:00:00Z'))).toBe(true);
  });

  it('returns null for unknown formats', () => {
    expect(getBangkokOpenState('Branch hours vary by location')).toBeNull();
  });
});
