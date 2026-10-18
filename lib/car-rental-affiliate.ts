// Public affiliate link generated in Travelpayouts > Localrent > Generate links.
// Source evidence: evidence/2026-10-16/car-rental-affiliate/localrent-generator.txt
export const carRentalAffiliate = {
  localrent: {
    status: 'available',
    href: 'https://localrent.tpx.gr/7mkCPhyS',
    destination: 'https://www.localrent.com/en/thailand/',
    project: 580269,
    marker: 784381,
    subId: 'exchangethb_guides',
  },
  discovercars: { status: 'unavailable_review_not_approved', href: null },
} as const;

export type CarRentalLocale = 'en' | 'th' | 'zh';
export function supportsCarRental(locale: string): locale is CarRentalLocale {
  return locale === 'en' || locale === 'th' || locale === 'zh';
}

export const carRentalCopy = {
  en: {
    eyebrow: 'PLAN THE REST OF YOUR TRIP', title: 'Thinking of driving in Thailand?',
    intro: 'For a multi-stop trip or a few days beyond the city. In central Bangkok, public transport may be simpler than driving and parking.',
    label: 'Affiliate recommendation', scenario: 'Explore rental options from local suppliers for your Thailand itinerary.',
    thirdParty: 'You book and pay on a third-party website, not ExchangeTHB. Availability, prices and rental terms are set by the provider.',
    cta: 'View Thailand cars on Localrent', external: 'Opens a new tab · destination page in English',
    disclosure: 'Affiliate disclosure: ExchangeTHB may earn a commission on eligible bookings through this link. Commission does not affect our exchange-rate rankings. This is not a whole-market comparison.',
    checklist: 'Before you book', checks: [
      'Confirm the driving licence and International Driving Permit requirements for your licence, nationality and rental company.',
      'Check the deposit amount, accepted payment method and release conditions.',
      'Read insurance coverage, exclusions and the excess you would pay.',
      'Confirm pick-up and return locations, opening hours and any extra fees.',
      'Read cancellation, refund and late-return terms before paying.',
    ], terms: 'The supplier’s current booking terms apply. An affiliate link is not a guarantee of price, insurance cover or commission.',
  },
  th: {
    eyebrow: 'วางแผนการเดินทางต่อ', title: 'กำลังคิดจะเช่ารถเที่ยวไทย?',
    intro: 'เหมาะกับทริปหลายจุดหมายหรือเดินทางออกนอกเมืองหลายวัน ในใจกลางกรุงเทพฯ ขนส่งสาธารณะอาจสะดวกกว่าการขับรถและหาที่จอด',
    label: 'ลิงก์แนะนำแบบพันธมิตร', scenario: 'ดูตัวเลือกเช่ารถจากผู้ให้บริการท้องถิ่นสำหรับทริปในประเทศไทย',
    thirdParty: 'จองและชำระเงินบนเว็บไซต์บุคคลที่สาม ไม่ใช่ ExchangeTHB ผู้ให้บริการเป็นผู้กำหนดรถว่าง ราคา และเงื่อนไขการเช่า',
    cta: 'ดูรถเช่าในไทยบน Localrent', external: 'เปิดแท็บใหม่ · หน้าปลายทางเป็นภาษาอังกฤษ',
    disclosure: 'การเปิดเผยค่าคอมมิชชัน: ExchangeTHB อาจได้รับค่าคอมมิชชันจากการจองที่เข้าเงื่อนไขผ่านลิงก์นี้ โดยไม่มีผลต่อการจัดอันดับอัตราแลกเปลี่ยน นี่ไม่ใช่การเปรียบเทียบผู้ให้บริการทั้งตลาด',
    checklist: 'ตรวจสอบก่อนจอง', checks: [
      'ตรวจสอบข้อกำหนดใบขับขี่และใบอนุญาตขับขี่ระหว่างประเทศตามใบขับขี่ สัญชาติ และบริษัทเช่ารถของคุณ',
      'ตรวจสอบจำนวนเงินมัดจำ วิธีชำระเงินที่รับ และเงื่อนไขคืนมัดจำ',
      'อ่านความคุ้มครองประกัน ข้อยกเว้น และค่าเสียหายส่วนแรกที่ต้องรับผิดชอบ',
      'ยืนยันจุดรับ–คืนรถ เวลาทำการ และค่าธรรมเนียมเพิ่มเติม',
      'อ่านเงื่อนไขยกเลิก คืนเงิน และคืนรถล่าช้าก่อนชำระเงิน',
    ], terms: 'ให้ยึดเงื่อนไขการจองล่าสุดของผู้ให้บริการ ลิงก์พันธมิตรไม่ใช่การรับประกันราคา ความคุ้มครองประกัน หรือค่าคอมมิชชัน',
  },
  zh: {
    eyebrow: '规划下一段旅程', title: '考虑在泰国自驾？',
    intro: '适合多站旅行，或离开市区游玩几天。在曼谷市中心，公共交通可能比开车和寻找停车位更省心。',
    label: '商业推广推荐', scenario: '为泰国行程查看当地供应商的租车选项。',
    thirdParty: '预订和付款均在第三方网站完成，不由 ExchangeTHB 提供。可租车辆、价格与租赁条款以供应商为准。',
    cta: '前往 Localrent 查看泰国租车', external: '在新标签页打开 · 目的地页面为英文',
    disclosure: '佣金披露：通过此链接完成符合条件的预订，ExchangeTHB 可能获得推广佣金。佣金不影响本站汇率排序。本模块不是全市场租车比较。',
    checklist: '预订前，先核对', checks: [
      '按持有的驾照、国籍和租车公司要求，核对驾照及国际驾驶许可证是否符合条件。',
      '核对押金金额、接受的付款方式及押金退还条件。',
      '阅读保险范围、除外责任和需自行承担的免赔额。',
      '确认取还车地点、营业时间与可能产生的额外费用。',
      '付款前阅读取消、退款及延迟还车条款。',
    ], terms: '具体政策以供应商当前预订条款为准。推广链接不代表价格、保险保障或佣金保证。',
  },
} as const;
