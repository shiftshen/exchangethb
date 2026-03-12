import { Locale } from '@/lib/types';

export type RouteGuideType = 'crypto' | 'cash';

export interface RouteGuide {
  slug: string;
  type: RouteGuideType;
  compareHref: string;
  symbol?: string;
  currency?: string;
  amount: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  intro: Record<Locale, string>;
  audience: Record<Locale, string>;
  checks: Record<Locale, string[]>;
  keywords: string[];
}

export const routeGuides: RouteGuide[] = [
  {
    slug: 'btc-to-thb',
    type: 'crypto',
    compareHref: '/crypto?symbol=BTC&side=buy&amount=0.01',
    symbol: 'BTC',
    amount: '0.01',
    title: {
      en: 'BTC to THB comparison for Thailand',
      zh: 'BTC 换 THB 路线比较',
      th: 'เปรียบเทียบ BTC เป็น THB',
    },
    summary: {
      en: 'Compare live Thai exchanges for buying Bitcoin with baht, including ask-side pricing, fees, and source freshness.',
      zh: '比较泰国平台买入 BTC 的预计总支付、手续费与数据新鲜度。',
      th: 'เปรียบเทียบต้นทุนซื้อ BTC ด้วยบาทไทย พร้อมค่าธรรมเนียมและสถานะข้อมูล',
    },
    intro: {
      en: 'This route is designed for users who need to compare Bitcoin buy quotes into Thai baht before clicking through to a Thai exchange.',
      zh: '这个入口适合先比较各平台 BTC 买入成本，再决定跳转到真实交易所。',
      th: 'หน้านี้เหมาะกับคนที่ต้องการเทียบต้นทุนซื้อ BTC เป็นเงินบาทก่อนกดออกไปยังเว็บเทรดจริง',
    },
    audience: {
      en: 'Useful for expats, remote workers, and travelers who already know they want BTC/THB and need a fast decision page.',
      zh: '适合已经确定要看 BTC/THB、但希望先看总成本和数据状态的人。',
      th: 'เหมาะกับผู้ใช้ที่รู้แล้วว่าจะดูคู่ BTC/THB และต้องการหน้าตัดสินใจที่เร็วขึ้น',
    },
    checks: {
      en: ['Compare total payment, not just the headline price.', 'Prefer live rows when the outcome is close.', 'Use the exchange detail page before registration or trading.'],
      zh: ['优先看总支付，而不是只看单价。', '结果接近时优先看实时数据。', '注册或交易前先查看平台详情页。'],
      th: ['ดูยอดจ่ายรวม ไม่ใช่ดูแค่ราคาหน้าแรก', 'ถ้าผลใกล้กัน ให้เลือกข้อมูลสดก่อน', 'ก่อนสมัครหรือเทรดให้เปิดหน้าโปรไฟล์แพลตฟอร์มก่อน'],
    },
    keywords: ['btc to thb', 'bitcoin to thb', 'buy btc thailand', 'thai bitcoin exchange', 'btc thb comparison'],
  },
  {
    slug: 'usdt-to-thb',
    type: 'crypto',
    compareHref: '/crypto?symbol=USDT&side=sell&amount=1000',
    symbol: 'USDT',
    amount: '1000',
    title: {
      en: 'USDT to THB comparison for Thailand',
      zh: 'USDT 换 THB 路线比较',
      th: 'เปรียบเทียบ USDT เป็น THB',
    },
    summary: {
      en: 'Compare Thai exchanges for selling USDT into baht with bid-side pricing, withdrawal assumptions, and explicit source states.',
      zh: '比较卖出 USDT 换 THB 的净到手、费用和数据状态。',
      th: 'เปรียบเทียบเส้นทางขาย USDT เป็นบาท พร้อมยอดรับสุทธิ ค่าธรรมเนียม และสถานะข้อมูล',
    },
    intro: {
      en: 'This route is aimed at users who hold USDT and want to estimate net THB proceeds across Thai exchanges.',
      zh: '这个入口适合持有 USDT、希望先比较净到手泰铢的人。',
      th: 'เหมาะกับผู้ใช้ที่ถือ USDT และต้องการประเมินเงินบาทสุทธิที่ได้จากแต่ละแพลตฟอร์ม',
    },
    audience: {
      en: 'Useful for stablecoin cash-out comparisons in Thailand, especially when fees and liquidity can change the final outcome.',
      zh: '适合在泰国做稳定币变现对比，尤其是费用和深度会影响最终结果时。',
      th: 'เหมาะกับการเทียบเส้นทาง cash-out ของ stablecoin ในไทย เมื่อค่าธรรมเนียมและ depth มีผลกับผลลัพธ์จริง',
    },
    checks: {
      en: ['Look at net THB received after fees.', 'Check liquidity gap before assuming the top row scales.', 'Use the live/fallback labels to understand route quality.'],
      zh: ['优先看扣费后的净到手 THB。', '不要默认第一行结果适用于更大金额。', '结合实时/备用标签判断路线质量。'],
      th: ['ดูเงินบาทสุทธิหลังหักค่าธรรมเนียม', 'อย่าคิดว่ารายการแถวแรกจะรองรับจำนวนที่ใหญ่กว่าเสมอ', 'ใช้ป้าย live/fallback เพื่อดูคุณภาพของเส้นทาง'],
    },
    keywords: ['usdt to thb', 'sell usdt thailand', 'thai usdt exchange', 'stablecoin to baht', 'usdt thb comparison'],
  },
  {
    slug: 'usd-cash-to-thb',
    type: 'cash',
    compareHref: '/cash?currency=USD&amount=1000&maxDistanceKm=10',
    currency: 'USD',
    amount: '1000',
    title: {
      en: 'USD cash to THB in Bangkok',
      zh: 'USD 现金换 THB 路线比较',
      th: 'เปรียบเทียบ USD เงินสดเป็น THB',
    },
    summary: {
      en: 'Compare Bangkok money changers for exchanging US dollars into baht with rate transparency, hours, and map or reference links.',
      zh: '比较曼谷门店把 USD 现金换成 THB 的汇率、营业时间与导航入口。',
      th: 'เปรียบเทียบร้านแลกเงินในกรุงเทพสำหรับ USD เงินสด พร้อมเรต เวลาเปิด และลิงก์นำทาง',
    },
    intro: {
      en: 'This page is for travelers, digital nomads, and visitors who want a cleaner USD cash to THB starting point in Bangkok.',
      zh: '这个入口适合游客、长期居留者和到曼谷后想换美元现金的人。',
      th: 'เหมาะกับนักท่องเที่ยวและผู้พำนักที่ต้องการจุดเริ่มต้นที่ชัดเจนสำหรับการแลก USD เงินสดในกรุงเทพ',
    },
    audience: {
      en: 'Especially useful if you compare airport convenience against city-center rates before leaving for a money changer.',
      zh: '适合在决定去机场换还是去市区换之前先做一轮比较。',
      th: 'มีประโยชน์มากถ้าคุณกำลังตัดสินใจว่าจะแลกที่สนามบินหรือออกไปยังร้านในเมือง',
    },
    checks: {
      en: ['Check the data state before using a rate.', 'Use your real location for distance sorting when possible.', 'Verify exact branch details before visiting if the row is marked as a reference point.'],
      zh: ['先看数据状态，再看汇率。', '可以授权定位，让距离排序更真实。', '如果是参考点，请到店前再次核实门店信息。'],
      th: ['ตรวจสถานะข้อมูลก่อนดูเรต', 'เปิดใช้ตำแหน่งจริงถ้าต้องการจัดเรียงตามระยะทางจริง', 'ถ้าเป็น reference point ให้ตรวจสอบรายละเอียดสาขาอีกครั้งก่อนเดินทาง'],
    },
    keywords: ['usd to thb cash', 'bangkok money changer usd', 'exchange usd in bangkok', 'thailand usd cash exchange', 'usd cash to baht'],
  },
  {
    slug: 'eur-cash-to-thb',
    type: 'cash',
    compareHref: '/cash?currency=EUR&amount=1000&maxDistanceKm=10',
    currency: 'EUR',
    amount: '1000',
    title: {
      en: 'EUR cash to THB in Bangkok',
      zh: 'EUR 现金换 THB 路线比较',
      th: 'เปรียบเทียบ EUR เงินสดเป็น THB',
    },
    summary: {
      en: 'A route page for European visitors comparing EUR cash to THB in Bangkok with branch context and source transparency.',
      zh: '面向欧洲访客的 EUR 现金换 THB 比较入口，包含门店背景与来源透明度。',
      th: 'เส้นทางสำหรับนักเดินทางจากยุโรปที่ต้องการเทียบ EUR เงินสดเป็น THB พร้อมบริบทของแต่ละสาขา',
    },
    intro: {
      en: 'Use this guide when you already hold euros and want a direct Bangkok comparison instead of generic FX content.',
      zh: '如果你已经持有欧元，想看面向曼谷场景的直接比较，这个入口更适合。',
      th: 'ใช้หน้านี้เมื่อคุณถือเงินยูโรอยู่แล้วและต้องการหน้าเทียบตรงสำหรับกรุงเทพ แทนคอนเทนต์ FX แบบกว้างๆ',
    },
    audience: {
      en: 'Built for European travelers and long-stay visitors comparing in-city money changers rather than relying on hotel or airport desks.',
      zh: '适合欧洲游客或长期停留者，在酒店或机场之外寻找更有参考价值的路线。',
      th: 'เหมาะกับนักท่องเที่ยวและผู้พำนักจากยุโรปที่ต้องการเทียบร้านแลกเงินในเมือง แทนการพึ่งเคาน์เตอร์สนามบินหรือโรงแรม',
    },
    checks: {
      en: ['Compare both the displayed rate and branch context.', 'Widen the distance filter if you want more options.', 'Treat fallback rows as reference-only until the provider confirms the final rate.'],
      zh: ['同时看汇率和门店背景。', '想看更多选项时可以放宽距离范围。', '备用结果只能做参考，最终以门店确认为准。'],
      th: ['ดูทั้งเรตและบริบทของสาขา', 'หากต้องการตัวเลือกเพิ่ม ให้ขยายระยะทางอ้างอิง', 'รายการ fallback ควรใช้เป็นข้อมูลอ้างอิงจนกว่าผู้ให้บริการจะยืนยันเรตสุดท้าย'],
    },
    keywords: ['eur to thb cash', 'bangkok eur exchange', 'euro to baht bangkok', 'exchange euro thailand', 'eur cash to baht'],
  },
  {
    slug: 'jpy-cash-to-thb',
    type: 'cash',
    compareHref: '/cash?currency=JPY&amount=50000&maxDistanceKm=10',
    currency: 'JPY',
    amount: '50000',
    title: {
      en: 'JPY cash to THB in Bangkok',
      zh: 'JPY 现金换 THB 路线比较',
      th: 'เปรียบเทียบ JPY เงินสดเป็น THB',
    },
    summary: {
      en: 'Compare yen cash to baht in Bangkok with branch hours, distance context, and direct provider links.',
      zh: '比较日元现金换泰铢的路线，查看营业时间、距离背景和官方入口。',
      th: 'เปรียบเทียบเงินเยนเป็นบาท พร้อมเวลาเปิด ระยะทางอ้างอิง และลิงก์ทางการของผู้ให้บริการ',
    },
    intro: {
      en: 'This route is designed for travelers from Japan and anyone already carrying yen who wants a Bangkok-focused comparison.',
      zh: '适合来自日本的游客，或已经持有日元现金并希望看曼谷路线的人。',
      th: 'เหมาะกับนักเดินทางจากญี่ปุ่นหรือผู้ที่ถือเงินเยนและต้องการหน้าเทียบสำหรับกรุงเทพโดยตรง',
    },
    audience: {
      en: 'Useful when you want to estimate in-city exchange options before arriving at a branch.',
      zh: '适合在出发去门店前，先预估市区换汇路线。',
      th: 'มีประโยชน์เมื่อคุณต้องการประเมินตัวเลือกในเมืองก่อนเดินทางไปยังสาขาจริง',
    },
    checks: {
      en: ['Check whether the provider shows a fresh rate for JPY.', 'Use the map or reference link to confirm the branch before going.', 'Treat the compare page as a route guide, not a guaranteed quote.'],
      zh: ['先看门店是否提供新鲜的 JPY 汇率。', '出发前打开地图或参考页确认门店。', '比较页是路线参考，不是保证报价。'],
      th: ['ดูว่าผู้ให้บริการมีเรต JPY ที่สดหรือไม่', 'เปิดแผนที่หรือหน้าอ้างอิงเพื่อยืนยันสาขาก่อนเดินทาง', 'มองหน้าคอมแพร์เป็น route guide ไม่ใช่ใบเสนอราคาการันตี'],
    },
    keywords: ['jpy to thb cash', 'yen to baht bangkok', 'japanese yen exchange thailand', 'bangkok money changer jpy', 'jpy cash to baht'],
  },
  {
    slug: 'cny-cash-to-thb',
    type: 'cash',
    compareHref: '/cash?currency=CNY&amount=5000&maxDistanceKm=10',
    currency: 'CNY',
    amount: '5000',
    title: {
      en: 'CNY cash to THB in Bangkok',
      zh: 'CNY 现金换 THB 路线比较',
      th: 'เปรียบเทียบ CNY เงินสดเป็น THB',
    },
    summary: {
      en: 'Compare renminbi cash routes into Thai baht with branch context, source labels, and direct reference links.',
      zh: '比较人民币现金换 THB 的路线，查看门店背景、数据标签和直接参考链接。',
      th: 'เปรียบเทียบเงินหยวนเป็นบาท พร้อมบริบทสาขา ป้ายสถานะข้อมูล และลิงก์อ้างอิงโดยตรง',
    },
    intro: {
      en: 'This route is aimed at users who already carry renminbi and want a Bangkok money changer comparison before walking in.',
      zh: '适合已经持有人民币现金、想在到店前先比较路线的人。',
      th: 'เหมาะกับผู้ใช้ที่ถือเงินหยวนอยู่แล้วและต้องการเทียบร้านแลกเงินในกรุงเทพก่อนเดินทางไปจริง',
    },
    audience: {
      en: 'Useful for China-origin travelers and cross-border visitors who need a direct CNY to THB route page.',
      zh: '适合来自中国或跨境出行用户，直接查看 CNY 到 THB 的路线页。',
      th: 'มีประโยชน์กับนักเดินทางจากจีนหรือผู้ใช้ข้ามพรมแดนที่ต้องการหน้าเส้นทาง CNY ไป THB โดยตรง',
    },
    checks: {
      en: ['Use the branch page if you need more context before visiting.', 'Check whether the provider is using live or fallback data.', 'Expect final in-store conditions to override the comparison estimate.'],
      zh: ['如果要更多上下文，可以先看门店详情页。', '先看当前是实时还是备用数据。', '最终门店条件始终优先于比较估算。'],
      th: ['ถ้าต้องการบริบทเพิ่ม ให้เปิดหน้าโปรไฟล์ร้านก่อน', 'ดูว่าผลลัพธ์เป็น live หรือ fallback', 'เงื่อนไขจริงหน้าร้านยังคงมีผลเหนือค่าประมาณในหน้าเทียบ'],
    },
    keywords: ['cny to thb cash', 'rmb to baht bangkok', 'exchange cny thailand', 'bangkok money changer cny', 'yuan to baht'],
  },
];

export const routeGuideSlugs = routeGuides.map((guide) => guide.slug);

export function getRouteGuide(slug: string) {
  return routeGuides.find((guide) => guide.slug === slug);
}
