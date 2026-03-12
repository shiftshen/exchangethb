import { describe, expect, it } from 'vitest';
import { formatDisplayAmount, formatInputAmount, isCompletePositiveDecimal, parsePositiveDecimal } from '@/lib/amounts';

describe('amount helpers', () => {
  it('parses normal decimals and rejects scientific notation', () => {
    expect(parsePositiveDecimal('0.01', 1, 0.00000001)).toBe(0.01);
    expect(parsePositiveDecimal('1000.50', 1, 0.01)).toBe(1000.5);
    expect(parsePositiveDecimal('1e-8', 1, 0.00000001)).toBe(1);
  });

  it('formats numbers without scientific notation', () => {
    expect(formatInputAmount(0.00000001, 8)).toBe('0.00000001');
    expect(formatDisplayAmount(0.00000001, { maximumFractionDigits: 8 })).toBe('0.00000001');
  });

  it('only auto-submits complete decimal strings', () => {
    expect(isCompletePositiveDecimal('1')).toBe(true);
    expect(isCompletePositiveDecimal('1.2')).toBe(true);
    expect(isCompletePositiveDecimal('1.')).toBe(false);
    expect(isCompletePositiveDecimal('')).toBe(false);
  });
});
