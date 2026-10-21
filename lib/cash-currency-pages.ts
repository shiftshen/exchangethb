import { readCashCache } from '@/lib/cash-cache-store';
import { publicCashProviders } from '@/data/site';
import type { Locale } from '@/lib/types';

// Cash currencies that the site already quotes and that carry a full localized page.
// Codes match the ones accepted by the cash comparison tool (components/cash-decision-tool.tsx).
export const cashCurrencyCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'] as const;
export type CashCurrencyCode = (typeof cashCurrencyCodes)[number];

export const indexedCashCurrencyLocales: Locale[] = ['en', 'th', 'zh'];

export function isCashCurrencyCode(value: string): value is CashCurrencyCode {
  return (cashCurrencyCodes as readonly string[]).includes(value.toUpperCase());
}

export function cashCurrencyPath(code: CashCurrencyCode) {
  return `/cash/${code.toLowerCase()}`;
}

export interface CurrencyRateRow {
  slug: string;
  name: string;
  denomination: string;
  buyRate: number;
  sellRate: number;
  observedAt: string;
  current: boolean;
}

export interface CurrencyRates {
  code: CashCurrencyCode;
  rows: CurrencyRateRow[];
  generatedAt: string | null;
  latestObservedAt: string | null;
}

const CURRENCY_NAMES: Record<Locale, Record<CashCurrencyCode, string>> = {
  en: { USD: 'US dollar', EUR: 'euro', GBP: 'British pound', JPY: 'Japanese yen', CNY: 'Chinese yuan' },
  th: { USD: 'ดอลลาร์สหรัฐ', EUR: 'ยูโร', GBP: 'ปอนด์อังกฤษ', JPY: 'เยนญี่ปุ่น', CNY: 'หยวนจีน' },
  zh: { USD: '美元', EUR: '欧元', GBP: '英镑', JPY: '日元', CNY: '人民币' },
  ja: { USD: '米ドル', EUR: 'ユーロ', GBP: '英ポンド', JPY: '日本円', CNY: '中国人民元' },
  ko: { USD: '미국 달러', EUR: '유로', GBP: '영국 파운드', JPY: '일본 엔', CNY: '중국 위안' },
  fr: { USD: 'dollar américain', EUR: 'euro', GBP: 'livre sterling', JPY: 'yen japonais', CNY: 'yuan chinois' },
  de: { USD: 'US-Dollar', EUR: 'Euro', GBP: 'Britisches Pfund', JPY: 'Japanischer Yen', CNY: 'Chinesischer Yuan' },
  id: { USD: 'dolar AS', EUR: 'euro', GBP: 'pound Inggris', JPY: 'yen Jepang', CNY: 'yuan Tiongkok' },
  vi: { USD: 'đô la Mỹ', EUR: 'euro', GBP: 'bảng Anh', JPY: 'yên Nhật', CNY: 'nhân dân tệ' },
  ru: { USD: 'доллар США', EUR: 'евро', GBP: 'фунт стерлингов', JPY: 'японская иена', CNY: 'китайский юань' },
};

export function currencyName(locale: Locale, code: CashCurrencyCode) {
  return (CURRENCY_NAMES[locale] ?? CURRENCY_NAMES.en)[code];
}

/** Latest observed buy/sell rate per public provider for one cash currency. */
export async function loadCurrencyRates(code: CashCurrencyCode): Promise<CurrencyRates> {
  const cache = await readCashCache().catch(() => ({ generatedAt: null, results: [] as Awaited<ReturnType<typeof readCashCache>>['results'] }));
  const allowed = new Set(publicCashProviders.map((provider) => provider.slug));
  const byProvider = new Map<string, CurrencyRateRow>();
  for (const result of cache.results ?? []) {
    if (!allowed.has(result.provider)) continue;
    for (const rate of result.rates ?? []) {
      if (rate.currency !== code) continue;
      const provider = publicCashProviders.find((item) => item.slug === result.provider);
      if (!provider) continue;
      const existing = byProvider.get(result.provider);
      if (existing && Date.parse(existing.observedAt) >= Date.parse(rate.observedAt)) continue;
      byProvider.set(result.provider, {
        slug: provider.slug,
        name: provider.name,
        denomination: rate.denomination,
        buyRate: rate.buyRate,
        sellRate: rate.sellRate,
        observedAt: rate.observedAt,
        current: true,
      });
    }
  }
  const rows = [...byProvider.values()].sort((left, right) => right.buyRate - left.buyRate);
  const latestObservedAt = rows.map((row) => row.observedAt).sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null;
  return { code, rows, generatedAt: cache.generatedAt ?? null, latestObservedAt };
}

export interface CurrencyCopy {
  title: string;
  description: string;
  intro: string;
  tableHeaders: { provider: string; denomination: string; buy: string; sell: string; observed: string };
  bestLabel: string;
  exampleLabel: string;
  noData: string;
  notes: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedLabel: string;
  backLabel: string;
}

export function currencyCopy(locale: Locale, code: CashCurrencyCode): CurrencyCopy {
  const localName = currencyName(locale, code);
  if (locale === 'th') {
    return {
      title: `เรทแลกเงิน ${code} เป็นบาท วันนี้ — เทียบ 3 ร้านแลกเงินกรุงเทพ`,
      description: `เรทรับซื้อเงินสด ${localName} (${code}) ล่าสุดจากร้านแลกเงินในกรุงเทพฯ ที่ ExchangeTHB เก็บข้อมูลเอง เทียบก่อนไปแลก`,
      intro: `หน้านี้แสดงเรทรับซื้อและเรทขายเงินสด ${localName} (${code}) ที่ ExchangeTHB เก็บจากประกาศของแต่ละร้านโดยตรง ระบบเก็บข้อมูลทุก 10 นาที ตัวเลขที่เห็นคือเรทที่สังเกตได้ ไม่ใช่ราคาที่เคาน์เตอร์ และไม่ใช่คำรับประกัน`,
      tableHeaders: { provider: 'ร้านแลกเงิน', denomination: 'ชนิดธนบัตร', buy: `รับซื้อ (บาท/1 ${code})`, sell: `ขาย (บาท/1 ${code})`, observed: 'เวลาที่เก็บข้อมูล' },
      bestLabel: 'เรทรับซื้อดีที่สุดที่สังเกตได้ตอนนี้',
      exampleLabel: 'ตัวอย่าง: แลก',
      noData: 'ยังไม่มีข้อมูลเรทล่าสุดจากร้านที่เปิดเผยราคา โปรดดูหน้าเปรียบเทียบเงินสดหรือยืนยันกับร้านก่อนไป',
      notes: [
        'เรทขึ้นกับชนิดธนบัตร (เช่น 100 ดอลลาร์ได้เรทดีกว่า 20 ดอลลาร์) และสภาพธนบัตร',
        'ตัวเลขทั้งหมดเป็นเรทที่เก็บจากประกาศสาธารณะของร้าน ไม่ใช่ใบเสนอราคา ณ เคาน์เตอร์',
        'ควรโทรหรือสอบถามร้านก่อนแลกจำนวนมาก และตรวจรับเงินให้ครบก่อนออกจากเคาน์เตอร์',
      ],
      faq: [
        { question: `เรทรับซื้อ ${code} วันนี้ดีที่สุดเท่าไหร่?`, answer: 'ดูตารางด้านบน ระบบจะแสดงร้านที่ให้เรทรับซื้อสูงสุดพร้อมเวลาที่เก็บข้อมูลล่าสุด' },
        { question: `แลก ${code} ที่ไหนในกรุงเทพได้เรทดี?`, answer: 'เรทต่างกันในแต่ละร้านและแต่ละช่วงเวลา ให้เทียบในตารางนี้แล้วยืนยันกับร้านก่อนไป' },
        { question: 'เรทในหน้านี้ใช้ได้จริงหรือไม่?', answer: 'เป็นเรทที่สังเกตได้จากประกาศของร้าน ไม่ใช่ราคาที่รับประกัน ณ เคาน์เตอร์' },
      ],
      relatedLabel: 'สกุลเงินอื่น',
      backLabel: 'กลับไปหน้าเปรียบเทียบเงินสด',
    };
  }
  if (locale === 'zh') {
    return {
      title: `${code} 换泰铢现金汇率（曼谷）— 三家换汇店比价`,
      description: `${localName}（${code}）现金在曼谷换汇店的最新买入/卖出汇率，数据由 ExchangeTHB 每 10 分钟自行采集`,
      intro: `本页列出 ${localName}（${code}）现金在曼谷三家公开报价换汇店的买入与卖出汇率。数据来自各店公开牌价，每 10 分钟采集一次；这是观测到的牌价，不是柜台成交价，也不构成成交承诺。`,
      tableHeaders: { provider: '换汇店', denomination: '面额', buy: `买入（THB / 1 ${code}）`, sell: `卖出（THB / 1 ${code}）`, observed: '采集时间' },
      bestLabel: '当前观测到的最高买入价',
      exampleLabel: '示例：兑换',
      noData: '暂时没有可用的最新牌价，请回到现金比价页或先向店家确认。',
      notes: [
        '汇率与面额有关（例如 100 美元通常优于 20 美元），也受钞票新旧影响。',
        '页面数字是公开牌价的观测值，不是柜台报价。',
        '大额兑换前先电话确认，并在柜台点清金额再离开。',
      ],
      faq: [
        { question: `今天 ${code} 换泰铢的最好价格是多少？`, answer: '看上表：表格会给出买入价最高的店家和对应采集时间。' },
        { question: `在曼谷哪里换 ${code} 比较划算？`, answer: '不同店家、不同时点差别明显，先用本页比价，再到店确认。' },
        { question: '这里的汇率可以直接成交吗？', answer: '不能，这是观测到的牌价，最终以柜台为准。' },
      ],
      relatedLabel: '其他币种',
      backLabel: '返回现金比价页',
    };
  }
  return {
    title: `${code} to THB cash rate in Bangkok — compare 3 money changers`,
    description: `Latest observed ${localName} (${code}) cash buying and selling rates at Bangkok money changers, collected by ExchangeTHB every 10 minutes.`,
    intro: `This page shows the ${localName} (${code}) cash buying and selling rates we observe at Bangkok money changers that publish their rates. ExchangeTHB collects them every 10 minutes; these are observed published rates, not counter quotes, and not a promise of execution.`,
    tableHeaders: { provider: 'Money changer', denomination: 'Banknote', buy: `Buy (THB per 1 ${code})`, sell: `Sell (THB per 1 ${code})`, observed: 'Observed' },
    bestLabel: 'Best observed buying rate right now',
    exampleLabel: 'Example: exchange',
    noData: 'No current published rate is available from the tracked changers. Check the cash comparison page or confirm with the changer before you go.',
    notes: [
      'The rate depends on the banknote denomination (100s usually beat 20s) and on note condition.',
      'Every number here is an observation of published rates, not a counter quote.',
      'For large amounts, call ahead and count the money before leaving the counter.',
    ],
    faq: [
      { question: `What is the best ${code} to THB cash rate today?`, answer: 'Check the table above: it ranks the tracked changers by buying rate and shows when each rate was observed.' },
      { question: `Where should I exchange ${code} in Bangkok?`, answer: 'Rates differ by changer and by hour. Compare on this page, then confirm with the changer before travelling.' },
      { question: 'Can I trade at the rate shown here?', answer: 'No. These are observed published rates; the counter decides the final rate.' },
    ],
    relatedLabel: 'Other currencies',
    backLabel: 'Back to the cash comparison',
  };
}

/** Title/description carrying the observed number — the query is usually "usd to thb". */
export function currencyQuoteCopy(locale: Locale, code: CashCurrencyCode, best: { name: string; buyRate: number; observedAt: string } | null) {
  if (!best) return null;
  const rate = best.buyRate.toFixed(2);
  const stamp = formatObserved(best.observedAt, locale);
  if (locale === 'th') {
    return { title: `${code} เป็นบาท: รับซื้อ ${rate} บาท (${best.name}) · ${stamp}`, description: `เรทรับซื้อเงินสด ${code} ล่าสุด ${rate} บาท ที่ ${best.name} อัปเดต ${stamp} เทียบกับอีกร้านก่อนไปแลก` };
  }
  if (locale === 'zh') {
    return { title: `${code} 换泰铢：${rate} 泰铢最高买入价（${best.name}）· ${stamp}`, description: `${code} 现金买入价 ${rate}（${best.name}，${stamp}）。比价后再去换，附另两家换汇店报价。` };
  }
  return { title: `${code} to THB: ${rate} best cash rate in Bangkok (${best.name}) · ${stamp}`, description: `${code} cash buying rate ${rate} THB at ${best.name}, observed ${stamp}. Compare the other Bangkok changers before you go.` };
}

export function formatRate(value: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
}

export function formatObserved(value: string, locale: Locale) {
  const tag = locale === 'th' ? 'th-TH-u-ca-gregory' : locale === 'zh' ? 'sv-SE' : 'en-GB';
  return new Intl.DateTimeFormat(tag, { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Bangkok' }).format(new Date(value));
}
