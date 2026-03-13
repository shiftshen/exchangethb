import { ContentLocale } from '@/lib/types';

export type RouteGuideType = 'crypto' | 'cash';

export interface RouteGuide {
  slug: string;
  type: RouteGuideType;
  compareHref: string;
  symbol?: string;
  currency?: string;
  amount: string;
  title: Record<ContentLocale, string>;
  summary: Record<ContentLocale, string>;
  intro: Record<ContentLocale, string>;
  audience: Record<ContentLocale, string>;
  checks: Record<ContentLocale, string[]>;
  faqs?: Record<ContentLocale, Array<{ question: string; answer: string }>>;
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
    slug: 'eth-to-thb',
    type: 'crypto',
    compareHref: '/crypto?symbol=ETH&side=buy&amount=0.1',
    symbol: 'ETH',
    amount: '0.1',
    title: {
      en: 'ETH to THB comparison for Thailand',
      zh: 'ETH 换 THB 路线比较',
      th: 'เปรียบเทียบ ETH เป็น THB',
    },
    summary: {
      en: 'Compare Thai exchanges for buying Ethereum with baht, using ask-side pricing, fees, and explicit source freshness.',
      zh: '比较在泰国买入 ETH 换 THB 的预计总支付、手续费和数据状态。',
      th: 'เปรียบเทียบต้นทุนซื้อ ETH ด้วยบาทไทย พร้อมค่าธรรมเนียมและสถานะข้อมูล',
    },
    intro: {
      en: 'This route is for users who know they want ETH/THB and need a cleaner decision page than a generic price list.',
      zh: '这个入口适合已经明确要看 ETH/THB、想先看总成本和数据状态的人。',
      th: 'หน้านี้เหมาะกับผู้ใช้ที่รู้แล้วว่าจะดูคู่ ETH/THB และต้องการหน้าตัดสินใจที่ชัดกว่าหน้าราคาทั่วไป',
    },
    audience: {
      en: 'Useful for Thailand-based buyers, expats, and international users who want an Ethereum route into baht before clicking out.',
      zh: '适合在泰国买入 ETH 的用户、长期居留者和国际搜索用户。',
      th: 'เหมาะกับผู้ซื้อ ETH ในไทย ผู้พำนักระยะยาว และผู้ใช้ต่างประเทศที่ต้องการเส้นทาง ETH เข้า THB',
    },
    checks: {
      en: ['Use total THB paid rather than the headline unit price.', 'Check whether the top row is live before clicking out.', 'Look at fee drag when the top two routes are close.'],
      zh: ['优先看总支付 THB，而不是单纯看单价。', '跳转前先看第一名是否为实时数据。', '当前两条路线接近时要看手续费拖累。'],
      th: ['ดูยอดจ่ายรวมเป็น THB ไม่ใช่ดูแค่ราคาต่อหน่วย', 'ก่อนกดออกไปให้เช็กก่อนว่ารายการอันดับหนึ่งเป็นข้อมูลสดหรือไม่', 'ถ้าผลลัพธ์ใกล้กันให้ดูผลกระทบจากค่าธรรมเนียม'],
    },
    keywords: ['eth to thb', 'ethereum to thb', 'buy eth thailand', 'eth thb exchange', 'thai ethereum exchange'],
  },
  {
    slug: 'xrp-to-thb',
    type: 'crypto',
    compareHref: '/crypto?symbol=XRP&side=buy&amount=500',
    symbol: 'XRP',
    amount: '500',
    title: {
      en: 'XRP to THB comparison for Thailand',
      zh: 'XRP 换 THB 路线比较',
      th: 'เปรียบเทียบ XRP เป็น THB',
    },
    summary: {
      en: 'Compare XRP buy routes into Thai baht with total-payment logic, fee visibility, and explicit source labels.',
      zh: '比较 XRP 买入 THB 路线，查看总支付逻辑、费用和数据标签。',
      th: 'เปรียบเทียบเส้นทางซื้อ XRP เป็นบาท พร้อมยอดจ่ายรวม ค่าธรรมเนียม และป้ายสถานะข้อมูล',
    },
    intro: {
      en: 'This page is for users searching XRP to THB in Thailand who need a practical compare screen instead of a raw quote page.',
      zh: '适合搜索 XRP to THB、想看到实用比较页而不是纯报价页的用户。',
      th: 'เหมาะกับผู้ใช้ที่ค้นหา XRP to THB ในไทยและต้องการหน้าคอมแพร์ที่ใช้งานได้จริง',
    },
    audience: {
      en: 'Useful when you want to compare a lower-ticket crypto route where fees and source freshness still change the real outcome.',
      zh: '适合比较相对低单价币种时，看清费用和数据状态对真实结果的影响。',
      th: 'มีประโยชน์เมื่อคุณต้องการเทียบเส้นทางของเหรียญราคาต่อหน่วยต่ำกว่า ซึ่งค่าธรรมเนียมและความสดของข้อมูลยังมีผลกับผลลัพธ์จริง',
    },
    checks: {
      en: ['Read buy mode as platform ask-side pricing.', 'Check total THB paid after fees.', 'Use the exchange detail page before registration or trading.'],
      zh: ['买入模式代表平台卖盘。', '看清手续费后的总支付 THB。', '注册或交易前先看平台详情页。'],
      th: ['โหมดซื้อหมายถึงการคำนวณจากฝั่งขายของแพลตฟอร์ม', 'ดูยอดจ่ายรวมเป็น THB หลังค่าธรรมเนียม', 'ก่อนสมัครหรือเทรดให้เปิดหน้าโปรไฟล์แพลตฟอร์มก่อน'],
    },
    keywords: ['xrp to thb', 'buy xrp thailand', 'xrp thb comparison', 'thai xrp exchange', 'xrp thailand'],
  },
  {
    slug: 'doge-to-thb',
    type: 'crypto',
    compareHref: '/crypto?symbol=DOGE&side=buy&amount=1000',
    symbol: 'DOGE',
    amount: '1000',
    title: {
      en: 'DOGE to THB comparison for Thailand',
      zh: 'DOGE 换 THB 路线比较',
      th: 'เปรียบเทียบ DOGE เป็น THB',
    },
    summary: {
      en: 'Compare DOGE buy routes into baht across Thai exchanges with fees, average execution price, and source freshness.',
      zh: '比较 DOGE 买入 THB 路线，查看费用、平均成交价和数据新鲜度。',
      th: 'เปรียบเทียบเส้นทางซื้อ DOGE เป็นบาท พร้อมค่าธรรมเนียม ราคาเฉลี่ย และความสดของข้อมูล',
    },
    intro: {
      en: 'This route captures DOGE-to-THB search intent and moves the user directly into the real Thai exchange comparison flow.',
      zh: '这个入口承接 DOGE to THB 搜索意图，并直接把用户带入真实比较流程。',
      th: 'หน้านี้รองรับเจตนาการค้นหา DOGE to THB และพาผู้ใช้เข้าสู่ flow เปรียบเทียบเว็บเทรดไทยโดยตรง',
    },
    audience: {
      en: 'Useful for users comparing smaller-ticket crypto purchases where unit price can be misleading without fee context.',
      zh: '适合比较小额币种买入路径时，避免只看单价而忽略费用。',
      th: 'เหมาะกับผู้ใช้ที่เทียบการซื้อเหรียญราคาต่อหน่วยเล็ก ซึ่งการดูแค่ราคาต่อหน่วยอาจทำให้เข้าใจผิดถ้าไม่ดูค่าธรรมเนียม',
    },
    checks: {
      en: ['Use the estimated total cost card rather than the average price alone.', 'Watch source freshness when liquidity is thin.', 'Treat the comparison as decision support, not a guaranteed execution quote.'],
      zh: ['优先看预计总成本，而不是只看均价。', '流动性较薄时要看数据新鲜度。', '比较页是决策辅助，不是保证成交报价。'],
      th: ['ดูการ์ดยอดต้นทุนรวมประมาณการ ไม่ใช่ดูแค่ราคาเฉลี่ย', 'ถ้าสภาพคล่องบางให้ดูความสดของข้อมูลด้วย', 'มองหน้าคอมแพร์เป็นเครื่องมือช่วยตัดสินใจ ไม่ใช่ราคา execution ที่การันตี'],
    },
    keywords: ['doge to thb', 'buy doge thailand', 'doge thb comparison', 'thai doge exchange', 'dogecoin thailand'],
  },
  {
    slug: 'sol-to-thb',
    type: 'crypto',
    compareHref: '/crypto?symbol=SOL&side=buy&amount=10',
    symbol: 'SOL',
    amount: '10',
    title: {
      en: 'SOL to THB comparison for Thailand',
      zh: 'SOL 换 THB 路线比较',
      th: 'เปรียบเทียบ SOL เป็น THB',
    },
    summary: {
      en: 'Compare SOL buy routes into Thai baht with total payment, fee breakdown, and live-versus-fallback source states.',
      zh: '比较 SOL 买入 THB 路线，查看总支付、费用拆解和实时/备用状态。',
      th: 'เปรียบเทียบเส้นทางซื้อ SOL เป็นบาท พร้อมยอดจ่ายรวม รายละเอียดค่าธรรมเนียม และสถานะ live/fallback',
    },
    intro: {
      en: 'This page is for Thailand-focused SOL users who want a more useful decision page than a simple price chart.',
      zh: '适合想看 SOL 在泰国换 THB 的用户，提供比单纯价格图更有决策价值的页面。',
      th: 'เหมาะกับผู้ใช้ SOL ที่เน้นเส้นทางในไทย และต้องการหน้าตัดสินใจที่มีประโยชน์กว่ากราฟราคาอย่างเดียว',
    },
    audience: {
      en: 'Useful for international users, expats, and local buyers comparing which Thai exchange route is worth clicking first.',
      zh: '适合国际用户、长期居留者和本地买家比较哪条 THB 路线更值得先点进去。',
      th: 'มีประโยชน์กับผู้ใช้ต่างประเทศ ผู้พำนักระยะยาว และผู้ซื้อในไทยที่ต้องการรู้ว่าควรกดเส้นทางไหนก่อน',
    },
    checks: {
      en: ['Use buy mode to read the platform sell-side correctly.', 'Compare total THB payment after fees.', 'Check the source state before using a narrow winner.'],
      zh: ['买入模式代表平台卖盘。', '比较扣费后的总支付 THB。', '结果接近时先看来源状态。'],
      th: ['โหมดซื้อหมายถึงการอ่านฝั่งขายของแพลตฟอร์ม', 'เปรียบเทียบยอดจ่าย THB หลังค่าธรรมเนียม', 'ถ้าผลต่างแคบ ให้เช็กสถานะแหล่งข้อมูลก่อน'],
    },
    keywords: ['sol to thb', 'buy sol thailand', 'sol thb comparison', 'thai sol exchange', 'solana thailand'],
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
  {
    slug: 'gbp-cash-to-thb',
    type: 'cash',
    compareHref: '/cash?currency=GBP&amount=500&maxDistanceKm=10',
    currency: 'GBP',
    amount: '500',
    title: {
      en: 'GBP cash to THB in Bangkok',
      zh: 'GBP 现金换 THB 路线比较',
      th: 'เปรียบเทียบ GBP เงินสดเป็น THB',
    },
    summary: {
      en: 'Compare pound cash routes into Thai baht in Bangkok with branch context, hours, and direct provider links.',
      zh: '比较英镑现金换 THB 的路线，查看门店背景、营业时间和直接入口。',
      th: 'เปรียบเทียบเงินปอนด์เป็นบาทในกรุงเทพ พร้อมบริบทสาขา เวลาเปิด และลิงก์ตรงของผู้ให้บริการ',
    },
    intro: {
      en: 'This route is built for UK-origin travelers and anyone carrying pound notes who wants a Bangkok-specific THB comparison.',
      zh: '适合来自英国的旅客，或持有英镑现金、希望看曼谷换 THB 路线的人。',
      th: 'เหมาะกับนักเดินทางจากสหราชอาณาจักรหรือผู้ที่ถือเงินปอนด์และต้องการหน้าเทียบ THB เฉพาะกรุงเทพ',
    },
    audience: {
      en: 'Useful when you want a stronger route page than a generic GBP to THB article before choosing a Bangkok money changer.',
      zh: '适合在去曼谷换汇前，先看比泛泛 GBP to THB 文章更有用的路线页。',
      th: 'มีประโยชน์เมื่อคุณต้องการหน้าตัดสินใจที่ชัดกว่าบทความ GBP to THB ทั่วไปก่อนเลือกร้านแลกเงินในกรุงเทพ',
    },
    checks: {
      en: ['Check whether the provider currently exposes a fresh GBP rate.', 'Use branch hours together with the estimated THB output.', 'Open the provider reference page again before you leave.'],
      zh: ['先看门店当前是否有新鲜的 GBP 汇率。', '同时比较预计 THB 和营业时间。', '出发前再打开一次品牌参考页确认。'],
      th: ['ตรวจว่าผู้ให้บริการมีเรต GBP ที่สดอยู่หรือไม่', 'ดูทั้งจำนวน THB โดยประมาณและเวลาเปิดของสาขา', 'ก่อนออกเดินทางให้เปิดหน้าอ้างอิงของแบรนด์ตรวจสอบอีกครั้ง'],
    },
    keywords: ['gbp to thb cash', 'pound to baht bangkok', 'uk traveler thailand money exchange', 'bangkok money changer gbp', 'gbp cash thailand'],
  },
  {
    slug: 'japan-to-thailand-money-exchange',
    type: 'cash',
    compareHref: '/cash?currency=JPY&amount=50000&maxDistanceKm=10',
    currency: 'JPY',
    amount: '50000',
    title: {
      en: 'Japan to Thailand money exchange guide',
      zh: '日本游客到泰国换汇指南',
      th: 'คู่มือแลกเงินจากญี่ปุ่นเป็นบาทไทย',
    },
    summary: {
      en: 'A Bangkok-focused guide for travelers from Japan who need to compare yen cash routes into Thai baht before visiting a money changer.',
      zh: '面向日本游客的曼谷换汇指南，帮助先比较日元现金换 THB 的路线。',
      th: 'คู่มือสำหรับนักเดินทางจากญี่ปุ่นที่ต้องการเทียบเส้นทางแลกเงินเยนเป็นบาทไทยก่อนเดินทางไปยังร้านแลกเงินจริง',
    },
    intro: {
      en: 'This page turns a broad Japan-to-Thailand exchange query into a concrete next step: compare yen cash routes in Bangkok with direct provider links.',
      zh: '这个页面把宽泛的“日本到泰国换汇”搜索，收敛成更具体的下一步：比较曼谷的 JPY 现金路线。',
      th: 'หน้านี้เปลี่ยนคำค้นกว้างๆ เรื่องการแลกเงินจากญี่ปุ่นมาไทย ให้กลายเป็นขั้นตอนถัดไปที่จับต้องได้ คือการเทียบเส้นทาง JPY เงินสดในกรุงเทพ',
    },
    audience: {
      en: 'Built for Japanese tourists, repeat visitors, and anyone arriving with yen who wants a cleaner decision page before walking to an exchange counter.',
      zh: '适合日本游客、回访旅客，以及任何携带日元现金到泰国的人。',
      th: 'เหมาะกับนักท่องเที่ยวจากญี่ปุ่น ผู้เดินทางซ้ำ และผู้ที่ถือเงินเยนก่อนเข้าร้านแลกเงิน',
    },
    checks: {
      en: ['Check the latest JPY rate sample before leaving.', 'Use the provider map or reference page to confirm the branch.', 'Treat this as a route guide rather than a final guaranteed quote.'],
      zh: ['先看最新 JPY 汇率样本。', '出发前用地图或参考页确认门店。', '把它当成路线指南，而不是最终保证报价。'],
      th: ['ดูตัวอย่างเรต JPY ล่าสุดก่อนออกเดินทาง', 'ใช้แผนที่หรือหน้าอ้างอิงเพื่อตรวจสอบสาขา', 'มองหน้านี้เป็นคู่มือเส้นทาง ไม่ใช่ใบเสนอราคาที่การันตี'],
    },
    faqs: {
      en: [
        {
          question: 'What is the fastest way for Japan travelers to compare yen to baht in Bangkok?',
          answer: 'Start from the JPY cash route page, then compare branch context, hours, and source freshness before leaving for a money changer.',
        },
        {
          question: 'Does this page guarantee the final yen to baht rate in store?',
          answer: 'No. This page is a route guide based on current observed data and provider context. Final in-store conditions still belong to the provider.',
        },
      ],
      zh: [
        {
          question: '来自日本的旅客，最快怎么比较日元到泰铢的路线？',
          answer: '先进入 JPY 现金路线页，再结合门店背景、营业时间和数据状态做判断。',
        },
        {
          question: '这个页面会保证最终门店汇率吗？',
          answer: '不会。它是路线参考页，最终门店条件仍以品牌现场规则为准。',
        },
      ],
      th: [
        {
          question: 'นักเดินทางจากญี่ปุ่นควรเริ่มเทียบเงินเยนเป็นบาทอย่างไรให้เร็วที่สุด',
          answer: 'เริ่มจากหน้า JPY cash route แล้วดูบริบทของสาขา เวลาเปิด และความสดของข้อมูลก่อนออกเดินทาง',
        },
        {
          question: 'หน้านี้การันตีเรตจริงหน้าร้านหรือไม่',
          answer: 'ไม่ หน้านี้เป็น route guide จากข้อมูลที่สังเกตได้และบริบทของผู้ให้บริการเท่านั้น เรตจริงยังขึ้นกับหน้าร้าน',
        },
      ],
    },
    keywords: ['japan to thailand money exchange', 'japan to thailand exchange rate', 'yen to baht thailand', 'japan travel money thailand', 'jpy bangkok money changer'],
  },
  {
    slug: 'korea-to-thailand-money-exchange',
    type: 'cash',
    compareHref: '/cash?currency=USD&amount=1000&maxDistanceKm=10',
    currency: 'USD',
    amount: '1000',
    title: {
      en: 'Korea to Thailand money exchange guide',
      zh: '韩国游客到泰国换汇指南',
      th: 'คู่มือแลกเงินจากเกาหลีมาไทย',
    },
    summary: {
      en: 'A practical Bangkok guide for Korea-origin travelers who want to compare stable money-changing routes into Thai baht before visiting a branch.',
      zh: '面向韩国出发游客的曼谷换汇指南，帮助先看稳定可行的 THB 路线。',
      th: 'คู่มือสำหรับผู้เดินทางจากเกาหลีที่ต้องการเทียบเส้นทางแลกเงินบาทที่ค่อนข้างเสถียรก่อนเดินทางไปยังร้านจริง',
    },
    intro: {
      en: 'KRW cash is not yet part of the live compare set, so this page focuses on how Korea-origin visitors should use the Bangkok cash comparison flow responsibly.',
      zh: '由于当前尚未接入 KRW 实时比较，本页重点是告诉来自韩国的用户，如何合理使用曼谷现金比较流程。',
      th: 'เนื่องจากตอนนี้ยังไม่ได้เชื่อมชุดเปรียบเทียบ KRW สด หน้านี้จึงเน้นการบอกผู้ใช้จากเกาหลีว่า ควรใช้ flow เปรียบเทียบเงินสดในกรุงเทพอย่างไรให้ตรงความจริง',
    },
    audience: {
      en: 'Useful for Korean travelers who need a decision framework first and can then switch to the closest supported cash route on the compare page.',
      zh: '适合先建立决策框架，再在比较页选择当前支持的现金路线的韩国旅客。',
      th: 'มีประโยชน์กับนักเดินทางชาวเกาหลีที่ต้องการกรอบการตัดสินใจก่อน แล้วค่อยไปเลือกเส้นทางเงินสดที่รองรับอยู่ในหน้าคอมแพร์',
    },
    checks: {
      en: ['Do not assume unsupported currencies have live rates on this site.', 'Use branch quality, hours, and map links as the first filter.', 'Confirm final currency availability with the provider before visiting.'],
      zh: ['不要默认本站对未接入币种提供实时汇率。', '先用门店质量、营业时间和地图作为第一层筛选。', '到店前请先向门店确认目标币种是否可兑换。'],
      th: ['อย่าคิดว่าสกุลเงินที่ยังไม่รองรับจะมีเรตสดบนเว็บนี้', 'ใช้คุณภาพสาขา เวลาเปิด และลิงก์แผนที่เป็นตัวกรองชั้นแรก', 'ก่อนเดินทางให้ยืนยันกับผู้ให้บริการก่อนว่าสามารถแลกสกุลเงินที่ต้องการได้จริง'],
    },
    faqs: {
      en: [
        {
          question: 'Does ExchangeTHB support live KRW to THB comparison right now?',
          answer: 'No. Korea pages are framed as travel exchange decision pages, not live KRW comparison pages. Use them to choose a practical Bangkok cash route and verify final currency support with the provider.',
        },
        {
          question: 'Why does the Korea page link into supported Bangkok cash routes instead of KRW rows?',
          answer: 'Because unsupported currencies should not be presented as live. The page is designed to help Korea-origin travelers make a realistic branch and route decision without pretending KRW is currently in the live compare set.',
        },
      ],
      zh: [
        {
          question: 'ExchangeTHB 现在支持 KRW 到 THB 的实时比较吗？',
          answer: '不支持。韩国页是旅行换汇决策页，不是假装提供 KRW 实时比较的页面。',
        },
        {
          question: '为什么韩国页会引导到当前支持的现金路线，而不是直接给 KRW 行情？',
          answer: '因为未接入币种不应该被包装成实时数据。这个页面的目标是帮助来自韩国的用户做出真实可执行的门店和路线决策。',
        },
      ],
      th: [
        {
          question: 'ตอนนี้ ExchangeTHB รองรับการเปรียบเทียบ KRW เป็น THB แบบสดหรือไม่',
          answer: 'ยังไม่รองรับ หน้าสำหรับเกาหลีถูกออกแบบเป็นหน้าช่วยตัดสินใจเรื่องการแลกเงินระหว่างการเดินทาง ไม่ใช่หน้าที่แกล้งทำเป็นมีเรต KRW สด',
        },
        {
          question: 'ทำไมหน้าเกาหลีจึงพาไปยังเส้นทางเงินสดที่รองรับแทนที่จะมีแถว KRW โดยตรง',
          answer: 'เพราะสกุลเงินที่ยังไม่รองรับไม่ควรถูกนำเสนอเหมือนเป็นข้อมูลสด หน้านี้จึงช่วยให้ผู้ใช้จากเกาหลีตัดสินใจเรื่องสาขาและเส้นทางได้อย่างตรงความจริง',
        },
      ],
    },
    keywords: ['korea to thailand money exchange', 'korea to thailand exchange rate', 'korean traveler money thailand', 'thailand money exchange guide korea', 'bangkok exchange guide korea'],
  },
  {
    slug: 'germany-to-thailand-money-exchange',
    type: 'cash',
    compareHref: '/cash?currency=EUR&amount=1000&maxDistanceKm=10',
    currency: 'EUR',
    amount: '1000',
    title: {
      en: 'Germany to Thailand money exchange guide',
      zh: '德国游客到泰国换汇指南',
      th: 'คู่มือแลกเงินจากเยอรมนีมาไทย',
    },
    summary: {
      en: 'A route guide for Germany-origin travelers comparing euro cash into Thai baht in Bangkok with direct branch context and source labels.',
      zh: '面向德国游客的欧元换 THB 路线页，突出门店背景和数据状态。',
      th: 'คู่มือสำหรับผู้เดินทางจากเยอรมนีที่ต้องการเทียบเงินยูโรเป็นบาทในกรุงเทพ พร้อมบริบทสาขาและป้ายสถานะข้อมูล',
    },
    intro: {
      en: 'This page is built for users searching broadly from Germany to Thailand exchange intent, then moving into a concrete euro-to-baht comparison.',
      zh: '这个页面承接从德国到泰国的宽泛换汇意图，再把用户导入更具体的 EUR 到 THB 比较。',
      th: 'หน้านี้สร้างมาสำหรับผู้ใช้ที่ค้นหาเจตนากว้างๆ เรื่องการแลกเงินจากเยอรมนีมาไทย แล้วต้องการไปต่อยังการเทียบ EUR เป็น THB แบบเจาะจง',
    },
    audience: {
      en: 'Useful for travelers from Germany who already hold euros and want a stronger Bangkok-specific decision page than a generic FX article.',
      zh: '适合已经持有欧元、希望看到更贴近曼谷场景而不是泛泛外汇文章的德国旅客。',
      th: 'เหมาะกับผู้เดินทางจากเยอรมนีที่ถือเงินยูโรอยู่แล้ว และต้องการหน้าตัดสินใจสำหรับกรุงเทพที่เฉพาะทางกว่าบทความ FX ทั่วไป',
    },
    checks: {
      en: ['Use the compare page to see rate context, not just one quoted number.', 'Check branch hours before traveling in Bangkok.', 'Prefer rows with live source labels when outcomes are close.'],
      zh: ['在比较页里同时看汇率背景，而不是单一数字。', '在曼谷出发前先看营业时间。', '结果接近时优先选择实时来源。'],
      th: ['ใช้หน้าคอมแพร์เพื่อดูบริบทของเรต ไม่ใช่ตัวเลขตัวเดียว', 'ตรวจเวลาเปิดของสาขาก่อนเดินทางในกรุงเทพ', 'ถ้าผลลัพธ์ใกล้กัน ให้เลือกรายการที่เป็น live source ก่อน'],
    },
    faqs: {
      en: [
        {
          question: 'What should Germany travelers compare before exchanging euros in Bangkok?',
          answer: 'Compare the estimated THB outcome, branch hours, and whether the row is live or fallback before using a Bangkok money changer.',
        },
        {
          question: 'Is this page better than a generic EUR to THB article?',
          answer: 'Yes. It is built as a decision page tied to actual Bangkok branches and provider links, not just an abstract exchange-rate article.',
        },
      ],
      zh: [
        {
          question: '来自德国的旅客，在曼谷换欧元前应该先看什么？',
          answer: '先比较预计到手 THB、营业时间，以及当前是实时还是备用数据。',
        },
        {
          question: '这个页面比泛泛的 EUR to THB 文章更有用吗？',
          answer: '更有用。它直接对应曼谷门店和品牌入口，而不是抽象的汇率说明文。',
        },
      ],
      th: [
        {
          question: 'ผู้เดินทางจากเยอรมนีควรดูอะไรบ้างก่อนแลกยูโรในกรุงเทพ',
          answer: 'ให้ดูจำนวน THB โดยประมาณ เวลาเปิดของสาขา และดูว่ารายการนั้นเป็น live หรือ fallback',
        },
        {
          question: 'หน้านี้มีประโยชน์กว่าบทความ EUR to THB ทั่วไปหรือไม่',
          answer: 'มีประโยชน์กว่า เพราะเชื่อมกับสาขาและลิงก์ของผู้ให้บริการในกรุงเทพโดยตรง ไม่ใช่แค่บทความอธิบายเรตแบบกว้างๆ',
        },
      ],
    },
    keywords: ['germany to thailand money exchange', 'germany to thailand exchange rate', 'euro to baht thailand', 'german traveler thailand money', 'eur bangkok money changer'],
  },
  {
    slug: 'europe-to-thailand-money-exchange',
    type: 'cash',
    compareHref: '/cash?currency=EUR&amount=1000&maxDistanceKm=10',
    currency: 'EUR',
    amount: '1000',
    title: {
      en: 'Europe to Thailand money exchange guide',
      zh: '欧洲游客到泰国换汇指南',
      th: 'คู่มือแลกเงินจากยุโรปมาไทย',
    },
    summary: {
      en: 'A Europe-focused entry page that leads travelers into the practical Bangkok EUR cash to THB comparison flow.',
      zh: '面向欧洲访客的入口页，把用户导入更实用的曼谷 EUR 现金换 THB 流程。',
      th: 'หน้าเริ่มต้นสำหรับผู้เดินทางจากยุโรปที่ต้องการเข้าสู่ flow การเทียบ EUR เงินสดเป็น THB ในกรุงเทพ',
    },
    intro: {
      en: 'This route helps Europe-origin users skip generic travel content and move directly into a Bangkok-specific money-changing decision.',
      zh: '这个页面帮助来自欧洲的用户跳过泛泛旅游内容，直接进入更贴近曼谷实际情况的换汇决策。',
      th: 'หน้านี้ช่วยให้ผู้ใช้จากยุโรปข้ามคอนเทนต์ท่องเที่ยวแบบกว้างๆ แล้วเข้าไปยังการตัดสินใจเรื่องร้านแลกเงินในกรุงเทพโดยตรง',
    },
    audience: {
      en: 'Useful for euro-zone visitors, long-stay travelers, and remote workers planning their first cash exchange route after landing in Thailand.',
      zh: '适合欧元区游客、长期停留者和远程工作者，在抵达泰国后规划第一条现金换汇路线。',
      th: 'เหมาะกับผู้เดินทางจากยูโรโซน ผู้พำนักระยะยาว และ remote worker ที่ต้องการวางแผนเส้นทางแลกเงินสดครั้งแรกหลังมาถึงไทย',
    },
    checks: {
      en: ['Start with the EUR route if that is your actual carry currency.', 'Use distance and branch hours together, not rate alone.', 'Open the provider page again before you leave your hotel or airport.'],
      zh: ['如果你实际携带的是欧元，就先从 EUR 路线开始。', '同时看距离和营业时间，不要只看汇率。', '离开酒店或机场前再打开一次品牌页面确认。'],
      th: ['ถ้าคุณถือเงินยูโรจริง ให้เริ่มจากเส้นทาง EUR ก่อน', 'ดูทั้งระยะทางและเวลาเปิด ไม่ใช่ดูเรตอย่างเดียว', 'ก่อนออกจากโรงแรมหรือสนามบิน ให้เปิดหน้าแบรนด์ตรวจสอบอีกครั้ง'],
    },
    faqs: {
      en: [
        {
          question: 'How should Europe travelers use this page before arriving in Bangkok?',
          answer: 'Use it to move from broad Europe-to-Thailand intent into a practical EUR cash route, then compare real provider pages and branch context.',
        },
        {
          question: 'Does this page work only for euro-zone visitors?',
          answer: 'It is strongest for euro-zone travelers, but it also works as a decision entry page for Europe-origin users who need a realistic first step into Bangkok money changing.',
        },
      ],
      zh: [
        {
          question: '来自欧洲的旅客，在到曼谷前应该怎么用这个页面？',
          answer: '先把宽泛的 Europe to Thailand 换汇需求，收敛成更实用的 EUR 现金路线，再进入真实门店比较。',
        },
        {
          question: '这个页面只适合欧元区旅客吗？',
          answer: '它最适合欧元区用户，但也适合作为欧洲访客进入曼谷换汇决策的第一步。',
        },
      ],
      th: [
        {
          question: 'ผู้เดินทางจากยุโรปควรใช้หน้านี้อย่างไรก่อนมาถึงกรุงเทพ',
          answer: 'ใช้หน้านี้เปลี่ยนเจตนากว้างๆ เรื่องการแลกเงินจากยุโรปมาไทย ให้กลายเป็นเส้นทาง EUR เงินสดที่ใช้งานได้จริง แล้วค่อยเข้าไปเทียบร้านจริง',
        },
        {
          question: 'หน้านี้เหมาะเฉพาะผู้เดินทางจากยูโรโซนหรือไม่',
          answer: 'เหมาะที่สุดกับผู้ใช้จากยูโรโซน แต่ก็ยังใช้เป็นจุดเริ่มต้นการตัดสินใจสำหรับผู้เดินทางจากยุโรปได้',
        },
      ],
    },
    keywords: ['europe to thailand money exchange', 'europe to thailand exchange rate', 'europe travel money thailand', 'euro cash thailand', 'bangkok exchange guide europe'],
  },
];

export const routeGuideSlugs = routeGuides.map((guide) => guide.slug);

export function getRouteGuide(slug: string) {
  return routeGuides.find((guide) => guide.slug === slug);
}
