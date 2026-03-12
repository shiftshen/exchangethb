import { describe, expect, it } from 'vitest';
import { localizeCashText, localizeProviderHealthReason, localizeScrapeNote } from '@/lib/cash-text';

describe('localizeCashText', () => {
  it('localizes known branch metadata strings', () => {
    expect(localizeCashText('Vasu Exchange Nana Area Reference', 'zh')).toBe('Vasu Exchange Nana 参考点');
    expect(localizeCashText('Verify on provider contact page before visiting', 'th')).toContain('ควรตรวจสอบ');
  });

  it('falls back to original value for unknown strings', () => {
    expect(localizeCashText('Unknown value', 'en')).toBe('Unknown value');
  });

  it('localizes scrape notes and provider health reasons', () => {
    expect(localizeScrapeNote('Parsed 11 rate rows from official page.', 'zh')).toContain('11');
    expect(localizeProviderHealthReason('live_fresh', 'th')).toContain('ข้อมูลสด');
  });
});
