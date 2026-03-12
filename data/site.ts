import { CashBranch, CashProvider, CashRate, ExchangeRecord, MarketSnapshot } from '@/lib/types';

export const exchanges: ExchangeRecord[] = [
  {
    slug: 'binance-th',
    name: 'Binance TH',
    license: 'Thai SEC digital asset exchange license',
    summary: {
      th: 'ตัวเลือกสภาพคล่องสูงสำหรับคู่ THB หลัก พร้อมโครงสร้างค่าธรรมเนียมที่ชัดเจน',
      en: 'High-liquidity venue for core THB pairs with clear fee structure.',
      zh: '适合核心 THB 交易对的高流动性平台，费率结构清晰。',
    },
    strengths: [
      { th: 'สภาพคล่องดีในคู่ยอดนิยม', en: 'Strong liquidity on major pairs', zh: '主流交易对流动性强' },
      { th: 'เอกสารและ API ครบ', en: 'Comprehensive public docs and APIs', zh: '公开文档与 API 完整' },
    ],
    cautions: [
      { th: 'แคมเปญ referral อาจเปลี่ยน', en: 'Campaign/referral availability can change', zh: '活动或返佣机制可能变动' },
    ],
    affiliate: {
      status: 'official_only',
      officialUrl: 'https://www.binance.th/en',
      disclosure: {
        th: 'ลิงก์นี้อาจเปลี่ยนตามกติกาของแพลตฟอร์มล่าสุด',
        en: 'This link may change based on the platform’s latest rules.',
        zh: '该链接可能随平台最新规则调整。',
      },
    },
    fee: { tradingFeePct: 0.25, thbWithdraw: 20, networks: { BTC: 0.00025, ETH: 0.003, USDT: 1 } },
    score: { compliance: 24, feeTransparency: 14, apiQuality: 15, thbFriendliness: 14, executionQuality: 19, operations: 9 },
    pairs: ['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL'],
    lastUpdated: '2026-03-08T00:00:00+07:00',
  },
  {
    slug: 'bitkub', name: 'Bitkub', license: 'Thai SEC digital asset exchange license',
    summary: { th: 'แพลตฟอร์มซื้อขายสินทรัพย์ดิจิทัลที่รองรับเงินบาทและมีการบริการภาษาไทยอย่างชัดเจน', en: 'Digital asset exchange with direct THB support and Thai-language operations.', zh: '支持泰铢交易并提供完整泰语服务的数字资产平台。' },
    strengths: [
      { th: 'รองรับการฝากถอนเงินบาทและงานบริการฝั่งไทย', en: 'Supports THB deposits, withdrawals, and Thai-side operations', zh: '支持泰铢充提与本地化运营' },
      { th: 'มีศูนย์ช่วยเหลือและช่องทางประกาศที่อัปเดตสม่ำเสมอ', en: 'Maintains active support and announcement channels', zh: '帮助中心和公告渠道更新较稳定' },
    ],
    cautions: [{ th: 'บางคู่ลึกน้อยกว่า', en: 'Some markets can be thinner', zh: '部分交易对深度较薄' }],
    affiliate: { status: 'official_only', officialUrl: 'https://www.bitkub.com', disclosure: { th: 'ลิงก์ทางการหรือโปรโมชันอาจอัปเดตได้', en: 'Official or campaign links may be updated.', zh: '官方或活动链接可能更新。' } },
    fee: { tradingFeePct: 0.25, thbWithdraw: 20, networks: { BTC: 0.0003, ETH: 0.0035, USDT: 1.2 } },
    score: { compliance: 25, feeTransparency: 13, apiQuality: 14, thbFriendliness: 15, executionQuality: 17, operations: 8 },
    pairs: ['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL'],
    lastUpdated: '2026-03-08T00:00:00+07:00'
  },
  {
    slug: 'upbit-thailand', name: 'Upbit Thailand', license: 'Thai SEC digital asset exchange license',
    summary: { th: 'แพลตฟอร์มที่มีหน้าตลาดและโครงสร้างคู่เทรดแบบมาตรฐาน เหมาะกับการเทียบราคา THB หลัก', en: 'Exchange with standardized market pages and pair structure that is straightforward to compare on core THB markets.', zh: '市场页和交易对结构较标准，适合做主流 THB 市场对比。' },
    strengths: [{ th: 'โครงสร้างตลาดและหน้าคู่เทรดอ่านง่าย', en: 'Clear market structure and pair pages', zh: '市场结构和交易对页面清晰' }],
    cautions: [{ th: 'ข้อมูลโปรโมชันหรือ referral สาธารณะมีไม่มาก', en: 'Public promotion or referral information is limited', zh: '公开促销或返佣信息较少' }],
    affiliate: { status: 'official_only', officialUrl: 'https://th.upbit.com', disclosure: { th: 'ใช้ลิงก์ทางการเป็นค่าเริ่มต้น', en: 'Official link used by default.', zh: '默认使用官方链接。' } },
    fee: { tradingFeePct: 0.25, thbWithdraw: 20, networks: { BTC: 0.00028, ETH: 0.0032, USDT: 1 } },
    score: { compliance: 24, feeTransparency: 13, apiQuality: 14, thbFriendliness: 13, executionQuality: 18, operations: 8 },
    pairs: ['BTC', 'ETH', 'USDT'],
    lastUpdated: '2026-03-08T00:00:00+07:00'
  },
  {
    slug: 'orbix', name: 'Orbix', license: 'Thai SEC digital asset exchange license',
    summary: { th: 'แพลตฟอร์มไทยที่มีหน้าสินค้า เว็บข้อมูลบริษัท และช่องทางซัพพอร์ตครบค่อนข้างชัดเจน', en: 'Thai exchange with clearly published product pages, company information, and support channels.', zh: '官网公开了较完整的产品页、公司信息和支持渠道的泰国交易平台。' },
    strengths: [{ th: 'มีช่องทางช่วยเหลือและข้อมูลบริษัทบนเว็บอย่างชัดเจน', en: 'Publishes visible support and company information on the website', zh: '官网可见支持渠道和公司信息' }],
    cautions: [{ th: 'จำนวนคู่เทรดและความลึกบางช่วงอาจจำกัด', en: 'Pair coverage and depth can still vary by period', zh: '交易对覆盖和深度仍可能随时段变化' }],
    affiliate: { status: 'campaign_only', officialUrl: 'https://www.orbixtrade.com', disclosure: { th: 'หากแคมเปญหมดอายุ ระบบจะแสดงลิงก์ทางการแทน', en: 'Expired campaigns fall back to the official link.', zh: '活动过期后将回退到官方链接。' } },
    fee: { tradingFeePct: 0.2, thbWithdraw: 15, networks: { BTC: 0.00024, ETH: 0.0028, USDT: 0.8 } },
    score: { compliance: 23, feeTransparency: 12, apiQuality: 12, thbFriendliness: 13, executionQuality: 16, operations: 8 },
    pairs: ['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL'],
    lastUpdated: '2026-03-08T00:00:00+07:00'
  }
];

export const marketSnapshots: MarketSnapshot[] = [
  { exchange: 'binance-th', symbol: 'BTC', asks: [{ price: 2298000, quantity: 0.3 }, { price: 2302000, quantity: 0.7 }], bids: [{ price: 2292000, quantity: 0.35 }, { price: 2289000, quantity: 0.8 }], lastUpdated: '2026-03-08T00:00:00+07:00' },
  { exchange: 'bitkub', symbol: 'BTC', asks: [{ price: 2299000, quantity: 0.25 }, { price: 2303500, quantity: 0.8 }], bids: [{ price: 2291000, quantity: 0.4 }, { price: 2288000, quantity: 0.9 }], lastUpdated: '2026-03-08T00:00:00+07:00' },
  { exchange: 'upbit-thailand', symbol: 'BTC', asks: [{ price: 2301000, quantity: 0.2 }, { price: 2304500, quantity: 0.8 }], bids: [{ price: 2292500, quantity: 0.25 }, { price: 2289500, quantity: 0.7 }], lastUpdated: '2026-03-08T00:00:00+07:00' },
  { exchange: 'orbix', symbol: 'BTC', asks: [{ price: 2300500, quantity: 0.18 }, { price: 2304000, quantity: 0.6 }], bids: [{ price: 2290000, quantity: 0.3 }, { price: 2288500, quantity: 0.7 }], lastUpdated: '2026-03-08T00:00:00+07:00' },
  { exchange: 'binance-th', symbol: 'USDT', asks: [{ price: 35.21, quantity: 9000 }, { price: 35.24, quantity: 30000 }], bids: [{ price: 35.15, quantity: 11000 }, { price: 35.12, quantity: 29000 }], lastUpdated: '2026-03-08T00:00:00+07:00' },
  { exchange: 'bitkub', symbol: 'USDT', asks: [{ price: 35.26, quantity: 7000 }, { price: 35.3, quantity: 22000 }], bids: [{ price: 35.14, quantity: 8000 }, { price: 35.1, quantity: 18000 }], lastUpdated: '2026-03-08T00:00:00+07:00' },
  { exchange: 'upbit-thailand', symbol: 'USDT', asks: [{ price: 35.24, quantity: 8000 }, { price: 35.27, quantity: 18000 }], bids: [{ price: 35.16, quantity: 7000 }, { price: 35.11, quantity: 20000 }], lastUpdated: '2026-03-08T00:00:00+07:00' },
  { exchange: 'orbix', symbol: 'USDT', asks: [{ price: 35.29, quantity: 6000 }, { price: 35.35, quantity: 18000 }], bids: [{ price: 35.13, quantity: 8500 }, { price: 35.09, quantity: 17500 }], lastUpdated: '2026-03-08T00:00:00+07:00' }
];

export const cashProviders: CashProvider[] = [
  { slug: 'superrich-1965', name: 'SuperRich 1965', summary: { th: 'ผู้ให้บริการแลกเงินรายใหญ่ที่เผยแพร่อัตราสำหรับลูกค้าทั่วไปผ่าน guest feed', en: 'Large money changer whose public guest feed exposes customer-facing rates.', zh: '通过公开 guest feed 提供面向客户汇率的大型换汇品牌。' }, officialUrl: 'https://www.superrich1965.com', affiliate: { status: 'official_only', officialUrl: 'https://www.superrich1965.com', disclosure: { th: 'ข้อมูลอาจต่างกันตามสาขาและเวลาจริง', en: 'Rates can vary by branch and time.', zh: '汇率可能因门店与时间不同而变化。' } } },
  { slug: 'superrich-thailand', name: 'SuperRich Thailand', summary: { th: 'ผู้ให้บริการแลกเงินที่เปิดเผย API อัตราแลกเปลี่ยนสาธารณะบนเว็บไซต์ทางการ', en: 'Money changer with a public rates API exposed on its official site.', zh: '官网公开提供汇率 API 的换汇品牌。' }, officialUrl: 'https://www.superrichthailand.com', affiliate: { status: 'official_only', officialUrl: 'https://www.superrichthailand.com', disclosure: { th: 'ใช้ลิงก์ทางการเท่านั้น', en: 'Official links only.', zh: '仅使用官方链接。' } } },
  { slug: 'sia', name: 'SIA Money Exchange', summary: { th: 'ผู้ให้บริการย่านประตูน้ำที่เผยแพร่หน้าอัตราและข้อมูลสำนักงานใหญ่บนเว็บทางการ', en: 'Pratunam-area money changer that publishes rates and headquarters details on its official website.', zh: '位于水门一带，官网公开展示汇率和总部资料的换汇商。' }, officialUrl: 'http://www.siamoneyexchange.com', affiliate: { status: 'official_only', officialUrl: 'http://www.siamoneyexchange.com', disclosure: { th: 'โปรดตรวจสอบเรทล่าสุดจากผู้ให้บริการ', en: 'Please verify final rates with the provider.', zh: '请以门店最终汇率为准。' } } },
  { slug: 'ratchada', name: 'Ratchada Exchange', summary: { th: 'ผู้ให้บริการรายเดี่ยวที่เผยแพร่หน้าเรทและข้อมูลติดต่อเองบนเว็บไซต์ทางการ', en: 'Single-store provider publishing its own rates page and contact details on the official website.', zh: '官网自行公开汇率页和联系方式的单店型换汇商。' }, officialUrl: 'https://www.ratchadaexchange.com', affiliate: { status: 'official_only', officialUrl: 'https://www.ratchadaexchange.com', disclosure: { th: 'ลิงก์นี้พาไปยังเว็บไซต์ทางการ', en: 'This link goes to the official website.', zh: '该链接跳转至官网。' } } }
];

export const publicCashProviderSlugs = ['superrich-thailand', 'sia', 'ratchada'] as const;
export const publicCashProviders = cashProviders.filter((provider) => publicCashProviderSlugs.includes(provider.slug as typeof publicCashProviderSlugs[number]));

export const cashBranches: CashBranch[] = [
  { id: 'sr1965-asok', providerSlug: 'superrich-1965', name: 'SuperRich 1965 Head Office', area: 'Central Bangkok', address: 'Official guest booking feed branch: Head Office (exact public walk-in address should be verified on the provider contact page).', mapsUrl: 'https://www.superrich1965.com', latitude: 13.747, longitude: 100.533, hours: 'Branch hours vary by location; verify with provider before visiting', isOpen: true, distanceKm: 1.1, locationPrecision: 'reference' },
  { id: 'sr-th-pratunam', providerSlug: 'superrich-thailand', name: 'SuperRich Thailand Pratunam Area Reference', area: 'Pratunam', address: 'Official website identifies central Bangkok / Pratunam area operations; exact branch selection is loaded dynamically from the provider contact module.', mapsUrl: 'https://www.superrichthailand.com/#!/en/contact', latitude: 13.7504, longitude: 100.5401, hours: 'Monday-Saturday 09:00-16:30', isOpen: true, distanceKm: 3.2, locationPrecision: 'reference' },
  { id: 'sia-hq-pratunam', providerSlug: 'sia', name: 'SIA Money Exchange HQ', area: 'Pratunam', address: '1091/156-7 Soi Petchaburi 33, New Petchaburi Rd, Makkasan, Ratchathewi, Bangkok 10400', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=1091%2F156-7%20Soi%20Petchaburi%2033%2C%20New%20Petchaburi%20Rd%2C%20Makkasan%2C%20Ratchathewi%2C%20Bangkok%2010400', latitude: 13.751234, longitude: 100.546349, hours: 'Mon-Sat 09:00-18:00, Sun closed', isOpen: true, distanceKm: 3.4, locationPrecision: 'address' },
  { id: 'ratchada-main', providerSlug: 'ratchada', name: 'Ratchada Exchange', area: 'Huai Khwang', address: '78/13 Prachatbamphen Rd., Huai Khwang, Bangkok 10310', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=78%2F13%20Prachatbamphen%20Rd.%2C%20Huai%20Khwang%2C%20Bangkok%2010310', latitude: 13.77837, longitude: 100.577055, hours: 'Open daily 09:00-20:30', isOpen: true, distanceKm: 5.5, locationPrecision: 'address' }
];

export const cashRates: CashRate[] = [
  { branchId: 'sr1965-asok', currency: 'USD', denomination: '100', buyRate: 31.91, sellRate: 32.07, observedAt: '2026-03-10T18:56:10+07:00' },
  { branchId: 'sr-th-pratunam', currency: 'USD', denomination: '100', buyRate: 31.52, sellRate: 31.62, observedAt: '2026-03-10T18:56:10+07:00' },
  { branchId: 'sia-hq-pratunam', currency: 'USD', denomination: '100', buyRate: 31.53, sellRate: 31.70, observedAt: '2026-03-10T16:02:07+07:00' },
  { branchId: 'ratchada-main', currency: 'USD', denomination: '100', buyRate: 31.46, sellRate: 31.62, observedAt: '2026-03-10T18:56:10+07:00' },
  { branchId: 'sr1965-asok', currency: 'CNY', denomination: 'notes', buyRate: 4.55, sellRate: 4.67, observedAt: '2026-03-10T18:56:10+07:00' },
  { branchId: 'ratchada-main', currency: 'CNY', denomination: 'notes', buyRate: 4.58, sellRate: 4.64, observedAt: '2026-03-10T18:56:10+07:00' }
];
