import { compareCashLive } from '@/lib/cash-live';
import { getCashHubChangers, isCashHubLocale, type CashHubLocale } from '@/lib/cash-hub-seo';
import type { CurrencyCode, Locale } from '@/lib/types';
import { exchanges } from '@/data/site';

// SEO-19: direct answers (40-70 words) for the ten AI-citation questions. Every figure comes
// from the same cash cache the comparison tool reads (rate, banknote group, observedAt); the
// copy itself has no numbers of its own. Changers are always listed in the fixed site order.
// A quote older than MAX_AGE_MS is not used at all; a stale-but-recent one is still shown with its time.
export const MAX_AGE_MS = 48 * 60 * 60 * 1000;
// A comparison between two changers is only stated when both quotes were observed in the same
// collection cycle (SAME_CYCLE_MS); otherwise each quote is given with its own time.
export const SAME_CYCLE_MS = 15 * 60 * 1000;

export interface AnswerQuote {
  slug: string;
  name: string;
  buyRate: number;
  denomination: string;
  observedAt: string;
  current: boolean;
}

type Row = { providerSlug: string; buyRate: number; denomination: string; observedAt: string; current: boolean };

export function quotesFromRows(rows: Row[], locale: Locale | string): AnswerQuote[] {
  const changers = getCashHubChangers(locale);
  return changers
    .map((changer) => {
      const row = rows.find((item) => item.providerSlug === changer.slug);
      return row && Number.isFinite(Date.parse(row.observedAt))
        ? { slug: changer.slug, name: changer.name, buyRate: row.buyRate, denomination: row.denomination, observedAt: row.observedAt, current: row.current }
        : null;
    })
    .filter((item): item is AnswerQuote => Boolean(item));
}

export async function loadAnswerQuotes(currency: CurrencyCode, locale: Locale | string): Promise<AnswerQuote[]> {
  const result = await compareCashLive({ currency, amount: 1000, maxDistanceKm: 100, locale: locale as Locale }).catch(() => null);
  return quotesFromRows((result?.all ?? []) as Row[], locale);
}

const dateLocale: Record<CashHubLocale, string> = { en: 'en-GB', th: 'th-TH-u-ca-gregory', zh: 'zh-CN' };

export function formatAnswerTime(value: string, locale: CashHubLocale, withZone = true) {
  // zh uses the ISO-like numeric form (2026-10-19 00:52) so the date reads as one short unit.
  const text = new Intl.DateTimeFormat(locale === 'zh' ? 'sv-SE' : dateLocale[locale], { dateStyle: locale === 'zh' ? 'short' : 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok' }).format(new Date(Date.parse(value)));
  return withZone ? `${text} (GMT+7)` : text;
}

function formatRate(value: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
}

function isBanknoteSpec(value: string) {
  return /^[\d\s,\-–]+$/.test(value);
}

function denomText(locale: CashHubLocale, value: string) {
  if (!isBanknoteSpec(value)) return '';
  return locale === 'en' ? ` (banknote ${value})` : locale === 'th' ? ` (ธนบัตร ${value})` : `（纸币 ${value}）`;
}

function usable(quotes: AnswerQuote[], now = Date.now()) {
  return quotes.filter((q) => now - Date.parse(q.observedAt) <= MAX_AGE_MS);
}

function sameCycle(quotes: AnswerQuote[]) {
  const times = quotes.map((q) => Date.parse(q.observedAt));
  return Math.max(...times) - Math.min(...times) <= SAME_CYCLE_MS;
}

function latest(quotes: AnswerQuote[]) {
  return quotes.reduce((a, b) => (Date.parse(b.observedAt) > Date.parse(a.observedAt) ? b : a)).observedAt;
}

const L = {
  en: {
    join: (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`),
    sep: ', ',
    observed: (t: string) => `(${t})`,
    zone: 'Times are GMT+7.',
    updated: (t: string) => `Data updated ${t}.`,
    word: { USD: 'US dollar', CNY: 'Chinese yuan' } as Record<string, string>,
  },
  th: {
    join: (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} และ ${items[items.length - 1]}`),
    sep: ', ',
    observed: (t: string) => `(${t})`,
    zone: 'เวลา GMT+7',
    updated: (t: string) => `ข้อมูลอัปเดตเมื่อ ${t}`,
    word: { USD: 'ดอลลาร์สหรัฐ', CNY: 'หยวนจีน' } as Record<string, string>,
  },
  zh: {
    join: (items: string[]) => items.join('、'),
    sep: '；',
    observed: (t: string) => `（${t}）`,
    zone: '时间均为 GMT+7。',
    updated: (t: string) => `数据更新于 ${t}。`,
    word: { USD: '美元', CNY: '人民币' } as Record<string, string>,
  },
} as const;

function quoteLine(locale: CashHubLocale, quotes: AnswerQuote[]) {
  const l = L[locale];
  const same = sameCycle(quotes);
  const list = quotes.map((q) => `${q.name} ${formatRate(q.buyRate)}${same ? '' : ` ${l.observed(formatAnswerTime(q.observedAt, locale, false))}`}`).join(l.sep);
  const time = same ? l.updated(formatAnswerTime(latest(quotes), locale)) : l.zone;
  return { list, time, names: l.join(quotes.map((q) => q.name)) };
}

// Q1 / Q6 / Q9: "where to exchange cash in Bangkok" on /{en,th,zh}/cash.
export function buildBestPlaceAnswer(locale: CashHubLocale, quotes: AnswerQuote[]): string | null {
  const live = usable(quotes);
  if (!live.length) return null;
  const { list, time } = quoteLine(locale, live);
  if (locale === 'en') return `From ExchangeTHB's own collection of the changers' published rates, the latest observed US dollar cash buying rates in baht per dollar: ${list}. ${time} ExchangeTHB does not rank changers; rates depend on the banknote group, so confirm with the changer.`.replace(/\s+/g, ' ');
  if (locale === 'th') return `ExchangeTHB เก็บเรทที่ร้านประกาศ เรทรับซื้อเงินสดดอลลาร์สหรัฐล่าสุดที่สังเกตได้ (บาทต่อดอลลาร์) คือ ${list} ${time} ExchangeTHB ไม่จัดอันดับร้าน เรทขึ้นกับกลุ่มธนบัตร โปรดยืนยันกับร้านก่อนไปแลก`.replace(/\s+/g, ' ');
  return `根据 ExchangeTHB 自行采集的各店公布牌价，美元现钞最新观测收购价（泰铢/美元）为：${list}。${time}本站不给换汇店排名，汇率随纸币组别而异，出发前请向店家确认。`.replace(/\s+/g, ' ');
}

// Q4 / Q7 / Q10: the currency question, answered inside the matching currency section.
export function buildCurrencyAnswer(locale: CashHubLocale, code: 'USD' | 'CNY', quotes: AnswerQuote[]): string | null {
  const live = usable(quotes);
  if (!live.length) return null;
  const { list, time } = quoteLine(locale, live);
  const word = L[locale].word[code];
  if (locale === 'en') return `ExchangeTHB names no single winner: rates depend on the banknote group and observation time. Latest observed ${word} cash buying rates collected from the changers, in baht per ${word}: ${list}. ${time} Confirm with the changer before you go.`.replace(/\s+/g, ' ');
  if (locale === 'th') return `ExchangeTHB ไม่ชี้ว่าร้านใดเหนือกว่า เพราะเรทขึ้นกับกลุ่มธนบัตรและเวลาที่สังเกต เรทรับซื้อเงินสด${word}ล่าสุดที่เก็บจากแต่ละร้าน (บาทต่อหน่วย) คือ ${list} ${time} โปรดยืนยันเรทกับร้านก่อนไปแลก`.replace(/\s+/g, ' ');
  return `本站不指定唯一结论：汇率随纸币组别和观测时间而异。ExchangeTHB 采集的各店${word}现钞最新收购价（泰铢/${word}）为：${list}。${time}出发前请向店家确认汇率。`.replace(/\s+/g, ' ');
}

export const currencyFaqQuestion: Record<CashHubLocale, { code: 'USD' | 'CNY'; question: string }> = {
  en: { code: 'USD', question: 'What is the best THB exchange rate in Bangkok today?' },
  th: { code: 'USD', question: 'ราคาแลกเงินยูเอสดี วันนี้ กรุงเทพ เท่าไร?' },
  zh: { code: 'CNY', question: '泰国换钱：人民币兑泰铢汇率今天是多少（曼谷）？' },
};

export interface CashPageLive {
  best: string | null;
  direct: { code: 'USD' | 'CNY'; text: string } | null;
  faq: { question: string; answer: string } | null;
}

export async function buildCashPageLive(locale: Locale | string): Promise<CashPageLive | null> {
  if (!isCashHubLocale(locale)) return null;
  const spec = currencyFaqQuestion[locale];
  const [usd, directQuotes] = await Promise.all([loadAnswerQuotes('USD', locale), spec.code === 'USD' ? null : loadAnswerQuotes(spec.code, locale)]);
  const text = buildCurrencyAnswer(locale, spec.code, directQuotes ?? usd);
  return {
    best: buildBestPlaceAnswer(locale, usd),
    direct: text ? { code: spec.code, text } : null,
    faq: text ? { question: spec.question, answer: text } : null,
  };
}

// Q2 (en) / Q8 (th): Ratchada Exchange profile.
export const ratchadaFaqQuestion: Partial<Record<CashHubLocale, string>> = {
  en: 'What is the Ratchada Exchange rate today?',
  th: 'ร้านแลกเงินแถวรัชดา ที่ไหนเรทดี?',
};

export function buildRatchadaAnswer(locale: CashHubLocale, usd: AnswerQuote[]): string | null {
  const q = usable(usd).find((item) => item.slug === 'ratchada');
  const info = getCashHubChangers(locale).find((item) => item.slug === 'ratchada');
  if (!q || !info) return null;
  const rate = formatRate(q.buyRate);
  const time = formatAnswerTime(q.observedAt, locale);
  const denom = denomText(locale, q.denomination);
  if (locale === 'en') return `${q.name}'s latest observed US dollar cash buying rate is ${rate} baht per dollar${denom}, from ExchangeTHB's own collection of its published rates. Data updated ${time}. This is an observation, not a counter quote: confirm the rate and banknote condition with the changer before you go.`;
  if (locale === 'th') return `ร้านแลกเงินแถวรัชดาที่ ExchangeTHB รวบรวมไว้คือ ${q.name} (${info.area}, เวลาเปิด ${info.hours}) เรทรับซื้อเงินสดดอลลาร์สหรัฐล่าสุดที่สังเกตได้คือ ${rate} บาทต่อดอลลาร์${denom} ข้อมูลอัปเดตเมื่อ ${time} เป็นเรทที่สังเกตได้ ไม่ใช่ราคาหน้าร้าน โปรดยืนยันกับร้านก่อนไป`;
  return null;
}

// Q3 (en): SuperRich Thailand vs Ratchada Exchange, only as a same-cycle statement of fact.
export const versusFaqQuestion = 'How do SuperRich Thailand and Ratchada Exchange compare today?';

export function buildVersusAnswer(locale: CashHubLocale, usd: AnswerQuote[]): string | null {
  const a = usable(usd).find((item) => item.slug === 'superrich-thailand');
  const b = usable(usd).find((item) => item.slug === 'ratchada');
  if (locale !== 'en' || !a || !b) return null;
  const same = sameCycle([a, b]);
  const da = denomText('en', a.denomination);
  const db = denomText('en', b.denomination);
  if (same) return `On the same ExchangeTHB observation (${formatAnswerTime(latest([a, b]), 'en')}), the US dollar cash buying rate is ${formatRate(a.buyRate)} baht at ${a.name}${da} and ${formatRate(b.buyRate)} baht at ${b.name}${db}. Rates depend on the banknote group, so compare the same group and confirm with each changer. These are observations, not counter quotes.`;
  return `ExchangeTHB makes no direct comparison because the two quotes were not observed at the same time: ${a.name} ${formatRate(a.buyRate)} baht${da} (observed ${formatAnswerTime(a.observedAt, 'en')}); ${b.name} ${formatRate(b.buyRate)} baht${db} (observed ${formatAnswerTime(b.observedAt, 'en')}). Rates depend on the banknote group, so confirm with each changer.`;
}

// Q5 (en): cash or crypto, on /en/crypto. Cash figures are the observed USD rates; the crypto
// side states only what the comparison measures.
export function buildCashVsCryptoAnswer(locale: CashHubLocale, usd: AnswerQuote[]): string | null {
  const live = usable(usd);
  if (locale !== 'en' || !live.length) return null;
  const { list, time } = quoteLine('en', live);
  return `Cash and crypto are two routes to baht; ExchangeTHB recommends neither. Cash: latest observed US dollar buying rates, in baht per dollar: ${list}. ${time} Crypto: this page compares ${exchanges.length} Thai SEC-licensed exchanges by fees and quote status. No figure is guaranteed.`.replace(/\s+/g, ' ');
}

export function isAnswerLocale(locale: string): locale is CashHubLocale {
  return isCashHubLocale(locale);
}
