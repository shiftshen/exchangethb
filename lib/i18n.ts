import { Locale, NavItem } from '@/lib/types';

export const locales: Locale[] = ['th', 'en', 'zh'];

export const navigation: NavItem[] = [
  { href: '', label: { th: 'หน้าแรก', en: 'Home', zh: '首页' } },
  { href: '/crypto', label: { th: 'คริปโตเป็นบาท', en: 'Crypto to THB', zh: '加密换泰铢' } },
  { href: '/cash', label: { th: '现金换泰铢', en: 'Cash / FX to THB', zh: '现金换泰铢' } },
  { href: '/legal/methodology', label: { th: 'วิธีการ', en: 'Methodology', zh: '方法论' } },
  { href: '/admin/login', label: { th: 'ผู้ดูแล', en: 'Admin', zh: '后台' } },
];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function t<T extends { th: string; en: string; zh: string }>(copy: T, locale: Locale) {
  return copy[locale];
}
