import type { CashDecisionResult } from '@/components/cash-decision-tool';
import type { CryptoDecisionResult } from '@/components/crypto-decision-tool';

export type CashRow = CashDecisionResult['all'][number];
export type CryptoRow = CryptoDecisionResult[number];
export type ComparisonMode = 'cash' | 'crypto';

export function isFreshQuote(observedAt: string, live: boolean, mode: ComparisonMode, now = Date.now()) {
  const time = Date.parse(observedAt);
  const age = now - time;
  return live && Number.isFinite(time) && age >= -60_000 && age <= (mode === 'cash' ? 30 * 60_000 : 2 * 60_000);
}

export function validAmount(value: string) {
  return value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) > 0;
}

export function amountBucket(value: string) {
  const amount = Number(value);
  return amount < 1 ? 'under_1' : amount < 100 ? '1_99' : amount < 1000 ? '100_999' : amount < 10000 ? '1000_9999' : '10000_plus';
}

// Quote provenance is distinct from a provider's current website.
export const quoteSourceLabel = {
  zh: { current: '报价来源', reference: '历史报价来源' },
  en: { current: 'Quote source', reference: 'Historical quote source' },
  th: { current: 'แหล่งที่มาของเรท', reference: 'แหล่งเรทในอดีต' },
  ja: { current: 'レートの情報源', reference: '過去のレート情報源' },
  ru: { current: 'Источник курса', reference: 'Источник исторического курса' },
  ko: { current: '환율 출처', reference: '과거 환율 출처' },
  fr: { current: 'Source du taux', reference: 'Source du taux historique' },
  de: { current: 'Kursquelle', reference: 'Historische Kursquelle' },
  id: { current: 'Sumber kurs', reference: 'Sumber kurs historis' },
  vi: { current: 'Nguồn tỷ giá', reference: 'Nguồn tỷ giá lịch sử' },
};

const headlineBanknoteLabels = {
  en: 'Headline rate; confirm the banknote denomination',
  zh: '官网参考价；请确认适用纸币面额',
  th: 'อัตราอ้างอิงบนเว็บไซต์ โปรดยืนยันชนิดธนบัตร',
  ja: '公式参考レート。適用する紙幣の額面を確認してください',
  ko: '공식 참고 환율. 적용되는 지폐 권종을 확인하세요',
  ru: 'Справочный курс. Уточните номинал банкнот',
  fr: 'Taux indicatif ; confirmez la coupure des billets',
  de: 'Richtkurs; gültige Banknotenstückelung bestätigen',
  id: 'Kurs acuan; konfirmasikan pecahan uang kertas',
  vi: 'Tỷ giá tham khảo; xác nhận mệnh giá tiền giấy',
};

export function banknoteLabel(value: string, locale: keyof typeof headlineBanknoteLabels) {
  return value === 'Official headline rate; banknote must be confirmed'
    ? headlineBanknoteLabels[locale] : value;
}
