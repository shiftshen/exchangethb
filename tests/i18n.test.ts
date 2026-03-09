import { describe, expect, it } from 'vitest';
import { t } from '@/lib/i18n';

describe('i18n fallback', () => {
  it('returns locale copy when available', () => {
    expect(t({ th: 'ไทย', en: 'English', zh: '中文' }, 'zh')).toBe('中文');
  });

  it('falls back to english when locale text is empty', () => {
    expect(t({ th: 'ไทย', en: 'English', zh: '' }, 'zh')).toBe('English');
  });
});
