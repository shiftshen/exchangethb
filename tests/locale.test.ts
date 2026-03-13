import { describe, expect, it } from 'vitest';
import { isLocale } from '@/lib/i18n';

describe('locale guard', () => {
  it('accepts supported locales', () => {
    expect(isLocale('th')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('ja')).toBe(true);
    expect(isLocale('ko')).toBe(true);
    expect(isLocale('de')).toBe(true);
  });

  it('rejects unsupported locales', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
  });
});
