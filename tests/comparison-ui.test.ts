import { describe, expect, it } from 'vitest';
import { amountBucket, isFreshQuote, validAmount } from '@/lib/comparison-ui';

describe('comparison display safeguards', () => {
  const now = Date.parse('2026-10-01T14:00:00Z');
  it('does not rank fallback, old, invalid, or future quotes as current', () => {
    expect(isFreshQuote('2026-10-01T13:59:00Z', true, 'crypto', now)).toBe(true);
    expect(isFreshQuote('2026-10-01T13:59:00Z', false, 'crypto', now)).toBe(false);
    expect(isFreshQuote('2026-10-01T13:57:00Z', true, 'crypto', now)).toBe(false);
    expect(isFreshQuote('2026-03-01T13:59:00Z', true, 'cash', now)).toBe(false);
    expect(isFreshQuote('invalid', true, 'cash', now)).toBe(false);
    expect(isFreshQuote('2026-10-02T13:59:00Z', true, 'cash', now)).toBe(false);
  });
  it('uses a separate cash freshness window', () => {
    expect(isFreshQuote('2026-10-01T13:40:00Z', true, 'cash', now)).toBe(true);
    expect(isFreshQuote('2026-10-01T13:29:00Z', true, 'cash', now)).toBe(false);
  });
  it('accepts small decimal asset amounts and rejects unusable inputs', () => {
    expect(validAmount('0.00000001')).toBe(true);
    expect(validAmount('1000.50')).toBe(true);
    for (const value of ['', ' ', '0', '-1', 'NaN', 'Infinity', '1e999']) expect(validAmount(value)).toBe(false);
  });
  it('reports amount ranges without exact financial amounts', () => {
    expect(amountBucket('0.01')).toBe('under_1');
    expect(amountBucket('1000.50')).toBe('1000_9999');
  });
});
