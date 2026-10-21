import { readCashCache } from '@/lib/cash-cache-store';
import { cashCurrencies, type CurrencyCode } from '@/lib/types';
import { publicCashProviders } from '@/data/site';
import type { Locale } from '@/lib/types';

export const ratesMatrixLocales: Locale[] = ['en', 'th', 'zh'];

export interface MatrixCell {
  slug: string;
  name: string;
  buyRate: number;
  sellRate: number;
  denomination: string;
  observedAt: string;
}

export interface MatrixRow {
  code: CurrencyCode;
  cells: MatrixCell[];
}

export interface RatesMatrix {
  rows: MatrixRow[];
  providers: Array<{ slug: string; name: string }>;
  latestObservedAt: string | null;
  generatedAt: string | null;
}

/** One row per cash currency, one cell per public provider, latest observed quote only. */
export async function loadRatesMatrix(): Promise<RatesMatrix> {
  const cache = await readCashCache().catch(() => ({ generatedAt: null, results: [] as Awaited<ReturnType<typeof readCashCache>>['results'] }));
  const providers = publicCashProviders.map((provider) => ({ slug: provider.slug, name: provider.name }));
  const allowed = new Set(providers.map((provider) => provider.slug));
  const best = new Map<string, MatrixCell>();
  for (const result of cache.results ?? []) {
    if (!allowed.has(result.provider)) continue;
    const provider = providers.find((item) => item.slug === result.provider);
    if (!provider) continue;
    for (const rate of result.rates ?? []) {
      const key = `${rate.currency}:${result.provider}`;
      const existing = best.get(key);
      if (existing && Date.parse(existing.observedAt) >= Date.parse(rate.observedAt)) continue;
      best.set(key, {
        slug: provider.slug,
        name: provider.name,
        buyRate: rate.buyRate,
        sellRate: rate.sellRate,
        denomination: rate.denomination,
        observedAt: rate.observedAt,
      });
    }
  }
  const rows: MatrixRow[] = cashCurrencies
    .map((code) => ({ code, cells: providers.map((provider) => best.get(`${code}:${provider.slug}`)).filter((cell): cell is MatrixCell => Boolean(cell)) }))
    .filter((row) => row.cells.length > 0);
  const latestObservedAt = rows.flatMap((row) => row.cells.map((cell) => cell.observedAt)).sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null;
  return { rows, providers, latestObservedAt, generatedAt: cache.generatedAt ?? null };
}

export interface RatesCopy {
  title: string;
  description: string;
  intro: string;
  headers: { currency: string; provider: string; buy: string; sell: string; observed: string };
  notes: string[];
  faq: Array<{ question: string; answer: string }>;
  empty: string;
  backLabel: string;
}

export function ratesCopy(locale: Locale): RatesCopy {
  if (locale === 'th') {
    return {
      title: 'เรทแลกเงินสดวันนี้ — เทียบทุกสกุลเงินและทุกเจ้าในกรุงเทพ',
      description: 'ตารางเรทรับซื้อ/ขายเงินสดล่าสุดของ USD EUR GBP JPY CNY และอีก 10 สกุล จากร้านแลกเงินที่เปิดเผยราคา เก็บข้อมูลโดย ExchangeTHB ทุก 10 นาที',
      intro: 'ตารางนี้รวมเรทเงินสดล่าสุดของทุกสกุลที่เราติดตาม เทียบกับร้านที่ประกาศราคาแต่ละเจ้า ตัวเลขคือเรทที่สังเกตได้จากประกาศสาธารณะ ไม่ใช่ราคาเคาน์เตอร์ และไม่ใช่คำรับประกัน',
      headers: { currency: 'สกุลเงิน', provider: 'ร้านแลกเงิน', buy: 'รับซื้อ (บาท)', sell: 'ขาย (บาท)', observed: 'เวลาเก็บข้อมูล' },
      notes: ['ช่องว่างหมายถึงร้านนั้นไม่ประกาศเรทสกุลนี้ หรือข้อมูลยังไม่อัปเดต', 'เรทขึ้นกับชนิดธนบัตรและสภาพธนบัตร', 'ยืนยันกับร้านก่อนแลกจำนวนมาก'],
      faq: [
        { question: 'วันนี้สกุลไหนได้เรทดีที่สุด?', answer: 'ดูแถวของแต่ละสกุลในตาราง ระบบเรียงตามเรทรับซื้อล่าสุดของแต่ละร้าน และแสดงเวลาที่เก็บข้อมูล' },
        { question: 'ทำไมบางช่องว่าง?', answer: 'เพราะร้านนั้นไม่ประกาศเรทสกุลนั้น หรือรอบเก็บข้อมูลล่าสุดยังไม่ได้รับข้อมูล' },
      ],
      empty: 'ยังไม่มีข้อมูลเรทจากร้านที่เปิดเผยราคาในขณะนี้',
      backLabel: 'กลับไปหน้าเปรียบเทียบเงินสด',
    };
  }
  if (locale === 'zh') {
    return {
      title: '今日现金汇率总表 — 曼谷各换汇店全币种比价',
      description: '美元、欧元、英镑、日元、人民币等 15 种货币在曼谷换汇店的最新买入/卖出价，数据由 ExchangeTHB 每 10 分钟采集',
      intro: '这张总表把目前跟踪的全部币种与公开报价的换汇店放在一起比较。数字来自各店公开牌价，是观测值，不是柜台成交价。',
      headers: { currency: '币种', provider: '换汇店', buy: '买入（THB）', sell: '卖出（THB）', observed: '采集时间' },
      notes: ['空白表示该店没有公布这个币种，或本轮没有取到数据', '汇率与面额、钞票新旧有关', '大额兑换前请先与店家确认'],
      faq: [
        { question: '今天哪个币种最划算？', answer: '看对应币种那一行，表格按各店最新买入价排列，并标注采集时间。' },
        { question: '为什么有些格子是空的？', answer: '因为该店没有公布这个币种，或本轮采集没有拿到数据。' },
      ],
      empty: '目前没有可用的公开牌价数据。',
      backLabel: '返回现金比价页',
    };
  }
  return {
    title: 'Cash exchange rates today — every currency, every Bangkok money changer',
    description: 'Latest observed buy and sell rates for USD, EUR, GBP, JPY, CNY and ten more currencies at Bangkok money changers, collected by ExchangeTHB every 10 minutes.',
    intro: 'This table puts every cash currency we track next to every money changer that publishes rates. Values are observed published rates, not counter quotes and not a promise of execution.',
    headers: { currency: 'Currency', provider: 'Money changer', buy: 'Buy (THB)', sell: 'Sell (THB)', observed: 'Observed' },
    notes: ['An empty cell means that changer does not publish the currency, or the last cycle had no quote.', 'Rates depend on the banknote denomination and condition.', 'Confirm with the changer before exchanging large amounts.'],
    faq: [
      { question: 'Which currency has the best rate today?', answer: 'Check that currency row: the table lists each changer with its latest observed buying rate and the time it was observed.' },
      { question: 'Why are some cells empty?', answer: 'That changer does not publish the currency, or the latest collection cycle did not return a quote for it.' },
    ],
    empty: 'No published rate is available from the tracked changers right now.',
    backLabel: 'Back to the cash comparison',
  };
}
