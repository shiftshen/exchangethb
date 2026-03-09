import Link from 'next/link';
import { Locale } from '@/lib/types';

const footerCopy = {
  th: { note: 'ข้อมูลทั้งหมดมีไว้เพื่อการเปรียบเทียบและการอ้างอิงเท่านั้น', rights: 'ExchangeTHB. สงวนลิขสิทธิ์ทุกประการ', methodology: 'วิธีการ', disclaimer: 'ข้อจำกัดความรับผิดชอบ', privacy: 'นโยบายความเป็นส่วนตัว', affiliate: 'การเปิดเผยลิงก์แนะนำ' },
  en: { note: 'All information is for comparison and reference only.', rights: 'ExchangeTHB. All rights reserved.', methodology: 'Methodology', disclaimer: 'Disclaimer', privacy: 'Privacy Policy', affiliate: 'Affiliate Disclosure' },
  zh: { note: '所有信息仅供比较与参考使用。', rights: 'ExchangeTHB 版权所有。', methodology: '方法论', disclaimer: '免责声明', privacy: '隐私政策', affiliate: '联盟披露' },
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
          <Link href={`/${locale}/legal/methodology`}>{copy.methodology}</Link>
          <Link href={`/${locale}/legal/disclaimer`}>{copy.disclaimer}</Link>
          <Link href={`/${locale}/legal/privacy-policy`}>{copy.privacy}</Link>
          <Link href={`/${locale}/legal/affiliate-disclosure`}>{copy.affiliate}</Link>
        </div>
      </div>
    </footer>
  );
}
