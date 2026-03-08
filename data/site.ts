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
    summary: { th: 'แพลตฟอร์มยอดนิยมในไทย เหมาะกับการแปลง THB แบบ local-first', en: 'Popular Thai exchange with strong local THB support.', zh: '泰国本地化体验较强，适合 THB 场景。' },
    strengths: [
      { th: 'รองรับผู้ใช้ไทยดี', en: 'Strong THB-native experience', zh: '本地 THB 体验强' },
      { th: 'เหมาะกับการ导流首发', en: 'Good fit for launch-phase referrals', zh: '适合首发导流' },
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
    summary: { th: 'ใช้ข้อมูล quotation/orderbook ที่มีมาตรฐานสม่ำเสมอ', en: 'Consistent quotation and orderbook data with strong market structure.', zh: '报价和订单簿结构稳定，适合标准化比较。' },
    strengths: [{ th: 'ข้อมูลตลาดเป็นระเบียบ', en: 'Well-structured market data', zh: '市场数据结构规范' }],
    cautions: [{ th: 'ข้อมูล referral สาธารณะยังไม่ชัด', en: 'Public referral terms are less clear', zh: '公开返佣信息不够明确' }],
    affiliate: { status: 'official_only', officialUrl: 'https://th.upbit.com', disclosure: { th: 'ใช้ลิงก์ทางการเป็นค่าเริ่มต้น', en: 'Official link used by default.', zh: '默认使用官方链接。' } },
    fee: { tradingFeePct: 0.25, thbWithdraw: 20, networks: { BTC: 0.00028, ETH: 0.0032, USDT: 1 } },
    score: { compliance: 24, feeTransparency: 13, apiQuality: 14, thbFriendliness: 13, executionQuality: 18, operations: 8 },
    pairs: ['BTC', 'ETH', 'USDT'],
    lastUpdated: '2026-03-08T00:00:00+07:00'
  },
  {
    slug: 'orbix', name: 'Orbix', license: 'Thai SEC digital asset exchange license',
    summary: { th: 'เหมาะกับแคมเปญเฉพาะช่วง และหน้าโปรไฟล์แพลตฟอร์มแบบเน้นเนื้อหา', en: 'Useful for campaign-led discovery and editorial platform pages.', zh: '适合活动导向流量与内容型平台资料页。' },
    strengths: [{ th: 'กิจกรรมและข้อเสนอปรับใช้ได้', en: 'Campaign-friendly operations', zh: '活动型运营更灵活' }],
    cautions: [{ th: 'คู่และ深度บางช่วงอาจจำกัด', en: 'Pair coverage and depth can vary', zh: '部分时段交易对和深度有限' }],
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
  { slug: 'superrich-1965', name: 'SuperRich 1965', summary: { th: 'ผู้ให้บริการแลกเงินชื่อดังแบบสาขา', en: 'Well-known exchange provider with branch-level rates.', zh: '知名换汇品牌，支持门店级汇率。' }, officialUrl: 'https://www.superrich1965.com', affiliate: { status: 'official_only', officialUrl: 'https://www.superrich1965.com', disclosure: { th: 'ข้อมูลอาจต่างกันตามสาขาและเวลาจริง', en: 'Rates can vary by branch and time.', zh: '汇率可能因门店与时间不同而变化。' } } },
  { slug: 'superrich-thailand', name: 'SuperRich Thailand', summary: { th: 'แบรนด์ยอดนิยมในกรุงเทพสำหรับเงินสดต่างประเทศ', en: 'Popular Bangkok cash exchange brand.', zh: '曼谷常见现金换汇品牌。' }, officialUrl: 'https://www.superrichthailand.com', affiliate: { status: 'official_only', officialUrl: 'https://www.superrichthailand.com', disclosure: { th: 'ใช้ลิงก์ทางการเท่านั้น', en: 'Official links only.', zh: '仅使用官方链接。' } } },
  { slug: 'vasu', name: 'Vasu Exchange', summary: { th: 'แหล่งอ้างอิงอัตราแลกเปลี่ยนคุณภาพสูงในกรุงเทพ', en: 'High-signal Bangkok source for exchange rates.', zh: '曼谷高质量汇率参考来源。' }, officialUrl: 'https://www.vasuexchange.com', affiliate: { status: 'official_only', officialUrl: 'https://www.vasuexchange.com', disclosure: { th: 'อัตราอาจเปลี่ยนระหว่างวัน', en: 'Rates may change intraday.', zh: '汇率可能日内变化。' } } },
  { slug: 'sia', name: 'SIA Money Exchange', summary: { th: 'ตัวเลือกเสริมสำหรับเทียบเรตรอบเมือง', en: 'Supplementary Bangkok option for rate comparison.', zh: '可作为曼谷范围内的补充比价来源。' }, officialUrl: 'https://www.siamoneyexchange.com', affiliate: { status: 'official_only', officialUrl: 'https://www.siamoneyexchange.com', disclosure: { th: 'โปรดตรวจสอบเรทล่าสุดจากผู้ให้บริการ', en: 'Please verify final rates with the provider.', zh: '请以门店最终汇率为准。' } } },
  { slug: 'ratchada', name: 'Ratchada Exchange', summary: { th: 'ผู้ให้บริการเดี่ยวที่มีคุณภาพข้อมูลค่อนข้างนิ่ง', en: 'Single-store provider with stable public rate data.', zh: '单店型来源，公开汇率数据较稳定。' }, officialUrl: 'https://www.ratchadaexchange.com', affiliate: { status: 'official_only', officialUrl: 'https://www.ratchadaexchange.com', disclosure: { th: 'ลิงก์นี้พาไปยังเว็บไซต์ทางการ', en: 'This link goes to the official website.', zh: '该链接跳转至官网。' } } }
];

export const cashBranches: CashBranch[] = [
  { id: 'sr1965-asok', providerSlug: 'superrich-1965', name: 'SuperRich 1965 Asok', area: 'Asok', address: 'Sukhumvit Rd, Bangkok', mapsUrl: 'https://maps.google.com/?q=13.737,100.560', latitude: 13.737, longitude: 100.56, hours: '09:00-18:00', isOpen: true, distanceKm: 1.1 },
  { id: 'sr-th-pratunam', providerSlug: 'superrich-thailand', name: 'SuperRich Thailand Pratunam', area: 'Pratunam', address: 'Ratchadamri Rd, Bangkok', mapsUrl: 'https://maps.google.com/?q=13.75,100.54', latitude: 13.75, longitude: 100.54, hours: '09:00-18:00', isOpen: true, distanceKm: 3.2 },
  { id: 'vasu-main', providerSlug: 'vasu', name: 'Vasu Exchange Main', area: 'Nana', address: 'Sukhumvit Soi 7, Bangkok', mapsUrl: 'https://maps.google.com/?q=13.742,100.554', latitude: 13.742, longitude: 100.554, hours: '09:00-18:30', isOpen: true, distanceKm: 1.8 },
  { id: 'sia-silom', providerSlug: 'sia', name: 'SIA Silom', area: 'Silom', address: 'Silom Rd, Bangkok', mapsUrl: 'https://maps.google.com/?q=13.728,100.531', latitude: 13.728, longitude: 100.531, hours: '10:00-18:00', isOpen: false, distanceKm: 4.7 },
  { id: 'ratchada-main', providerSlug: 'ratchada', name: 'Ratchada Exchange', area: 'Ratchada', address: 'Ratchadaphisek Rd, Bangkok', mapsUrl: 'https://maps.google.com/?q=13.77,100.57', latitude: 13.77, longitude: 100.57, hours: '09:30-19:00', isOpen: true, distanceKm: 5.5 }
];

export const cashRates: CashRate[] = [
  { branchId: 'sr1965-asok', currency: 'USD', denomination: '100', buyRate: 35.62, sellRate: 35.78, observedAt: '2026-03-08T00:00:00+07:00' },
  { branchId: 'sr-th-pratunam', currency: 'USD', denomination: '100', buyRate: 35.58, sellRate: 35.75, observedAt: '2026-03-08T00:00:00+07:00' },
  { branchId: 'vasu-main', currency: 'USD', denomination: '100', buyRate: 35.64, sellRate: 35.81, observedAt: '2026-03-08T00:00:00+07:00' },
  { branchId: 'sia-silom', currency: 'USD', denomination: '100', buyRate: 35.51, sellRate: 35.72, observedAt: '2026-03-08T00:00:00+07:00' },
  { branchId: 'ratchada-main', currency: 'USD', denomination: '100', buyRate: 35.57, sellRate: 35.74, observedAt: '2026-03-08T00:00:00+07:00' },
  { branchId: 'sr1965-asok', currency: 'CNY', denomination: 'notes', buyRate: 4.89, sellRate: 5.01, observedAt: '2026-03-08T00:00:00+07:00' },
  { branchId: 'vasu-main', currency: 'CNY', denomination: 'notes', buyRate: 4.9, sellRate: 5.02, observedAt: '2026-03-08T00:00:00+07:00' },
  { branchId: 'ratchada-main', currency: 'CNY', denomination: 'notes', buyRate: 4.88, sellRate: 5.03, observedAt: '2026-03-08T00:00:00+07:00' }
];
