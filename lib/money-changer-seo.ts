import { cashBranches, cashProviders, publicCashProviderSlugs } from '@/data/site';
import type { Locale } from '@/lib/types';

// Money changer profile pages are rendered (and indexed) in en/th/zh only; every other
// locale is redirected to /en by middleware. Copy therefore covers those three locales and
// falls back to English, while all facts come from data/site.ts at build time.
export type ProfileLocale = 'en' | 'th' | 'zh';

export const moneyChangerProfileLocales: ProfileLocale[] = ['en', 'th', 'zh'];

export interface OpeningHoursRule {
  days: string[];
  opens: string;
  closes: string;
}

export interface MoneyChangerProfile {
  slug: string;
  name: string;
  brandThai?: string;
  area: string;
  branchName: string;
  /** Street address only when the branch record marks it as a real address. */
  streetAddress: string | null;
  /** Raw address string from the branch record (may be an area-level note). */
  addressNote: string | null;
  hours: string;
  hoursSpec: OpeningHoursRule[] | null;
  sundayOpen: boolean | null;
  mapUrl: string;
  officialUrl: string;
  geo: { latitude: number; longitude: number } | null;
}

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const dayAliases: Record<string, string> = {
  mon: 'Monday',
  monday: 'Monday',
  tue: 'Tuesday',
  tues: 'Tuesday',
  tuesday: 'Tuesday',
  wed: 'Wednesday',
  wednesday: 'Wednesday',
  thu: 'Thursday',
  thur: 'Thursday',
  thurs: 'Thursday',
  thursday: 'Thursday',
  fri: 'Friday',
  friday: 'Friday',
  sat: 'Saturday',
  saturday: 'Saturday',
  sun: 'Sunday',
  sunday: 'Sunday',
};

function normalizeDay(token: string) {
  return dayAliases[token.trim().toLowerCase().replace(/\.$/, '')];
}

function parseDayRange(value: string): string[] | null {
  const cleaned = value.replace(/^open\s+/i, '').replace(/\s+hours$/i, '').trim();
  if (!cleaned) return null;
  if (/^daily$/i.test(cleaned)) return [...allDays];
  if (/^weekdays?$/i.test(cleaned)) return allDays.slice(0, 5);
  if (/^weekends?$/i.test(cleaned)) return ['Saturday', 'Sunday'];

  const days: string[] = [];
  for (const chunk of cleaned.split(',').map((part) => part.trim()).filter(Boolean)) {
    const range = chunk.split(/\s*[-–]\s*/);
    if (range.length === 2) {
      const from = normalizeDay(range[0]);
      const to = normalizeDay(range[1]);
      if (!from || !to) return null;
      const start = allDays.indexOf(from);
      const end = allDays.indexOf(to);
      if (start < 0 || end < 0 || end < start) return null;
      days.push(...allDays.slice(start, end + 1));
      continue;
    }
    const single = normalizeDay(chunk);
    if (!single) return null;
    days.push(single);
  }
  return days.length ? days : null;
}

function normalizeTime(value: string) {
  const [hour, minute] = value.split(':');
  return `${hour.padStart(2, '0')}:${minute}`;
}

/**
 * Parses the branch hour strings used in data/site.ts into schema.org opening hours.
 * Returns null for anything it does not fully understand (for example "hours vary by
 * location; verify with the provider") so the page never publishes a guessed schedule.
 */
export function parseOpeningHours(value: string): OpeningHoursRule[] | null {
  if (!value || !/\d{1,2}:\d{2}/.test(value)) return null;
  const rules: OpeningHoursRule[] = [];
  for (const part of value.split(/[;,]/).map((piece) => piece.trim()).filter(Boolean)) {
    const time = part.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    if (!time) {
      // "Sun closed" style fragments are already implied by the remaining rules.
      if (/closed/i.test(part)) continue;
      return null;
    }
    if (/closed/i.test(part)) continue;
    const days = parseDayRange(part.slice(0, part.indexOf(time[0])));
    if (!days) return null;
    rules.push({ days, opens: normalizeTime(time[1]), closes: normalizeTime(time[2]) });
  }
  return rules.length ? rules : null;
}

export function isOpenOnSunday(rules: OpeningHoursRule[] | null) {
  if (!rules) return null;
  return rules.some((rule) => rule.days.includes('Sunday'));
}

export function getMoneyChangerProfile(slug: string): MoneyChangerProfile | null {
  if (!publicCashProviderSlugs.includes(slug as (typeof publicCashProviderSlugs)[number])) return null;
  const provider = cashProviders.find((item) => item.slug === slug);
  const branch = cashBranches.find((item) => item.providerSlug === slug);
  if (!provider || !branch) return null;
  const hasStreetAddress = branch.locationPrecision === 'address';
  const hoursSpec = parseOpeningHours(branch.hours);
  return {
    slug: provider.slug,
    name: provider.name,
    brandThai: provider.slug === 'ratchada' ? 'รัชดาเอ๊กซเชนจ์' : undefined,
    area: branch.area,
    branchName: branch.name,
    streetAddress: hasStreetAddress ? branch.address : null,
    addressNote: hasStreetAddress ? null : branch.address,
    hours: branch.hours,
    hoursSpec,
    sundayOpen: isOpenOnSunday(hoursSpec),
    mapUrl: branch.mapsUrl,
    officialUrl: provider.officialUrl,
    geo: branch.latitude != null && branch.longitude != null
      ? { latitude: branch.latitude, longitude: branch.longitude }
      : null,
  };
}

export interface ProfileContent {
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  /** Answer-first paragraph: where, when, how the rate works, what to bring. */
  answer: string;
  rateHeading: string;
  rateBody: string;
  locationHeading: string;
  hoursHeading: string;
  sundayYes: string;
  sundayNo: string;
  sundayUnknown: string;
  addressLabel: string;
  areaDisplay: string;
  hoursLabel: string;
  /** Published hours with locale day names, produced from the parsed schedule. */
  hoursDisplay: string;
  areaLabel: string;
  mapCta: string;
  officialCta: string;
  compareCta: string;
  compareTableHeading: string;
  compareTableBody: string;
  tableChanger: string;
  tableArea: string;
  tableHours: string;
  tableSunday: string;
  tableRate: string;
  currentBadge: string;
  faqHeading: string;
  verifyNote: string;
  sourceNote: string;
}

interface ProfileCopyBundle extends ProfileContent {
  faqs: Array<{ question: string; answer: string }>;
}

/** `./data/site.ts` stores hours in English (for example "Open daily 09:00-20:30").
 * Display them with locale day names; when a schedule cannot be parsed the raw
 * string is returned unchanged instead of a guess. */
export function formatOpeningHours(rules: OpeningHoursRule[] | null, raw: string, locale: Locale) {
  if (!rules || !rules.length) return raw;
  const dayNames: Record<Locale, Record<string, string>> = {
    en: { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' },
    th: { Monday: 'จ.', Tuesday: 'อ.', Wednesday: 'พ.', Thursday: 'พฤ.', Friday: 'ศ.', Saturday: 'ส.', Sunday: 'อา.' },
    zh: { Monday: '周一', Tuesday: '周二', Wednesday: '周三', Thursday: '周四', Friday: '周五', Saturday: '周六', Sunday: '周日' },
    ja: { Monday: '月', Tuesday: '火', Wednesday: '水', Thursday: '木', Friday: '金', Saturday: '土', Sunday: '日' },
    ko: { Monday: '월', Tuesday: '화', Wednesday: '수', Thursday: '목', Friday: '금', Saturday: '토', Sunday: '일' },
    ru: { Monday: 'Пн', Tuesday: 'Вт', Wednesday: 'Ср', Thursday: 'Чт', Friday: 'Пт', Saturday: 'Сб', Sunday: 'Вс' },
    fr: { Monday: 'lun.', Tuesday: 'mar.', Wednesday: 'mer.', Thursday: 'jeu.', Friday: 'ven.', Saturday: 'sam.', Sunday: 'dim.' },
    de: { Monday: 'Mo', Tuesday: 'Di', Wednesday: 'Mi', Thursday: 'Do', Friday: 'Fr', Saturday: 'Sa', Sunday: 'So' },
    id: { Monday: 'Sen', Tuesday: 'Sel', Wednesday: 'Rab', Thursday: 'Kam', Friday: 'Jum', Saturday: 'Sab', Sunday: 'Min' },
    vi: { Monday: 'T2', Tuesday: 'T3', Wednesday: 'T4', Thursday: 'T5', Friday: 'T6', Saturday: 'T7', Sunday: 'CN' },
  };
  const everyDay: Record<Locale, string> = {
    en: 'Daily', th: 'ทุกวัน', zh: '每天', ja: '毎日', ko: '매일', ru: 'Ежедневно', fr: 'Tous les jours', de: 'Täglich', id: 'Setiap hari', vi: 'Hằng ngày',
  };
  const daySeparator = locale === 'zh' ? '，' : ', ';
  const rangeSeparator = locale === 'zh' ? '至' : locale === 'ja' ? '〜' : '–';
  const names = dayNames[locale];
  const render = (rule: OpeningHoursRule) => {
    const indexes = rule.days.map((day) => allDays.indexOf(day)).sort((left, right) => left - right);
    const groups: number[][] = [];
    for (const index of indexes) {
      const last = groups[groups.length - 1];
      if (last && index === last[last.length - 1] + 1) last.push(index);
      else groups.push([index]);
    }
    const spans = groups.map((group) => (group.length === 1
      ? names[allDays[group[0]]]
      : `${names[allDays[group[0]]]}${rangeSeparator}${names[allDays[group[group.length - 1]]]}`));
    return { spans, time: `${rule.opens}–${rule.closes}` };
  };
  const rendered = rules.map(render);
  if (rendered.length === 1 && rendered[0].spans.length === 1 && rendered[0].spans[0] === `${names.Monday}${rangeSeparator}${names.Sunday}`) {
    return `${everyDay[locale]} ${rendered[0].time}`;
  }
  const merged = new Map<string, string[]>();
  for (const item of rendered) {
    const key = item.time;
    merged.set(key, [...(merged.get(key) || []), ...item.spans]);
  }
  return [...merged.entries()].map(([time, spans]) => `${spans.join(daySeparator)} ${time}`).join(daySeparator);
}

const copy: Record<ProfileLocale, Omit<ProfileCopyBundle, 'metaTitle' | 'metaDescription' | 'answer' | 'faqs' | 'hoursDisplay' | 'areaDisplay'>> = {
  en: {
    eyebrow: 'Bangkok money changer profile',
    rateHeading: "Today's reference rate",
    rateBody: 'Observed buying rates with the time each quote was collected. Counter rates move during the day, so confirm before you hand over cash.',
    locationHeading: 'Where this changer is',
    hoursHeading: 'Opening hours',
    sundayYes: 'Open on Sunday',
    sundayNo: 'Closed on Sunday',
    sundayUnknown: 'Sunday hours not verified',
    addressLabel: 'Address',
    hoursLabel: 'Hours',
    areaLabel: 'Area',
    mapCta: 'Open map',
    officialCta: 'Verify on official site',
    compareCta: 'Compare all Bangkok changers',
    compareTableHeading: 'How the three changers we cover compare',
    compareTableBody: 'Same-day observed USD buying rate, published hours and address precision for each changer. Rows come from the same collection as the comparison tool.',
    tableChanger: 'Changer',
    tableArea: 'Area',
    tableHours: 'Hours',
    tableSunday: 'Sunday',
    tableRate: 'USD buy (observed)',
    currentBadge: 'This page',
    faqHeading: 'Questions before you go',
    verifyNote: 'Rates are observations from public sources, not guaranteed counter quotes.',
    sourceNote: 'Estimated THB uses the observed buying rate for the banknote condition shown.',
  },
  th: {
    eyebrow: 'โปรไฟล์ร้านแลกเงินกรุงเทพ',
    rateHeading: 'เรทอ้างอิงวันนี้',
    rateBody: 'เรทรับซื้อที่สังเกตได้ พร้อมเวลาที่เก็บข้อมูล เรทหน้าร้านเปลี่ยนได้ตลอดวัน ควรยืนยันก่อนแลกจริง',
    locationHeading: 'ร้านนี้อยู่ที่ไหน',
    hoursHeading: 'เวลาเปิดทำการ',
    sundayYes: 'เปิดวันอาทิตย์',
    sundayNo: 'ปิดวันอาทิตย์',
    sundayUnknown: 'ยังไม่ยืนยันเวลาเปิดวันอาทิตย์',
    addressLabel: 'ที่อยู่',
    hoursLabel: 'เวลาเปิด',
    areaLabel: 'ย่าน',
    mapCta: 'เปิดแผนที่',
    officialCta: 'ยืนยันกับเว็บทางการ',
    compareCta: 'เทียบร้านแลกเงินในกรุงเทพทั้งหมด',
    compareTableHeading: 'เทียบสามร้านที่เรารวบรวมไว้',
    compareTableBody: 'เรทรับซื้อ USD ที่สังเกตในวันเดียวกัน เวลาเปิดที่ประกาศ และความละเอียดของที่อยู่ของแต่ละร้าน ข้อมูลชุดเดียวกับเครื่องมือเปรียบเทียบ',
    tableChanger: 'ร้าน',
    tableArea: 'ย่าน',
    tableHours: 'เวลาเปิด',
    tableSunday: 'วันอาทิตย์',
    tableRate: 'รับซื้อ USD (ที่สังเกต)',
    currentBadge: 'หน้านี้',
    faqHeading: 'คำถามก่อนเดินทาง',
    verifyNote: 'เรทเป็นค่าที่สังเกตจากแหล่งสาธารณะ ไม่ใช่เรทหน้าร้านที่รับประกัน',
    sourceNote: 'ยอด THB โดยประมาณคำนวณจากเรทรับซื้อที่สังเกตตามชนิดธนบัตรที่ระบุ',
  },
  zh: {
    eyebrow: '曼谷换汇店实体页',
    rateHeading: '今日参考汇率',
    rateBody: '这里列出观测到的买入汇率和采集时间。柜台汇率当天会变动，成交前请再确认。',
    locationHeading: '门店位置',
    hoursHeading: '营业时间',
    sundayYes: '周日营业',
    sundayNo: '周日休息',
    sundayUnknown: '周日营业时间未核实',
    addressLabel: '地址',
    hoursLabel: '营业时间',
    areaLabel: '区域',
    mapCta: '打开地图',
    officialCta: '前往官网确认',
    compareCta: '比较曼谷全部换汇店',
    compareTableHeading: '我们收录的三家换汇店对比',
    compareTableBody: '同一天观测的美元买入价、公布的营业时间与地址精确度，与会话比较工具使用同一批采集数据。',
    tableChanger: '换汇店',
    tableArea: '区域',
    tableHours: '营业时间',
    tableSunday: '周日',
    tableRate: '美元买入（观测）',
    currentBadge: '本页',
    faqHeading: '前往之前的常见问题',
    verifyNote: '汇率来自公开来源观测，不代表保证的柜台成交价。',
    sourceNote: '预计泰铢按所列纸币条件下的观测买入价计算。',
  },
};

interface ProviderCopy {
  brandThai?: string;
  metaTitle: Record<ProfileLocale, string>;
  metaDescription: Record<ProfileLocale, string>;
  answer: Record<ProfileLocale, string>;
  positioning: Record<ProfileLocale, string>;
  practical: Record<ProfileLocale, string[]>;
  extraFaq: Record<ProfileLocale, { question: string; answer: string }>;
}

// One hand-written block per provider so the three pages do not read as a swapped template.
const providers: Record<string, ProviderCopy> = {
  ratchada: {
    brandThai: 'รัชดาเอ๊กซเชนจ์',
    metaTitle: {
      en: 'Ratchada Exchange รัชดาเอ๊กซเชนจ์: rate today, 09:00–20:30',
      th: 'รัชดาเอ๊กซเชนจ์ (Ratchada Exchange) เรทวันนี้ เปิด 09:00–20:30',
      zh: 'Ratchada Exchange（รัชดาเอ๊กซเชนจ์）今日汇率、营业时间 09:00–20:30',
    },
    metaDescription: {
      en: 'Ratchada Exchange (รัชดาเอ๊กซเชนจ์), Huai Khwang: open daily 09:00–20:30 at 78/13 Prachatbamphen Rd. Today’s observed rate, map and official site.',
      th: 'รัชดาเอ๊กซเชนจ์ (Ratchada Exchange) ย่านห้วยขวาง เปิดทุกวัน 09:00–20:30 ที่ 78/13 Prachatbamphen Rd. ดูเรทที่สังเกตล่าสุด แผนที่ และเว็บทางการ',
      zh: 'Ratchada Exchange（รัชดาเอ๊กซเชนจ์）位于曼谷辉煌区，每天 09:00–20:30 营业，地址 78/13 Prachatbamphen Rd.。查看今日观测汇率、地图与官网入口。',
    },
    answer: {
      en: 'Ratchada Exchange is in Huai Khwang, Bangkok, at 78/13 Prachatbamphen Rd. It opens every day from 09:00 to 20:30. Today’s observed buying rate and the baht you would receive are below, with the time each quote was collected. Bring your passport: licensed Thai changers record ID.',
      th: 'รัชดาเอ๊กซเชนจ์ (Ratchada Exchange) อยู่ย่านห้วยขวาง กรุงเทพฯ ที่ 78/13 Prachatbamphen Rd. เปิดทุกวัน 09:00–20:30 เรทรับซื้อที่สังเกตล่าสุดและยอดบาทโดยประมาณอยู่ในส่วนถัดไป ควรพาหนังสือเดินทางไปด้วย เพราะร้านที่ได้ใบอนุญาตต้องบันทึกข้อมูลผู้แลก',
      zh: 'Ratchada Exchange（รัชดาเอ๊กซเชนจ์）位于曼谷辉煌区 78/13 Prachatbamphen Rd.，每天 09:00–20:30 营业，今日观测买入汇率与预计泰铢见下方。请带护照，持牌换汇店会登记换汇人身份。',
    },
    positioning: {
      en: 'This is a single-store changer that publishes its own rate page, so the quote you compare here can be checked again on its official site before you walk in.',
      th: 'ร้านนี้เป็นร้านเดี่ยวที่ประกาศหน้าเรทของตัวเอง เรทที่เห็นในหน้านี้จึงตรวจซ้ำได้ที่เว็บทางการก่อนเดินทาง',
      zh: '这是一家自己公布汇率页的单店换汇商，页面上的报价可以在官网再核对一次。',
    },
    practical: {
      en: ['Open seven days a week, including Sunday.', 'Street address is verified, so the map link drops you at the door.', 'Rates are published by the changer itself, not only by a head office.'],
      th: ['เปิดครบเจ็ดวัน รวมวันอาทิตย์', 'ที่อยู่ระดับเลขที่ได้รับการยืนยัน ลิงก์แผนที่จึงพาไปถึงหน้าร้าน', 'ร้านประกาศเรทเอง ไม่ใช่เฉพาะสำนักงานใหญ่'],
      zh: ['一周七天营业，含周日。', '地址已核实到门牌号，地图链接可直达门店。', '汇率由门店自行公布，不只靠总店报价。'],
    },
    extraFaq: {
      en: {
        question: 'Is Ratchada Exchange open on Sunday?',
        answer: 'Yes. The published schedule is daily 09:00–20:30, which includes Sunday and public holidays unless the store announces otherwise on its official site.',
      },
      th: {
        question: 'รัชดาเอ๊กซเชนจ์เปิดวันอาทิตย์ไหม',
        answer: 'เปิด เวลาที่ประกาศไว้คือทุกวัน 09:00–20:30 ซึ่งรวมวันอาทิตย์ เว้นแต่ทางร้านจะแจ้งเปลี่ยนแปลงบนเว็บทางการ',
      },
      zh: {
        question: 'Ratchada Exchange 周日营业吗？',
        answer: '营业。公布的时间是每天 09:00–20:30，包含周日；如门店在官网公告调整则以公告为准。',
      },
    },
  },
  'superrich-thailand': {
    metaTitle: {
      en: 'SuperRich Thailand: Pratunam rates, Mon–Sat 09:00–16:30',
      th: 'SuperRich Thailand เรทวันนี้ จันทร์–เสาร์ 09:00–16:30',
      zh: 'SuperRich Thailand 今日汇率、营业时间 周一至周六 09:00–16:30',
    },
    metaDescription: {
      en: 'SuperRich Thailand in Pratunam, Bangkok: branches open Monday to Saturday 09:00–16:30, closed Sunday. Today’s observed rate, map and official branch list.',
      th: 'SuperRich Thailand ย่านประตูน้ำ กรุงเทพฯ เปิดจันทร์–เสาร์ 09:00–16:30 ปิดวันอาทิตย์ ดูเรทที่สังเกตล่าสุด แผนที่ และรายชื่อสาขาทางการ',
      zh: 'SuperRich Thailand 位于曼谷水门（Pratunam）一带，周一至周六 09:00–16:30 营业，周日休息。查看今日观测汇率、地图与官网分行列表。',
    },
    answer: {
      en: 'SuperRich Thailand operates in the Pratunam area of central Bangkok. Branches run Monday to Saturday, 09:00–16:30, and close on Sunday. Today’s observed buying rate is below with its observation time. Choose the exact branch on the official contact page and bring your passport.',
      th: 'SuperRich Thailand อยู่ในย่านประตูน้ำใจกลางกรุงเทพฯ เปิดทำการจันทร์ถึงเสาร์ 09:00–16:30 และปิดวันอาทิตย์ เรทรับซื้อที่สังเกตล่าสุดพร้อมเวลาที่เก็บข้อมูลอยู่ในส่วนถัดไป ควรเลือกสาขาที่ต้องการจากหน้าติดต่อทางการ และพาหนังสือเดินทางไปด้วย',
      zh: 'SuperRich Thailand 位于曼谷市中心水门（Pratunam）一带，周一至周六 09:00–16:30 营业，周日休息。今日观测买入汇率与采集时间见下方。具体分行请在官网联系页选择，前往时请带护照。',
    },
    positioning: {
      en: 'A larger chain with several Bangkok branches, so this page tracks the Pratunam area quotes and points you to the official branch selector rather than guessing an address.',
      th: 'เป็นเครือที่มีหลายสาขาในกรุงเทพฯ หน้านี้จึงติดตามเรทในย่านประตูน้ำ และพาไปเลือกสาขาจากหน้าทางการแทนการเดาที่อยู่',
      zh: '这是拥有多家曼谷分行的连锁品牌，因此本页跟踪水门一带的报价，并把具体分行交给官网选择，不猜测地址。',
    },
    practical: {
      en: ['Closed on Sunday, unlike the other two changers on this site.', 'Branch addresses are chosen on the official contact page; this page marks the area, not a guessed street address.', 'Hours end at 16:30, earlier than most Pratunam shops.'],
      th: ['ปิดวันอาทิตย์ ต่างจากอีกสองร้านในเว็บนี้', 'ที่อยู่สาขาเลือกจากหน้าติดต่อทางการ หน้านี้ระบุเป็นย่าน ไม่เดาเลขที่', 'ปิด 16:30 เร็วกว่าร้านแถวประตูน้ำหลายร้าน'],
      zh: ['周日休息，与本站另外两家不同。', '分行地址在官网联系页选择，本页只标区域，不猜门牌号。', '16:30 结束营业，比水门多数门店早。'],
    },
    extraFaq: {
      en: {
        question: 'Does SuperRich Thailand open on Sunday?',
        answer: 'The published schedule is Monday to Saturday 09:00–16:30, so Sunday is not covered. Confirm holidays on the official site before travelling.',
      },
      th: {
        question: 'SuperRich Thailand เปิดวันอาทิตย์ไหม',
        answer: 'เวลาที่ประกาศไว้คือจันทร์ถึงเสาร์ 09:00–16:30 จึงไม่ครอบคลุมวันอาทิตย์ ควรตรวจวันหยุดเพิ่มเติมบนเว็บทางการก่อนเดินทาง',
      },
      zh: {
        question: 'SuperRich Thailand 周日营业吗？',
        answer: '公布的时间是周一至周六 09:00–16:30，不含周日。出发前请在官网确认节假日安排。',
      },
    },
  },
  'twelve-victory': {
    metaTitle: {
      en: 'Twelve Victory Exchange: Pradipat rates, open 7 days',
      th: 'Twelve Victory Exchange เรทวันนี้ เปิดครบเจ็ดวัน',
      zh: 'Twelve Victory Exchange 今日汇率、营业时间 全周营业',
    },
    metaDescription: {
      en: 'Twelve Victory Exchange head office, 231 Pradipat Rd, Bangkok: weekdays 08:30–17:00, weekends 09:00–16:00. Today’s observed rate, map and official site.',
      th: 'Twelve Victory Exchange สำนักงานใหญ่ 231 Pradipat Rd. กรุงเทพฯ จันทร์–ศุกร์ 08:30–17:00 เสาร์–อาทิตย์ 09:00–16:00 ดูเรทที่สังเกตล่าสุดและแผนที่',
      zh: 'Twelve Victory Exchange 总部位于曼谷 231 Pradipat Rd.，周一至周五 08:30–17:00、周末 09:00–16:00。查看今日观测汇率与地图。',
    },
    answer: {
      en: 'Twelve Victory Exchange runs its head office at 231 Pradipat Road in Phaya Thai, Bangkok. Weekday hours are 08:30–17:00 and weekends 09:00–16:00, so it opens all seven days. Today’s observed buying rate is below. Bring your passport, as licensed changers record ID.',
      th: 'Twelve Victory Exchange ตั้งสำนักงานใหญ่ที่ 231 Pradipat Road เขตพญาไท กรุงเทพฯ เวลาทำการจันทร์–ศุกร์ 08:30–17:00 และเสาร์–อาทิตย์ 09:00–16:00 จึงเปิดครบเจ็ดวัน เรทรับซื้อที่สังเกตล่าสุดอยู่ในส่วนถัดไป ควรพาหนังสือเดินทางไปด้วย',
      zh: 'Twelve Victory Exchange 总部位于曼谷 231 Pradipat Road（Phaya Thai 区），周一至周五 08:30–17:00、周末 09:00–16:00，全周营业。今日观测买入汇率与采集时间见下方。前往请带护照，持牌换汇店会登记换汇人身份。',
    },
    positioning: {
      en: 'This is the head office rather than a mall kiosk, and it is the only one of our three profiles with different weekday and weekend hours.',
      th: 'ที่นี่เป็นสำนักงานใหญ่ไม่ใช่เคาน์เตอร์ในห้าง และเป็นหนึ่งในสองร้านที่เวลาเสาร์–อาทิตย์ต่างจากวันธรรมดา',
      zh: '这里是总部而非商场柜台，也是我们收录的三家里唯一周末与工作日营业时间不同的。',
    },
    practical: {
      en: ['Different weekday and weekend hours; both are published above.', 'The head office is listed at 231 Pradipat Road in Phaya Thai, Bangkok.', 'Opens at 08:30 on weekdays, the earliest of the three profiles.'],
      th: ['เวลาเสาร์–อาทิตย์ต่างจากวันธรรมดา และแจ้งไว้ทั้งสองช่วง', 'สำนักงานใหญ่อยู่ที่ 231 Pradipat Road เขตพญาไท กรุงเทพฯ', 'เปิด 08:30 ในวันธรรมดา เร็วที่สุดในสามร้านที่รวบรวม'],
      zh: ['周末与工作日时间不同，两段都已列出。', '总部地址为曼谷 Phaya Thai 区 231 Pradipat Road。', '工作日 08:30 开门，是三家收录门店中最早的。'],
    },
    extraFaq: {
      en: {
        question: 'Are weekend hours different at Twelve Victory?',
        answer: 'Yes. Weekdays run 08:30–17:00 and weekends 09:00–16:00, so Saturday and Sunday both open but close an hour earlier than Friday.',
      },
      th: {
        question: 'เสาร์–อาทิตย์ Twelve Victory เปิดเวลาเดียวกันไหม',
        answer: 'ไม่เหมือนกัน วันธรรมดา 08:30–17:00 ส่วนเสาร์–อาทิตย์ 09:00–16:00 จึงเปิดทั้งสองวันแต่ปิดเร็วกว่าวันศุกร์หนึ่งชั่วโมง',
      },
      zh: {
        question: 'Twelve Victory 周末时间不同吗？',
        answer: '不同。工作日 08:30–17:00，周末 09:00–16:00，周六周日都营业，但比周五早一小时关门。',
      },
    },
  },
};

type AddressKind = 'street' | 'listed' | 'area';

function addressKind(profile: MoneyChangerProfile): AddressKind {
  if (profile.streetAddress) return 'street';
  if (profile.addressNote && /\d/.test(profile.addressNote)) return 'listed';
  return 'area';
}

// Locale area names, used inside FAQ prose. Street addresses stay exactly as published in
// data/site.ts (Latin script) so the page never invents a transliteration.
const areaNames: Record<string, Record<ProfileLocale, string>> = {
  ratchada: { en: 'Huai Khwang, Bangkok', th: 'ห้วยขวาง', zh: '辉煌区（Huai Khwang）' },
  'superrich-thailand': { en: 'the Pratunam area of Bangkok', th: 'ประตูน้ำ', zh: '水门（Pratunam）一带' },
  'twelve-victory': { en: 'Phaya Thai, Bangkok', th: 'พญาไท', zh: 'Phaya Thai 区' },
};

function faqEntries(profile: MoneyChangerProfile, locale: ProfileLocale, bundle: ProviderCopy, hoursDisplay: string) {
  const kind = addressKind(profile);
  const area = areaNames[profile.slug]?.[locale] || profile.area;
  // Thai copy names the shop by its Thai brand first; English/Chinese keep the Latin name.
  const brand = locale === 'th' && profile.brandThai ? `${profile.brandThai} (${profile.name})` : profile.name;
  const address = profile.streetAddress || profile.addressNote || '';
  const sameEveryDay = Boolean(profile.hoursSpec && profile.hoursSpec.length === 1 && profile.hoursSpec[0].days.length === 7);
  const sunday = profile.sundayOpen === null
    ? copy[locale].sundayUnknown
    : profile.sundayOpen ? copy[locale].sundayYes : copy[locale].sundayNo;

  const addressClause: Record<ProfileLocale, string> = kind === 'street'
    ? {
        en: `Address: ${address}.`,
        th: `ที่อยู่ ${address}`,
        zh: `地址：${address}。`,
      }
    : kind === 'listed'
      ? {
          en: `Listed address: ${address}. Confirm it on the official contact page.`,
          th: `ที่อยู่ที่ประกาศไว้ ${address} ควรยืนยันกับหน้าติดต่อทางการอีกครั้ง`,
          zh: `公布地址：${address}，请到官网联系页确认。`,
        }
      : {
          en: 'The area is confirmed; the exact branch is chosen on the official contact page.',
          th: 'ยืนยันได้เพียงระดับย่าน ส่วนสาขาที่แน่นอนเลือกจากหน้าติดต่อทางการ',
          zh: '区域已确认，具体分行请在官网联系页选择。',
        };

  const hoursAnswer: Record<ProfileLocale, string> = {
    en: `Published hours: ${hoursDisplay}.${sameEveryDay ? '' : ` ${sunday}.`} Confirm holiday closures on the official site.`,
    th: `เวลาที่ประกาศไว้คือ ${hoursDisplay}${sameEveryDay ? '' : ` (${sunday})`} ควรตรวจวันหยุดเพิ่มเติมบนเว็บทางการ`,
    zh: `公布时间为${hoursDisplay}${sameEveryDay ? '' : `（${sunday}）`}。节假日安排请在官网确认。`,
  };

  const shared: Record<ProfileLocale, Array<{ question: string; answer: string }>> = {
    en: [
      {
        question: `Where is ${brand}?`,
        answer: `${brand} is in ${area}. ${addressClause.en} The map link on this page opens the location.`,
      },
      {
        question: `What are ${brand} opening hours?`,
        answer: hoursAnswer.en,
      },
      {
        question: `Are the ${profile.name} rates on this page live?`,
        answer: 'Each quote carries its source state and observation time. When the collected quote is stale or missing, the page labels the fallback instead of showing a made-up number. Always confirm at the counter.',
      },
      {
        question: 'Do you need a passport to exchange money in Thailand?',
        answer: 'Yes. Licensed Thai money changers record the identity of the person exchanging, so bring your passport. Larger amounts are checked more carefully.',
      },
      {
        question: 'Which banknotes were these rates quoted for?',
        answer: 'The denomination column shows the banknote condition behind each quote, for example 100-dollar notes. Smaller or marked notes usually quote differently, so compare the same denomination.',
      },
      {
        question: 'How do I verify the official rate before I go?',
        answer: `${profile.name} publishes its own rate channel; open the official link on this page and compare the counter rate with the observed rate here.`,
      },
    ],
    th: [
      {
        question: `${brand} อยู่ที่ไหน`,
        answer: `${brand} อยู่ในย่าน${area} ${addressClause.th} ลิงก์แผนที่ในหน้านี้เปิดตำแหน่งให้ตรวจต่อ`,
      },
      {
        question: `${brand} เปิดกี่โมง`,
        answer: hoursAnswer.th,
      },
      {
        question: `เรทในหน้านี้เป็นเรทสดหรือไม่`,
        answer: 'แต่ละเรทมีสถานะแหล่งข้อมูลและเวลาที่สังเกตกำกับ ถ้าข้อมูลเก่าหรือขาด หน้าเว็บจะแสดงป้ายสำรองแทนการสร้างตัวเลขขึ้นมา ควรยืนยันที่เคาน์เตอร์อีกครั้ง',
      },
      {
        question: 'แลกเงินในไทยต้องใช้หนังสือเดินทางไหม',
        answer: 'ต้องใช้ ร้านแลกเงินที่ได้ใบอนุญาตในไทยบันทึกข้อมูลผู้แลก จึงควรพาหนังสือเดินทางไปด้วย ยอดใหญ่จะถูกตรวจละเอียดกว่า',
      },
      {
        question: 'เรทนี้คิดจากธนบัตรชนิดไหน',
        answer: 'คอลัมน์ชนิดธนบัตรระบุสภาพธนบัตรของแต่ละเรท เช่น ธนบัตร 100 ดอลลาร์ ธนบัตรใบเล็กหรือมีรอยมักได้เรทต่าง จึงควรเทียบชนิดเดียวกัน',
      },
      {
        question: 'จะตรวจเรททางการก่อนไปได้อย่างไร',
        answer: `${brand} มีช่องทางเรททางการของตัวเอง เปิดลิงก์ทางการในหน้านี้แล้วเทียบเรทหน้าร้านกับเรทที่สังเกตไว้`,
      },
    ],
    zh: [
      {
        question: `${brand} 在哪里？`,
        answer: `${brand} 位于${area}。${addressClause.zh}本页地图链接可直接打开位置。`,
      },
      {
        question: `${brand} 几点开门？`,
        answer: hoursAnswer.zh,
      },
      {
        question: '本页汇率是实时的吗？',
        answer: '每条报价都带来源状态和观测时间；采集数据过期或缺失时，页面会标注备用状态，而不是编一个数字。成交前请再到柜台确认。',
      },
      {
        question: '在泰国换钱需要护照吗？',
        answer: '需要。泰国持牌换汇店会登记换汇人身份，请随身携带护照；金额较大时核验更细。',
      },
      {
        question: '这些报价对应哪种纸币？',
        answer: '纸币条件一列标明每条报价对应的纸币，例如 100 美元面额。小额或有污损的纸币报价通常不同，比较时请对齐同一面额。',
      },
      {
        question: '出发前怎么核对官方汇率？',
        answer: `${profile.name} 有官方汇率渠道，打开本页的官网链接，把柜台汇率与这里的观测值对照即可。`,
      },
    ],
  };

  return [bundle.extraFaq[locale], ...shared[locale]];
}

export function buildMoneyChangerSeo(slug: string, locale: Locale) {
  const profile = getMoneyChangerProfile(slug);
  if (!profile) return null;
  const copyLocale: ProfileLocale = locale === 'th' || locale === 'zh' ? locale : 'en';
  const bundle = providers[slug];
  if (!bundle) return null;
  const base = copy[copyLocale];
  const hoursDisplay = formatOpeningHours(profile.hoursSpec, profile.hours, copyLocale);
  const content: ProfileCopyBundle = {
    ...base,
    hoursDisplay,
    areaDisplay: areaNames[profile.slug]?.[copyLocale] || profile.area,
    metaTitle: bundle.metaTitle[copyLocale],
    metaDescription: bundle.metaDescription[copyLocale],
    answer: bundle.answer[copyLocale],
    faqs: faqEntries(profile, copyLocale, bundle, hoursDisplay),
  };
  return {
    profile,
    locale: copyLocale,
    content,
    positioning: bundle.positioning[copyLocale],
    practical: bundle.practical[copyLocale],
  };
}

export interface ExchangeServiceJsonLdInput {
  name: string;
  url: string;
  officialUrl: string;
  area: string;
  streetAddress: string | null;
  hoursSpec: OpeningHoursRule[] | null;
  geo: { latitude: number; longitude: number } | null;
  mapUrl: string;
}

/**
 * LocalBusiness/FinancialService markup for a real, single counter.
 * schema.org has no CurrencyExchangeService type (schema.org/CurrencyExchangeService returns 404,
 * checked 2026-10-18), so this uses the valid pair LocalBusiness + FinancialService. Fields are
 * only emitted when data/site.ts holds a verified value; an area-level note never becomes a
 * postal street address.
 */
export function currencyExchangeJsonLd(input: ExchangeServiceJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'FinancialService'],
    '@id': `${input.url}#exchange`,
    name: input.name,
    url: input.url,
    sameAs: [input.officialUrl],
    hasMap: input.mapUrl,
    areaServed: { '@type': 'City', name: 'Bangkok' },
    address: input.streetAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: input.streetAddress,
          addressLocality: 'Bangkok',
          addressCountry: 'TH',
        }
      : undefined,
    geo: input.geo
      ? { '@type': 'GeoCoordinates', latitude: input.geo.latitude, longitude: input.geo.longitude }
      : undefined,
    openingHoursSpecification: input.hoursSpec
      ? input.hoursSpec.map((rule) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: rule.days,
          opens: rule.opens,
          closes: rule.closes,
        }))
      : undefined,
    currenciesAccepted: 'THB, USD, EUR, JPY, CNY, GBP',
    paymentAccepted: 'Cash',
  };
}

export const moneyChangerProfileSlugs = publicCashProviderSlugs;
