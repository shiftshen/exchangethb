import Link from 'next/link';
import { Locale } from '@/lib/types';

const footerCopy = {
  th: { note: 'ข้อมูลทั้งหมดมีไว้เพื่อการเปรียบเทียบและการอ้างอิงเท่านั้น', rights: 'ExchangeTHB. สงวนลิขสิทธิ์ทุกประการ' },
  en: { note: 'All information is for comparison and reference only.', rights: 'ExchangeTHB. All rights reserved.' },
  zh: { note: '所有信息仅供比较与参考使用。', rights: 'ExchangeTHB 版权所有。' },
};

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="container-shell flex flex-col gap-4 py-10 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p>{copy.note}</p>
          <p className="mt-1">{copy.rights}</p>
        </div>
        <div className="flex gap-4">
          <Link href={`/${locale}/legal/methodology`}>Methodology</Link>
          <Link href={`/${locale}/legal/disclaimer`}>Disclaimer</Link>
          <Link href={`/${locale}/legal/privacy-policy`}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
