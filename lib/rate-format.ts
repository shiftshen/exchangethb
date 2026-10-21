import type { CurrencyCode, Locale } from '@/lib/types';

// Pure helpers (no cache / DB imports) shared by the rate table and the static SEO copy.

export type RateLocale = 'en' | 'th' | 'zh';

export function rateLocale(locale: Locale): RateLocale {
  return locale === 'th' || locale === 'zh' ? locale : 'en';
}

export const currencyNames: Record<RateLocale, Record<CurrencyCode, string>> = {
  en: { USD: 'US dollar', EUR: 'Euro', JPY: 'Japanese yen', CNY: 'Chinese yuan', GBP: 'British pound', AUD: 'Australian dollar', CAD: 'Canadian dollar', SGD: 'Singapore dollar', HKD: 'Hong Kong dollar', CHF: 'Swiss franc', NZD: 'New Zealand dollar', KRW: 'Korean won', TWD: 'Taiwan dollar', MYR: 'Malaysian ringgit', INR: 'Indian rupee' },
  th: { USD: 'ดอลลาร์สหรัฐ', EUR: 'ยูโร', JPY: 'เยนญี่ปุ่น', CNY: 'หยวนจีน', GBP: 'ปอนด์อังกฤษ', AUD: 'ดอลลาร์ออสเตรเลีย', CAD: 'ดอลลาร์แคนาดา', SGD: 'ดอลลาร์สิงคโปร์', HKD: 'ดอลลาร์ฮ่องกง', CHF: 'ฟรังก์สวิส', NZD: 'ดอลลาร์นิวซีแลนด์', KRW: 'วอนเกาหลี', TWD: 'ดอลลาร์ไต้หวัน', MYR: 'ริงกิตมาเลเซีย', INR: 'รูปีอินเดีย' },
  zh: { USD: '美元', EUR: '欧元', JPY: '日元', CNY: '人民币', GBP: '英镑', AUD: '澳元', CAD: '加元', SGD: '新加坡元', HKD: '港币', CHF: '瑞士法郎', NZD: '新西兰元', KRW: '韩元', TWD: '新台币', MYR: '马来西亚林吉特', INR: '印度卢比' },
};

const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** Bangkok wall-clock parts (UTC+7, no DST) without depending on the server timezone or ICU data. */
function bangkokParts(value: string | Date) {
  const ms = (value instanceof Date ? value.getTime() : Date.parse(value)) + 7 * 3600_000;
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms);
  return {
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    hm: `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`,
  };
}

/** "17 Oct 17:00" / "17 ต.ค. 17:00" / "10月17日 17:00" (Bangkok time; the caller says "ICT"). */
export function formatBangkokStamp(value: string | Date | null | undefined, locale: RateLocale): string | null {
  if (!value) return null;
  const p = bangkokParts(value);
  if (!p) return null;
  if (locale === 'zh') return `${p.month + 1}月${p.day}日 ${p.hm}`;
  if (locale === 'th') return `${p.day} ${thMonths[p.month]} ${p.hm}`;
  return `${p.day} ${enMonths[p.month]} ${p.hm}`;
}

export interface RatchadaMeta { title: string; description: string }

/**
 * Title/description for the Ratchada profile. The "updated" stamp is the latest quote time the
 * page itself shows; without any quote the stamp (and the currency count) is simply omitted.
 */
export function ratchadaMeta(locale: RateLocale, stamp: string | null, count: number, usdRate: number | null = null): RatchadaMeta {
  const usd = usdRate && usdRate > 0 ? usdRate.toFixed(2) : null;
  if (locale === 'th') {
    return {
      title: usd ? `รัชดาเอกเช้น รับซื้อ USD ${usd} บาท${stamp ? ` · อัปเดต ${stamp}` : ''}` : (stamp ? `รัชดาเอกเช้น Ratchada Exchange เรทวันนี้ อัปเดต ${stamp}` : 'รัชดาเอกเช้น Ratchada Exchange เรทวันนี้ ห้วยขวาง เปิด 09:00–20:30'),
      description: `${usd ? `รับซื้อเงินสด USD ${usd} บาท/ดอลลาร์ ` : ''}รัชดาเอกเช้น (รัชดาเอ๊กซเชนจ์ / Ratchada Exchange) ย่านห้วยขวาง เรทวันนี้${count ? ` ${count} สกุลเงิน` : ''}${stamp ? ` อัปเดต ${stamp} น.` : ''} เปิดทุกวัน 09:00–20:30 พร้อมแผนที่และเว็บทางการ`,
    };
  }
  if (locale === 'zh') {
    return {
      title: usd ? `Ratchada Exchange 美元买入 ${usd} 泰铢${stamp ? ` · 更新 ${stamp}` : ''}` : (stamp ? `Ratchada Exchange 汇权区（ห้วยขวาง）今日汇率 · 更新 ${stamp}` : 'Ratchada Exchange 汇权区（ห้วยขวาง）今日汇率 · 09:00–20:30'),
      description: `${usd ? `美元现金买入价 ${usd} 泰铢。` : ''}Ratchada Exchange（รัชดาเอ๊กซเชนจ์）位于曼谷汇权区（ห้วยขวาง），今日汇率${count ? ` ${count} 个币种` : ''}${stamp ? `，更新于 ${stamp}（曼谷时间）` : ''}，每天 09:00–20:30 营业，附地图与官网入口。`,
    };
  }
  return {
    title: usd ? `Ratchada Exchange Rate Today: ${usd} THB per USD${stamp ? ` · updated ${stamp}` : ''}` : (stamp ? `Ratchada Exchange Rate Today · Updated ${stamp}` : 'Ratchada Exchange Rate Today · Huai Khwang, 09:00–20:30'),
    description: `${usd ? `USD cash buying ${usd} baht. ` : ''}Ratchada Exchange (รัชดาเอ๊กซเชนจ์) rate today${count ? `: ${count} currencies` : ''}${stamp ? `, updated ${stamp} ICT` : ''}. Huai Khwang, Bangkok, open daily 09:00–20:30 at 78/13 Prachatbamphen Rd. Map and official site.`,
  };
}
