import { exchanges } from '@/data/site';
import { localizeExchangeLicense } from '@/lib/exchange-text';

import { organizationId, withLocalePath } from '@/lib/seo';
import type { ExchangeRecord, Locale } from '@/lib/types';

// Exchange profile pages are rendered and indexed in en/th/zh; every other locale is
// redirected to /en by middleware. Every fact below is derived from data/site.ts at build
// time; the hand-written copy only states what that record supports and nothing else.
export type ExchangeSeoLocale = 'en' | 'th' | 'zh';
export const exchangeSeoLocales: ExchangeSeoLocale[] = ['en', 'th', 'zh'];

export interface ExchangeFacts {
  slug: string;
  name: string;
  tradingFeePct: number;
  /** True when the fee is taken from the asset the customer receives. */
  feeOnReceived: boolean;
  /** THB withdrawal fee, or null when data/site.ts marks it as not published. */
  thbWithdraw: number | null;
  pairs: string[];
  license: string;
  officialUrl: string;
  /** ISO date (YYYY-MM-DD) taken from the record's lastUpdated. */
  reviewed: string;
}

export interface ExchangeFaq {
  question: string;
  answer: string;
}

export interface ExchangeSeoContent {
  metaTitle: string;
  metaDescription: string;
  answer: string;
  differentHeading: string;
  differentiators: string[];
  faqHeading: string;
  faqs: ExchangeFaq[];
  compareHeading: string;
  compareBody: string;
  compareCta: string;
  feesHeading: string;
  /** Sentence shown next to the fee tiles; states when the THB withdrawal fee is unknown. */
  withdrawalUnknown: string;
}

// Licence wording used in this copy (proofread): the shared helper stays untouched for the other pages.
function licenceText(license: string, locale: ExchangeSeoLocale) {
  if (license !== 'Thai SEC digital asset exchange license') return localizeExchangeLicense(license, locale);
  return {
    en: 'Thai SEC digital asset exchange licence',
    th: 'ใบอนุญาตประกอบธุรกิจศูนย์ซื้อขายสินทรัพย์ดิจิทัลจากสำนักงาน ก.ล.ต.',
    zh: '泰国证监会（SEC）数字资产交易所牌照',
  }[locale];
}

function toLocale(locale: Locale | string): ExchangeSeoLocale {
  return locale === 'th' || locale === 'zh' ? locale : 'en';
}

export function getExchangeFacts(slug: string): ExchangeFacts | null {
  const record: ExchangeRecord | undefined = exchanges.find((item) => item.slug === slug);
  if (!record) return null;
  return {
    slug: record.slug,
    name: record.name,
    tradingFeePct: record.fee.tradingFeePct,
    feeOnReceived: record.fee.tradingFeeAsset === 'received',
    thbWithdraw: record.fee.thbWithdrawKnown === false ? null : record.fee.thbWithdraw,
    pairs: [...record.pairs],
    license: record.license,
    officialUrl: record.affiliate.officialUrl,
    reviewed: record.lastUpdated.slice(0, 10),
  };
}

export const exchangeSeoSlugs = exchanges.map((item) => item.slug);

type L3<T> = Record<ExchangeSeoLocale, T>;

interface Bundle {
  /** First sentence of the page: what this exchange is, taken from the record's own summary. */
  lead: L3<string>;
  metaDescription: L3<(f: ExchangeFacts) => string>;
  /** Two or three points that only apply to this exchange. */
  differentiators: L3<(f: ExchangeFacts) => string[]>;
  /** Deposit answer: only Bitkub's record states that THB deposits are supported. */
  depositSupported: boolean;
}

const fee = (f: ExchangeFacts) => `${f.tradingFeePct}%`;
const wd = (f: ExchangeFacts) => (f.thbWithdraw === null ? null : `฿${f.thbWithdraw}`);

const bundles: Record<string, Bundle> = {
  'binance-th': {
    depositSupported: false,
    lead: {
      en: 'Binance TH is a high-liquidity venue for the core THB pairs with a clear fee structure.',
      th: 'Binance TH เป็นแพลตฟอร์มที่สภาพคล่องสูงสำหรับคู่ THB หลัก และโครงสร้างค่าธรรมเนียมชัดเจน',
      zh: 'Binance TH 是适合核心 THB 交易对的高流动性平台，费率结构清晰。',
    },
    metaDescription: {
      en: (f) => `Binance TH fees: ${fee(f)} trading fee taken from the asset you receive and a ${wd(f)} THB withdrawal fee. Licensed by the Thai SEC per our data; compare net THB for USDT and BTC.`,
      th: (f) => `Binance TH ค่าธรรมเนียมเทรด ${fee(f)} หักจากสินทรัพย์ที่ได้รับ ค่าถอนเงินบาท ${wd(f)} ข้อมูลของเราระบุว่าได้รับใบอนุญาตจาก ก.ล.ต. เทียบยอด THB สุทธิของ USDT และ BTC`,
      zh: (f) => `Binance TH 交易费 ${fee(f)}（从收到的资产中扣除），泰铢提现费 ${wd(f)}。数据记录持有泰国证监会（SEC）牌照，可比较 USDT、BTC 的净到手 THB。`,
    },
    differentiators: {
      en: (f) => [
        'Strong liquidity on the major pairs, with public documentation and APIs available.',
        `The ${fee(f)} fee is taken from the asset you receive, so compare the net THB you end up with, not only the headline fee.`,
        'Campaign and referral availability can change, so the official link may differ from one you saw earlier.',
      ],
      th: (f) => [
        'สภาพคล่องดีในคู่ยอดนิยม และมีเอกสารสาธารณะกับ API ครบ',
        `ค่าธรรมเนียม ${fee(f)} หักจากสินทรัพย์ที่ได้รับ จึงควรเทียบยอด THB สุทธิที่ได้จริง ไม่ใช่ดูแค่อัตราค่าธรรมเนียม`,
        'แคมเปญและ referral อาจเปลี่ยน ลิงก์ทางการจึงอาจไม่ตรงกับที่เคยเห็น',
      ],
      zh: (f) => [
        '主流交易对流动性强，公开文档与 API 完整。',
        `${fee(f)} 的手续费从收到的资产中扣除，所以要比较最终净到手的 THB，而不只是看费率数字。`,
        '活动与返佣机制可能变动，官方链接可能与你之前看到的不同。',
      ],
    },
  },
  bitkub: {
    depositSupported: true,
    lead: {
      en: 'Bitkub is a digital asset exchange with direct THB support and Thai-language operations.',
      th: 'Bitkub เป็นแพลตฟอร์มซื้อขายสินทรัพย์ดิจิทัลที่รองรับเงินบาทและให้บริการเป็นภาษาไทย',
      zh: 'Bitkub 是支持泰铢交易并提供泰语服务的数字资产平台。',
    },
    metaDescription: {
      en: (f) => `Bitkub fees: ${fee(f)} trading fee and a ${wd(f)} THB withdrawal fee. Supports THB deposits and withdrawals with Thai-side operations; licensed by the Thai SEC per our data.`,
      th: (f) => `Bitkub ค่าธรรมเนียมเทรด ${fee(f)} ค่าถอนเงินบาท ${wd(f)} รองรับการฝากและถอนเงินบาทและดำเนินงานในประเทศไทย ข้อมูลของเราระบุว่าได้รับใบอนุญาตจาก ก.ล.ต.`,
      zh: (f) => `Bitkub 交易费 ${fee(f)}，泰铢提现费 ${wd(f)}。支持泰铢充提与本地化运营，数据记录持有泰国证监会（SEC）牌照。`,
    },
    differentiators: {
      en: () => [
        'Supports THB deposits and withdrawals and runs Thai-side operations, so the THB side of the flow can stay in baht.',
        'It publishes help-centre and announcement channels, which helps when you need to check a rule.',
        'Some markets are thinner than others, so check order-book depth before a large trade.',
      ],
      th: () => [
        'รองรับการฝากถอนเงินบาทและดำเนินงานในประเทศไทย ทำให้ส่วนที่เกี่ยวกับเงินบาทอยู่ในสกุลเงินบาทได้',
        'มีศูนย์ช่วยเหลือและช่องทางประกาศ ช่วยให้ตรวจสอบกฎเกณฑ์ได้สะดวก',
        'บางคู่เทรดมีความลึกของตลาดน้อยกว่าคู่อื่น ควรดูความลึกของ order book ก่อนเทรดยอดใหญ่',
      ],
      zh: () => [
        '支持泰铢充提与本地化运营，泰铢相关环节可以用泰铢完成。',
        '设有帮助中心和公告渠道，需要核对规则时更方便。',
        '部分交易对深度较薄，大额交易前请先看订单簿深度。',
      ],
    },
  },
  'upbit-thailand': {
    depositSupported: false,
    lead: {
      en: 'Upbit Thailand is an exchange with standardised market pages and pair structure, easy to compare on the core THB markets.',
      th: 'Upbit Thailand เป็นแพลตฟอร์มที่มีหน้าตลาดและโครงสร้างคู่เทรดแบบมาตรฐาน เหมาะกับการเปรียบเทียบในตลาดคู่ THB หลัก',
      zh: 'Upbit Thailand 的市场页和交易对结构较标准，适合做主流 THB 市场对比。',
    },
    metaDescription: {
      en: (f) => `Upbit Thailand fees: ${fee(f)} trading fee, the lowest of the four exchanges compared here. THB withdrawal fee not published in our data; ${f.pairs.join(', ')} covered.`,
      th: (f) => `Upbit Thailand ค่าธรรมเนียมเทรด ${fee(f)} ต่ำสุดในสี่แพลตฟอร์มที่เทียบ ค่าถอนเงินบาทยังไม่มีข้อมูลเผยแพร่ ครอบคลุม ${f.pairs.join(', ')}`,
      zh: (f) => `Upbit Thailand 交易费 ${fee(f)}，是本站比较的四家中最低。泰铢提现费在我们的数据中暂无公开数值，覆盖 ${f.pairs.join('、')}。`,
    },
    differentiators: {
      en: (f) => [
        `A ${fee(f)} trading fee, lower than the other three exchanges compared on this site.`,
        `Clear market structure and pair pages, but coverage here is limited to ${f.pairs.join(', ')}.`,
        'The THB withdrawal fee is not published in our data, and public promotion or referral information is limited, so verify costs on the official site first.',
      ],
      th: (f) => [
        `ค่าธรรมเนียมเทรด ${fee(f)} ต่ำกว่าอีกสามแพลตฟอร์มที่เทียบในเว็บนี้`,
        `โครงสร้างตลาดและหน้าคู่เทรดอ่านง่าย แต่ที่นี่ครอบคลุมเพียง ${f.pairs.join(', ')}`,
        'ยังไม่มีข้อมูลค่าถอนเงินบาทที่เผยแพร่ และข้อมูลโปรโมชันหรือ referral สาธารณะมีไม่มาก ควรตรวจค่าใช้จ่ายบนเว็บทางการก่อน',
      ],
      zh: (f) => [
        `交易费 ${fee(f)}，低于本站比较的其他三家。`,
        `市场结构和交易对页面清晰，但本站只覆盖 ${f.pairs.join('、')}。`,
        '泰铢提现费在我们的数据里没有公开数值，公开促销或返佣信息也较少，请先到官网核对费用。',
      ],
    },
  },
  orbix: {
    depositSupported: false,
    lead: {
      en: 'Orbix is a Thai exchange that publishes product pages, company information and support channels on its website.',
      th: 'Orbix เป็นแพลตฟอร์มไทยที่เผยแพร่หน้าผลิตภัณฑ์ ข้อมูลบริษัท และช่องทางช่วยเหลือบนเว็บอย่างชัดเจน',
      zh: 'Orbix 是官网公开了产品页、公司信息和支持渠道的泰国交易平台。',
    },
    metaDescription: {
      en: (f) => `Orbix fees: ${fee(f)} trading fee taken from the asset you receive. THB withdrawal fee not published in our data. Support and company details are public; licensed by the Thai SEC per our data.`,
      th: (f) => `Orbix ค่าธรรมเนียมเทรด ${fee(f)} หักจากสินทรัพย์ที่ได้รับ ค่าถอนเงินบาทยังไม่มีข้อมูลเผยแพร่ ช่องทางช่วยเหลือและข้อมูลบริษัทเปิดเผยต่อสาธารณะ ข้อมูลของเราระบุว่าได้รับใบอนุญาตจาก ก.ล.ต.`,
      zh: (f) => `Orbix 交易费 ${fee(f)}（从收到的资产中扣除），泰铢提现费暂无公开数值。官网公开支持渠道与公司信息，数据记录持有泰国证监会（SEC）牌照。`,
    },
    differentiators: {
      en: (f) => [
        'Publishes visible support channels and company information on its website.',
        `The ${fee(f)} fee is taken from the asset you receive, and the THB withdrawal fee is not published in our data.`,
        'Pair coverage and depth can vary by period. If a campaign link is shown, it falls back to the official link once the campaign expires.',
      ],
      th: (f) => [
        'มีช่องทางช่วยเหลือและข้อมูลบริษัทบนเว็บอย่างชัดเจน',
        `ค่าธรรมเนียม ${fee(f)} หักจากสินทรัพย์ที่ได้รับ และยังไม่มีข้อมูลค่าถอนเงินบาทที่เผยแพร่`,
        'จำนวนคู่เทรดและความลึกอาจต่างกันตามช่วงเวลา หากมีการแสดงลิงก์แคมเปญ ลิงก์จะกลับไปเป็นลิงก์ทางการเมื่อแคมเปญหมดอายุ',
      ],
      zh: (f) => [
        '官网可见支持渠道和公司信息。',
        `${fee(f)} 的手续费从收到的资产中扣除，泰铢提现费在我们的数据里没有公开数值。`,
        '交易对覆盖和深度可能随时段变化；若显示活动链接，活动过期后会回退到官方链接。',
      ],
    },
  },
};

const pairsText = (f: ExchangeFacts, locale: ExchangeSeoLocale) => f.pairs.join(locale === 'zh' ? '、' : ', ');

const feeSummary = (locale: ExchangeSeoLocale) => exchanges
  .map((item) => `${item.name} ${item.fee.tradingFeePct}%`)
  .join(locale === 'zh' ? '；' : '; ');

function buildFaqs(f: ExchangeFacts, bundle: Bundle, locale: ExchangeSeoLocale): ExchangeFaq[] {
  const n = f.name;
  const recv = {
    en: f.feeOnReceived ? ' (taken from the asset you receive)' : '',
    th: f.feeOnReceived ? ' (หักจากสินทรัพย์ที่ได้รับ)' : '',
    zh: f.feeOnReceived ? '（从收到的资产中扣除）' : '',
  }[locale];

  const copy: L3<ExchangeFaq[]> = {
    en: [
      {
        question: `What is the ${n} trading fee?`,
        answer: `In the data ExchangeTHB reviewed on ${f.reviewed}, ${n} lists a ${fee(f)} trading fee${recv}. Fees can change, so confirm the current schedule on the official site before you trade.`,
      },
      {
        question: `How much does it cost to withdraw THB from ${n}?`,
        answer: f.thbWithdraw === null
          ? `The reviewed data does not include a published THB withdrawal fee for ${n}, so this page does not state one. Do not read a missing figure as free; check the official fee page before you move money.`
          : `The reviewed data lists a ${wd(f)} THB withdrawal fee for ${n}. Confirm the current amount, and any charge on the bank side, on the official site.`,
      },
      {
        question: `How do I deposit THB on ${n}?`,
        answer: bundle.depositSupported
          ? `${n} supports THB deposits and withdrawals and runs Thai-side operations. ExchangeTHB is a comparison site and cannot take deposits; ExchangeTHB does not list the deposit steps, limits or fees, so follow the instructions on the official ${n} site.`
          : `The data ExchangeTHB reviewed does not list the THB deposit methods, limits or fees of ${n}. ExchangeTHB is a comparison site and cannot take deposits, so open the official site and read its deposit instructions before you send money.`,
      },
      {
        question: `Is ${n} licensed in Thailand?`,
        answer: `The reviewed data records ${n} under a ${licenceText(f.license, 'en')}. ExchangeTHB cannot confirm the current licence status, so check the Thai SEC list of licensed operators before you deposit.`,
      },
      {
        question: `Which assets can I compare on ${n}?`,
        answer: `Here we compare ${pairsText(f, 'en')} on ${n}. Pair coverage and depth can differ by period, so check the order book of your pair before you trade.`,
      },
      {
        question: `How do Thai exchange trading fees compare?`,
        answer: `Trading fees in the reviewed data: ${feeSummary('en')}. The fee is only part of the cost: spread, order-book depth and THB withdrawal also change what you receive, so use the comparison tool for a net THB figure.`,
      },
      {
        question: `Is the THB example on this ${n} page live?`,
        answer: 'Each example is labelled live source or reviewed fallback and carries its observation time. When no current example is available the page says so instead of showing a made-up number.',
      },
    ],
    th: [
      {
        question: `ค่าธรรมเนียมเทรดของ ${n} เท่าไร`,
        answer: `ข้อมูลที่ ExchangeTHB ตรวจสอบเมื่อ ${f.reviewed} ระบุค่าธรรมเนียมเทรดของ ${n} ที่ ${fee(f)}${recv} ค่าธรรมเนียมอาจเปลี่ยน จึงควรยืนยันตารางค่าธรรมเนียมล่าสุดบนเว็บไซต์ทางการก่อนเทรด`,
      },
      {
        question: `ถอนเงินบาทออกจาก ${n} เสียค่าธรรมเนียมเท่าไร`,
        answer: f.thbWithdraw === null
          ? `ข้อมูลที่ตรวจสอบยังไม่มีค่าถอนเงินบาทของ ${n} ที่เผยแพร่ หน้านี้จึงไม่ระบุตัวเลข ไม่ควรเข้าใจว่าไม่มีค่าธรรมเนียม ควรเปิดหน้าค่าธรรมเนียมทางการก่อนโอนเงิน`
          : `ข้อมูลที่ตรวจสอบระบุค่าถอนเงินบาทของ ${n} ที่ ${wd(f)} ควรยืนยันอัตราล่าสุดบนเว็บไซต์ทางการ และตรวจสอบค่าธรรมเนียมที่ธนาคารอาจเรียกเก็บ`,
      },
      {
        question: `ฝากเงินบาทเข้า ${n} ทำอย่างไร`,
        answer: bundle.depositSupported
          ? `${n} รองรับการฝากและถอนเงินบาท และดำเนินงานในประเทศไทย ส่วน ExchangeTHB เป็นเว็บเปรียบเทียบ ไม่รับฝากเงินหรือดำเนินการแทนผู้ใช้ และไม่ได้ระบุขั้นตอน วงเงิน หรือค่าธรรมเนียมการฝาก โปรดทำตามขั้นตอนบนเว็บทางการของ ${n}`
          : `ข้อมูลที่ ExchangeTHB ตรวจสอบยังไม่ได้ระบุวิธีฝากเงินบาท วงเงิน หรือค่าธรรมเนียมการฝากของ ${n} และ ExchangeTHB เป็นเว็บเปรียบเทียบที่ไม่รับฝากเงินหรือดำเนินการแทนผู้ใช้ โปรดเปิดเว็บทางการและอ่านขั้นตอนการฝากก่อนโอนเงิน`,
      },
      {
        question: `${n} มีใบอนุญาตในไทยหรือไม่`,
        answer: `ข้อมูลที่ตรวจสอบบันทึกว่า ${n} อยู่ภายใต้${licenceText(f.license, 'th')} แต่ ExchangeTHB ยืนยันสถานะปัจจุบันไม่ได้ จึงควรตรวจรายชื่อผู้ได้รับใบอนุญาตของ ก.ล.ต. ก่อนฝากเงิน`,
      },
      {
        question: `เทียบสินทรัพย์อะไรบน ${n} ได้บ้าง`,
        answer: `หน้านี้เปรียบเทียบ ${pairsText(f, 'th')} ของ ${n} จำนวนคู่เทรดและความลึกของ order book อาจต่างกันตามช่วงเวลา จึงควรเช็ก order book ของคู่ที่ต้องการก่อนเทรด`,
      },
      {
        question: 'ค่าธรรมเนียมเทรดของแพลตฟอร์มไทยเทียบกันอย่างไร',
        answer: `ค่าธรรมเนียมเทรดในข้อมูลที่ตรวจสอบ: ${feeSummary('th')} ค่าธรรมเนียมเป็นเพียงส่วนหนึ่งของต้นทุน สเปรด (ส่วนต่างราคาซื้อ-ขาย) ความลึกของ order book และค่าถอนเงินบาทก็มีผลต่อยอดที่ได้รับ จึงควรใช้เครื่องมือเปรียบเทียบเพื่อดูยอด THB สุทธิ`,
      },
      {
        question: `ตัวอย่าง THB ในหน้า ${n} เป็นข้อมูลสดหรือไม่`,
        answer: 'แต่ละตัวอย่างมีป้ายระบุว่าเป็นข้อมูลเรียลไทม์หรือข้อมูลสำรองที่ตรวจแล้ว พร้อมเวลาที่สังเกต หากไม่มีตัวอย่างล่าสุด หน้านี้จะแจ้งให้ทราบ แทนที่จะแสดงตัวเลขที่สมมติขึ้น',
      },
    ],
    zh: [
      {
        question: `${n} 的交易手续费是多少？`,
        answer: `ExchangeTHB 于 ${f.reviewed} 核对的数据显示，${n} 的交易手续费为 ${fee(f)}${recv}。费率可能调整，交易前请到官网确认最新费率表。`,
      },
      {
        question: `从 ${n} 提现泰铢要多少钱？`,
        answer: f.thbWithdraw === null
          ? `核对的数据里没有 ${n} 公布的泰铢提现费，因此本页不写具体数字。缺少数字不等于免费，转账前请先查官网费用页。`
          : `核对的数据显示 ${n} 的泰铢提现费为 ${wd(f)}。具体金额及银行侧可能产生的费用请以官网为准。`,
      },
      {
        question: `怎么往 ${n} 充值泰铢？`,
        answer: bundle.depositSupported
          ? `${n} 支持泰铢充值和提现，并有本地化运营。ExchangeTHB 是比较网站，不代收资金，也没有列出充值步骤、额度或费用，请按 ${n} 官网的指引操作。`
          : `ExchangeTHB 核对的数据里没有 ${n} 的泰铢充值方式、额度或费用。ExchangeTHB 是比较网站，不代收资金，请先打开官网阅读充值说明再转账。`,
      },
      {
        question: `${n} 在泰国有牌照吗？`,
        answer: `核对的数据把 ${n} 记录为持有${licenceText(f.license, 'zh')}。ExchangeTHB 无法确认其当前牌照状态，充值前请先查泰国 SEC 公布的持牌机构名单。`,
      },
      {
        question: `${n} 这里可以比较哪些资产？`,
        answer: `本站在 ${n} 上比较 ${pairsText(f, 'zh')}。交易对覆盖和深度会随时段变化，下单前请查看对应交易对的订单簿。`,
      },
      {
        question: '泰国交易所的交易手续费怎么比较？',
        answer: `核对数据中的交易费：${feeSummary('zh')}。手续费只是成本的一部分，价差、订单簿深度和泰铢提现费也会改变你最终收到的金额，请用比较工具查看净到手 THB。`,
      },
      {
        question: `${n} 页面上的 THB 示例是实时的吗？`,
        answer: '每个示例都标明是实时来源还是已核对的备用数据，并带有观测时间；没有当前示例时，页面会直接说明，而不是编一个数字。',
      },
    ],
  };
  return copy[locale];
}

const labels: L3<{
  differentHeading: (name: string) => string;
  faqHeading: (name: string) => string;
  compareHeading: string;
  compareBody: string;
  compareCta: string;
  feesHeading: string;
  withdrawalUnknown: string;
  title: (f: ExchangeFacts) => string;
  answer: (f: ExchangeFacts, lead: string) => string;
}> = {
  en: {
    differentHeading: (name) => `What makes ${name} different`,
    faqHeading: (name) => `${name}: frequently asked questions`,
    compareHeading: 'Compare it with the other Thai exchanges',
    compareBody: 'Fees are only part of the cost. The comparison tool shows the net THB for the same amount on every exchange.',
    compareCta: 'Open the crypto comparison',
    feesHeading: 'Fees and coverage',
    withdrawalUnknown: 'Not published',
    title: (f) => `${f.name} Fees: ${fee(f)} Trading Fee & THB Withdrawal`,
    answer: (f, lead) => `${lead} It lists a ${fee(f)} trading fee${f.feeOnReceived ? ' (taken from the asset you receive)' : ''}${f.thbWithdraw === null ? '; its THB withdrawal fee is not published in our data' : ` and a ${wd(f)} THB withdrawal fee`}. Our data records it under a ${licenceText(f.license, 'en')}. Below: the latest USDT-to-THB example, the points that set it apart and what to verify before you deposit.`,
  },
  th: {
    differentHeading: (name) => `จุดที่ ${name} ต่างจากแพลตฟอร์มอื่น`,
    faqHeading: (name) => `คำถามที่พบบ่อยเกี่ยวกับ ${name}`,
    compareHeading: 'เทียบกับแพลตฟอร์มไทยอื่น',
    compareBody: 'ค่าธรรมเนียมเป็นเพียงส่วนหนึ่งของต้นทุน เครื่องมือเปรียบเทียบแสดงยอด THB สุทธิของจำนวนเดียวกันในทุกแพลตฟอร์ม',
    compareCta: 'เปิดหน้าเปรียบเทียบคริปโต',
    feesHeading: 'ค่าธรรมเนียมและสินทรัพย์ที่ครอบคลุม',
    withdrawalUnknown: 'ยังไม่มีข้อมูลเผยแพร่',
    title: (f) => `${f.name} ค่าธรรมเนียมเทรด ${fee(f)} และการถอนเงินบาท`,
    answer: (f, lead) => `${lead} ค่าธรรมเนียมเทรด ${fee(f)}${f.feeOnReceived ? ' หักจากสินทรัพย์ที่ได้รับ' : ''}${f.thbWithdraw === null ? ' ส่วนค่าถอนเงินบาทยังไม่มีข้อมูลที่เผยแพร่ในชุดข้อมูลของเรา' : ` และค่าถอนเงินบาท ${wd(f)}`} ข้อมูลของเราบันทึกว่าอยู่ภายใต้${licenceText(f.license, 'th')} ด้านล่างมีตัวอย่าง USDT → THB ล่าสุด จุดที่ต่างจากแพลตฟอร์มอื่น และสิ่งที่ควรตรวจสอบก่อนฝากเงิน`,
  },
  zh: {
    differentHeading: (name) => `${name} 的差异点`,
    faqHeading: (name) => `${name} 常见问题`,
    compareHeading: '与其他泰国交易所比较',
    compareBody: '手续费只是成本的一部分。比较工具会对同一金额给出每家交易所的净到手 THB。',
    compareCta: '打开加密货币比较',
    feesHeading: '费用与覆盖资产',
    withdrawalUnknown: '暂无公开数值',
    title: (f) => `${f.name} 手续费：交易费 ${fee(f)} 与泰铢提现`,
    answer: (f, lead) => `${lead}交易手续费 ${fee(f)}${f.feeOnReceived ? '（从收到的资产中扣除）' : ''}${f.thbWithdraw === null ? '，泰铢提现费在我们的数据里没有公开数值' : `，泰铢提现费 ${wd(f)}`}。数据记录其持有${licenceText(f.license, 'zh')}。下方有最新的 USDT → THB 示例、它的差异点，以及充值前需要核对的事项。`,
  },
};

export function buildExchangeSeo(slug: string, locale: Locale | string) {
  const facts = getExchangeFacts(slug);
  const bundle = bundles[slug];
  if (!facts || !bundle) return null;
  const copyLocale = toLocale(locale);
  const label = labels[copyLocale];
  const content: ExchangeSeoContent = {
    metaTitle: label.title(facts),
    metaDescription: bundle.metaDescription[copyLocale](facts),
    answer: label.answer(facts, bundle.lead[copyLocale]),
    differentHeading: label.differentHeading(facts.name),
    differentiators: bundle.differentiators[copyLocale](facts),
    faqHeading: label.faqHeading(facts.name),
    faqs: buildFaqs(facts, bundle, copyLocale),
    compareHeading: label.compareHeading,
    compareBody: label.compareBody,
    compareCta: label.compareCta,
    feesHeading: label.feesHeading,
    withdrawalUnknown: label.withdrawalUnknown,
  };
  return { facts, locale: copyLocale, content };
}

/** FinancialService node with only fields that data/site.ts supports. */
export function exchangeServiceJsonLd(input: { facts: ExchangeFacts; locale: Locale; description: string }) {
  const { facts, locale, description } = input;
  const url = withLocalePath(locale, `/exchanges/${facts.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${url}#exchange`,
    name: facts.name,
    url,
    description,
    sameAs: [facts.officialUrl],
    areaServed: { '@type': 'Country', name: 'Thailand' },
  };
}

/** FAQPage published by the site Organization declared once per page by the layout. */
export function exchangeFaqJsonLd(input: { locale: Locale; slug: string; faqs: ExchangeFaq[] }) {
  const url = withLocalePath(input.locale, `/exchanges/${input.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: toLocale(input.locale),
    publisher: { '@id': organizationId() },
    mainEntity: input.faqs.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}
