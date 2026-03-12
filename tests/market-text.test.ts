import { describe, expect, it } from 'vitest';
import { localizeAdapterNote, localizeMarketFallbackReason, localizeMarketFreshness, localizeMarketSource } from '@/lib/market-text';

describe('market text localization', () => {
  it('localizes known market source labels', () => {
    expect(localizeMarketSource('Official API + rules engine', 'zh')).toBe('官方实时数据与审核规则');
    expect(localizeMarketSource('Reviewed fallback dataset', 'th')).toBe('ชุดข้อมูลสำรองที่ผ่านการทบทวน');
  });

  it('localizes freshness labels', () => {
    expect(localizeMarketFreshness('Fallback snapshot', 'zh')).toBe('备用快照');
  });

  it('localizes fallback reasons', () => {
    expect(
      localizeMarketFallbackReason('Live endpoint unavailable or symbol not supported; using reviewed fallback snapshot.', 'zh'),
    ).toContain('备用快照');
  });

  it('localizes adapter notes', () => {
    expect(localizeAdapterNote('Live market adapter responding.', 'zh')).toBe('实时市场数据源连接正常');
  });
});
