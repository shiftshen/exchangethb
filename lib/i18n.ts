import { ContentLocale, Locale, NavItem } from '@/lib/types';

export const locales: Locale[] = ['th', 'en', 'zh', 'ja', 'ko', 'de'];
export const indexableLocales: Locale[] = ['th', 'en', 'zh'];

export const navigation: NavItem[] = [
  { href: '', label: { th: 'หน้าแรก', en: 'Home', zh: '首页', ja: 'ホーム', ko: '홈', de: 'Start' } },
  { href: '/crypto', label: { th: 'คริปโตเป็นบาท', en: 'Crypto to THB', zh: '加密换泰铢', ja: '暗号資産 -> THB', ko: '가상자산 -> THB', de: 'Krypto -> THB' } },
  { href: '/cash', label: { th: 'เงินสด/ฟอเร็กซ์เป็นบาท', en: 'Cash / FX to THB', zh: '现金换泰铢', ja: '現金 / FX -> THB', ko: '현금 / FX -> THB', de: 'Bargeld / FX -> THB' } },
  { href: '/legal/methodology', label: { th: 'วิธีการ', en: 'Methodology', zh: '方法论', ja: '方法論', ko: '방법론', de: 'Methodik' } },
];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isIndexableLocale(locale: Locale) {
  return indexableLocales.includes(locale);
}

export function resolveContentLocale(locale: Locale): ContentLocale {
  if (locale === 'th' || locale === 'en' || locale === 'zh') return locale;
  return 'en';
}

export function t<T extends { th: string; en: string; zh: string; ja?: string; ko?: string; de?: string }>(copy: T, locale: Locale) {
  const primary = copy[locale];
  if (primary && primary.trim().length > 0) return primary;
  if (copy.en && copy.en.trim().length > 0) return copy.en;
  return copy.th || copy.zh;
}
