import { describe, expect, it } from 'vitest';
import { isLocale } from '@/lib/i18n';

describe('locale guard', () => {
  it('accepts supported locales', () => {
    expect(isLocale('th')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
  });

  it('rejects unsupported locales', () => {
    expect(isLocale('ja')).toBe(false);
    expect(isLocale('')).toBe(false);
  });
});
