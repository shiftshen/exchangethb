import { describe, expect, it } from 'vitest';
import { isLegacyLocale, isLocale } from '@/lib/i18n';

describe('locale guard', () => {
  it('accepts supported locales', () => {
    expect(isLocale('th')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
  });

  it('recognizes legacy locales separately', () => {
    expect(isLegacyLocale('ja')).toBe(true);
    expect(isLegacyLocale('ko')).toBe(true);
    expect(isLegacyLocale('de')).toBe(true);
  });

  it('rejects unsupported locales', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLegacyLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
  });
});
