import Link from 'next/link';
import { Locale } from '@/lib/types';

const footerCopy = {
  th: { note: 'ข้อมูลทั้งหมดมีไว้เพื่อการเปรียบเทียบและการอ้างอิงเท่านั้น', rights: 'ExchangeTHB. สงวนลิขสิทธิ์ทุกประการ', methodology: 'วิธีการ', disclaimer: 'ข้อจำกัดความรับผิดชอบ', privacy: 'นโยบายความเป็นส่วนตัว' },
  en: { note: 'All information is for comparison and reference only.', rights: 'ExchangeTHB. All rights reserved.', methodology: 'Methodology', disclaimer: 'Disclaimer', privacy: 'Privacy Policy' },
  zh: { note: '所有信息仅供比较与参考使用。', rights: 'ExchangeTHB 版权所有。', methodology: '方法论', disclaimer: '免责声明', privacy: '隐私政策' },
};

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];
  return (
    <footer className="mt-20 border-t border-surface-800 bg-surface-950/90 backdrop-blur">
      <div className="container-shell flex flex-col gap-5 py-10 text-sm text-stone-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p>{copy.note}</p>
          <p className="mt-1">{copy.rights}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={`/${locale}/legal/methodology`}>{copy.methodology}</Link>
          <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={`/${locale}/legal/disclaimer`}>{copy.disclaimer}</Link>
          <Link className="rounded-full border border-surface-700 px-4 py-2 transition hover:border-brand-500 hover:text-brand-300" href={`/${locale}/legal/privacy-policy`}>{copy.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}
