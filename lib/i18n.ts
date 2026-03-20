import { ContentLocale, Locale, NavItem } from '@/lib/types';

export const locales: ContentLocale[] = ['th', 'en', 'zh'];
export const indexableLocales: ContentLocale[] = ['th', 'en', 'zh'];
export const legacyLocales: Array<Exclude<Locale, ContentLocale>> = ['ja', 'ko', 'de'];

export const navigation: NavItem[] = [
  { href: '', label: { th: 'หน้าแรก', en: 'Home', zh: '首页', ja: 'ホーム', ko: '홈', de: 'Start' } },
  { href: '/crypto', label: { th: 'คริปโตเป็นบาท', en: 'Crypto to THB', zh: '加密换泰铢', ja: '暗号資産 -> THB', ko: '가상자산 -> THB', de: 'Krypto -> THB' } },
  { href: '/cash', label: { th: 'เงินสด/ฟอเร็กซ์เป็นบาท', en: 'Cash / FX to THB', zh: '现金换泰铢', ja: '現金 / FX -> THB', ko: '현금 / FX -> THB', de: 'Bargeld / FX -> THB' } },
  { href: '/routes', label: { th: 'เส้นทาง THB', en: 'Route Guides', zh: '路线页', ja: 'ルートガイド', ko: '경로 가이드', de: 'Routen' } },
  { href: '/exchanges', label: { th: 'แพลตฟอร์ม', en: 'Exchanges', zh: '交易所', ja: '取引所', ko: '거래소', de: 'Börsen' } },
  { href: '/money-changers', label: { th: 'ร้านแลกเงิน', en: 'Money Changers', zh: '换汇品牌', ja: '両替ブランド', ko: '환전 브랜드', de: 'Wechselstuben' } },
  { href: '/legal/methodology', label: { th: 'วิธีการ', en: 'Methodology', zh: '方法论', ja: '方法論', ko: '방법론', de: 'Methodik' } },
];

export function isLocale(value: string): value is ContentLocale {
  return locales.includes(value as ContentLocale);
}

export function isLegacyLocale(value: string): value is Exclude<Locale, ContentLocale> {
  return legacyLocales.includes(value as Exclude<Locale, ContentLocale>);
}

export function isIndexableLocale(locale: Locale): locale is ContentLocale {
  return indexableLocales.includes(locale as ContentLocale);
}

export function resolveContentLocale(locale: Locale): ContentLocale {
  if (isIndexableLocale(locale)) return locale;
  return 'en';
}

export function t<T extends { th: string; en: string; zh: string; ja?: string; ko?: string; de?: string }>(copy: T, locale: Locale) {
  const primary = copy[locale];
  if (primary && primary.trim().length > 0) return primary;
  if (copy.en && copy.en.trim().length > 0) return copy.en;
  return copy.th || copy.zh;
}
