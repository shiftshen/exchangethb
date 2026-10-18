import type { Metadata } from 'next';
import { shouldIndexAboutPage } from '@/lib/indexing-policy';
import { metadataAlternatesForPolicy, robotsForPage, withLocalePath, localeMetadataAlternates, localeRobots } from '@/lib/seo';
import type { ContentLocale, Locale } from '@/lib/types';

/**
 * Brand-entity copy. One consistent statement of what ExchangeTHB (exchangethb.com) is,
 * reused by the home title/description, the home "seo-answer" lead sentence, the JSON-LD
 * and the About page. Nothing here is a number, price or claim that is not already stated
 * elsewhere on the site (llms.txt, methodology, data-status, disclaimer).
 */
export const brandName = 'ExchangeTHB';
export const brandDomain = 'exchangethb.com';

/** `ExchangeTHB – <localized description>`; kept <= 60 characters. */
export const homeTitles: Record<ContentLocale, string> = {
  en: 'ExchangeTHB – Compare Thai baht exchange: cash & crypto',
  th: 'ExchangeTHB – เปรียบเทียบแลกเงินเป็นบาท เงินสด-คริปโต',
  zh: 'ExchangeTHB – 泰铢兑换比较：曼谷换汇店与泰国交易所',
  ja: 'ExchangeTHB – タイバーツ両替レート比較：現金・暗号資産',
  ru: 'ExchangeTHB – сравнение обмена валюты на баты',
  ko: 'ExchangeTHB – 태국 바트 환전 비교',
  fr: 'ExchangeTHB – Comparer le change en bahts thaïlandais',
  de: 'ExchangeTHB – Wechsel in thailändische Baht vergleichen',
  id: 'ExchangeTHB – Bandingkan penukaran ke baht Thailand',
  vi: 'ExchangeTHB – So sánh đổi tiền sang baht Thái',
};

/** Meta description. The first sentence names the brand and the domain. */
export const homeDescriptions: Record<ContentLocale, string> = {
  en: 'ExchangeTHB (exchangethb.com) compares Bangkok cash money changers and Thai crypto exchanges for Thai baht. Choose your currency and amount. Compare your options.',
  th: 'ExchangeTHB (exchangethb.com) เปรียบเทียบร้านแลกเงินในกรุงเทพฯ และแพลตฟอร์มคริปโตไทยสำหรับแลกเป็นบาท เลือกสกุลเงิน ใส่จำนวน แล้วเปรียบเทียบตัวเลือก',
  zh: 'ExchangeTHB（exchangethb.com）比较曼谷换汇店与泰国交易所的泰铢兑换方案。选币种、填金额，比较哪家更合适。',
  ja: 'ExchangeTHB（exchangethb.com）は、現金や暗号資産をタイバーツへ両替する方法を比較するサイトです。通貨と金額を選び、バンコクの両替店やタイの暗号資産取引所を比較できます。',
  ru: 'ExchangeTHB (exchangethb.com) сравнивает обменные пункты Бангкока и тайские криптобиржи для обмена на баты. Выберите валюту и сумму.',
  ko: 'ExchangeTHB(exchangethb.com)는 방콕 환전소와 태국 가상자산 거래소를 비교해 바트로 바꾸는 방법을 보여 줍니다. 통화와 금액을 선택해 비교하세요.',
  fr: 'ExchangeTHB (exchangethb.com) compare les bureaux de change de Bangkok et les plateformes crypto thaïlandaises pour obtenir des bahts. Choisissez une devise et un montant.',
  de: 'ExchangeTHB (exchangethb.com) vergleicht Wechselstuben in Bangkok und thailändische Kryptobörsen für Baht. Währung und Betrag auswählen und vergleichen.',
  id: 'ExchangeTHB (exchangethb.com) membandingkan penukar uang Bangkok dan bursa kripto Thailand untuk mendapatkan baht. Pilih mata uang dan jumlah.',
  vi: 'ExchangeTHB (exchangethb.com) so sánh điểm đổi tiền Bangkok và sàn tài sản mã hóa Thái Lan để đổi sang baht. Chọn tiền tệ và số tiền.',
};

/** Lead sentence of the homepage "seo-answer" paragraph: what ExchangeTHB is. */
export const homeBrandIntro: Record<ContentLocale, string> = {
  en: 'ExchangeTHB (exchangethb.com) is a comparison website for getting Thai baht: Bangkok cash money changers and Thai crypto exchanges, side by side.',
  th: 'ExchangeTHB (exchangethb.com) คือเว็บไซต์เปรียบเทียบการแลกเป็นเงินบาท ระหว่างร้านแลกเงินสดในกรุงเทพฯ กับแพลตฟอร์มคริปโตในไทย',
  zh: 'ExchangeTHB（exchangethb.com）是一个泰铢兑换比较网站，把曼谷现金换汇店与泰国加密交易所放在一起比较。',
  ja: 'ExchangeTHB（exchangethb.com）は、バンコクの現金両替店とタイの暗号資産取引所を並べてタイバーツの入手方法を比較するサイトです。',
  ru: 'ExchangeTHB (exchangethb.com) — сайт сравнения, где обменные пункты Бангкока и тайские криптобиржи сопоставляются для получения тайских батов.',
  ko: 'ExchangeTHB(exchangethb.com)는 방콕의 현금 환전소와 태국 가상자산 거래소를 나란히 비교해 태국 바트를 받는 방법을 보여 주는 비교 사이트입니다.',
  fr: 'ExchangeTHB (exchangethb.com) est un site de comparaison pour obtenir des bahts thaïlandais : bureaux de change en espèces à Bangkok et plateformes crypto thaïlandaises, côte à côte.',
  de: 'ExchangeTHB (exchangethb.com) ist eine Vergleichsseite für thailändische Baht: Bargeld-Wechselstuben in Bangkok und thailändische Kryptobörsen im direkten Vergleich.',
  id: 'ExchangeTHB (exchangethb.com) adalah situs perbandingan untuk mendapatkan baht Thailand: penukar uang tunai di Bangkok dan bursa kripto Thailand, berdampingan.',
  vi: 'ExchangeTHB (exchangethb.com) là trang so sánh để nhận baht Thái: điểm đổi tiền mặt ở Bangkok và sàn tài sản mã hóa Thái Lan, đặt cạnh nhau.',
};

export function homeMetadata(locale: ContentLocale): Metadata {
  const title = homeTitles[locale];
  const description = homeDescriptions[locale];
  return {
    // `absolute` keeps the brand first and skips the root "%s | ExchangeTHB" template.
    title: { absolute: title },
    description,
    alternates: localeMetadataAlternates(locale),
    robots: localeRobots(locale),
    openGraph: { type: 'website', siteName: brandName, title, description, url: withLocalePath(locale) },
    twitter: { title, description },
  };
}

/* ------------------------------------------------------------------ About page */

export type AboutSection = { heading: string; body: string[] };
export type AboutCopy = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: AboutSection[];
  linksHeading: string;
  links: { cash: string; crypto: string; methodology: string; dataStatus: string; disclaimer: string; privacy: string };
  breadcrumbHome: string;
};

export const aboutLocales: ContentLocale[] = ['en', 'th', 'zh'];

export const aboutCopy: Record<'en' | 'th' | 'zh', AboutCopy> = {
  en: {
    title: 'About ExchangeTHB',
    metaTitle: 'About ExchangeTHB (exchangethb.com) – what it is and how it works',
    metaDescription: 'ExchangeTHB (exchangethb.com) is a comparison website for Thai baht: Bangkok cash money changers against Thai SEC-licensed crypto exchanges. Where the data comes from and what the site does not do.',
    intro: 'ExchangeTHB (exchangethb.com) is a comparison website for getting Thai baht (THB). It puts cash money changers in Bangkok and Thai SEC-licensed crypto exchanges side by side, so you can see roughly how much baht each route gives you before you decide. It is a comparison site, not a money changer and not an exchange.',
    sections: [
      {
        heading: 'What ExchangeTHB does',
        body: [
          'You choose a currency and an amount. ExchangeTHB lists the options it can compare: cash at Bangkok money changers, and buying or selling crypto on Thai exchanges, with the estimated baht you would receive and the fee fields it can verify.',
          'Every amount is labelled as an estimate. The final rate is always set by the provider at the counter or on the exchange.',
        ],
      },
      {
        heading: 'Where the data comes from',
        body: [
          'Cash rates come from the public pages or public APIs of the money changers the site lists. Exchange quotes come from the exchanges’ public market data. Where a live source is incomplete, the page says so and labels the result as fallback or reviewed data.',
          'The Bank of Thailand reference rate is shown only as a baseline, not as a counter quote. The sources and the last collection time of each provider are listed on the data status page.',
        ],
      },
      {
        heading: 'How it is updated',
        body: [
          'Cash rates are collected on a scheduled cycle and marked live, hybrid or fallback. Exchange quotes are requested when you compare and are checked for time and order book depth. Collection time and the provider’s own publication time are kept apart, and old quotes are reference only.',
        ],
      },
      {
        heading: 'What ExchangeTHB does not do',
        body: [
          'ExchangeTHB is not a money changer, a crypto exchange, a broker or the counterparty of any transaction. It does not hold or move your money and does not ask for identity documents or bank details.',
          'Nothing on the site is investment or foreign-exchange advice, and a displayed estimate is not a guaranteed price.',
        ],
      },
      {
        heading: 'Cost and independence',
        body: [
          'Using ExchangeTHB is free. The site may show advertising and may earn a commission from some outbound links; referral commission does not change how options are ranked.',
        ],
      },
    ],
    linksHeading: 'Read more',
    links: { cash: 'Compare cash exchange in Bangkok', crypto: 'Compare crypto to THB', methodology: 'How we compare', dataStatus: 'Data sources and update status', disclaimer: 'Disclaimer', privacy: 'Privacy policy' },
    breadcrumbHome: 'ExchangeTHB',
  },
  th: {
    title: 'เกี่ยวกับ ExchangeTHB',
    metaTitle: 'เกี่ยวกับ ExchangeTHB (exchangethb.com) – คืออะไร ทำงานอย่างไร',
    metaDescription: 'ExchangeTHB (exchangethb.com) คือเว็บไซต์เปรียบเทียบการแลกเป็นเงินบาท ระหว่างร้านแลกเงินสดในกรุงเทพฯ กับแพลตฟอร์มคริปโตที่ได้รับอนุญาตจาก ก.ล.ต. ไทย ข้อมูลมาจากไหน และสิ่งที่เว็บไซต์ไม่ได้ทำ',
    intro: 'ExchangeTHB (exchangethb.com) คือเว็บไซต์เปรียบเทียบการแลกเป็นเงินบาท (THB) วางร้านแลกเงินสดในกรุงเทพฯ กับแพลตฟอร์มคริปโตที่ได้รับอนุญาตจาก ก.ล.ต. ไทยไว้เคียงกัน เพื่อให้คุณเห็นคร่าวๆ ว่าแต่ละเส้นทางได้บาทเท่าไรก่อนตัดสินใจ เป็นเว็บเปรียบเทียบ ไม่ใช่ร้านแลกเงิน และไม่ใช่แพลตฟอร์มซื้อขาย',
    sections: [
      {
        heading: 'ExchangeTHB ทำอะไร',
        body: [
          'คุณเลือกสกุลเงินและใส่จำนวน ExchangeTHB จะแสดงตัวเลือกที่เทียบได้ คือเงินสดที่ร้านแลกเงินในกรุงเทพฯ และการซื้อหรือขายคริปโตบนแพลตฟอร์มไทย พร้อมยอดบาทโดยประมาณและช่องค่าธรรมเนียมที่ตรวจสอบได้',
          'ตัวเลขทุกจำนวนเป็นค่าประมาณ เรทสุดท้ายถูกกำหนดโดยผู้ให้บริการที่เคาน์เตอร์หรือบนแพลตฟอร์มเสมอ',
        ],
      },
      {
        heading: 'ข้อมูลมาจากไหน',
        body: [
          'เรทเงินสดมาจากหน้าเว็บสาธารณะหรือ API สาธารณะของร้านแลกเงินที่เว็บไซต์แสดง ส่วนราคาของแพลตฟอร์มมาจากข้อมูลตลาดสาธารณะของแพลตฟอร์มนั้น หากแหล่งข้อมูลสดไม่ครบ หน้าเว็บจะระบุและติดป้ายว่าเป็นข้อมูลสำรองหรือข้อมูลที่ผ่านการทบทวน',
          'เรทอ้างอิงของธนาคารแห่งประเทศไทยใช้เป็นเกณฑ์เปรียบเทียบเท่านั้น ไม่ใช่เรทหน้าร้าน แหล่งข้อมูลและเวลาเก็บข้อมูลล่าสุดของแต่ละผู้ให้บริการอยู่ในหน้าสถานะข้อมูล',
        ],
      },
      {
        heading: 'อัปเดตอย่างไร',
        body: [
          'เรทเงินสดถูกเก็บตามรอบที่กำหนดและติดป้าย live, hybrid หรือ fallback ส่วนราคาแพลตฟอร์มจะถูกดึงเมื่อคุณเปรียบเทียบ และตรวจเวลากับความลึกของออร์เดอร์บุ๊ก เวลาที่เก็บข้อมูลแยกจากเวลาที่ผู้ให้บริการประกาศ และเรทเก่าใช้เพื่ออ้างอิงเท่านั้น',
        ],
      },
      {
        heading: 'สิ่งที่ ExchangeTHB ไม่ได้ทำ',
        body: [
          'ExchangeTHB ไม่ใช่ร้านแลกเงิน ไม่ใช่แพลตฟอร์มซื้อขายคริปโต ไม่ใช่โบรกเกอร์ และไม่ใช่คู่สัญญาของธุรกรรมใดๆ เราไม่ถือหรือโอนเงินของคุณ และไม่ขอเอกสารยืนยันตัวตนหรือข้อมูลบัญชีธนาคาร',
          'เนื้อหาบนเว็บไซต์ไม่ใช่คำแนะนำการลงทุนหรือการแลกเปลี่ยนเงินตรา และตัวเลขประมาณการที่แสดงไม่ใช่ราคาที่รับประกัน',
        ],
      },
      {
        heading: 'ค่าใช้จ่ายและความเป็นอิสระ',
        body: [
          'การใช้ ExchangeTHB ไม่มีค่าใช้จ่าย เว็บไซต์อาจแสดงโฆษณาและอาจได้รับค่าคอมมิชชันจากลิงก์ภายนอกบางรายการ ค่าคอมมิชชันไม่เปลี่ยนการจัดอันดับตัวเลือก',
        ],
      },
    ],
    linksHeading: 'อ่านเพิ่มเติม',
    links: { cash: 'เปรียบเทียบแลกเงินสดในกรุงเทพฯ', crypto: 'เปรียบเทียบคริปโตเป็นบาท', methodology: 'วิธีเปรียบเทียบ', dataStatus: 'แหล่งข้อมูลและสถานะอัปเดต', disclaimer: 'ข้อจำกัดความรับผิดชอบ', privacy: 'นโยบายความเป็นส่วนตัว' },
    breadcrumbHome: 'ExchangeTHB',
  },
  zh: {
    title: '关于 ExchangeTHB',
    metaTitle: '关于 ExchangeTHB（exchangethb.com）– 是什么、怎么运作',
    metaDescription: 'ExchangeTHB（exchangethb.com）是一个泰铢兑换比较网站：把曼谷现金换汇店与泰国证监会持牌的加密交易所放在一起比较。数据来自哪里，以及本站不做什么。',
    intro: 'ExchangeTHB（exchangethb.com）是一个泰铢（THB）兑换比较网站。它把曼谷的现金换汇店与泰国证监会（SEC）持牌的加密交易所放在一起，让你在决定之前大致看到每条路线能换到多少泰铢。它是比较网站，不是换汇店，也不是交易所。',
    sections: [
      {
        heading: 'ExchangeTHB 做什么',
        body: [
          '你选择币种并填写金额，ExchangeTHB 列出它能比较的选项：曼谷换汇店的现金兑换，以及在泰国交易所买入或卖出加密资产，并给出预估到手的泰铢和它能核实的费用项。',
          '所有金额都标注为估算值。最终汇率始终由柜台或交易所的服务方决定。',
        ],
      },
      {
        heading: '数据来自哪里',
        body: [
          '现金汇率来自本站所列换汇店的官方公开页面或公开 API；交易所报价来自各交易所的公开行情数据。实时来源不完整时，页面会说明，并把结果标注为备用数据或经审核的数据。',
          '泰国央行参考汇率只作为基准展示，不是柜台成交价。各服务方的数据来源与最近一次采集时间列在“数据来源与更新状态”页面。',
        ],
      },
      {
        heading: '怎么更新',
        body: [
          '现金汇率按固定周期采集，并标注为 live、hybrid 或 fallback；交易所报价在你比较时请求，并校验时间与订单簿深度。采集时间与服务方自己的发布时间分开记录，过期报价仅供参考。',
        ],
      },
      {
        heading: 'ExchangeTHB 不做什么',
        body: [
          'ExchangeTHB 不是换汇店、不是加密交易所、不是经纪商，也不是任何交易的对手方。我们不持有或转移你的资金，也不索要身份证明或银行资料。',
          '站内内容不构成投资或外汇建议，显示的估算值不是保证成交价。',
        ],
      },
      {
        heading: '费用与独立性',
        body: [
          '使用 ExchangeTHB 免费。网站可能展示广告，并可能从部分外链获得佣金；推广佣金不会改变选项的排序。',
        ],
      },
    ],
    linksHeading: '继续阅读',
    links: { cash: '比较曼谷现金换汇', crypto: '比较加密换泰铢', methodology: '比较方法', dataStatus: '数据来源与更新状态', disclaimer: '免责声明', privacy: '隐私政策' },
    breadcrumbHome: 'ExchangeTHB',
  },
};

export function aboutContentLocale(locale: Locale): 'en' | 'th' | 'zh' {
  return locale === 'th' || locale === 'zh' ? locale : 'en';
}

export function aboutMetadata(locale: Locale): Metadata {
  const c = aboutCopy[aboutContentLocale(locale)];
  const index = shouldIndexAboutPage(locale);
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    alternates: metadataAlternatesForPolicy(locale, '/about', aboutLocales),
    robots: robotsForPage(locale, index),
    openGraph: { type: 'website', siteName: brandName, title: c.metaTitle, description: c.metaDescription, url: withLocalePath(locale, '/about') },
    twitter: { title: c.metaTitle, description: c.metaDescription },
  };
}
