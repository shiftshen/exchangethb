import Link from 'next/link';
import { resolveContentLocale } from '@/lib/i18n';
import { localeRoutePath } from '@/lib/seo';
import { ContentLocale, Locale } from '@/lib/types';

const footerCopy = {
  th: {
    note: 'ข้อมูลทั้งหมดมีไว้เพื่อการเปรียบเทียบและการอ้างอิงเท่านั้น',
    rights: 'ExchangeTHB. สงวนลิขสิทธิ์ทุกประการ',
    methodology: 'วิธีการ',
    disclaimer: 'ข้อจำกัดความรับผิดชอบ',
    privacy: 'นโยบายความเป็นส่วนตัว',
    explore: 'หน้าหลักที่ควรเริ่ม',
    crypto: 'คริปโตเป็นบาท',
    cash: 'เงินสดเป็นบาท',
  },
  en: {
    note: 'All information is for comparison and reference only.',
    rights: 'ExchangeTHB. All rights reserved.',
    methodology: 'Methodology',
    disclaimer: 'Disclaimer',
    privacy: 'Privacy Policy',
    explore: 'Core pages to start with',
    crypto: 'Crypto to THB',
    cash: 'Cash to THB',
  },
  zh: {
    note: '所有信息仅供比较与参考使用。',
    rights: 'ExchangeTHB 版权所有。',
    methodology: '方法论',
    disclaimer: '免责声明',
    privacy: '隐私政策',
    explore: '建议先看的主页面',
    crypto: '加密换泰铢',
    cash: '现金换泰铢',
  },
};

export function SiteFooter({ locale }: { locale: ContentLocale | Locale }) {
  const hrefLocale = resolveContentLocale(locale);
  const copy = footerCopy[hrefLocale];
  return (
    <footer className="mt-20 border-t border-surface-800 bg-surface-950/90 backdrop-blur">
      <div className="container-shell grid gap-6 py-10 text-sm text-stone-400 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div>
          <p>{copy.note}</p>
          <p className="mt-1">{copy.rights}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{copy.explore}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={localeRoutePath(hrefLocale, '/crypto')}>{copy.crypto}</Link>
            <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={localeRoutePath(hrefLocale, '/cash')}>{copy.cash}</Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={localeRoutePath(hrefLocale, '/legal/methodology')}>{copy.methodology}</Link>
          <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={localeRoutePath(hrefLocale, '/legal/disclaimer')}>{copy.disclaimer}</Link>
          <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={localeRoutePath(hrefLocale, '/legal/privacy-policy')}>{copy.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}
