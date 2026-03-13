import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AutoSubmitForm } from '@/components/auto-submit-form';
import { TrackButton } from '@/components/track-button';
import { TrackAnchor, TrackLink } from '@/components/track-link';
import { ChoiceChip, Pill, Section } from '@/components/ui';
import { formatDisplayAmount, formatInputAmount, inspectPositiveDecimal } from '@/lib/amounts';
import { compareCrypto } from '@/lib/compare';
import { localizeExchangeLicense } from '@/lib/exchange-text';
import { resolveContentLocale, t } from '@/lib/i18n';
import { localizeMarketFallbackReason, localizeMarketFreshness, localizeMarketSource } from '@/lib/market-text';
import { routeGuides } from '@/lib/route-guides';
import { breadcrumbJsonLd, localeAlternates, withLocalePath } from '@/lib/seo';
import { CryptoSymbol, Locale } from '@/lib/types';

const symbols: CryptoSymbol[] = ['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL'];

const copy = {
  th: {
    title: 'คริปโตเป็นบาท',
    description: 'เปรียบเทียบแบบดู depth พร้อมผลลัพธ์ประมาณการ ค่าธรรมเนียม และบริบทความน่าเชื่อถือ',
    panel: 'ตั้งค่าเส้นทางคริปโต',
    panelHint: 'เลือกเหรียญ ทิศทาง และจำนวนเงิน แล้วระบบจะรีเฟรชผลลัพธ์ให้อัตโนมัติ',
    pricingHintBuy: 'โหมดซื้อจะอ้างอิงฝั่งขายของแพลตฟอร์ม และยอดจ่ายรวมจะรวมค่าธรรมเนียมด้วย',
    pricingHintSell: 'โหมดขายจะอ้างอิงฝั่งซื้อของแพลตฟอร์ม และยอดรับสุทธิจะหักค่าธรรมเนียมแล้ว',
    symbol: 'เหรียญ',
    symbolHint: 'แตะเลือกเหรียญหลักได้ทันที',
    side: 'ทิศทาง',
    sideBuy: 'ซื้อ',
    sideSell: 'ขาย',
    amount: 'จำนวน',
    amountHint: 'รองรับทศนิยม เช่น 0.01 BTC',
    amountNote: 'กรอกเป็นตัวเลขปกติ เช่น 0.01 และไม่ใช้รูปแบบวิทยาศาสตร์',
    amountInvalid: 'กรุณากรอกจำนวนเป็นตัวเลขปกติที่มากกว่าหรือเท่ากับ 0.00000001',
    compare: 'อัปเดตผลลัพธ์',
    compareHint: 'ปุ่มนี้เป็นตัวสำรอง ระบบจะคำนวณให้อัตโนมัติเมื่อคุณเปลี่ยนค่า',
    summary: 'ดูตัวเลือกที่เหมาะที่สุดก่อน',
    summaryHint: 'ดูกำไร/ต้นทุนโดยรวม ค่าธรรมเนียม และสถานะข้อมูลก่อนกดออกไปยังแพลตฟอร์ม',
    statMarkets: 'ตลาดที่กำลังเทียบ',
    statMode: 'โหมดเปรียบเทียบ',
    statSource: 'ข้อมูลหลัก',
    guideTitle: 'อ่านผลลัพธ์อย่างไร',
    guideOneTitle: 'ดูผลลัพธ์รวมก่อน',
    guideOneBody: 'ถ้าซื้อให้ดูยอดจ่ายรวม ถ้าขายให้ดูยอดสุทธิที่ได้รับ ไม่ใช่ดูราคาเฉลี่ยอย่างเดียว',
    guideTwoTitle: 'แล้วค่อยดูสถานะข้อมูล',
    guideTwoBody: 'ข้อมูลสดควรมาก่อน และข้อมูลสำรองจะถูกติดป้ายชัดเจนเสมอ',
    guideThreeTitle: 'ค่อยตัดสินใจกดออกไป',
    guideThreeBody: 'หน้านี้ช่วยคัดเส้นทาง ส่วนเงื่อนไขสุดท้ายยังต้องดูจากหน้าแพลตฟอร์มจริง',
    best: 'ตัวเลือกที่ดีที่สุดตอนนี้',
    bestReasonBuy: 'ซื้อจะอ้างอิงฝั่งขายของแพลตฟอร์ม ตัวเลือกนี้ให้ต้นทุนรวมที่ดีกว่าสำหรับจำนวนที่คุณกรอก',
    bestReasonSell: 'ขายจะอ้างอิงฝั่งซื้อของแพลตฟอร์ม ตัวเลือกนี้ให้เงินบาทหลังหักค่าธรรมเนียมดีที่สุดสำหรับจำนวนที่คุณกรอก',
    liveOfficial: 'แหล่งข้อมูลทางการแบบสด',
    fallback: 'แหล่งข้อมูลสำรองที่ตรวจทานแล้ว',
    receiveBuy: 'คาดว่าจะได้หลังหักค่าถอน',
    receiveSell: 'คาดว่าจะได้รับสุทธิ',
    totalCostBuy: 'ยอดจ่ายรวมโดยประมาณ',
    totalCostSell: 'ค่าธรรมเนียมรวมโดยประมาณ',
    avgPriceBuy: 'ราคาเฉลี่ยฝั่งขาย',
    avgPriceSell: 'ราคาเฉลี่ยฝั่งซื้อ',
    freshness: 'ความสดของข้อมูล',
    source: 'ชั้นข้อมูล',
    updated: 'อัปเดตล่าสุด',
    fallbackReason: 'เหตุผลที่ใช้ fallback',
    noData: 'ยังไม่มีข้อมูลเพียงพอสำหรับคู่ที่เลือก',
    noResultsBody: 'ลองเปลี่ยนจำนวนหรือทิศทาง แล้วระบบจะคำนวณใหม่ทันที',
    table: 'ตารางเปรียบเทียบ',
    tableDescription: 'ผลลัพธ์ทั้งหมดเป็นค่าประมาณและสามารถกดดูรายละเอียดแพลตฟอร์มได้',
    platform: 'แพลตฟอร์ม',
    fees: 'ค่าธรรมเนียม',
    fill: 'อัตราการเติมเต็ม',
    gap: 'ช่องว่างสภาพคล่อง',
    action: 'การดำเนินการ',
    detail: 'ดูรายละเอียด',
    visitExchange: 'ไปยังเว็บเทรด',
    visitBest: 'ไปยังตัวเลือกนี้',
    live: 'สด',
    fallbackShort: 'สำรอง',
    feeLine: 'เทรด {trade} / เครือข่าย {network}',
  },
  en: {
    title: 'Crypto to THB',
    description: 'Depth-aware comparison with estimated receive, fees, and compliance context.',
    panel: 'Set your crypto route',
    panelHint: 'Pick the coin, direction, and amount. Results refresh automatically.',
    pricingHintBuy: 'Buy mode uses the exchange ask side, and the total payment includes fees.',
    pricingHintSell: 'Sell mode uses the exchange bid side, and the net receive is shown after fees.',
    symbol: 'Symbol',
    symbolHint: 'Tap a major coin below for a quicker switch.',
    side: 'Side',
    sideBuy: 'Buy',
    sideSell: 'Sell',
    amount: 'Amount',
    amountHint: 'Supports decimals, for example 0.01 BTC',
    amountNote: 'Use normal decimal numbers like 0.01 and avoid scientific notation.',
    amountInvalid: 'Enter a normal decimal amount that is at least 0.00000001.',
    compare: 'Update results',
    compareHint: 'This button is only a fallback. The page recalculates automatically when fields change.',
    summary: 'Review the strongest route first',
    summaryHint: 'Check the estimated outcome, fees, and data state before leaving for the exchange.',
    statMarkets: 'Markets compared',
    statMode: 'Comparison mode',
    statSource: 'Primary source',
    guideTitle: 'How to read this',
    guideOneTitle: 'Start with the all-in result',
    guideOneBody: 'For buys, prioritize total payment. For sells, prioritize net THB received.',
    guideTwoTitle: 'Then check the data state',
    guideTwoBody: 'Live rows come first, and fallback rows stay explicitly labeled.',
    guideThreeTitle: 'Click out only after filtering',
    guideThreeBody: 'This page narrows the route. Final terms still belong to the exchange.',
    best: 'Best current option',
    bestReasonBuy: 'Buy mode uses the exchange ask side. This route currently gives the strongest all-in cost for the amount you entered.',
    bestReasonSell: 'Sell mode uses the exchange bid side. This route currently gives the strongest net THB outcome for the amount you entered.',
    liveOfficial: 'Live official source',
    fallback: 'Reviewed fallback source',
    receiveBuy: 'Estimated receive after withdrawal',
    receiveSell: 'Estimated net receive',
    totalCostBuy: 'Estimated total payment',
    totalCostSell: 'Estimated total fees',
    avgPriceBuy: 'Average ask price',
    avgPriceSell: 'Average bid price',
    freshness: 'Freshness',
    source: 'Source',
    updated: 'Updated',
    fallbackReason: 'Fallback reason',
    noData: 'No comparison data available for this symbol yet.',
    noResultsBody: 'Try another amount or switch the direction to refresh the route.',
    table: 'Comparison table',
    tableDescription: 'Every result is labeled as estimated and linked to the official platform page.',
    platform: 'Platform',
    fees: 'Fees',
    fill: 'Fill ratio',
    gap: 'Liquidity gap',
    action: 'Action',
    detail: 'View detail',
    visitExchange: 'Open exchange',
    visitBest: 'Open this exchange',
    live: 'Live',
    fallbackShort: 'Fallback',
    feeLine: 'Trade {trade} / Network {network}',
  },
  zh: {
    title: '加密换泰铢',
    description: '结合订单簿深度、费用与数据可靠性上下文进行估算比较。',
    panel: '先选你的交易条件',
    panelHint: '先选币种、方向和数量，页面会自动刷新结果。',
    pricingHintBuy: '买入按平台卖盘计算，预计总支付会包含手续费。',
    pricingHintSell: '卖出按平台买盘计算，预计净到手会扣除手续费。',
    symbol: '币种',
    symbolHint: '主流币种直接点标签就能切换。',
    side: '方向',
    sideBuy: '买入',
    sideSell: '卖出',
    amount: '数量',
    amountHint: '支持小数，例如 0.01 BTC',
    amountNote: '请输入普通数字格式，例如 0.01，不要使用科学计数法。',
    amountInvalid: '请输入大于等于 0.00000001 的普通小数金额。',
    compare: '更新结果',
    compareHint: '这个按钮只是兜底，正常情况下你改动字段后页面会自动重算。',
    summary: '先看最值得跳转的平台',
    summaryHint: '先看预计结果、费用和数据状态，再决定是否跳到交易所。',
    statMarkets: '当前比较市场',
    statMode: '比较模式',
    statSource: '主要数据源',
    guideTitle: '怎么读这个结果',
    guideOneTitle: '先看总结果',
    guideOneBody: '买入优先看总支付，卖出优先看净到手，不要只看均价。',
    guideTwoTitle: '再看数据状态',
    guideTwoBody: '实时优先，备用结果会明确标识，不会伪装成实时。',
    guideThreeTitle: '最后再决定跳转',
    guideThreeBody: '比较页负责筛选路线，最终条件仍以交易所页面为准。',
    best: '当前最优选项',
    bestReasonBuy: '买入会按平台卖盘计算，这个平台当前给出的总支付成本更优。',
    bestReasonSell: '卖出会按平台买盘计算，这个平台当前给出的净到手泰铢更优。',
    liveOfficial: '官方实时来源',
    fallback: '审核后备用来源',
    receiveBuy: '预计到手数量',
    receiveSell: '预计净到手',
    totalCostBuy: '预计总支付',
    totalCostSell: '预计总费用',
    avgPriceBuy: '平台卖盘均价',
    avgPriceSell: '平台买盘均价',
    freshness: '新鲜度',
    source: '来源层',
    updated: '更新时间',
    fallbackReason: '回退原因',
    noData: '该币种暂时没有可用比较数据。',
    noResultsBody: '可以尝试修改金额或方向，页面会重新计算当前路径。',
    table: '比较表',
    tableDescription: '所有结果均标注为估算值，并可进入平台详情页。',
    platform: '平台',
    fees: '费用',
    fill: '成交率',
    gap: '流动性缺口',
    action: '操作',
    detail: '查看详情',
    visitExchange: '前往交易所',
    visitBest: '前往该平台',
    live: '实时',
    fallbackShort: '备用',
    feeLine: '交易费 {trade} / 网络费 {network}',
  },
} as const;

type CryptoCopy = typeof copy.en;
const localeOverrides = {
  ja: {
    title: '暗号資産を THB に比較',
    description: '板の深さ、手数料、推定受取額、データ状態をまとめて比較します。',
    panel: '暗号資産ルートを設定',
    panelHint: 'コイン、方向、数量を選ぶと結果が自動で更新されます。',
    pricingHintBuy: '買いは取引所の ask 側を使い、総支払額には手数料も含まれます。',
    pricingHintSell: '売りは取引所の bid 側を使い、純受取額は手数料差し引き後です。',
    symbolHint: '主要コインは下のチップで素早く切り替えられます。',
    amountHint: '小数対応。例: 0.01 BTC',
    amountNote: '0.01 のような通常の小数を使い、指数表記は避けてください。',
    compareHint: 'このボタンは予備です。通常は自動で再計算されます。',
    summary: 'まず最有力のルートを見る',
    summaryHint: '外部へ進む前に、推定結果、手数料、データ状態を確認してください。',
    guideTitle: '結果の読み方',
    guideOneTitle: 'まず総合結果を見る',
    guideOneBody: '買いでは総支払額、売りでは純受取 THB を優先して見てください。',
    guideTwoTitle: '次にデータ状態を見る',
    guideTwoBody: 'live を優先し、fallback は明確にラベル表示されます。',
    guideThreeTitle: '最後に外部へ進む',
    guideThreeBody: 'このページはルートの絞り込み用で、最終条件は取引所ページ側にあります。',
    noData: 'このコインではまだ十分な比較データがありません。',
    noResultsBody: '数量や方向を変えて再計算してください。',
  },
  ko: {
    title: '가상자산을 THB 로 비교',
    description: '호가창 깊이, 수수료, 예상 수령액, 데이터 상태를 함께 비교합니다.',
    panel: '가상자산 경로 설정',
    panelHint: '코인, 방향, 수량을 고르면 결과가 자동 갱신됩니다.',
    pricingHintBuy: '매수는 거래소 ask 호가를 사용하며 총 지불액에는 수수료가 포함됩니다.',
    pricingHintSell: '매도는 거래소 bid 호가를 사용하며 순수령액은 수수료 차감 후 금액입니다.',
    symbolHint: '주요 코인은 아래 칩으로 빠르게 바꿀 수 있습니다.',
    amountHint: '소수 입력 가능. 예: 0.01 BTC',
    amountNote: '0.01 같은 일반 소수를 사용하고 과학적 표기법은 피하세요.',
    compareHint: '이 버튼은 예비용입니다. 보통은 자동 재계산됩니다.',
    summary: '먼저 가장 강한 경로 확인',
    summaryHint: '거래소로 나가기 전에 예상 결과, 수수료, 데이터 상태를 확인하세요.',
    guideTitle: '결과 읽는 법',
    guideOneTitle: '먼저 종합 결과를 본다',
    guideOneBody: '매수는 총 지불액, 매도는 순수령 THB 를 우선해서 보세요.',
    guideTwoTitle: '다음으로 데이터 상태를 본다',
    guideTwoBody: 'live 를 우선하고 fallback 은 명확히 표시됩니다.',
    guideThreeTitle: '마지막에 외부로 이동',
    guideThreeBody: '이 페이지는 경로를 좁히는 용도이며 최종 조건은 거래소 페이지에 있습니다.',
    noData: '이 코인에 대한 충분한 비교 데이터가 아직 없습니다.',
    noResultsBody: '수량이나 방향을 바꿔 다시 계산해 보세요.',
  },
  de: {
    title: 'Krypto zu THB vergleichen',
    description: 'Vergleiche Orderbuchtiefe, Gebühren, geschätzten Gegenwert und Datenstatus in einer Ansicht.',
    panel: 'Krypto-Route festlegen',
    panelHint: 'Wähle Coin, Richtung und Betrag. Ergebnisse aktualisieren sich automatisch.',
    pricingHintBuy: 'Kauf nutzt die Ask-Seite der Börse; die Gesamtkosten enthalten Gebühren.',
    pricingHintSell: 'Verkauf nutzt die Bid-Seite der Börse; der Nettobetrag ist nach Gebühren berechnet.',
    symbolHint: 'Wichtige Coins lassen sich unten per Chip schnell wechseln.',
    amountHint: 'Dezimalwerte möglich, z. B. 0.01 BTC',
    amountNote: 'Nutze normale Dezimalzahlen wie 0.01 und keine wissenschaftliche Schreibweise.',
    compareHint: 'Diese Schaltfläche ist nur eine Reserve. Normalerweise wird automatisch neu gerechnet.',
    summary: 'Zuerst die stärkste Route prüfen',
    summaryHint: 'Prüfe geschätztes Ergebnis, Gebühren und Datenstatus, bevor du zur Börse gehst.',
    guideTitle: 'So liest du das Ergebnis',
    guideOneTitle: 'Mit dem Gesamtergebnis beginnen',
    guideOneBody: 'Beim Kauf zählt der Gesamtbetrag, beim Verkauf der Netto-THB-Ertrag.',
    guideTwoTitle: 'Dann den Datenstatus prüfen',
    guideTwoBody: 'Live kommt zuerst, Fallback bleibt klar gekennzeichnet.',
    guideThreeTitle: 'Danach erst nach außen klicken',
    guideThreeBody: 'Diese Seite filtert die Route vor. Die finalen Bedingungen gelten auf der Börsenseite.',
    noData: 'Für diesen Coin sind noch keine ausreichenden Vergleichsdaten verfügbar.',
    noResultsBody: 'Ändere Betrag oder Richtung und berechne die Route neu.',
  },
} satisfies Partial<Record<Locale, Partial<Record<keyof CryptoCopy, string>>>>;

export default async function CryptoPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const { locale } = await params;
  const query = await searchParams;
  const rawSymbol = Array.isArray(query.symbol) ? query.symbol[0] : query.symbol;
  const rawSide = Array.isArray(query.side) ? query.side[0] : query.side;
  const symbol = (query.symbol as CryptoSymbol) || 'BTC';
  const rawAmount = Array.isArray(query.amount) ? query.amount[0] : query.amount;
  const amountState = inspectPositiveDecimal(query.amount, 0.00000001);
  const side = query.side === 'sell' ? 'sell' : 'buy';
  const hasDefaultRouteQuery = Boolean(rawSymbol || rawSide || rawAmount);
  if (!hasDefaultRouteQuery) {
    redirect(`/${locale}/crypto?symbol=BTC&side=buy&amount=1`);
  }
  const contentLocale = resolveContentLocale(locale);
  const c = locale in localeOverrides
    ? { ...copy.en, ...localeOverrides[locale as keyof typeof localeOverrides] }
    : copy[contentLocale];
  const amount = amountState.valid && amountState.parsed !== null ? amountState.parsed : 1;
  const results = amountState.valid && amountState.parsed !== null
    ? await compareCrypto({ symbol, amount, side, quoteMode: 'coin', includeWithdrawal: true, withdrawThb: side === 'sell' })
    : [];
  const best = results[0];
  const feeLine = (trade: number, network: number) => c.feeLine.replace('{trade}', formatDisplayAmount(trade, { maximumFractionDigits: 2 })).replace('{network}', formatDisplayAmount(network, { maximumFractionDigits: 8 }));
  const bestReason = side === 'buy' ? c.bestReasonBuy : c.bestReasonSell;
  const receiveLabel = side === 'buy' ? c.receiveBuy : c.receiveSell;
  const totalCostLabel = side === 'buy' ? c.totalCostBuy : c.totalCostSell;
  const avgPriceLabel = side === 'buy' ? c.avgPriceBuy : c.avgPriceSell;
  const pricingHint = side === 'buy' ? c.pricingHintBuy : c.pricingHintSell;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: c.title, item: withLocalePath(locale, '/crypto') },
  ]);

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Section title={c.title} description={c.description}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="card overflow-hidden border-brand-500/20 bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900">
            <AutoSubmitForm action={`/${locale}/crypto`} className="grid gap-6 p-6" delayMs={150}>
              <div className="space-y-2">
                <Pill>{c.panel}</Pill>
                <p className="text-sm text-stone-300">{c.panelHint}</p>
                <p className="text-xs text-stone-500">{pricingHint}</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-stone-300">{c.symbol}</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {symbols.map((item) => {
                    const selected = item === symbol;
                    return (
                      <label key={item} className="cursor-pointer">
                        <input type="radio" name="symbol" value={item} defaultChecked={selected} className="sr-only" />
                        <ChoiceChip active={selected}>{item}</ChoiceChip>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-stone-500">{c.symbolHint}</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-stone-300">{c.side}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'buy', label: c.sideBuy },
                    { value: 'sell', label: c.sideSell },
                  ].map((item) => {
                    const selected = item.value === side;
                    return (
                      <label key={item.value} className="cursor-pointer">
                        <input type="radio" name="side" value={item.value} defaultChecked={selected} className="sr-only" />
                        <ChoiceChip active={selected}>{item.label}</ChoiceChip>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-300">{c.amount} ({symbol})</label>
                <input
                  type="text"
                  name="amount"
                  defaultValue={rawAmount || formatInputAmount(amount, 8)}
                  inputMode="decimal"
                  placeholder={symbol === 'USDT' ? '1000' : '0.01'}
                  autoComplete="off"
                  spellCheck={false}
                  data-decimal-input="true"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-surface-800 px-4 py-3 text-lg text-white"
                />
                <p className="mt-2 text-xs text-stone-400">{c.amountHint}</p>
                <p className="mt-1 text-xs text-stone-400">{c.amountNote}</p>
                {!amountState.valid && rawAmount ? <p className="mt-2 text-sm font-medium text-rose-700">{c.amountInvalid}</p> : null}
              </div>

              <TrackButton type="submit" eventName="crypto_compare_submit" eventParams={{ symbol, side }} className="rounded-full border border-brand-500/40 bg-brand-500 px-5 py-3 text-sm font-medium text-surface-950">{c.compare}</TrackButton>
              <p className="text-xs text-stone-500">{c.compareHint}</p>
            </AutoSubmitForm>
          </div>

          <div className="grid gap-4">
            <div className="card p-6">
              <div className="space-y-2">
                <Pill>{c.summary}</Pill>
                <p className="text-sm text-stone-400">{c.summaryHint}</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="card-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.statMarkets}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{results.length || 0}</p>
                </div>
                <div className="card-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.statMode}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{side === 'buy' ? c.sideBuy : c.sideSell}</p>
                </div>
                <div className="card-panel p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{c.statSource}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{best ? (best.live ? c.live : c.fallbackShort) : '-'}</p>
                </div>
              </div>
            </div>

            {best ? (
              <div className="card border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-surface-900 to-surface-850 p-6 shadow-glow">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>{c.best}</Pill>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${best.live ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>
                    {best.live ? c.liveOfficial : c.fallback}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-white">{best.exchange}</h2>
                <p className="mt-2 text-sm text-stone-300">{bestReason}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-stone-400">{receiveLabel}</p>
                    <p className="mt-1 text-3xl font-semibold text-white">{formatDisplayAmount(best.estimatedReceive, { maximumFractionDigits: side === 'buy' ? 8 : 2 })} {side === 'buy' ? symbol : 'THB'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">{totalCostLabel}</p>
                    <p className="mt-1 text-3xl font-semibold text-white">{formatDisplayAmount(best.estimatedTotalCost, { maximumFractionDigits: 2 })} THB</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">{avgPriceLabel}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{formatDisplayAmount(best.averagePrice, { maximumFractionDigits: 6 })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">{c.fees}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{feeLine(best.tradingFee, best.networkFee)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">{c.freshness}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{localizeMarketFreshness(best.freshness, locale)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-400">{c.source}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{localizeMarketSource(best.source, locale)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <TrackAnchor href={best.affiliateUrl} target="_blank" rel="noopener noreferrer" eventName="crypto_best_exchange_click" eventParams={{ exchange: best.slug, affiliateStatus: best.affiliateStatus }} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-surface-950">{c.visitBest}</TrackAnchor>
                  <TrackLink href={`/${locale}/exchanges/${best.slug}`} eventName="crypto_best_detail_click" eventParams={{ exchange: best.slug }} className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-stone-200">{c.detail}</TrackLink>
                </div>
                <p className="mt-4 text-sm text-stone-400">{c.updated}: {new Date(best.updatedAt).toLocaleString()}</p>
                {best.fallbackReason ? <p className="mt-2 text-sm font-medium text-amber-300">{localizeMarketFallbackReason(best.fallbackReason, locale)}</p> : null}
              </div>
            ) : (
              <div className="card p-6 text-stone-400">
                <p className="font-medium text-white">{amountState.valid ? c.noData : c.amountInvalid}</p>
                <p className="mt-2">{c.noResultsBody}</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section title={c.table} description={c.tableDescription}>
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
          {!results.length ? <div className="data-table px-6 py-8 text-sm text-stone-500">{c.noResultsBody}</div> : null}
          {results.length ? (
            <div className="grid gap-4 md:hidden">
              {results.map((row) => (
                <div key={`mobile-${row.slug}`} className="card card-interactive p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{row.exchange}</p>
                      <p className="mt-1 text-xs text-stone-400">{localizeExchangeLicense(row.license, locale)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.live ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>
                      {row.live ? c.live : c.fallbackShort}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-stone-400">{receiveLabel}</p>
                      <p className="mt-1 font-semibold text-white">{formatDisplayAmount(row.estimatedReceive, { maximumFractionDigits: side === 'buy' ? 8 : 2 })} {side === 'buy' ? symbol : 'THB'}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{totalCostLabel}</p>
                      <p className="mt-1 font-semibold text-white">{formatDisplayAmount(row.estimatedTotalCost, { maximumFractionDigits: 2 })} THB</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{avgPriceLabel}</p>
                      <p className="mt-1 font-semibold text-white">{formatDisplayAmount(row.averagePrice, { maximumFractionDigits: 6 })}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{c.fees}</p>
                      <p className="mt-1 font-semibold text-white">{feeLine(row.tradingFee, row.networkFee)}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{c.freshness}</p>
                      <p className="mt-1 font-semibold text-white">{localizeMarketFreshness(row.freshness, locale)}</p>
                    </div>
                    <div>
                      <p className="text-stone-400">{c.updated}</p>
                      <p className="mt-1 font-semibold text-white">{new Date(row.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {row.fallbackReason ? <p className="mt-3 text-sm text-amber-300">{localizeMarketFallbackReason(row.fallbackReason, locale)}</p> : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <TrackAnchor href={row.affiliateUrl} target="_blank" rel="noopener noreferrer" eventName="crypto_exchange_outbound_click" eventParams={{ exchange: row.slug, affiliateStatus: row.affiliateStatus }} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-surface-950">{c.visitExchange}</TrackAnchor>
                    <TrackLink href={`/${locale}/exchanges/${row.slug}`} eventName="crypto_result_click" eventParams={{ exchange: row.slug }} className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-stone-200">{c.detail}</TrackLink>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="data-table">
            {!results.length ? <div className="px-6 py-8 text-sm text-stone-500">{c.noResultsBody}</div> : null}
            {results.length ? (
              <table className="hidden min-w-full text-left text-sm md:table">
                <thead>
                  <tr>
                    {[c.platform, receiveLabel, totalCostLabel, avgPriceLabel, c.fees, c.fill, c.gap, c.freshness, c.updated, c.action].map((head) => <th key={head} className="px-5 py-4 font-medium">{head}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.slug} className="border-t border-white/8">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{row.exchange}</div>
                        <div className="text-xs text-stone-400">{localizeExchangeLicense(row.license, locale)}</div>
                        <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.live ? 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>
                          {row.live ? c.live : c.fallbackShort}
                        </span>
                      </td>
                      <td className="px-5 py-4">{formatDisplayAmount(row.estimatedReceive, { maximumFractionDigits: side === 'buy' ? 8 : 2 })} {side === 'buy' ? symbol : 'THB'}</td>
                      <td className="px-5 py-4">{formatDisplayAmount(row.estimatedTotalCost, { maximumFractionDigits: 2 })} THB</td>
                      <td className="px-5 py-4">{formatDisplayAmount(row.averagePrice, { maximumFractionDigits: 6 })}</td>
                      <td className="px-5 py-4">{feeLine(row.tradingFee, row.networkFee)}</td>
                      <td className="px-5 py-4">{(row.fillRatio * 100).toFixed(2)}%</td>
                      <td className="px-5 py-4">{formatDisplayAmount(row.liquidityGap, { maximumFractionDigits: 8 })}</td>
                      <td className="px-5 py-4">
                        <div>{localizeMarketFreshness(row.freshness, locale)}</div>
                        {row.fallbackReason ? <div className="mt-1 text-xs text-amber-300">{localizeMarketFallbackReason(row.fallbackReason, locale)}</div> : null}
                      </td>
                      <td className="px-5 py-4">{new Date(row.updatedAt).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <TrackAnchor href={row.affiliateUrl} target="_blank" rel="noopener noreferrer" eventName="crypto_exchange_outbound_click" eventParams={{ exchange: row.slug, affiliateStatus: row.affiliateStatus }} className="font-medium text-brand-300">{c.visitExchange}</TrackAnchor>
                          <TrackLink href={`/${locale}/exchanges/${row.slug}`} eventName="crypto_result_click" eventParams={{ exchange: row.slug }} className="font-medium text-stone-300">{c.detail}</TrackLink>
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
        <Section title="English search questions this page answers" description="This section strengthens long-tail relevance for people searching how to compare Thai crypto routes into baht.">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'How do I compare BTC to THB in Thailand?',
                body: 'Use buy mode to compare ask-side execution, fee drag, and the total THB payment instead of only one quoted price.',
              },
              {
                title: 'How do I compare USDT to THB across Thai exchanges?',
                body: 'Use sell mode to estimate the net THB outcome after fees, then check whether the best row is live or fallback.',
              },
              {
                title: 'Why does a lower average price not always win?',
                body: 'Liquidity gap, network fees, and trading fees can make a route look cheaper on the surface but worse in the final result.',
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
        title={contentLocale === 'th' ? 'เส้นทางคริปโตที่เกี่ยวข้อง' : contentLocale === 'zh' ? '相关加密路线页' : 'Related crypto route guides'}
        description={contentLocale === 'th' ? 'หน้าพวกนี้ช่วยรองรับคำค้นเฉพาะของแต่ละเหรียญ แล้วพาผู้ใช้กลับเข้ามายัง flow เปรียบเทียบจริง' : contentLocale === 'zh' ? '这些页面承接更具体的币种搜索，再把用户带回真实比较流程。' : 'These landing pages target specific coin-to-THB search intent and feed users back into the live Thai comparison flow.'}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routeGuides.filter((guide) => guide.type === 'crypto').map((guide) => (
            <TrackLink
              key={guide.slug}
              href={`/${locale}/routes/${guide.slug}`}
              eventName="crypto_related_route_click"
              eventParams={{ route: guide.slug }}
              className="card card-interactive p-5"
            >
              <p className="text-sm text-stone-400">{guide.symbol}/THB</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{t(guide.title, locale)}</h2>
              <p className="mt-3 text-sm text-stone-400">{t(guide.summary, locale)}</p>
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
  const c = locale in localeOverrides
    ? { ...copy.en, ...localeOverrides[locale as keyof typeof localeOverrides] }
    : copy[contentLocale];
  const title = locale === 'th'
    ? 'เปรียบเทียบคริปโตเป็นบาท'
    : locale === 'zh'
      ? '加密换泰铢比较'
      : locale === 'ja'
        ? 'タイで暗号資産を THB に比較 | BTC・ETH・USDT'
        : locale === 'ko'
          ? '태국 암호화폐 THB 비교 | BTC·ETH·USDT'
          : locale === 'de'
            ? 'Krypto zu THB Vergleich in Thailand | BTC, ETH, USDT'
            : 'Best Crypto to THB Comparison in Thailand | BTC, ETH, USDT';
  const description = c.description;
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale, '/crypto'),
      languages: localeAlternates('/crypto'),
    },
    keywords: locale === 'en'
      ? ['BTC to THB', 'ETH to THB', 'USDT to THB', 'XRP to THB', 'DOGE to THB', 'SOL to THB', 'crypto exchange Thailand', 'buy crypto in Thailand', 'sell crypto for baht']
      : undefined,
    openGraph: {
      title,
      description,
      url: withLocalePath(locale, '/crypto'),
    },
  };
}
