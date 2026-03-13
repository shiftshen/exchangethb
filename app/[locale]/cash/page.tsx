import type { Metadata } from 'next';
import { AutoSubmitForm } from '@/components/auto-submit-form';
import { CashLocationControls } from '@/components/cash-location-controls';
import { TrackButton } from '@/components/track-button';
import { TrackAnchor, TrackLink } from '@/components/track-link';
import { ChoiceChip, Pill, Section } from '@/components/ui';
import { publicCashProviders } from '@/data/site';
import { formatDisplayAmount, formatInputAmount, inspectPositiveDecimal, parsePositiveDecimal } from '@/lib/amounts';
import { compareCashLive } from '@/lib/cash-live';
import { localizeCashText } from '@/lib/cash-text';
import { resolveContentLocale } from '@/lib/i18n';
import { routeGuides } from '@/lib/route-guides';
import { breadcrumbJsonLd, localeAlternates, withLocalePath } from '@/lib/seo';
import { CurrencyCode, Locale } from '@/lib/types';

const currencies: CurrencyCode[] = ['USD', 'CNY', 'EUR', 'JPY', 'GBP'];
const quickCurrencies: CurrencyCode[] = ['USD', 'CNY', 'EUR', 'JPY', 'GBP'];

const copy = {
  th: {
    title: 'เงินสด/ฟอเร็กซ์เป็นบาท',
    description: 'เปรียบเทียบร้านแลกเงินในกรุงเทพจากเรต ระยะทาง สภาพสาขา และเงื่อนไขธนบัตร',
    panel: 'ตั้งค่าเส้นทางแลกเงิน',
    panelHint: 'เลือกสกุลเงิน จำนวนเงิน และระยะอ้างอิง แล้วระบบจะรีเฟรชผลลัพธ์ให้อัตโนมัติ',
    currency: 'สกุลเงิน',
    currencyQuick: 'แตะเลือกสกุลหลักได้ทันที',
    currencyMore: 'สกุลอื่นๆ',
    currencyMoreHint: 'ตอนนี้ทุกสกุลเงินสดที่เชื่อมอยู่แสดงครบในปุ่มลัดด้านบนแล้ว',
    supportScope: 'สกุลเงินสดที่รองรับสดในตอนนี้: USD, CNY, EUR, JPY, GBP',
    supportScopeHint: 'เว็บไซต์รองรับหลายภาษา แต่ยังไม่ได้หมายความว่าทุกสกุลเงินของทุกประเทศมีข้อมูลสดอยู่ในหน้าเปรียบเทียบ',
    amount: 'จำนวนเงิน',
    amountHint: 'รองรับทศนิยม เช่น 1000.50',
    amountNote: 'กรอกเป็นตัวเลขปกติ เช่น 1000.50 และไม่ใช้รูปแบบวิทยาศาสตร์',
    amountInvalid: 'กรุณากรอกจำนวนเงินเป็นตัวเลขปกติที่มากกว่าหรือเท่ากับ 0.01',
    distance: 'ระยะอ้างอิงสูงสุดจากใจกลางกรุงเทพ (กม.)',
    distanceHint: 'หากเปิดตำแหน่ง ระบบจะใช้ระยะจริงจากคุณ มิฉะนั้นจะใช้จุดอ้างอิงในกรุงเทพ',
    distanceInvalid: 'กรุณากรอกระยะทางเป็นเลขจำนวนเต็มตั้งแต่ 1 กม. ขึ้นไป',
    locationOn: 'กำลังใช้ตำแหน่งจริงของคุณ',
    locationOff: 'ยังไม่ได้ใช้ตำแหน่งจริง',
    locationRequest: 'ใช้ตำแหน่งของฉัน',
    locationClear: 'กลับไปใช้จุดอ้างอิง',
    locationPending: 'กำลังขอสิทธิ์ตำแหน่ง...',
    locationUnavailable: 'เบราว์เซอร์นี้ไม่รองรับตำแหน่ง',
    locationDenied: 'ยังไม่ได้รับสิทธิ์ตำแหน่ง',
    nearestLabelUser: 'ใกล้คุณกว่า',
    nearestReasonUser: 'ตัวเลือกนี้จัดอันดับจากระยะจริงระหว่างตำแหน่งของคุณกับร้าน',
    bestAlsoNearest: 'ตัวเลือกนี้ยังเป็นตัวเลือกที่ใกล้ที่สุดในโหมดระยะทางปัจจุบัน',
    distanceMode: 'โหมดระยะทาง',
    distanceModeUser: 'ใช้ตำแหน่งจริงของคุณ',
    distanceModeReference: 'ใช้จุดอ้างอิงในกรุงเทพ',
    distanceModeHintUser: 'ตัวเลือกใกล้สุดจะอิงจากตำแหน่งที่คุณอนุญาตให้เบราว์เซอร์ใช้',
    distanceModeHintReference: 'หากยังไม่เปิดตำแหน่ง ระบบจะใช้จุดอ้างอิงกลางกรุงเทพแทน',
    submit: 'อัปเดตผลลัพธ์',
    submitHint: 'ปุ่มนี้เป็นตัวสำรอง ระบบจะคำนวณให้อัตโนมัติเมื่อคุณเปลี่ยนค่า',
    autoRefresh: 'เปลี่ยนค่าแล้วระบบจะคำนวณใหม่อัตโนมัติ',
    summary: 'ดูตัวเลือกที่เหมาะที่สุดก่อน',
    summaryHint: 'อย่าดูแค่ตัวเลขสูงสุด ให้ดูสถานะข้อมูลและระยะอ้างอิงด้วย',
    statProviders: 'จำนวนแบรนด์ที่กำลังเทียบ',
    statDistance: 'โหมดระยะทาง',
    statRefresh: 'สถานะแคช',
    guideTitle: 'วิธีอ่านหน้าร้านแลกเงิน',
    guideOneTitle: 'ดูตัวเลือกที่คุ้มสุดก่อน',
    guideOneBody: 'เช็กว่าตัวเลือกไหนให้เงินบาทประมาณการสูงสุดก่อนค่อยชั่งกับความสะดวกในการเดินทาง',
    guideTwoTitle: 'แล้วค่อยดูโหมดระยะทาง',
    guideTwoBody: 'ถ้ายังไม่เปิดตำแหน่ง คำว่าใกล้ที่สุดยังหมายถึงจุดอ้างอิงในกรุงเทพ ไม่ใช่ตำแหน่งจริงของคุณ',
    guideThreeTitle: 'สุดท้ายค่อยเช็กสถานะข้อมูล',
    guideThreeBody: 'ป้ายสด ผสม และสำรองจะแสดงชัดเจน เพื่อไม่ให้แหล่งที่ไม่เสถียรถูกมองว่าเป็นข้อมูลสด',
    bestLabel: 'ดีที่สุดตอนนี้',
    bestReason: 'ตัวเลือกนี้ให้จำนวนเงินบาทประมาณการสูงสุดสำหรับจำนวนเงินที่คุณกรอก',
    nearestLabel: 'เดินทางสะดวกกว่า',
    nearestReason: 'หากคุณให้ความสำคัญกับระยะทาง ระบบจะดูจากจุดอ้างอิงในกรุงเทพ ไม่ใช่ตำแหน่งจริงของคุณ',
    quality: 'คุณภาพข้อมูล',
    branch: 'สาขา',
    denomination: 'ชนิดธนบัตร',
    estimated: 'ประมาณการ THB',
    buyRate: 'เรตรับซื้อ',
    distanceShort: 'ระยะอ้างอิง',
    distanceExact: 'ตำแหน่งร้าน',
    distanceAddress: 'อิงจากที่อยู่',
    distanceReference: 'จุดอ้างอิงแบรนด์',
    sourceLive: 'สด',
    sourceHybrid: 'ผสม',
    sourceFallback: 'สำรอง',
    sourceMix: 'สัดส่วนแหล่งข้อมูล',
    sourceMixLive: 'สด',
    sourceMixHybrid: 'ผสม',
    sourceMixFallback: 'สำรอง',
    missing: 'ผู้ให้บริการที่ยังขาด',
    anomaly: 'รายการผิดปกติ',
    updatedAt: 'อัปเดตแคช',
    healthy: 'ปกติ',
    degraded: 'ลดระดับ',
    down: 'ล้มเหลว',
    official: 'เปิดเว็บไซต์ทางการ',
    maps: 'เปิดแผนที่',
    referencePage: 'เปิดหน้าอ้างอิง',
    detail: 'ดูรายละเอียด',
    table: 'ตารางสาขา',
    tableDescription: 'แสดงผลลัพธ์ที่ดีที่สุดต่อแบรนด์จากข้อมูลสด ข้อมูลผสม หรือข้อมูลสำรองที่ผ่านการทบทวน พร้อมระยะอ้างอิงจากจุดศูนย์กลางกรุงเทพ',
    provider: 'แบรนด์',
    sourceType: 'สถานะข้อมูล',
    observed: 'สังเกตเมื่อ',
    action: 'การดำเนินการ',
    cacheUpdatedSuffix: 'อัปเดตแคช',
    cacheWarning: 'แคชข้อมูลสดเริ่มเก่า ระบบจึงแสดงผลล่าสุดที่เก็บไว้พร้อมข้อมูลสำรองที่ผ่านการทบทวน',
    noResults: 'ยังไม่พบตัวเลือกในระยะอ้างอิงที่ตั้งไว้',
    noResultsBody: 'ลองเพิ่มระยะทางอ้างอิง หรือเปลี่ยนสกุลเงินและจำนวนเงิน',
  },
  en: {
    title: 'Cash / FX to THB',
    description: 'Compare Bangkok money changers by rate, distance, denomination, and branch availability.',
    panel: 'Set your exchange route',
    panelHint: 'Pick the currency, amount, and reference distance. Results refresh automatically.',
    currency: 'Currency',
    currencyQuick: 'Tap a common currency',
    currencyMore: 'More currencies',
    currencyMoreHint: 'All currently supported cash currencies already appear in the quick chips above.',
    supportScope: 'Current live cash support: USD, CNY, EUR, JPY, GBP',
    supportScopeHint: 'The site supports more languages than the live cash set, so country pages do not automatically mean that currency has live rows.',
    amount: 'Amount',
    amountHint: 'Supports decimals, for example 1000.50',
    amountNote: 'Use normal decimal numbers like 1000.50 and avoid scientific notation.',
    amountInvalid: 'Enter a normal decimal amount that is at least 0.01.',
    distance: 'Max reference distance from central Bangkok (km)',
    distanceHint: 'If location is enabled, this uses your real distance. Otherwise it falls back to the Bangkok reference point.',
    distanceInvalid: 'Enter a whole-number distance of at least 1 km.',
    locationOn: 'Using your real location',
    locationOff: 'Using the Bangkok reference point',
    locationRequest: 'Use my location',
    locationClear: 'Use reference point instead',
    locationPending: 'Requesting location access...',
    locationUnavailable: 'This browser cannot provide location',
    locationDenied: 'Location access was not granted',
    nearestLabelUser: 'Closer to you',
    nearestReasonUser: 'This option is ranked using the real distance between your location and the branch.',
    bestAlsoNearest: 'This provider is also the closest option in the current distance mode.',
    distanceMode: 'Distance mode',
    distanceModeUser: 'Using your real location',
    distanceModeReference: 'Using the Bangkok reference point',
    distanceModeHintUser: 'Closest results now use the location you allowed in the browser.',
    distanceModeHintReference: 'Until you enable location, nearest results use the central Bangkok reference point.',
    submit: 'Update results',
    submitHint: 'This button is only a fallback. The page recalculates automatically when fields change.',
    autoRefresh: 'Results refresh automatically when you change any field.',
    summary: 'Review the strongest routes first',
    summaryHint: 'Balance the rate, data state, and reference distance together.',
    statProviders: 'Providers compared',
    statDistance: 'Distance mode',
    statRefresh: 'Cache state',
    guideTitle: 'How to read cash results',
    guideOneTitle: 'Start with the best rate',
    guideOneBody: 'Check which route gives the strongest estimated THB before optimizing for convenience.',
    guideTwoTitle: 'Then check distance mode',
    guideTwoBody: 'Without location enabled, nearest means closest to the Bangkok reference point, not to you.',
    guideThreeTitle: 'Finally check data state',
    guideThreeBody: 'Live, hybrid, and fallback rows stay visibly labeled so weak sources do not hide.',
    bestLabel: 'Best now',
    bestReason: 'This option currently gives the highest estimated THB output for the amount you entered.',
    nearestLabel: 'Shorter trip',
    nearestReason: 'If convenience matters more, this is the closest Bangkok-reference option, not a live route from your current location.',
    quality: 'Data quality',
    branch: 'Branch',
    denomination: 'Denomination',
    estimated: 'Estimated THB',
    buyRate: 'Buy rate',
    distanceShort: 'Reference distance',
    distanceExact: 'Exact branch point',
    distanceAddress: 'Address-based',
    distanceReference: 'Brand reference',
    sourceLive: 'Live',
    sourceHybrid: 'Hybrid',
    sourceFallback: 'Fallback',
    sourceMix: 'Source mix',
    sourceMixLive: 'live',
    sourceMixHybrid: 'hybrid',
    sourceMixFallback: 'fallback',
    missing: 'Missing providers',
    anomaly: 'Anomalies',
    updatedAt: 'Cache updated',
    healthy: 'Healthy',
    degraded: 'Degraded',
    down: 'Down',
    official: 'Open official site',
    maps: 'Open map',
    referencePage: 'Open reference page',
    detail: 'View detail',
    table: 'Branch table',
    tableDescription: 'Shows the best current row per provider from live, hybrid, or reviewed fallback data, using a central Bangkok reference distance.',
    provider: 'Provider',
    sourceType: 'Data state',
    observed: 'Observed',
    action: 'Action',
    cacheUpdatedSuffix: 'Cache updated',
    cacheWarning: 'Live cache is stale, so the site is showing the latest retained snapshot with fallback support.',
    noResults: 'No options matched the current reference distance.',
    noResultsBody: 'Try a wider distance or change the currency and amount.',
  },
  zh: {
    title: '现金 / 外汇换泰铢',
    description: '按汇率、距离、面额条件与门店状态比较曼谷换汇渠道。',
    panel: '先选你的换汇条件',
    panelHint: '选择币种、金额和参考距离后，页面会自动刷新结果。',
    currency: '币种',
    currencyQuick: '常用币种快捷选择',
    currencyMore: '更多币种',
    currencyMoreHint: '当前接入的现金币种都已经显示在上面的快捷标签里。',
    supportScope: '当前实时现金支持：USD、CNY、EUR、JPY、GBP',
    supportScopeHint: '网站语言覆盖会大于实时现金支持集，所以国家页并不自动等于该国货币已有实时行。',
    amount: '金额',
    amountHint: '支持小数，例如 1000.50',
    amountNote: '请输入普通数字格式，例如 1000.50，不要使用科学计数法。',
    amountInvalid: '请输入大于等于 0.01 的普通小数金额。',
    distance: '距曼谷中心参考点的最大距离（公里）',
    distanceHint: '如果开启定位，就按你当前位置算真实距离；否则回退到曼谷参考点。',
    distanceInvalid: '请输入大于等于 1 的整数距离。',
    locationOn: '当前按你的位置计算',
    locationOff: '当前按曼谷参考点计算',
    locationRequest: '使用我的位置',
    locationClear: '改回参考点',
    locationPending: '正在请求定位权限...',
    locationUnavailable: '当前浏览器不支持定位',
    locationDenied: '未获得定位权限',
    nearestLabelUser: '离你更近',
    nearestReasonUser: '这个结果按你当前位置到门店的真实距离排序。',
    bestAlsoNearest: '这个品牌同时也是当前距离模式下最近的可选项。',
    distanceMode: '距离模式',
    distanceModeUser: '当前使用你的位置',
    distanceModeReference: '当前使用曼谷参考点',
    distanceModeHintUser: '现在“最近”结果按你授权给浏览器的位置来计算。',
    distanceModeHintReference: '在你开启定位前，“最近”结果会先按曼谷中心参考点计算。',
    submit: '更新结果',
    submitHint: '这个按钮只是兜底，正常情况下你改动字段后页面会自动重算。',
    autoRefresh: '修改任一字段后，结果会自动刷新。',
    summary: '先看最值得行动的选项',
    summaryHint: '不要只看最高数字，也要一起看数据状态和参考距离。',
    statProviders: '当前比较品牌',
    statDistance: '距离模式',
    statRefresh: '缓存状态',
    guideTitle: '怎么读现金页',
    guideOneTitle: '先看最划算',
    guideOneBody: '先确认当前最佳结果给出的预计泰铢，再决定是否值得继续走线下路线。',
    guideTwoTitle: '再看距离模式',
    guideTwoBody: '没开定位时，最近结果只是曼谷参考点，不是你当前位置导航。',
    guideThreeTitle: '最后核对状态',
    guideThreeBody: '实时、混合、备用会直接标出，避免把不稳定来源当成实时。',
    bestLabel: '当前最划算',
    bestReason: '按你输入的金额计算，这个选项目前给出的预计泰铢最多。',
    nearestLabel: '更省路程',
    nearestReason: '如果你更看重路程，这里看的是曼谷参考距离，不是你当前位置的实时导航距离。',
    quality: '数据质量',
    branch: '门店',
    denomination: '面额',
    estimated: '预计 THB',
    buyRate: '买入价',
    distanceShort: '参考距离',
    distanceExact: '精确门店点位',
    distanceAddress: '按地址估算',
    distanceReference: '品牌参考点',
    sourceLive: '实时',
    sourceHybrid: '混合',
    sourceFallback: '备用',
    sourceMix: '来源占比',
    sourceMixLive: '实时',
    sourceMixHybrid: '混合',
    sourceMixFallback: '备用',
    missing: '缺失品牌',
    anomaly: '异常项',
    updatedAt: '缓存更新时间',
    healthy: '正常',
    degraded: '降级',
    down: '故障',
    official: '打开官网',
    maps: '打开地图',
    referencePage: '打开参考页',
    detail: '查看详情',
    table: '门店列表',
    tableDescription: '按品牌展示当前最佳结果，来源可能是实时抓取、混合数据或人工审核后的备用数据，并显示距曼谷中心参考点的距离。',
    provider: '品牌',
    sourceType: '数据状态',
    observed: '观测时间',
    action: '操作',
    cacheUpdatedSuffix: '缓存更新于',
    cacheWarning: '当前实时缓存已经偏旧，页面显示的是最近保留快照，并辅以经过审核的备用数据。',
    noResults: '当前参考距离内没有可比选项',
    noResultsBody: '可以尝试增加参考距离，或修改币种和金额。',
  },
} as const;

function isGoogleMapsUrl(url: string) {
  return /google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.com/i.test(url);
}

export default async function CashPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const { locale } = await params;
  const query = await searchParams;
  const currency = (query.currency as CurrencyCode) || 'USD';
  const rawAmount = Array.isArray(query.amount) ? query.amount[0] : query.amount;
  const amountState = inspectPositiveDecimal(query.amount, 0.01);
  const distanceRaw = Array.isArray(query.maxDistanceKm) ? query.maxDistanceKm[0] : query.maxDistanceKm;
  const userLatRaw = Array.isArray(query.userLat) ? query.userLat[0] : query.userLat;
  const userLngRaw = Array.isArray(query.userLng) ? query.userLng[0] : query.userLng;
  const maxDistanceKm = parsePositiveDecimal(query.maxDistanceKm, 10, 1);
  const contentLocale = resolveContentLocale(locale);
  const c = copy[contentLocale];
  const parsedUserLat = userLatRaw ? Number(userLatRaw) : NaN;
  const parsedUserLng = userLngRaw ? Number(userLngRaw) : NaN;
  const hasUserLocation = Number.isFinite(parsedUserLat) && Math.abs(parsedUserLat) <= 90 && Number.isFinite(parsedUserLng) && Math.abs(parsedUserLng) <= 180;
  const hasValidDistance = !distanceRaw || /^\d+$/.test(distanceRaw.trim());
  const hasValidAmount = !rawAmount || amountState.valid;
  const canCompare = Boolean(amountState.valid || !rawAmount) && hasValidDistance;
  const amount = amountState.valid && amountState.parsed !== null ? amountState.parsed : 1000;
  const results = canCompare
    ? await compareCashLive({ currency, amount, maxDistanceKm, userLatitude: hasUserLocation ? parsedUserLat : null, userLongitude: hasUserLocation ? parsedUserLng : null })
    : {
        bestRate: null,
        nearestGood: null,
        all: [],
        source: '',
        distanceOrigin: 'reference',
        cacheGeneratedAt: null,
        cacheAgeMinutes: null,
        cacheStale: false,
        quality: { liveRows: 0, hybridRows: 0, fallbackRows: 0, liveProviderCount: 0, hybridProviderCount: 0, fallbackProviderCount: 0, missingProviders: [], providerHealth: [], anomalyCount: 0, anomalies: [] },
      };

  const providerLabel = (providerSlug: string) => publicCashProviders.find((item) => item.slug === providerSlug)?.name || providerSlug;
  const statusLabel = (status: string) => status === 'healthy' ? c.healthy : status === 'degraded' ? c.degraded : c.down;
  const statusClass = (status: string) => status === 'healthy' ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : status === 'degraded' ? 'border border-amber-500/25 bg-amber-500/10 text-amber-300' : 'border border-rose-500/25 bg-rose-500/10 text-rose-300';
  const sourceTypeLabel = (status: string) => status === 'live' ? c.sourceLive : status === 'hybrid' ? c.sourceHybrid : c.sourceFallback;
  const locationPrecisionLabel = (value: 'exact' | 'address' | 'reference') => value === 'exact' ? c.distanceExact : value === 'address' ? c.distanceAddress : c.distanceReference;
  const nearestReason = results.distanceOrigin === 'user' ? c.nearestReasonUser : c.nearestReason;
  const distanceModeLabel = results.distanceOrigin === 'user' ? c.distanceModeUser : c.distanceModeReference;
  const distanceModeHint = results.distanceOrigin === 'user' ? c.distanceModeHintUser : c.distanceModeHintReference;
  const nearestDuplicatesBest = Boolean(results.bestRate && results.nearestGood && results.bestRate.providerSlug === results.nearestGood.providerSlug);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: c.title, item: withLocalePath(locale, '/cash') },
  ]);

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Section title={c.title} description={c.description}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="card overflow-hidden border-brand-500/20 bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900">
            <AutoSubmitForm action={`/${locale}/cash`} className="grid gap-6 p-6" delayMs={150}>
              <input type="hidden" name="currency" defaultValue={currency} />
              <input type="hidden" name="userLat" defaultValue={hasUserLocation ? String(parsedUserLat) : ''} />
              <input type="hidden" name="userLng" defaultValue={hasUserLocation ? String(parsedUserLng) : ''} />
              <div className="space-y-2">
                <Pill>{c.panel}</Pill>
                <p className="text-sm text-stone-300">{c.panelHint}</p>
              </div>

              <CashLocationControls
                initialEnabled={hasUserLocation}
                enabledLabel={c.locationOn}
                disabledLabel={c.locationOff}
                requestLabel={c.locationRequest}
                clearLabel={c.locationClear}
                pendingLabel={c.locationPending}
                unavailableLabel={c.locationUnavailable}
                deniedLabel={c.locationDenied}
              />

              <div className="space-y-3">
                <label className="text-sm font-medium text-stone-300">{c.currency}</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {quickCurrencies.map((item) => {
                    const selected = item === currency;
                    return (
                      <label key={item} className="cursor-pointer">
                        <input type="radio" name="currencyQuickUi" value={item} defaultChecked={selected} data-sync-target="currency" className="sr-only" />
                        <ChoiceChip active={selected}>{item}</ChoiceChip>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-stone-500">{c.currencyQuick}</p>
                <div>
                  <label className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">{c.currencyMore}</label>
                  <select name="currencySelectUi" defaultValue={currency} data-sync-target="currency" className="mt-2 w-full rounded-2xl border border-white/10 bg-surface-800 px-4 py-3 text-white">
                    {currencies.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <p className="mt-2 text-xs text-stone-500">{c.currencyMoreHint}</p>
                </div>
                <div className="rounded-2xl border border-brand-500/20 bg-brand-500/8 px-4 py-3">
                  <p className="text-sm font-medium text-brand-200">{c.supportScope}</p>
                  <p className="mt-1 text-xs text-stone-400">{c.supportScopeHint}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-stone-300">{c.amount}</label>
                  <input
                    type="text"
                    name="amount"
                    defaultValue={rawAmount || formatInputAmount(amount, 2)}
                    inputMode="decimal"
                    placeholder="1000.50"
                    autoComplete="off"
                    spellCheck={false}
                    data-decimal-input="true"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-surface-800 px-4 py-3 text-lg text-white"
                  />
                  <p className="mt-2 text-xs text-stone-500">{c.amountHint}</p>
                  <p className="mt-1 text-xs text-stone-500">{c.amountNote}</p>
                  {!hasValidAmount && rawAmount ? <p className="mt-2 text-sm font-medium text-rose-700">{c.amountInvalid}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-300">{c.distance}</label>
                  <input
                    type="number"
                    name="maxDistanceKm"
                    defaultValue={String(maxDistanceKm)}
                    min="1"
                    step="1"
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    data-integer-input="true"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-surface-800 px-4 py-3 text-lg text-white"
                  />
                  <p className="mt-2 text-xs text-stone-500">{c.distanceHint}</p>
                  {!hasValidDistance && distanceRaw ? <p className="mt-2 text-sm font-medium text-rose-700">{c.distanceInvalid}</p> : null}
                </div>
              </div>

              <p className="text-xs text-stone-400">{c.autoRefresh}</p>
              <TrackButton type="submit" eventName="cash_compare_submit" eventParams={{ currency, amount: amountState.valid && amountState.parsed !== null ? amountState.parsed : undefined }} className="rounded-full border border-brand-500/40 bg-brand-500 px-5 py-3 text-sm font-medium text-surface-950">{c.submit}</TrackButton>
              <p className="text-xs text-stone-500">{c.submitHint}</p>
            </AutoSubmitForm>
          </div>

          <div className="grid gap-4">
            <div className="card p-6">
              <div className="space-y-2">
                <Pill>{c.summary}</Pill>
                <p className="text-sm text-stone-400">{c.summaryHint}</p>
                <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-surface-800 px-3 py-2 text-sm text-stone-300">
                  <span className="font-medium text-white">{c.distanceMode}</span>
                  <span>{distanceModeLabel}</span>
                </div>
                <p className="text-xs text-stone-400">{distanceModeHint}</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="card-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.statProviders}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{results.all.length || 0}</p>
                </div>
                <div className="card-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.statDistance}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{distanceModeLabel}</p>
                </div>
                <div className="card-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.statRefresh}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{results.cacheStale ? c.sourceFallback : c.sourceLive}</p>
                </div>
              </div>
            </div>

            {results.bestRate ? (
              <div className="card border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-surface-900 to-surface-850 p-6 shadow-glow">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>{c.bestLabel}</Pill>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${results.bestRate.sourceType === 'live' ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : results.bestRate.sourceType === 'hybrid' ? 'border border-sky-500/25 bg-sky-500/10 text-sky-300' : 'border border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>
                    {sourceTypeLabel(results.bestRate.sourceType)}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-white">{results.bestRate.provider}</h2>
                <p className="mt-2 text-sm text-stone-300">{c.bestReason}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-stone-400">{c.branch}</p>
                    <p className="mt-1 font-semibold text-white">{localizeCashText(results.bestRate.branchName, locale)}</p>
                    <p className="mt-1 text-sm text-stone-400">{localizeCashText(results.bestRate.area, locale)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">{c.estimated}</p>
                    <p className="mt-1 text-3xl font-semibold text-white">≈ {formatDisplayAmount(results.bestRate.estimatedThb, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} THB</p>
                    <p className="mt-1 text-sm text-stone-400">{c.denomination} {results.bestRate.denomination}</p>
                  </div>
                </div>
                {nearestDuplicatesBest ? (
                  <div className="mt-4 rounded-2xl bg-surface-800/80 px-4 py-3 text-sm text-stone-300">
                    {c.bestAlsoNearest}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  <TrackAnchor href={results.bestRate.officialUrl} target="_blank" rel="noreferrer" eventName="cash_best_official_click" eventParams={{ provider: results.bestRate.providerSlug }} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-surface-950">{c.official}</TrackAnchor>
                  <TrackAnchor href={results.bestRate.mapsUrl} target="_blank" rel="noreferrer" eventName="cash_best_map_click" eventParams={{ provider: results.bestRate.providerSlug }} className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-stone-200">{isGoogleMapsUrl(results.bestRate.mapsUrl) ? c.maps : c.referencePage}</TrackAnchor>
                  <TrackLink href={`/${locale}/money-changers/${results.bestRate.providerSlug}`} eventName="cash_best_detail_click" eventParams={{ provider: results.bestRate.providerSlug }} className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-stone-200">{c.detail}</TrackLink>
                </div>
              </div>
            ) : (
              <div className="card p-6 text-stone-400">
                <p className="font-medium text-white">{canCompare ? c.noResults : hasValidAmount ? c.distanceInvalid : c.amountInvalid}</p>
                <p className="mt-2">{c.noResultsBody}</p>
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              {results.nearestGood && !nearestDuplicatesBest ? (
                <div className="card p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Pill>{results.distanceOrigin === 'user' ? c.nearestLabelUser : c.nearestLabel}</Pill>
                    <span className="rounded-full border border-surface-600 bg-surface-800 px-2.5 py-1 text-xs font-semibold text-stone-200">{results.nearestGood.distanceKm} km · {locationPrecisionLabel(results.nearestGood.locationPrecision)}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{results.nearestGood.provider}</h3>
                  <p className="mt-2 text-sm text-stone-400">{nearestReason}</p>
                  <p className="mt-3 text-sm text-stone-400">{localizeCashText(results.nearestGood.hours, locale)}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <TrackAnchor href={results.nearestGood.mapsUrl} target="_blank" rel="noreferrer" eventName="cash_nearest_map_click" eventParams={{ provider: results.nearestGood.providerSlug }} className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-stone-200">{isGoogleMapsUrl(results.nearestGood.mapsUrl) ? c.maps : c.referencePage}</TrackAnchor>
                    <TrackLink href={`/${locale}/money-changers/${results.nearestGood.providerSlug}`} eventName="cash_nearest_detail_click" eventParams={{ provider: results.nearestGood.providerSlug }} className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-stone-200">{c.detail}</TrackLink>
                  </div>
                </div>
              ) : null}

              <div className="card p-6">
                <Pill>{c.quality}</Pill>
                <p className="mt-4 text-sm text-stone-300">{c.sourceMix}: {results.quality.liveRows} {c.sourceMixLive} / {results.quality.hybridRows} {c.sourceMixHybrid} / {results.quality.fallbackRows} {c.sourceMixFallback}</p>
                <p className="mt-2 text-sm text-stone-300">{c.missing}: {results.quality.missingProviders.length ? results.quality.missingProviders.map(providerLabel).join(', ') : '-'}</p>
                <p className="mt-2 text-sm text-stone-300">{c.anomaly}: {results.quality.anomalyCount}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {results.quality.providerHealth?.map((item) => (
                    <span key={item.providerSlug} className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(item.status)}`}>
                      {providerLabel(item.providerSlug)}: {statusLabel(item.status)}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-stone-400">{c.updatedAt}: {results.cacheGeneratedAt ? new Date(results.cacheGeneratedAt).toLocaleString() : '-'}</p>
                {results.cacheStale ? <p className="mt-2 text-sm font-medium text-amber-300">{c.cacheWarning}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title={c.table} description={`${c.tableDescription}${results.cacheGeneratedAt ? ` ${c.cacheUpdatedSuffix} ${new Date(results.cacheGeneratedAt).toLocaleString()}.` : ''}`}>
        <div className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-3">
            {[
              { title: c.guideOneTitle, body: c.guideOneBody },
              { title: c.guideTwoTitle, body: c.guideTwoBody },
              { title: c.guideThreeTitle, body: c.guideThreeBody },
            ].map((item) => (
              <div key={item.title} className="card p-5">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-stone-400">{item.body}</p>
              </div>
            ))}
          </div>
          {results.all.length ? (
            <div className="grid gap-4 md:hidden">
              {results.all.map((row) => (
                <div key={`mobile-${row.providerSlug}-${row.branchName}-${row.denomination}`} className="card card-interactive p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{row.provider}</p>
                      <p className="mt-1 text-sm text-stone-400">{localizeCashText(row.branchName, locale)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.sourceType === 'live' ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : row.sourceType === 'hybrid' ? 'border border-sky-500/25 bg-sky-500/10 text-sky-300' : 'border border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>
                      {sourceTypeLabel(row.sourceType)}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-stone-400">{c.buyRate}</p>
                      <p className="mt-1 font-semibold text-white">{row.buyRate}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{c.estimated}</p>
                      <p className="mt-1 font-semibold text-white">{formatDisplayAmount(row.estimatedThb, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{c.denomination}</p>
                      <p className="mt-1 font-semibold text-white">{row.denomination}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{c.distanceShort}</p>
                      <p className="mt-1 font-semibold text-white">{row.distanceKm} km</p>
                      <p className="mt-1 text-xs text-stone-400">{locationPrecisionLabel(row.locationPrecision)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-stone-400">{c.observed} {new Date(row.observedAt).toLocaleString()}</p>
                  <div className="mt-4 space-y-3">
                    <TrackAnchor href={row.officialUrl} target="_blank" rel="noreferrer" eventName="cash_result_official_click" eventParams={{ provider: row.providerSlug }} className="inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-surface-950">{c.official}</TrackAnchor>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <TrackAnchor href={row.mapsUrl} target="_blank" rel="noreferrer" eventName="cash_result_map_click" eventParams={{ provider: row.providerSlug }} className="font-medium text-stone-300">{isGoogleMapsUrl(row.mapsUrl) ? c.maps : c.referencePage}</TrackAnchor>
                      <TrackLink href={`/${locale}/money-changers/${row.providerSlug}`} eventName="cash_result_click" eventParams={{ provider: row.providerSlug }} className="font-medium text-stone-300">{c.detail}</TrackLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="data-table">
            {!canCompare ? <div className="px-6 py-8 text-sm text-rose-300">{hasValidAmount ? c.distanceInvalid : c.amountInvalid}</div> : null}
            {canCompare && !results.all.length ? <div className="px-6 py-8 text-sm text-stone-400"><p className="font-medium text-white">{c.noResults}</p><p className="mt-2">{c.noResultsBody}</p></div> : null}
            {results.all.length ? (
              <table className="hidden min-w-full text-left text-sm md:table">
                <thead>
                  <tr>{[c.provider, c.branch, c.denomination, c.buyRate, c.estimated, c.sourceType, c.observed, c.distanceShort, c.action].map((head) => <th key={head} className="px-5 py-4 font-medium">{head}</th>)}</tr>
                </thead>
                <tbody>
                  {results.all.map((row) => (
                    <tr key={`${row.providerSlug}-${row.branchName}-${row.denomination}`} className="border-t border-white/8">
                      <td className="px-5 py-4 font-semibold text-white">{row.provider}</td>
                      <td className="px-5 py-4 text-stone-200">{localizeCashText(row.branchName, locale)}</td>
                      <td className="px-5 py-4 text-stone-200">{row.denomination}</td>
                      <td className="px-5 py-4 text-white">{row.buyRate}</td>
                      <td className="px-5 py-4 text-white">{formatDisplayAmount(row.estimatedThb, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.sourceType === 'live' ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : row.sourceType === 'hybrid' ? 'border border-sky-500/25 bg-sky-500/10 text-sky-300' : 'border border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>
                          {sourceTypeLabel(row.sourceType)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-stone-300">{new Date(row.observedAt).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="text-white">{row.distanceKm} km</div>
                        <div className="mt-1 text-xs text-stone-400">{locationPrecisionLabel(row.locationPrecision)}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <TrackAnchor href={row.officialUrl} target="_blank" rel="noreferrer" eventName="cash_result_official_click" eventParams={{ provider: row.providerSlug }} className="font-medium text-brand-300">{c.official}</TrackAnchor>
                          <TrackAnchor href={row.mapsUrl} target="_blank" rel="noreferrer" eventName="cash_result_map_click" eventParams={{ provider: row.providerSlug }} className="font-medium text-stone-300">{isGoogleMapsUrl(row.mapsUrl) ? c.maps : c.referencePage}</TrackAnchor>
                          <TrackLink href={`/${locale}/money-changers/${row.providerSlug}`} eventName="cash_result_click" eventParams={{ provider: row.providerSlug }} className="font-medium text-stone-300">{c.detail}</TrackLink>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </Section>

      {contentLocale === 'en' ? (
        <Section title="English search questions this page answers" description="These blocks strengthen long-tail relevance for travelers and international users searching for Bangkok cash exchange routes.">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'Where should I exchange USD to THB in Bangkok?',
                body: 'This page compares money changers by observed rate, distance context, branch hours, and the quality of the current data source.',
              },
              {
                title: 'How do I compare EUR cash to THB in Thailand?',
                body: 'Use the cash compare page to rank Bangkok routes by estimated THB output, then inspect the branch detail page before you travel.',
              },
              {
                title: 'Why is the best rate not always the best branch for me?',
                body: 'Distance, map accuracy, reference-point precision, and opening hours can change which route is actually useful.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm text-stone-400">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        title={contentLocale === 'th' ? 'เส้นทางเงินสดและนักเดินทางที่เกี่ยวข้อง' : contentLocale === 'zh' ? '相关现金路线与国家页' : 'Related cash and country route guides'}
        description={contentLocale === 'th' ? 'ทั้งหน้าคู่เงินสดและหน้าคำค้นจากแต่ละประเทศจะพากลับเข้ามายัง flow เปรียบเทียบเงินสดจริงของกรุงเทพ' : contentLocale === 'zh' ? '这些现金路线页和国家意图页都会把用户带回真实的曼谷现金比较流程。' : 'These cash route pages and country-intent guides support international search traffic and feed users back into the practical Bangkok compare flow.'}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routeGuides.filter((guide) => guide.type === 'cash').map((guide) => (
            <TrackLink
              key={guide.slug}
              href={`/${locale}/routes/${guide.slug}`}
              eventName="cash_related_route_click"
              eventParams={{ route: guide.slug }}
              className="card card-interactive p-5"
            >
              <p className="text-sm text-stone-400">{guide.currency ? `${guide.currency}/THB` : 'Route guide'}</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{guide.title[contentLocale]}</h2>
              <p className="mt-3 text-sm text-stone-400">{guide.summary[contentLocale]}</p>
            </TrackLink>
          ))}
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const contentLocale = resolveContentLocale(locale);
  const title = locale === 'th'
    ? 'เปรียบเทียบเงินสด/ฟอเร็กซ์เป็นบาท'
    : locale === 'zh'
      ? '现金外汇换泰铢比较'
      : locale === 'ja'
        ? 'バンコク現金両替 THB 比較'
        : locale === 'ko'
          ? '방콕 현금 환전 THB 비교'
          : locale === 'de'
            ? 'Bargeld zu THB Vergleich in Bangkok'
            : 'Cash Exchange to THB in Bangkok';
  const description = copy[contentLocale].description;
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale, '/cash'),
      languages: localeAlternates('/cash'),
    },
    keywords: locale === 'en'
      ? ['Bangkok money changer', 'cash to THB', 'USD to THB cash', 'EUR to THB cash', 'GBP to THB cash', 'JPY to THB cash', 'CNY to THB cash', 'Thailand exchange rate', 'Japan to Thailand money exchange', 'Germany to Thailand money exchange', 'Europe to Thailand money exchange', 'Korea to Thailand money exchange']
      : undefined,
    openGraph: {
      title,
      description,
      url: withLocalePath(locale, '/cash'),
    },
  };
}
