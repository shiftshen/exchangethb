import { cashCurrencies } from '@/lib/types';
import { formatOpeningHours, getMoneyChangerProfile, moneyChangerProfileSlugs } from '@/lib/money-changer-seo';
import { organizationId, withLocalePath } from '@/lib/seo';
import type { Locale } from '@/lib/types';

// /cash is the cash comparison landing page. The hand-written answer, currency sections and
// FAQ below exist in en/th/zh; every other locale keeps the page it had. The copy states no
// figure of its own: changer names, areas, hours and the currency count are derived from
// data/site.ts at build time and observed rates are read from the same cash cache as the
// comparison tool. tests/cash-hub-seo.test.ts enforces both rules.
export type CashHubLocale = 'en' | 'th' | 'zh';
export const cashHubLocales: CashHubLocale[] = ['en', 'th', 'zh'];
export const cashHubCurrencies = ['USD', 'EUR', 'JPY', 'CNY'] as const;
export type CashHubCurrency = (typeof cashHubCurrencies)[number];

export function isCashHubLocale(locale: Locale | string): locale is CashHubLocale {
  return locale === 'en' || locale === 'th' || locale === 'zh';
}

export interface CashHubChanger {
  slug: string;
  name: string;
  area: string;
  hours: string;
  sundayOpen: boolean | null;
}

export interface CashHubFaq {
  question: string;
  answer: string;
}

export interface CashHubCurrencyCopy {
  heading: string;
  intro: string;
  cta: string;
}

export interface CashHubContent {
  metaTitle: string;
  metaDescription: string;
  answerHeading: string;
  answer: string;
  currencies: Record<CashHubCurrency, CashHubCurrencyCopy>;
  faqHeading: string;
  faqs: CashHubFaq[];
  labels: {
    rate: string;
    banknotes: string;
    headline: string;
    observed: string;
    recent: string;
    reference: string;
    noQuote: string;
    noneAtAll: string;
    profile: string;
  };
}

export function getCashHubChangers(locale: Locale | string): CashHubChanger[] {
  const display = (isCashHubLocale(locale) ? locale : 'en') as Locale;
  return moneyChangerProfileSlugs
    .map((slug) => getMoneyChangerProfile(slug))
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile))
    .map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      area: profile.area,
      hours: formatOpeningHours(profile.hoursSpec, profile.hours, display),
      sundayOpen: profile.sundayOpen,
    }));
}

type Parts = {
  join: (items: string[]) => string;
  sep: string;
  colon: string;
};

const parts: Record<CashHubLocale, Parts> = {
  en: {
    join: (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`),
    sep: '; ',
    colon: ': ',
  },
  th: { join: (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} และ ${items[items.length - 1]}`), sep: '; ', colon: ': ' },
  zh: { join: (items) => items.join('、'), sep: '；', colon: '：' },
};

const currencyWord: Record<CashHubLocale, Record<CashHubCurrency, string>> = {
  en: { USD: 'US dollars', EUR: 'euros', JPY: 'Japanese yen', CNY: 'Chinese yuan' },
  th: { USD: 'ดอลลาร์สหรัฐ', EUR: 'ยูโร', JPY: 'เยนญี่ปุ่น', CNY: 'หยวนจีน' },
  zh: { USD: '美元', EUR: '欧元', JPY: '日元', CNY: '人民币' },
};

export function buildCashHubContent(locale: CashHubLocale, changers: CashHubChanger[] = getCashHubChangers(locale)): CashHubContent {
  const p = parts[locale];
  const withArea = p.join(changers.map((c) => (locale === 'zh' ? `${c.name}（${c.area}）` : `${c.name} (${c.area})`)));
  const withHours = p.join(changers.map((c) => (locale === 'zh' ? `${c.name}（${c.area}，${c.hours}）` : `${c.name} (${c.area}, ${c.hours})`)));
  const hoursOnly = changers.map((c) => `${c.name}${p.colon}${c.hours}`).join(p.sep);
  const sundayOpen = changers.filter((c) => c.sundayOpen === true).map((c) => c.name);
  const sundayClosed = changers.filter((c) => c.sundayOpen === false).map((c) => c.name);
  const sundayUnknown = changers.filter((c) => c.sundayOpen === null).map((c) => c.name);
  const currencyCount = cashCurrencies.length;
  const currencyList = locale === 'zh' ? cashHubCurrencies.join('、') : cashHubCurrencies.join(', ');
  const currencyListTh = `${cashHubCurrencies.slice(0, -1).join(', ')} และ ${cashHubCurrencies[cashHubCurrencies.length - 1]}`;

  if (locale === 'en') {
    const sunday = [
      sundayOpen.length ? `${p.join(sundayOpen)} ${sundayOpen.length > 1 ? 'list' : 'lists'} Sunday opening hours.` : '',
      sundayClosed.length ? `${p.join(sundayClosed)} ${sundayClosed.length > 1 ? 'do' : 'does'} not list Sunday hours.` : '',
      sundayUnknown.length ? `For ${p.join(sundayUnknown)} the published hours do not say, so check with the changer.` : '',
    ].filter(Boolean).join(' ');
    return {
      metaTitle: 'USD, EUR, JPY & CNY to Thai baht: Bangkok money changers',
      metaDescription: `Compare cash to Thai baht in Bangkok: ${p.join(changers.map((c) => c.name))}. Hours and latest observed buying rates for USD, EUR, JPY, CNY.`,
      answerHeading: 'Where can I exchange cash for Thai baht in Bangkok?',
      answer: `The Bangkok money changers listed on ExchangeTHB are ${withHours}. Pick a currency below (${currencyList}) to see each changer's latest observed buying rate and the banknote condition it applies to, or enter your own amount in the comparison tool above. Observed rates are not final quotes: confirm the rate with the changer before you go.`,
      currencies: Object.fromEntries(cashHubCurrencies.map((code) => [code, {
        heading: `Where to exchange ${currencyWord.en[code]} (${code}) to Thai baht in Bangkok?`,
        intro: `Latest observed buying rate for ${code} cash at each listed changer, in baht for one unit of ${code}. Compare the estimated total for your own amount before choosing.`,
        cta: `Compare ${code} with your amount`,
      }])) as Record<CashHubCurrency, CashHubCurrencyCopy>,
      faqHeading: 'Questions about exchanging cash for baht in Bangkok',
      faqs: [
        { question: 'Where can I exchange cash for Thai baht in Bangkok?', answer: `This site covers ${withArea}. Each has its own page with the published opening hours and the latest observed rate.` },
        { question: 'What are the opening hours of these money changers?', answer: `Published hours: ${hoursOnly}. Hours can change, so confirm with the changer before a special trip.` },
        { question: 'Which money changer is open on Sunday?', answer: sunday },
        { question: 'How do I compare USD, EUR, JPY or CNY to baht?', answer: 'Choose the currency and enter the amount in the comparison tool above, or use the currency sections on this page. The tool shows the estimated baht for each changer. Compare the estimated total and the banknote condition, not only the displayed rate.' },
        { question: 'Why can the rate depend on the banknotes I bring?', answer: 'Some changers publish a separate rate for each banknote group, so the rate depends on the notes you carry. The banknote condition is shown next to every observed rate.' },
        { question: 'Are the rates shown here final?', answer: 'No. They are the latest rates observed from each changer\'s published information, with the observation time shown. Confirm the final rate and the banknote conditions with the changer before you go.' },
        { question: 'Does ExchangeTHB exchange money or take payments?', answer: 'No. ExchangeTHB is a comparison website. It does not exchange money, receive payments or hold funds. You deal with the money changer directly.' },
        { question: 'How many currencies can I compare?', answer: `The comparison tool covers ${currencyCount} currencies, including ${currencyList}. A changer with no quote for a currency is simply not listed for it.` },
      ],
      labels: {
        rate: 'Buying rate',
        banknotes: 'Banknotes',
        headline: 'Headline rate; confirm the banknote with the changer',
        observed: 'Observed',
        recent: 'Recent quote',
        reference: 'Reference data (older quote)',
        noQuote: 'No observed quote for this currency from',
        noneAtAll: 'No observed quote is available right now. Open the comparison to check again.',
        profile: 'Profile',
      },
    };
  }

  if (locale === 'th') {
    const sunday = [
      sundayOpen.length ? `${p.join(sundayOpen)} มีเวลาเปิดวันอาทิตย์ที่ประกาศไว้` : '',
      sundayClosed.length ? `${p.join(sundayClosed)} ไม่ได้ระบุเวลาเปิดวันอาทิตย์` : '',
      sundayUnknown.length ? `ส่วน ${p.join(sundayUnknown)} เวลาที่ประกาศไว้ไม่ระบุ โปรดสอบถามร้านโดยตรง` : '',
    ].filter(Boolean).join(' ');
    return {
      metaTitle: 'เรทแลกเงิน USD EUR JPY CNY เป็นบาท — ร้านแลกเงินกรุงเทพ',
      metaDescription: `เปรียบเทียบการแลกเงินสดเป็นบาทในกรุงเทพฯ: ${p.join(changers.map((c) => c.name))} ดูเวลาเปิดที่ประกาศไว้และเรทรับซื้อที่สังเกตล่าสุดของ USD EUR JPY และ CNY`,
      answerHeading: 'แลกเงินสดเป็นบาทที่ไหนในกรุงเทพฯ ดี?',
      answer: `ร้านแลกเงินในกรุงเทพฯ ที่ ExchangeTHB รวบรวมไว้ ได้แก่ ${withHours} เลือกสกุลเงินด้านล่าง (${currencyList}) เพื่อดูเรทรับซื้อที่สังเกตล่าสุดของแต่ละร้านและเงื่อนไขธนบัตรที่ใช้ หรือกรอกจำนวนเงินของคุณในเครื่องมือเปรียบเทียบด้านบน เรทที่แสดงเป็นเรทที่สังเกตได้ ไม่ใช่ราคาสุดท้าย โปรดยืนยันเรทกับร้านก่อนเดินทาง`,
      currencies: Object.fromEntries(cashHubCurrencies.map((code) => [code, {
        heading: `แลก${currencyWord.th[code]} (${code}) เป็นบาทที่ไหนในกรุงเทพฯ?`,
        intro: `เรทรับซื้อเงินสด ${code} ล่าสุดที่สังเกตได้ของแต่ละร้าน หน่วยเป็นบาทต่อหนึ่งหน่วยของ ${code} ก่อนเลือกร้าน ให้เทียบยอดรวมโดยประมาณตามจำนวนเงินของคุณ`,
        cta: `เทียบ ${code} ตามจำนวนเงินของคุณ`,
      }])) as Record<CashHubCurrency, CashHubCurrencyCopy>,
      faqHeading: 'คำถามเกี่ยวกับการแลกเงินสดเป็นบาทในกรุงเทพฯ',
      faqs: [
        { question: 'แลกเงินสดเป็นบาทที่ไหนในกรุงเทพฯ?', answer: `เว็บนี้รวบรวมร้านแลกเงิน ${withArea} แต่ละร้านมีหน้าของตัวเองที่แสดงเวลาเปิดที่ประกาศไว้และเรทที่สังเกตล่าสุด` },
        { question: 'ร้านแลกเงินเหล่านี้เปิดกี่โมง?', answer: `เวลาเปิดที่ประกาศไว้: ${hoursOnly} เวลาอาจเปลี่ยนได้ หากจะเดินทางไปโดยเฉพาะ โปรดยืนยันกับร้านก่อน` },
        { question: 'ร้านแลกเงินร้านไหนเปิดวันอาทิตย์?', answer: sunday },
        { question: 'เปรียบเทียบเรท USD, EUR, JPY หรือ CNY เป็นบาทอย่างไร?', answer: 'เลือกสกุลเงินและกรอกจำนวนเงินในเครื่องมือเปรียบเทียบด้านบน หรือดูหัวข้อสกุลเงินในหน้านี้ เครื่องมือจะแสดงยอดบาทโดยประมาณของแต่ละร้าน ให้เทียบยอดรวมและเงื่อนไขธนบัตร ไม่ใช่ดูแค่ตัวเลขเรท' },
        { question: 'ทำไมเรทจึงขึ้นอยู่กับธนบัตรที่นำไปแลก?', answer: 'บางร้านประกาศเรทแยกตามกลุ่มธนบัตร เรทจึงขึ้นอยู่กับธนบัตรที่คุณนำไป เงื่อนไขธนบัตรแสดงอยู่ข้างเรทที่สังเกตได้ทุกรายการ' },
        { question: 'เรทที่แสดงในหน้านี้เป็นเรทสุดท้ายหรือไม่?', answer: 'ไม่ใช่ เป็นเรทที่สังเกตล่าสุดจากข้อมูลที่แต่ละร้านประกาศ และแสดงเวลาที่สังเกตไว้ โปรดยืนยันเรทสุดท้ายและเงื่อนไขธนบัตรกับร้านก่อนเดินทาง' },
        { question: 'ExchangeTHB แลกเงินหรือรับชำระเงินด้วยหรือไม่?', answer: 'ไม่ได้ ExchangeTHB เป็นเว็บไซต์เปรียบเทียบข้อมูล ไม่ให้บริการแลกเงิน ไม่รับชำระเงิน และไม่ดูแลเงินของผู้ใช้ คุณทำรายการกับร้านแลกเงินโดยตรง' },
        { question: 'เปรียบเทียบได้กี่สกุลเงิน?', answer: `เครื่องมือเปรียบเทียบรองรับ ${currencyCount} สกุลเงิน รวมถึง ${currencyListTh} ร้านที่ไม่มีเรทของสกุลเงินนั้นจะไม่แสดงในรายการ` },
      ],
      labels: {
        rate: 'เรทรับซื้อ',
        banknotes: 'ธนบัตร',
        headline: 'เรทหลัก โปรดยืนยันธนบัตรที่ใช้กับร้าน',
        observed: 'สังเกตเมื่อ',
        recent: 'เรทเมื่อไม่นานมานี้',
        reference: 'ข้อมูลอ้างอิง (เรทเก่า)',
        noQuote: 'ไม่มีเรทที่สังเกตได้ของสกุลเงินนี้จาก',
        noneAtAll: 'ขณะนี้ยังไม่มีเรทที่สังเกตได้ ลองเปิดเครื่องมือเปรียบเทียบเพื่อตรวจสอบอีกครั้ง',
        profile: 'ดูหน้าร้าน',
      },
    };
  }

  const sunday = [
    sundayOpen.length ? `${p.join(sundayOpen)} 公布了周日营业时间。` : '',
    sundayClosed.length ? `${p.join(sundayClosed)} 没有公布周日营业时间。` : '',
    sundayUnknown.length ? `${p.join(sundayUnknown)} 公布的营业时间未说明周日情况，请向店家确认。` : '',
  ].filter(Boolean).join('');
  return {
    metaTitle: '美元、欧元、日元、人民币换泰铢：曼谷换汇店比较',
    metaDescription: `比较曼谷现金换泰铢：${p.join(changers.map((c) => c.name))}。查看公布的营业时间，以及美元、欧元、日元、人民币最新观测到的收购汇率。`,
    answerHeading: '曼谷哪里可以把现金换成泰铢？',
    answer: `ExchangeTHB 收录的曼谷换汇店有：${withHours}。在下方选择币种（${currencyList}），可查看各家最新观测到的收购汇率及对应的纸币条件；也可以在上方的比较工具里输入你自己的金额。观测汇率不是最终报价，出发前请向换汇店确认。`,
    currencies: Object.fromEntries(cashHubCurrencies.map((code) => [code, {
      heading: `${currencyWord.zh[code]}（${code}）换泰铢，曼谷在哪里换？`,
      intro: `各家换汇店最新观测到的 ${code} 现钞收购汇率，单位：每一单位 ${code} 兑多少泰铢。选店之前，请按你的金额比较预计到手的总额。`,
      cta: `按你的金额比较 ${code}`,
    }])) as Record<CashHubCurrency, CashHubCurrencyCopy>,
    faqHeading: '曼谷现金换泰铢的常见问题',
    faqs: [
      { question: '曼谷哪里可以把现金换成泰铢？', answer: `本站收录的换汇店有：${withArea}。每家都有独立页面，列出公布的营业时间和最新观测汇率。` },
      { question: '这些换汇店几点营业？', answer: `各店公布的营业时间：${hoursOnly}。营业时间可能变动，如需专程前往，请先向店家确认。` },
      { question: '哪家换汇店周日营业？', answer: sunday },
      { question: '美元、欧元、日元或人民币换泰铢怎么比较？', answer: '在上方比较工具里选择币种并输入金额，或查看本页的各币种板块。工具会给出每家预计到手的泰铢。请比较预计总额和纸币条件，不要只看显示的汇率。' },
      { question: '为什么汇率会取决于我带的纸币？', answer: '有些换汇店按纸币组别分别公布汇率，所以汇率取决于你携带的纸币。每条观测汇率旁边都标注了对应的纸币条件。' },
      { question: '页面上显示的汇率是最终汇率吗？', answer: '不是。这是根据各店公布信息最新观测到的汇率，并标注了观测时间。出发前请向换汇店确认最终汇率和纸币条件。' },
      { question: 'ExchangeTHB 会帮我换汇或收款吗？', answer: '不会。ExchangeTHB 是比较网站，不提供换汇服务，不收款，也不保管资金。你需要直接与换汇店办理。' },
      { question: '可以比较多少种币种？', answer: `比较工具支持 ${currencyCount} 种币种，包括 ${currencyList}。某家换汇店没有该币种的报价时，就不会出现在该币种下。` },
    ],
    labels: {
      rate: '收购汇率',
      banknotes: '纸币',
      headline: '主要标示汇率；适用的纸币请向店家确认',
      observed: '观测于',
      recent: '近期报价',
      reference: '参考数据（较早报价）',
      noQuote: '该币种暂无观测报价：',
      noneAtAll: '目前没有可用的观测报价，请打开比较工具再查看。',
      profile: '门店页',
    },
  };
}

export function cashHubFaqJsonLd(locale: Locale, faqs: CashHubFaq[]) {
  const url = withLocalePath(locale, '/cash');
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: locale,
    publisher: { '@id': organizationId() },
    mainEntity: faqs.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}
