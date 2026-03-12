import { describe, expect, it } from 'vitest';
import { localizeExchangeLicense } from '@/lib/exchange-text';

describe('exchange text localization', () => {
  it('localizes the common Thai SEC exchange license', () => {
    expect(localizeExchangeLicense('Thai SEC digital asset exchange license', 'zh')).toBe('泰国 SEC 数字资产交易所牌照');
    expect(localizeExchangeLicense('Thai SEC digital asset exchange license', 'th')).toContain('ก.ล.ต.');
  });
});
