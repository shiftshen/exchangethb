import { Locale } from '@/lib/types';

export function localizeExchangeLicense(license: string, locale: Locale) {
  if (license === 'Thai SEC digital asset exchange license') {
    return locale === 'th'
      ? 'ใบอนุญาตศูนย์ซื้อขายสินทรัพย์ดิจิทัลจาก ก.ล.ต. ไทย'
      : locale === 'zh'
        ? '泰国 SEC 数字资产交易所牌照'
        : 'Thai SEC digital asset exchange license';
  }

  return license;
}
