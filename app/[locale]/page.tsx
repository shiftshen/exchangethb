import Link from 'next/link';
import type { Metadata } from 'next';
import { exchanges, publicCashProviders } from '@/data/site';
import { TrackLink } from '@/components/track-link';
import { resolveContentLocale, t } from '@/lib/i18n';
import { routeGuides } from '@/lib/route-guides';
import { Locale } from '@/lib/types';
import { breadcrumbJsonLd, localeAlternates, websiteJsonLd, withLocalePath } from '@/lib/seo';
import { Pill, Section, StatCard } from '@/components/ui';

const copy = {
  th: {
    heroKicker: 'ตัวช่วยเลือกทางแลกเงินบาทที่ดีกว่า',
    heroTitle: 'เปรียบเทียบคริปโตและร้านแลกเงิน เพื่อหาเส้นทางที่เหมาะกับคุณ',
    heroBody: 'ExchangeTHB เปรียบเทียบจำนวนเงินบาทประมาณการ ค่าธรรมเนียม สภาพคล่อง ระยะอ้างอิงจากใจกลางกรุงเทพ และเวลาเปิดทำการไว้ในที่เดียว',
    primary: 'เปรียบเทียบคริปโต',
    secondary: 'เปรียบเทียบเงินสด',
    trust: 'ใช้ข้อมูลจาก API ทางการ หน้าเว็บทางการ และกฎตรวจทานที่เปิดเผยสถานะข้อมูลอย่างตรงไปตรงมา',
    coverageTitle: 'ความครอบคลุม',
    coverageValue: '{exchangeCount} แพลตฟอร์ม / {cashCount} แบรนด์เงินสด',
    coverageHint: 'ขอบเขตเปิดตัวถูกล็อกเพื่อเน้นความแม่นยำ',
    localeTitle: 'ภาษาเริ่มต้น',
    localeValue: 'TH',
    localeHint: 'สลับ EN / 中文 ได้ในคลิกเดียว',
    mapsTitle: 'แผนที่',
    mapsValue: 'แผนที่ / หน้าอ้างอิง',
    mapsHint: 'เปิดแผนที่จริงเมื่อมี และใช้หน้าอ้างอิงของแบรนด์เมื่อยังไม่มีลิงก์แผนที่โดยตรง',
    complianceTitle: 'Compliance',
    complianceValue: 'Estimated only',
    complianceHint: 'ไม่แสดงเป็นราคาการทำรายการที่การันตี',
    quickTitle: 'เริ่มเปรียบเทียบทันที',
    quickDescription: 'เลือกเส้นทางที่เหมาะกับการตัดสินใจครั้งถัดไปของคุณ',
    cryptoCardTitle: 'เปรียบเทียบคริปโตแบบดูสภาพคล่อง',
    cryptoCardBody: 'รองรับ BTC, ETH, USDT, XRP, DOGE, SOL พร้อมแสดงค่าธรรมเนียมและผลลัพธ์ประมาณการ',
    cashCardTitle: 'เปรียบเทียบเงินสดตามเรตและระยะอ้างอิง',
    cashCardBody: 'ดูเรตดีที่สุด ตัวเลือกตามระยะอ้างอิง เวลาเปิดทำการ และลิงก์แผนที่หรือหน้าอ้างอิง',
    routeTitle: 'เส้นทางยอดนิยม',
    routeDescription: 'เส้นทางที่ใช้บ่อย เพื่อเข้าเปรียบเทียบได้เร็วขึ้นโดยไม่ต้องเริ่มใหม่',
    routeLabel: 'เส้นทางยอดนิยม',
    trustedTitle: 'แหล่งข้อมูลที่ตรวจสอบได้',
    trustedDescription: 'คัดเลือกจากแหล่งที่ตรวจสอบได้ พร้อมคำอธิบายวิธีการและสถานะข้อมูลอย่างโปร่งใส',
    routeGuidesTitle: 'เส้นทางค้นหาที่ควรมีหน้าเฉพาะ',
    routeGuidesDescription: 'หน้าเหล่านี้เหมาะกับผู้ใช้ที่มาจากการค้นหา เช่น USD cash to THB, BTC to THB หรือ JPY cash to THB แล้วต้องการเข้าเปรียบเทียบต่อทันที',
    exchangesTitle: 'แพลตฟอร์มคริปโต',
    changersTitle: 'ร้านแลกเงิน',
    viewProfile: 'ดูโปรไฟล์',
    startTitle: 'เริ่มจากโจทย์ที่ใกล้ตัวที่สุด',
    startDescription: 'กดหนึ่งครั้งเพื่อเริ่มด้วยค่าที่พบบ่อย แล้วค่อยปรับตัวเลขต่อในหน้าถัดไป',
    sourceTitle: 'สถานะข้อมูลที่คุณจะเห็น',
    sourceDescription: 'ทุกหน้าจะติดป้ายสถานะข้อมูลชัดเจน เพื่อแยกข้อมูลสดออกจากข้อมูลสำรอง',
    sourceLiveTitle: 'สด',
    sourceLiveBody: 'มาจาก official API หรือ official website ที่ดึงได้ในรอบล่าสุด',
    sourceHybridTitle: 'ผสม',
    sourceHybridBody: 'ผสมระหว่างแหล่งทางการกับการเติมข้อมูลที่ผ่านการทบทวน',
    sourceFallbackTitle: 'สำรอง',
    sourceFallbackBody: 'ใช้ข้อมูลสำรองเมื่อแหล่งสดไม่พร้อม และจะแสดงเหตุผลกำกับ',
    quickCryptoPill: 'คริปโต -> THB',
    quickCashPill: 'เงินสด / FX -> THB',
    startBuyBtc: 'ซื้อ 0.01 BTC',
    startSellUsdt: 'ขาย 1000 USDT',
    startUsdCash: 'แลกเงินสด 1000 USD',
    startCnyCash: 'แลกเงินสด 5000 CNY',
    missionEyebrow: 'เหตุผลที่คนใช้หน้านี้',
    missionTitle: 'ตัดสินใจก่อนออกไปยังแพลตฟอร์มหรือร้านจริง',
    missionBody: 'ดูต้นทุนรวม ค่าธรรมเนียม ความลึกของตลาด สถานะข้อมูล และลิงก์ออกจริงในหน้าที่ออกแบบมาเพื่อการตัดสินใจ ไม่ใช่หน้าแสดงตัวเลขอย่างเดียว',
    proofOneTitle: 'ข้อมูลสดที่เปิดสถานะชัด',
    proofOneBody: 'ทุกหน้าระบุ live, hybrid, fallback ให้เห็นตรงๆ',
    proofTwoTitle: 'ลิงก์ออกพร้อมใช้งาน',
    proofTwoBody: 'กดแล้วไปหน้าแพลตฟอร์มหรือหน้าอ้างอิงจริงได้ทันที',
    proofThreeTitle: 'เส้นทางยอดนิยมพร้อมใช้',
    proofThreeBody: 'เปิดหน้าแล้วมี route พร้อมเทียบ ไม่ต้องเริ่มจากศูนย์',
  },
  en: {
    heroKicker: 'Find a better path into Thai baht',
    heroTitle: 'Compare crypto and money changers in one decision-friendly flow',
    heroBody: 'ExchangeTHB compares estimated receive, fees, depth, central-Bangkok reference distance, and opening hours in one place.',
    primary: 'Compare crypto',
    secondary: 'Compare cash / FX',
    trust: 'Built on official APIs, official websites, and a reviewed rules engine.',
    coverageTitle: 'Coverage',
    coverageValue: '{exchangeCount} Exchanges / {cashCount} Cash Brands',
    coverageHint: 'Launch scope is frozen for quality',
    localeTitle: 'Default Locale',
    localeValue: 'TH',
    localeHint: 'One-tap switch to EN / 中文',
    mapsTitle: 'Maps',
    mapsValue: 'Maps / reference',
    mapsHint: 'Open a real map when available, otherwise go to the provider reference page.',
    complianceTitle: 'Compliance',
    complianceValue: 'Estimated only',
    complianceHint: 'Never presented as guaranteed execution',
    quickTitle: 'Quick compare',
    quickDescription: 'Choose the path that fits your next conversion decision.',
    cryptoCardTitle: 'Depth-aware exchange comparison',
    cryptoCardBody: 'BTC, ETH, USDT, XRP, DOGE, SOL with fee breakdowns and estimated receive.',
    cashCardTitle: 'Bangkok branch and rate comparison',
    cashCardBody: 'Best rate, reference-distance ranking, branch hours, and direct map or reference-page links.',
    routeTitle: 'Popular routes',
    routeDescription: 'Common starting routes so users can compare faster without starting from zero.',
    routeLabel: 'Popular route',
    trustedTitle: 'Trusted coverage',
    trustedDescription: 'Traceable sources with transparent methodology and visible data-state labels.',
    routeGuidesTitle: 'Route guides for search intent',
    routeGuidesDescription: 'These landing pages help users arriving from searches like USD cash to THB, BTC to THB, or JPY cash to THB move straight into a realistic comparison flow.',
    exchangesTitle: 'Exchanges',
    changersTitle: 'Money changers',
    viewProfile: 'View profile',
    startTitle: 'Start from a common use case',
    startDescription: 'One tap opens a prefilled comparison so you can adjust the numbers from there.',
    sourceTitle: 'Data states you will see',
    sourceDescription: 'Every comparison clearly labels live, hybrid, and fallback states instead of hiding them.',
    sourceLiveTitle: 'Live',
    sourceLiveBody: 'Pulled from an official API or official website in the latest refresh.',
    sourceHybridTitle: 'Hybrid',
    sourceHybridBody: 'Combines official data with reviewed completion where the source is partial.',
    sourceFallbackTitle: 'Fallback',
    sourceFallbackBody: 'Used only when a live source is unavailable, with the reason shown on page.',
    quickCryptoPill: 'Crypto -> THB',
    quickCashPill: 'Cash / FX -> THB',
    startBuyBtc: 'Buy 0.01 BTC',
    startSellUsdt: 'Sell 1000 USDT',
    startUsdCash: 'Exchange 1000 USD cash',
    startCnyCash: 'Exchange 5000 CNY cash',
    missionEyebrow: 'Why this page exists',
    missionTitle: 'Decide before you leave for the real provider',
    missionBody: 'See all-in cost, fees, liquidity, data state, and real outbound links in a screen built for decision-making instead of raw data dumping.',
    proofOneTitle: 'Live data with explicit states',
    proofOneBody: 'Every surface tells you whether the row is live, hybrid, or fallback.',
    proofTwoTitle: 'Ready outbound actions',
    proofTwoBody: 'Jump directly to the exchange, map, or provider reference page.',
    proofThreeTitle: 'Prefilled popular routes',
    proofThreeBody: 'Open the page with a realistic starting route instead of an empty state.',
  },
  zh: {
    heroKicker: '找到更适合你的换入泰铢路径',
    heroTitle: '把加密兑换与线下换汇放进同一个决策界面',
    heroBody: 'ExchangeTHB 统一比较预计到手、手续费、深度、距曼谷中心参考点的距离与营业时间。',
    primary: '比较加密兑换',
    secondary: '比较现金换汇',
    trust: '基于官方 API、官网页面与人工复核规则库。',
    coverageTitle: '覆盖范围',
    coverageValue: '{exchangeCount} 家交易所 / {cashCount} 家现金品牌',
    coverageHint: '首发范围已锁定以保证质量',
    localeTitle: '默认语言',
    localeValue: 'TH',
    localeHint: '一键切换 EN / 中文',
    mapsTitle: '地图',
    mapsValue: '地图 / 参考页',
    mapsHint: '有真实地图就直接跳地图，没有时跳到品牌参考页',
    complianceTitle: '合规说明',
    complianceValue: '仅为估算',
    complianceHint: '不承诺最终成交价格',
    quickTitle: '快速开始比较',
    quickDescription: '选择更符合你当前换汇决策的路径。',
    cryptoCardTitle: '深度感知的交易所比较',
    cryptoCardBody: '支持 BTC、ETH、USDT、XRP、DOGE、SOL，并展示费用拆解与预计到手。',
    cashCardTitle: '按汇率与参考距离比较门店',
    cashCardBody: '同时查看最佳汇率、参考距离排序、营业时间，以及地图或参考页跳转。',
    routeTitle: '热门路线',
    routeDescription: '常用路线直接进入比较，不用每次从空白页开始。',
    routeLabel: '热门路线',
    trustedTitle: '可信覆盖',
    trustedDescription: '来源可追溯，方法论透明，并明确展示数据状态。',
    routeGuidesTitle: '面向搜索需求的路线页',
    routeGuidesDescription: '这些页面适合承接诸如 USD cash to THB、BTC to THB、JPY cash to THB 之类的搜索意图，再把用户带入真实比较流程。',
    exchangesTitle: '交易所',
    changersTitle: '换汇品牌',
    viewProfile: '查看详情',
    startTitle: '从最常见的需求开始',
    startDescription: '一键进入预填参数的比较页，后续再微调金额和方向。',
    sourceTitle: '你会看到的数据状态',
    sourceDescription: '页面会明确标注实时、混合、备用状态，而不是把备用数据伪装成实时。',
    sourceLiveTitle: '实时',
    sourceLiveBody: '来自最近一轮成功抓取的官方 API 或官网页面。',
    sourceHybridTitle: '混合',
    sourceHybridBody: '官方数据为主，配合审核后的补全信息。',
    sourceFallbackTitle: '备用',
    sourceFallbackBody: '仅在实时源不可用时启用，并在页面说明原因。',
    quickCryptoPill: '加密兑换 -> THB',
    quickCashPill: '现金 / 外汇 -> THB',
    startBuyBtc: '买入 0.01 BTC',
    startSellUsdt: '卖出 1000 USDT',
    startUsdCash: '兑换 1000 USD 现金',
    startCnyCash: '兑换 5000 CNY 现金',
    missionEyebrow: '这个页面存在的意义',
    missionTitle: '先把路线看明白，再跳到真实平台或门店',
    missionBody: '这里不是只摆数字，而是把总成本、手续费、流动性、数据状态和真实跳转入口放在同一个决策界面里。',
    proofOneTitle: '实时数据状态直接可见',
    proofOneBody: '每个页面都明确区分实时、混合、备用。',
    proofTwoTitle: '跳转入口直接可用',
    proofTwoBody: '可以直接跳交易所、地图或品牌参考页。',
    proofThreeTitle: '热门路线预填即用',
    proofThreeBody: '打开就是合理默认路线，不是空白起步。',
  },
  ja: {
    heroKicker: 'THB に入るための比較ルート',
    heroTitle: '暗号資産と現金両替を同じ判断画面で比較',
    heroBody: 'ExchangeTHB は、推定受取額、手数料、深さ、バンコク中心部からの参考距離、営業時間を 1 か所で比較します。',
    primary: '暗号資産を比較',
    secondary: '現金両替を比較',
    trust: '公式 API、公式サイト、レビュー済みルールに基づく比較です。',
    coverageTitle: '対象範囲',
    coverageValue: '{exchangeCount} 取引所 / {cashCount} 現金ブランド',
    coverageHint: '公開範囲は品質優先で絞っています',
    localeTitle: '標準言語',
    localeValue: 'EN',
    localeHint: 'TH / 中文 / 日本語 も切替可能',
    mapsTitle: '地図',
    mapsValue: '地図 / 参照ページ',
    mapsHint: '地図があれば地図へ、なければブランド参照ページへ移動します',
    complianceTitle: '注意',
    complianceValue: '推定値のみ',
    complianceHint: '約定価格を保証するものではありません',
    quickTitle: 'すぐに比較を始める',
    quickDescription: '次の判断に合ったルートを選んでください。',
    cryptoCardTitle: '板の厚みを踏まえた取引所比較',
    cryptoCardBody: 'BTC、ETH、USDT、XRP、DOGE、SOL の推定結果と手数料を表示します。',
    cashCardTitle: 'レートと参考距離で現金両替を比較',
    cashCardBody: '最良レート、参考距離、営業時間、地図や参照リンクを確認できます。',
    routeTitle: 'よく使われるルート',
    routeDescription: '空の画面から始めずに、よく使われる条件で比較を始められます。',
    routeLabel: '人気ルート',
    trustedTitle: '信頼できる対象範囲',
    trustedDescription: 'ソースと状態表示が明確な比較対象だけを公開しています。',
    routeGuidesTitle: '検索意図向けのルートガイド',
    routeGuidesDescription: 'BTC to THB や USD cash to THB のような検索から来たユーザーを、空のツールではなく実際の比較導線に入れるためのページです。',
    exchangesTitle: '取引所',
    changersTitle: '両替ブランド',
    viewProfile: '詳細を見る',
    startTitle: 'よくあるケースから始める',
    startDescription: '1 回のクリックで実用的な初期条件の比較画面に入れます。',
    sourceTitle: '表示されるデータ状態',
    sourceDescription: 'live / hybrid / fallback を隠さずに表示します。',
    sourceLiveTitle: 'ライブ',
    sourceLiveBody: '最新更新で取得できた公式 API または公式サイト由来の値です。',
    sourceHybridTitle: 'ハイブリッド',
    sourceHybridBody: '公式データを主に使い、必要に応じてレビュー済み補完を加えます。',
    sourceFallbackTitle: 'フォールバック',
    sourceFallbackBody: 'ライブソースが使えない時だけ使い、理由も表示します。',
    quickCryptoPill: 'Crypto -> THB',
    quickCashPill: 'Cash / FX -> THB',
    startBuyBtc: '0.01 BTC を購入',
    startSellUsdt: '1000 USDT を売却',
    startUsdCash: '1000 USD を両替',
    startCnyCash: '5000 CNY を両替',
    missionEyebrow: 'このページの役割',
    missionTitle: '実際の業者へ進む前にルートを判断する',
    missionBody: '総コスト、手数料、流動性、データ状態、外部リンクを同じ画面にまとめています。',
    proofOneTitle: 'データ状態が明確',
    proofOneBody: '各ページで live、hybrid、fallback を明示します。',
    proofTwoTitle: '外部リンクがすぐ使える',
    proofTwoBody: '取引所、地図、参照ページへ直接移動できます。',
    proofThreeTitle: '初期ルートが用意済み',
    proofThreeBody: '空白状態ではなく、現実的な開始条件で開きます。',
  },
  ko: {
    heroKicker: 'THB 전환 경로 비교 도구',
    heroTitle: '가상자산과 현금 환전을 한 화면에서 비교',
    heroBody: 'ExchangeTHB는 예상 수령액, 수수료, 유동성, 방콕 중심 기준 거리, 영업시간을 한곳에서 비교합니다.',
    primary: '가상자산 비교',
    secondary: '현금 환전 비교',
    trust: '공식 API, 공식 웹사이트, 검토된 규칙 기반 비교입니다.',
    coverageTitle: '커버리지',
    coverageValue: '{exchangeCount} 거래소 / {cashCount} 현금 브랜드',
    coverageHint: '품질을 위해 공개 범위를 제한했습니다',
    localeTitle: '기본 언어',
    localeValue: 'EN',
    localeHint: 'TH / 中文 / 한국어 전환 가능',
    mapsTitle: '지도',
    mapsValue: '지도 / 참고 페이지',
    mapsHint: '실제 지도 링크가 있으면 지도, 없으면 브랜드 참고 페이지로 이동합니다.',
    complianceTitle: '안내',
    complianceValue: '추정치 전용',
    complianceHint: '최종 체결가를 보장하지 않습니다',
    quickTitle: '바로 비교 시작',
    quickDescription: '지금 필요한 전환 경로를 바로 선택하세요.',
    cryptoCardTitle: '호가창 깊이를 반영한 거래소 비교',
    cryptoCardBody: 'BTC, ETH, USDT, XRP, DOGE, SOL 의 예상 결과와 수수료를 보여줍니다.',
    cashCardTitle: '환율과 기준 거리로 현금 환전 비교',
    cashCardBody: '최적 환율, 기준 거리, 영업시간, 지도 또는 참고 링크를 볼 수 있습니다.',
    routeTitle: '자주 쓰는 경로',
    routeDescription: '빈 페이지에서 시작하지 않고 자주 쓰는 조건으로 바로 비교할 수 있습니다.',
    routeLabel: '인기 경로',
    trustedTitle: '신뢰 가능한 비교 범위',
    trustedDescription: '출처와 데이터 상태가 명확한 비교 대상만 공개합니다.',
    routeGuidesTitle: '검색 의도용 경로 가이드',
    routeGuidesDescription: 'BTC to THB, USD cash to THB 같은 검색에서 들어온 사용자를 실제 비교 흐름으로 바로 연결합니다.',
    exchangesTitle: '거래소',
    changersTitle: '환전 브랜드',
    viewProfile: '자세히 보기',
    startTitle: '가장 흔한 사용 사례에서 시작',
    startDescription: '한 번의 클릭으로 현실적인 기본값이 채워진 비교 화면을 엽니다.',
    sourceTitle: '표시되는 데이터 상태',
    sourceDescription: 'live / hybrid / fallback 상태를 숨기지 않고 보여줍니다.',
    sourceLiveTitle: '실시간',
    sourceLiveBody: '가장 최근 새로고침에서 가져온 공식 API 또는 공식 웹페이지 값입니다.',
    sourceHybridTitle: '혼합',
    sourceHybridBody: '공식 데이터를 중심으로, 일부를 검토된 보완 데이터로 채웁니다.',
    sourceFallbackTitle: '대체',
    sourceFallbackBody: '실시간 소스를 쓸 수 없을 때만 사용하며 이유를 표시합니다.',
    quickCryptoPill: 'Crypto -> THB',
    quickCashPill: 'Cash / FX -> THB',
    startBuyBtc: '0.01 BTC 매수',
    startSellUsdt: '1000 USDT 매도',
    startUsdCash: '1000 USD 환전',
    startCnyCash: '5000 CNY 환전',
    missionEyebrow: '이 페이지의 목적',
    missionTitle: '실제 업체로 가기 전에 경로를 먼저 판단',
    missionBody: '총비용, 수수료, 유동성, 데이터 상태, 실제 외부 링크를 한 화면에 모았습니다.',
    proofOneTitle: '데이터 상태가 명확함',
    proofOneBody: '각 페이지에서 live, hybrid, fallback 을 분명히 표시합니다.',
    proofTwoTitle: '외부 링크가 바로 작동',
    proofTwoBody: '거래소, 지도, 참고 페이지로 바로 이동할 수 있습니다.',
    proofThreeTitle: '현실적인 기본 경로 제공',
    proofThreeBody: '빈 상태가 아니라 실제로 쓸 만한 기본 경로로 열립니다.',
  },
  de: {
    heroKicker: 'Bessere Wege in THB finden',
    heroTitle: 'Krypto und Bargeldwechsel in einer Entscheidungsansicht vergleichen',
    heroBody: 'ExchangeTHB vergleicht geschätzten Gegenwert, Gebühren, Markttiefe, Referenzdistanz in Bangkok und Öffnungszeiten an einem Ort.',
    primary: 'Krypto vergleichen',
    secondary: 'Bargeld vergleichen',
    trust: 'Auf Basis offizieller APIs, offizieller Websites und überprüfter Regeln.',
    coverageTitle: 'Abdeckung',
    coverageValue: '{exchangeCount} Börsen / {cashCount} Bargeldmarken',
    coverageHint: 'Der Startumfang ist aus Qualitätsgründen bewusst begrenzt',
    localeTitle: 'Standardsprache',
    localeValue: 'EN',
    localeHint: 'TH / 中文 / DE per Klick',
    mapsTitle: 'Karten',
    mapsValue: 'Karte / Referenzseite',
    mapsHint: 'Wenn vorhanden direkt zur Karte, sonst zur Referenzseite des Anbieters.',
    complianceTitle: 'Hinweis',
    complianceValue: 'Nur Schätzung',
    complianceHint: 'Kein garantierter Ausführungspreis',
    quickTitle: 'Schnell vergleichen',
    quickDescription: 'Wähle den Pfad, der zu deiner nächsten THB-Entscheidung passt.',
    cryptoCardTitle: 'Börsenvergleich mit Tiefenbezug',
    cryptoCardBody: 'BTC, ETH, USDT, XRP, DOGE, SOL mit Gebührenaufschlüsselung und Schätzwerten.',
    cashCardTitle: 'Bargeldwechsel nach Kurs und Referenzdistanz',
    cashCardBody: 'Bester Kurs, Referenzdistanz, Öffnungszeiten und direkte Karten- oder Referenzlinks.',
    routeTitle: 'Beliebte Routen',
    routeDescription: 'Häufige Startpunkte, damit du nicht jedes Mal bei null beginnst.',
    routeLabel: 'Beliebte Route',
    trustedTitle: 'Verlässliche Abdeckung',
    trustedDescription: 'Nachvollziehbare Quellen mit transparenter Methodik und sichtbaren Datenstatus.',
    routeGuidesTitle: 'Routenleitfäden für Suchintention',
    routeGuidesDescription: 'Diese Seiten fangen Suchen wie BTC to THB oder USD cash to THB ab und leiten direkt in den passenden Vergleich über.',
    exchangesTitle: 'Börsen',
    changersTitle: 'Wechselstuben',
    viewProfile: 'Profil ansehen',
    startTitle: 'Mit einem typischen Fall starten',
    startDescription: 'Ein Klick öffnet einen realistischen Vergleich mit vorausgefüllten Werten.',
    sourceTitle: 'Datenstatus auf der Seite',
    sourceDescription: 'Live, Hybrid und Fallback werden sichtbar markiert statt versteckt.',
    sourceLiveTitle: 'Live',
    sourceLiveBody: 'Aus einer offiziellen API oder Website im letzten erfolgreichen Abruf.',
    sourceHybridTitle: 'Hybrid',
    sourceHybridBody: 'Offizielle Daten, ergänzt durch überprüfte Vervollständigung bei unvollständigen Quellen.',
    sourceFallbackTitle: 'Fallback',
    sourceFallbackBody: 'Wird nur genutzt, wenn die Live-Quelle fehlt, inklusive Begründung.',
    quickCryptoPill: 'Krypto -> THB',
    quickCashPill: 'Bargeld / FX -> THB',
    startBuyBtc: '0,01 BTC kaufen',
    startSellUsdt: '1000 USDT verkaufen',
    startUsdCash: '1000 USD Bargeld wechseln',
    startCnyCash: '5000 CNY Bargeld wechseln',
    missionEyebrow: 'Wofür diese Seite da ist',
    missionTitle: 'Vor dem Klick zum echten Anbieter entscheiden',
    missionBody: 'Gesamtkosten, Gebühren, Liquidität, Datenstatus und echte Ausgeh-Links in einer Ansicht statt als rohe Datensammlung.',
    proofOneTitle: 'Datenstatus klar sichtbar',
    proofOneBody: 'Jede Fläche zeigt live, hybrid oder fallback offen an.',
    proofTwoTitle: 'Direkte Ausgeh-Aktionen',
    proofTwoBody: 'Direkter Sprung zur Börse, Karte oder Referenzseite.',
    proofThreeTitle: 'Vorgefüllte Standardrouten',
    proofThreeBody: 'Die Seite öffnet nicht leer, sondern mit einem realistischen Startpunkt.',
  },
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const contentLocale = resolveContentLocale(locale);
  const c = copy[locale];
  const coverageValue = c.coverageValue
    .replace('{exchangeCount}', String(exchanges.length))
    .replace('{cashCount}', String(publicCashProviders.length));
  const homeRouteGuides = routeGuides;
  const webSiteLd = websiteJsonLd(locale, '', c.heroBody);
  const breadcrumbLd = breadcrumbJsonLd([{ name: 'ExchangeTHB', item: withLocalePath(locale) }]);
  return (
    <div className="space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="frontend-hero overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Pill>{c.heroKicker}</Pill>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">{c.heroTitle}</h1>
              <p className="max-w-2xl text-lg text-stone-300">{c.heroBody}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <TrackLink href={`/${locale}/crypto`} eventName="homepage_cta_click" eventParams={{ target: 'crypto' }} className="rounded-full bg-brand-500 px-6 py-3 font-medium text-surface-950 hover:bg-brand-400">{c.primary}</TrackLink>
              <TrackLink href={`/${locale}/cash`} eventName="homepage_cta_click" eventParams={{ target: 'cash' }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.secondary}</TrackLink>
            </div>
            <p className="max-w-2xl text-sm text-stone-500">{c.trust}</p>
          </div>
          <div className="grid gap-4">
            <div className="card-panel hero-orbit relative overflow-hidden p-5 float-slow">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{c.missionEyebrow}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{c.missionTitle}</p>
              <p className="mt-2 text-sm text-stone-400">{c.missionBody}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: c.proofOneTitle, body: c.proofOneBody },
                { title: c.proofTwoTitle, body: c.proofTwoBody },
                { title: c.proofThreeTitle, body: c.proofThreeBody },
              ].map((item) => (
                <div key={item.title} className="card-panel p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-stone-400">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard title={c.coverageTitle} value={coverageValue} hint={c.coverageHint} />
              <StatCard title={c.localeTitle} value={c.localeValue} hint={c.localeHint} />
              <StatCard title={c.mapsTitle} value={c.mapsValue} hint={c.mapsHint} />
              <StatCard title={c.complianceTitle} value={c.complianceValue} hint={c.complianceHint} />
            </div>
          </div>
        </div>
      </section>

      <Section title={c.quickTitle} description={c.quickDescription}>
        <div className="grid gap-6 md:grid-cols-2">
          <TrackLink href={`/${locale}/crypto`} eventName="homepage_route_click" eventParams={{ route: 'crypto' }} className="card card-interactive space-y-4 p-6">
            <Pill>{c.quickCryptoPill}</Pill>
            <h3 className="text-2xl font-semibold text-white">{c.cryptoCardTitle}</h3>
            <p className="text-stone-400">{c.cryptoCardBody}</p>
          </TrackLink>
          <TrackLink href={`/${locale}/cash`} eventName="homepage_route_click" eventParams={{ route: 'cash' }} className="card card-interactive space-y-4 p-6">
            <Pill>{c.quickCashPill}</Pill>
            <h3 className="text-2xl font-semibold text-white">{c.cashCardTitle}</h3>
            <p className="text-stone-400">{c.cashCardBody}</p>
          </TrackLink>
        </div>
      </Section>

      <Section title={c.startTitle} description={c.startDescription}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: c.startBuyBtc, href: `/${locale}/crypto?symbol=BTC&amount=0.01&side=buy` },
            { label: c.startSellUsdt, href: `/${locale}/crypto?symbol=USDT&amount=1000&side=sell` },
            {
              label: contentLocale === 'th' ? 'ซื้อ 0.1 ETH' : contentLocale === 'zh' ? '买入 0.1 ETH' : 'Buy 0.1 ETH',
              href: `/${locale}/crypto?symbol=ETH&amount=0.1&side=buy`,
            },
            {
              label: contentLocale === 'th' ? 'ซื้อ 500 XRP' : contentLocale === 'zh' ? '买入 500 XRP' : 'Buy 500 XRP',
              href: `/${locale}/crypto?symbol=XRP&amount=500&side=buy`,
            },
            { label: c.startUsdCash, href: `/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=10` },
            { label: c.startCnyCash, href: `/${locale}/cash?currency=CNY&amount=5000&maxDistanceKm=10` },
          ].map((item) => (
            <TrackLink key={item.label} href={item.href} eventName="homepage_prefilled_start_click" eventParams={{ label: item.label }} className="card card-interactive p-5">
              <p className="text-sm text-stone-400">{c.routeLabel}</p>
              <p className="mt-2 text-lg font-semibold text-white">{item.label}</p>
            </TrackLink>
          ))}
        </div>
      </Section>

      <Section title={c.routeTitle} description={c.routeDescription}>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            { label: 'BTC/THB', href: `/${locale}/crypto?symbol=BTC&amount=0.01&side=buy` },
            { label: 'USDT/THB', href: `/${locale}/crypto?symbol=USDT&amount=1000&side=buy` },
            { label: 'ETH/THB', href: `/${locale}/crypto?symbol=ETH&amount=0.1&side=buy` },
            { label: 'USD→THB', href: `/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=10` },
            { label: 'EUR→THB', href: `/${locale}/cash?currency=EUR&amount=1000&maxDistanceKm=10` },
            { label: 'GBP→THB', href: `/${locale}/cash?currency=GBP&amount=500&maxDistanceKm=10` },
          ].map((route) => (
            <TrackLink key={route.label} href={route.href} eventName="homepage_popular_route_click" eventParams={{ route: route.label }} className="card card-interactive p-5">
              <p className="text-sm text-stone-400">{c.routeLabel}</p>
              <p className="mt-2 text-xl font-semibold text-white">{route.label}</p>
            </TrackLink>
          ))}
        </div>
      </Section>

      <Section title={c.routeGuidesTitle} description={c.routeGuidesDescription}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {homeRouteGuides.map((guide) => (
            <TrackLink
              key={guide.slug}
              href={`/${locale}/routes/${guide.slug}`}
              eventName="homepage_route_guide_click"
              eventParams={{ route: guide.slug }}
              className="card card-interactive p-5"
            >
              <p className="text-sm text-stone-400">{guide.type === 'crypto' ? c.quickCryptoPill : c.quickCashPill}</p>
              <p className="mt-2 text-xl font-semibold text-white">{guide.title[contentLocale]}</p>
              <p className="mt-3 text-sm text-stone-400">{guide.summary[contentLocale]}</p>
            </TrackLink>
          ))}
        </div>
      </Section>

      <Section title={c.sourceTitle} description={c.sourceDescription}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: c.sourceLiveTitle, body: c.sourceLiveBody, tone: 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' },
            { title: c.sourceHybridTitle, body: c.sourceHybridBody, tone: 'border border-amber-500/25 bg-amber-500/10 text-amber-300' },
            { title: c.sourceFallbackTitle, body: c.sourceFallbackBody, tone: 'border border-surface-600 bg-surface-800 text-stone-200' },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>{item.title}</span>
              <p className="mt-4 text-sm text-stone-400">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {contentLocale === 'en' ? (
        <Section title="Who this site is built for" description="English search traffic is the fastest path to international discovery, so the homepage now explains the real use cases more clearly.">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'Travelers landing in Bangkok',
                body: 'Use ExchangeTHB to compare USD, EUR, JPY, or CNY cash routes before choosing an in-city money changer.',
              },
              {
                title: 'Expats and long-stay users',
                body: 'Compare BTC or USDT routes into THB with fees, orderbook depth, and outbound links to regulated Thai exchanges.',
              },
              {
                title: 'International search users',
                body: 'Country-intent pages and route guides help users searching from Japan, Korea, Germany, or Europe move straight into a THB comparison flow.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-stone-400">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {contentLocale === 'en' ? (
        <Section title="High-intent route pages for international search" description="These landing pages are built to match real search intent from travelers, expats, and users comparing crypto or cash routes into Thai baht.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              'btc-to-thb',
              'eth-to-thb',
              'usdt-to-thb',
              'usd-cash-to-thb',
              'eur-cash-to-thb',
              'gbp-cash-to-thb',
              'japan-to-thailand-money-exchange',
              'germany-to-thailand-money-exchange',
              'europe-to-thailand-money-exchange',
              'korea-to-thailand-money-exchange',
              'bangkok-airport-money-exchange-guide',
              'pratunam-money-exchange-guide',
              'central-bangkok-money-exchange-guide',
              'bangkok-money-changer-near-me-guide',
            ].map((slug) => {
              const guide = routeGuides.find((item) => item.slug === slug);
              if (!guide) return null;
              return (
                <TrackLink
                  key={guide.slug}
                  href={`/${locale}/routes/${guide.slug}`}
                  eventName="homepage_high_intent_route_click"
                  eventParams={{ route: guide.slug }}
                  className="card card-interactive p-5"
                >
                  <p className="text-sm text-stone-400">{guide.type === 'crypto' ? 'Crypto intent' : 'Cash intent'}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{guide.title.en}</p>
                  <p className="mt-3 text-sm text-stone-400">{guide.summary.en}</p>
                </TrackLink>
              );
            })}
          </div>
        </Section>
      ) : null}

      <Section title={c.trustedTitle} description={c.trustedDescription}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">{c.exchangesTitle}</h3>
            <div className="mt-4 grid gap-3">
              {exchanges.map((exchange) => (
                <TrackLink key={exchange.slug} href={`/${locale}/exchanges/${exchange.slug}`} eventName="homepage_exchange_profile_click" eventParams={{ exchange: exchange.slug }} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-surface-800/70 px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/40">
                  <div>
                    <p className="font-medium text-white">{exchange.name}</p>
                    <p className="mt-1 text-sm text-stone-400">{t(exchange.summary, locale)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-brand-300">{c.viewProfile}</span>
                </TrackLink>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">{c.changersTitle}</h3>
            <div className="mt-4 grid gap-3">
              {publicCashProviders.map((provider) => (
                <TrackLink key={provider.slug} href={`/${locale}/money-changers/${provider.slug}`} eventName="homepage_money_changer_profile_click" eventParams={{ provider: provider.slug }} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-surface-800/70 px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/40">
                  <div>
                    <p className="font-medium text-white">{provider.name}</p>
                    <p className="mt-1 text-sm text-stone-400">{t(provider.summary, locale)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-brand-300">{c.viewProfile}</span>
                </TrackLink>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const contentLocale = resolveContentLocale(locale);
  const title = locale === 'th'
    ? 'หน้าแรก ExchangeTHB'
    : locale === 'zh'
      ? 'ExchangeTHB 首页'
      : locale === 'ja'
        ? 'タイの暗号資産と現金両替比較 | ExchangeTHB'
        : locale === 'ko'
          ? '태국 바트 비교 | ExchangeTHB'
          : locale === 'de'
            ? 'Thailand Baht Vergleich | ExchangeTHB'
            : 'Thailand Crypto and Cash Exchange Comparison';
  const description = copy[contentLocale].heroBody;
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale),
      languages: localeAlternates(),
    },
    keywords: locale === 'en'
      ? ['Thailand crypto exchange comparison', 'THB conversion', 'Bangkok money changer', 'crypto to baht', 'cash exchange Thailand', 'Japan to Thailand money exchange', 'Germany to Thailand money exchange', 'Europe to Thailand money exchange']
      : undefined,
    openGraph: {
      title,
      description,
      url: withLocalePath(locale),
    },
  };
}
