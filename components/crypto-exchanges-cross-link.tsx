import { TrackLink } from '@/components/track-link';
import type { Locale } from '@/lib/types';

// SEO-30: /crypto owns amount and fee estimation; /exchanges owns the licensed-venue
// comparison. One sentence + one link from each side keeps the two intents apart
// without duplicating either page's body copy.

const copy = {
  en: {
    title: 'Choosing a licensed Thai exchange first?',
    text: 'This page estimates the THB amount and fees for one crypto trade. If you have not picked a venue yet, start from the exchange comparison, then come back here with the pair and amount.',
    cta: 'Compare licensed Thai exchanges',
  },
  th: {
    title: 'ยังเลือกแพลตฟอร์มไทยที่ได้รับใบอนุญาตอยู่หรือไม่',
    text: 'หน้านี้ใช้ประมาณยอดเงินบาทและค่าธรรมเนียมของธุรกรรมคริปโตหนึ่งรายการ หากยังไม่ได้เลือกแพลตฟอร์ม ให้เริ่มจากหน้ารวมแพลตฟอร์ม แล้วกลับมาที่นี่พร้อมคู่เทรดและจำนวน',
    cta: 'ดูหน้ารวมแพลตฟอร์มที่ได้รับใบอนุญาต',
  },
  zh: {
    title: '先选泰国持牌交易所？',
    text: '本页估算一笔加密交易的泰铢金额与手续费。如果还没决定用哪家，先从交易所对比页开始，再带着交易对与金额回到这里。',
    cta: '查看泰国持牌交易所对比',
  },
} as const;

export function CryptoExchangesCrossLink({ locale }: { locale: Locale }) {
  const c = copy[locale === 'th' || locale === 'zh' ? locale : 'en'];
  return (
    <section className="cash-hub-answer" aria-labelledby="crypto-exchanges-cross-link">
      <h2 id="crypto-exchanges-cross-link">{c.title}</h2>
      <p className="cash-hub-answer-text" data-crypto-exchanges-link>
        {c.text}{' '}
        <TrackLink href={`/${locale}/exchanges`} eventName="crypto_exchanges_cross_link_click" eventParams={{ locale }} className="font-semibold text-[#087f91] underline underline-offset-4">{c.cta}</TrackLink>
      </p>
    </section>
  );
}
