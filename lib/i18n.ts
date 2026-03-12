import { Locale, NavItem } from '@/lib/types';

export const locales: Locale[] = ['th', 'en', 'zh'];

export const navigation: NavItem[] = [
  { href: '', label: { th: 'หน้าแรก', en: 'Home', zh: '首页' } },
  { href: '/crypto', label: { th: 'คริปโตเป็นบาท', en: 'Crypto to THB', zh: '加密换泰铢' } },
  { href: '/cash', label: { th: 'เงินสด/ฟอเร็กซ์เป็นบาท', en: 'Cash / FX to THB', zh: '现金换泰铢' } },
  { href: '/legal/methodology', label: { th: 'วิธีการ', en: 'Methodology', zh: '方法论' } },
];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function t<T extends { th: string; en: string; zh: string }>(copy: T, locale: Locale) {
  const primary = copy[locale];
  if (primary && primary.trim().length > 0) return primary;
  if (copy.en && copy.en.trim().length > 0) return copy.en;
  return copy.th || copy.zh;
}
