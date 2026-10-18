import { exchanges } from '@/data/site';
import { licenseLookup } from '@/lib/provider-evidence';
import type { ContentLocale, CopyGroup, ExchangeSlug } from '@/lib/types';

// SEO-39: the datawallet-style side-by-side table on /exchanges. Unlike SEO-30's
// cash-out table (THB withdrawal -> cash), this one answers "how do I compare these
// exchanges" with the facts data/site.ts actually holds: name, licence, THB pairs,
// trading fee, deposit support and key feature. The deposit column only states what
// the record supports; it never invents a funding channel, limit or fee.

export interface ExchangeComparisonTableRow {
  slug: ExchangeSlug;
  name: string;
  license: string;
  /** Crypto symbols paired with THB, rendered as "BTC/THB". */
  thbPairs: string[];
  tradingFeePct: number;
  feeOnReceived: boolean;
  /** True when the record states THB deposits are supported (only Bitkub). */
  thbDepositSupported: boolean;
  keyFeature: CopyGroup;
  officialUrl: string;
}

export function buildExchangeComparisonTableRows(): ExchangeComparisonTableRow[] {
  return exchanges.map((exchange) => ({
    slug: exchange.slug,
    name: exchange.name,
    license: exchange.license,
    thbPairs: exchange.pairs.map((pair) => `${pair}/THB`),
    tradingFeePct: exchange.fee.tradingFeePct,
    feeOnReceived: exchange.fee.tradingFeeAsset === 'received',
    // data/site.ts only records Bitkub as stating THB deposit support ("Supports THB
    // deposits, withdrawals, and Thai-side operations"). A missing flag never means
    // the exchange cannot take deposits; it means the reviewed data does not list it.
    thbDepositSupported: exchange.slug === 'bitkub',
    keyFeature: exchange.strengths[0] ?? exchange.summary,
    officialUrl: exchange.affiliate.officialUrl,
  }));
}

// Official public source for the Thai SEC digital asset business operator list.
export const secLicenseSourceUrl = licenseLookup;

export interface ExchangeIndexFaq {
  question: string;
  answer: string;
}

export function exchangeIndexFaqs(locale: ContentLocale): ExchangeIndexFaq[] {
  if (locale === 'th') {
    return [
      { question: 'หน้านี้ต่างจากหน้าคอมแพร์คริปโตอย่างไร', answer: 'หน้ารวมนี้ใช้เพื่อทำความเข้าใจว่าเว็บไซต์ติดตาม exchange อะไรบ้าง ส่วนหน้าคอมแพร์ใช้สำหรับคำนวณผลลัพธ์เส้นทางเป็น THB แบบสดมากกว่า' },
      { question: 'ควรเริ่มจากหน้ารวมหรือหน้ารายตัว', answer: 'ถ้าคุณยังไม่แน่ใจว่าจะดูแพลตฟอร์มไหน ให้เริ่มจากหน้ารวมนี้ก่อน แล้วค่อยคลิกเข้าโปรไฟล์แพลตฟอร์มที่ตรงกับสิ่งที่คุณสนใจ' },
      { question: 'หน้านี้ช่วย SEO อย่างไร', answer: 'มันเป็นหน้า hub ที่รวม internal links ไปยัง exchange profile หลัก ทำให้ search engine เห็นโครงสร้างหมวด exchange ได้ชัดขึ้น' },
    ];
  }
  if (locale === 'zh') {
    return [
      { question: '这个页面和加密比较页有什么不同', answer: '这个索引页主要负责说明站内追踪了哪些交易所；真正的实时路线估算和排序仍在加密比较页完成。' },
      { question: '应该先看索引页还是交易所详情页', answer: '如果你还不确定先研究哪家交易所，先从索引页进入会更高效，然后再进入具体详情页。' },
      { question: '这个 hub 对 SEO 有什么帮助', answer: '它把交易所主题集中在一个可抓取入口上，再把内部链接分发到更重要的实体详情页。' },
    ];
  }
  return [
    { question: 'How is this page different from the crypto compare page?', answer: 'This index exists to organize which exchanges are covered. The live comparison page is where users estimate route outcomes into THB.' },
    { question: 'Should I start here or on an exchange profile?', answer: 'Start here if you need a quick map of the category, then move into the exact profile page that matches your route or concerns.' },
    { question: 'Why does this help SEO?', answer: 'It gives search engines one crawlable exchange hub, then passes internal links into the entity pages that should rank for brand and review intent.' },
  ];
}
