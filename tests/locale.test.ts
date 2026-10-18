import { describe, expect, it } from 'vitest';
import { isLegacyLocale, isLocale } from '@/lib/i18n';

describe('locale guard', () => {
  it('accepts supported locales', () => {
    expect(isLocale('th')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('ja')).toBe(true);
    for (const locale of ['ru','ko','fr','de','id','vi']) expect(isLocale(locale)).toBe(true);
  });

  it('recognizes legacy locales separately', () => {
    expect(isLegacyLocale('ja')).toBe(false);
    expect(isLegacyLocale('ko')).toBe(false);
    expect(isLegacyLocale('de')).toBe(false);
  });

  it('rejects unsupported locales', () => {
    expect(isLocale('es')).toBe(false);
    expect(isLegacyLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
  });
});
