'use client';

import { banknoteLabel, quoteSourceLabel } from '@/lib/comparison-ui';
import { cryptoEmptyCopy } from '@/lib/crypto-empty-copy';
import { cashEmptyCopy } from '@/lib/cash-empty-copy';
import { locationCopy } from '@/lib/location-copy';
import { defaultCashCurrency } from '@/lib/locale-preferences';
import { additionalCopy, additionalWords, additionalExtra, isAdditionalLocale } from '@/lib/additional-copy';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics-client';
import { amountBucket, isFreshQuote, validAmount } from '@/lib/comparison-ui';
import type { CashRow, ComparisonMode, CryptoRow } from '@/lib/comparison-ui';
import { cashCurrencies, cryptoSymbols, type ContentLocale } from '@/lib/types';
import { cashQuoteCurrent } from '@/lib/data-quality';
import { ExchangeBackground } from '@/components/exchange-background';
import { ProviderContext } from '@/components/provider-context';
import { unknownFiatWithdrawal } from '@/lib/fiat-withdrawal-copy';

const words = {
 ...additionalWords,
  ja: {"cash": "現金両替", "crypto": "暗号資産", "cashHint": "両替店を探す", "cryptoHint": "取引所を比較", "currency": "通貨", "asset": "資産", "amount": "金額", "assetAmount": "資産数量", "compare": "比較する", "loading": "比較中…", "sell": "売却してTHBを受取", "buy": "THBで購入", "advanced": "詳細条件", "distance": "最大距離", "location": "現在地を使う", "locating": "現在地を取得中…", "locationActive": "現在地を使用中", "reference": "バンコク中心部からの参考距離", "locationError": "現在地を取得できません。参考距離で比較できます。", "openOnly": "営業中の店舗のみ", "nearest": "近い順", "best": "受取額順", "results": "比較結果", "ready": "通貨と金額を選んで比較しましょう。", "changed": "選択を更新中です。有効な金額を入力してください。", "error": "更新できませんでした。再試行してください。", "invalid": "0より大きい有効な金額を入力してください。", "empty": "条件に合う結果がありません。通貨や絞り込み条件を変更してください。", "receive": "概算受取額", "payment": "概算支払額", "fresh": "最近のレート", "cached": "参考データ", "referenceResults": "参考情報のみ", "stale": "このレートで最適な選択は判断できません。公式サイトで確認してください。", "bestLabel": "受取額が最大", "cheapest": "支払額が最小", "closed": "営業時間外", "open": "営業中", "map": "地図を見る", "official": "公式サイトへ", "details": "手数料と情報源", "rate": "レート", "observed": "レートの時点", "note": "金額は概算です。最終レートは提供者に確認してください。", "trading": "取引手数料", "withdraw": "THB出金手数料", "network": "資産出金手数料", "fill": "約定可能な割合", "banknote": "紙幣の額面", "hours": "営業時間", "gap": "未約定数量", "all": "他の結果を見る", "less": "表示を減らす", "rankNote": "全量の約定可否を考慮してから金額を比較します。", "buyNote": "購入する資産数量を入力します。支払額はTHBで表示します。", "valueRoute": "タイバーツに両替", "assetReceive": "概算資産受取量"},
  zh: {
    cash: '现金换汇', crypto: '加密资产', cashHint: '找换汇店', cryptoHint: '比较交易所',
    currency: '币种', asset: '资产', amount: '金额', assetAmount: '资产数量', compare: '比较一下', loading: '正在比较…',
    sell: '卖出换泰铢', buy: '用泰铢买入', advanced: '更多选择', distance: '最大距离', location: '使用我的位置', locating: '正在定位…',
    locationActive: '已使用你的位置', reference: '距离以曼谷中心为参考', locationError: '无法定位，仍可使用参考距离比较。',
    openOnly: '只看营业中的门店', nearest: '离我更近', best: '兑换所得', results: '比较结果', ready: '选择币种和金额，看看能换多少。',
    changed: '正在更新选择；请输入有效金额。', error: '暂时无法更新，请再试一次。', invalid: '请输入大于 0 的有效金额。',
    empty: '没有符合条件的结果，请更换币种或放宽筛选。', receive: '预计到手', payment: '预计支付', fresh: '近期报价', cached: '参考数据',
    referenceResults: '仅供参考', stale: '这些报价暂不可用于判断哪家更好，请前往官网确认。', bestLabel: '当前最高', cheapest: '当前最低',
    closed: '已打烊', open: '营业中', map: '查看地图', official: '前往官网', details: '费用与来源', rate: '汇率', observed: '报价时间',
    note: '金额为估算，最终汇率请向平台或门店确认。', trading: '交易费', withdraw: '泰铢提现费', network: '资产提币费', fill: '可成交比例',
    banknote: '纸币面额', hours: '营业时间', gap: '未成交数量', all: '查看其余结果', less: '收起其余结果', rankNote: '先考虑能否完整成交，再比较金额。',
    buyNote: '输入想买的资产数量；预计支付以泰铢显示。', valueRoute: '换成泰铢 THB', assetReceive: '预计获得资产',
  },
  en: {
    cash: 'Cash exchange', crypto: 'Crypto', cashHint: 'Find a money changer', cryptoHint: 'Compare exchanges',
    currency: 'Currency', asset: 'Asset', amount: 'Amount', assetAmount: 'Asset amount', compare: 'Compare options', loading: 'Comparing…',
    sell: 'Sell for THB', buy: 'Buy with THB', advanced: 'More options', distance: 'Max distance', location: 'Use my location', locating: 'Finding your location…',
    locationActive: 'Using your location', reference: 'Distances from central Bangkok', locationError: 'Location unavailable. You can still compare reference distances.',
    openOnly: 'Open now only', nearest: 'Nearest first', best: 'Best amount', results: 'Your options', ready: 'Choose a currency and amount to compare.',
    changed: 'Updating your selection. Enter a valid amount.', error: 'Unable to update right now. Please try again.', invalid: 'Enter a valid amount greater than 0.',
    empty: 'No matching options. Try another currency or wider filters.', receive: 'Estimated receive', payment: 'Estimated payment', fresh: 'Recent quote', cached: 'Reference data',
    referenceResults: 'For reference only', stale: 'These quotes cannot identify the best option. Check the official site for current rates.', bestLabel: 'Highest amount', cheapest: 'Lowest payment',
    closed: 'Closed', open: 'Open now', map: 'Open map', official: 'Official site', details: 'Fees and source', rate: 'Rate', observed: 'Quoted',
    note: 'Estimates only. Confirm the final rate with the provider.', trading: 'Trading fee', withdraw: 'THB withdrawal fee', network: 'Asset withdrawal fee', fill: 'Fill available',
    banknote: 'Banknote', hours: 'Opening hours', gap: 'Unfilled amount', all: 'Show other options', less: 'Show fewer', rankNote: 'Complete fills come first, then the amount.',
    buyNote: 'Enter how much of the asset to buy. Payment is shown in THB.', valueRoute: 'Exchange to Thai baht', assetReceive: 'Estimated asset received',
  },
  th: {
    cash: 'แลกเงินสด', crypto: 'คริปโต', cashHint: 'เลือกร้านแลกเงิน', cryptoHint: 'เทียบแพลตฟอร์ม',
    currency: 'สกุลเงิน', asset: 'สินทรัพย์', amount: 'จำนวนเงิน', assetAmount: 'จำนวนสินทรัพย์', compare: 'เปรียบเทียบ', loading: 'กำลังเปรียบเทียบ…',
    sell: 'ขายเป็นบาท', buy: 'ซื้อด้วยบาท', advanced: 'ตัวเลือกเพิ่มเติม', distance: 'ระยะสูงสุด', location: 'ใช้ตำแหน่งของฉัน', locating: 'กำลังหาตำแหน่ง…',
    locationActive: 'ใช้ตำแหน่งของคุณแล้ว', reference: 'ระยะอ้างอิงจากใจกลางกรุงเทพ', locationError: 'ใช้ตำแหน่งไม่ได้ ยังเปรียบเทียบจากจุดอ้างอิงได้',
    openOnly: 'เฉพาะร้านที่เปิด', nearest: 'ใกล้ที่สุดก่อน', best: 'ยอดรับสูงสุด', results: 'ตัวเลือกของคุณ', ready: 'เลือกสกุลเงินและจำนวนเพื่อเปรียบเทียบ',
    changed: 'กำลังอัปเดตตัวเลือก โปรดกรอกจำนวนที่ถูกต้อง', error: 'อัปเดตไม่ได้ชั่วคราว โปรดลองอีกครั้ง', invalid: 'กรอกจำนวนที่ถูกต้องและมากกว่า 0',
    empty: 'ไม่พบตัวเลือก ลองเปลี่ยนสกุลเงินหรือเพิ่มระยะ', receive: 'ยอดรับโดยประมาณ', payment: 'ยอดจ่ายโดยประมาณ', fresh: 'เรทล่าสุด', cached: 'ข้อมูลอ้างอิง',
    referenceResults: 'สำหรับอ้างอิงเท่านั้น', stale: 'ข้อมูลนี้ยังใช้เลือกเรทที่ดีที่สุดไม่ได้ โปรดตรวจสอบเรทกับเว็บไซต์ทางการ', bestLabel: 'ยอดรับสูงสุด', cheapest: 'ยอดจ่ายต่ำสุด',
    closed: 'ปิดแล้ว', open: 'เปิดอยู่', map: 'เปิดแผนที่', official: 'เว็บไซต์ทางการ', details: 'ค่าธรรมเนียมและแหล่งข้อมูล', rate: 'เรท', observed: 'เวลาของข้อมูล',
    note: 'ยอดประมาณการ โปรดยืนยันเรทสุดท้ายกับผู้ให้บริการ', trading: 'ค่าธรรมเนียมเทรด', withdraw: 'ค่าถอนบาท', network: 'ค่าถอนสินทรัพย์', fill: 'สัดส่วนที่ซื้อขายได้',
    banknote: 'ชนิดธนบัตร', hours: 'เวลาเปิด', gap: 'จำนวนที่ยังซื้อขายไม่ได้', all: 'ดูตัวเลือกอื่น', less: 'แสดงน้อยลง', rankNote: 'เรียงจากการซื้อขายครบก่อน แล้วจึงเปรียบเทียบยอด',
    buyNote: 'กรอกจำนวนสินทรัพย์ที่ต้องการซื้อ ยอดจ่ายแสดงเป็นบาท', valueRoute: 'แลกเป็นเงินบาท', assetReceive: 'สินทรัพย์ที่คาดว่าจะได้รับ',
  },
} as const;

type Selection = { mode: ComparisonMode; unit: string; amount: string; side: 'buy' | 'sell'; distance: string; banknote: string; coords: { lat: number; lng: number; accuracy?: number } | null };
type Result = { key: string; mode: ComparisonMode; cash: CashRow[]; crypto: CryptoRow[]; cacheStale: boolean; selection: Selection };
const cashUnits: readonly string[] = cashCurrencies;
const cryptoUnits: readonly string[] = cryptoSymbols;
const currencyNames = {
 ja: ["米ドル", "ユーロ", "日本円", "人民元", "英ポンド", "豪ドル", "カナダドル", "シンガポールドル", "香港ドル", "スイスフラン", "ニュージーランドドル", "韓国ウォン", "台湾ドル", "マレーシアリンギット", "インドルピー"],
  zh: ['美元', '欧元', '日元', '人民币', '英镑', '澳元', '加元', '新加坡元', '港币', '瑞士法郎', '新西兰元', '韩元', '新台币', '马来西亚林吉特', '印度卢比'],
  en: ['US dollar', 'Euro', 'Japanese yen', 'Chinese yuan', 'British pound', 'Australian dollar', 'Canadian dollar', 'Singapore dollar', 'Hong Kong dollar', 'Swiss franc', 'New Zealand dollar', 'South Korean won', 'Taiwan dollar', 'Malaysian ringgit', 'Indian rupee'],
  th: ['ดอลลาร์สหรัฐ', 'ยูโร', 'เยน', 'หยวน', 'ปอนด์', 'ดอลลาร์ออสเตรเลีย', 'ดอลลาร์แคนาดา', 'ดอลลาร์สิงคโปร์', 'ดอลลาร์ฮ่องกง', 'ฟรังก์สวิส', 'ดอลลาร์นิวซีแลนด์', 'วอน', 'ดอลลาร์ไต้หวัน', 'ริงกิต', 'รูปีอินเดีย'],
};
const extra = {
 ...additionalExtra,
  ja: {"cashBuy": "外貨の現金を購入", "cashSell": "外貨の現金を売却", "buyNote": "希望する外貨の金額を入力してください。支払額はTHBで概算します。", "feeWarning": "手数料は未確認です。金額は概算です。", "unknownWithdrawal": "この資産の出金手数料は未確認です。不明な費用は含まれていません。", "marketBest": "有利な参考レート", "unknownDistance": "距離は未確認", "published": "提供者の公表時点", "collected": "取得時点", "auto": "市場データを30秒ごとに更新", "feeAssumption": "標準取引手数料を仮定。売却にはTHB出金、購入には資産出金を含みます。", "cashScope": "本店・指定額面のレートです。対象支店と紙幣条件を確認してください。"},
  zh: { cashBuy:'用泰铢买外币',cashSell:'外币换泰铢',buyNote:'输入希望获得的外币金额，结果显示预计支付的泰铢。',feeWarning:'费用尚未核验，金额仅供估算。',unknownWithdrawal:'该资产提币费尚未核验；显示金额未包含未知费用。',marketBest:'行情较优',unknownDistance:'距离待核验',published:'官网发布时间',collected:'采集时间',auto:'每30秒自动更新行情',feeAssumption:'费用假设：标准交易费；卖出含泰铢提现，买入含资产提币。',cashScope:'总店/指定面额报价；到店请确认适用分店及纸币条件。' },
  en: {cashBuy:'Buy foreign cash',cashSell:'Sell foreign cash',buyNote:'Enter the foreign amount you want. Payment is estimated in THB.',feeWarning:'Fees are not verified. Amounts are estimates.',unknownWithdrawal:'Withdrawal fee not verified for this asset; unknown fees are not included.',marketBest:'Competitive quote',unknownDistance:'Distance unverified',published:'Provider published',collected:'Collected',auto:'Refresh market every 30 seconds',feeAssumption:'Assumed standard trading fees; sells include THB withdrawal, buys include asset withdrawal.',cashScope:'Head-office / listed banknote quote. Confirm the branch and banknote conditions.'},
  th: {cashBuy:'ซื้อเงินต่างประเทศ',cashSell:'ขายเงินต่างประเทศ',buyNote:'กรอกจำนวนเงินต่างประเทศที่ต้องการ ยอดจ่ายประมาณเป็นบาท',feeWarning:'ยังไม่ได้ตรวจค่าธรรมเนียม ยอดเป็นประมาณการ',unknownWithdrawal:'ยังไม่ได้ตรวจค่าถอนสินทรัพย์นี้ ยอดยังไม่รวมค่าที่ไม่ทราบ',marketBest:'เรทที่น่าสนใจ',unknownDistance:'ยังไม่ตรวจระยะทาง',published:'เวลาประกาศของผู้ให้บริการ',collected:'เวลาที่เก็บข้อมูล',auto:'อัปเดตตลาดทุก 30 วินาที',feeAssumption:'ใช้ค่าธรรมเนียมเทรดมาตรฐาน ขายรวมถอนบาท ซื้อรวมถอนสินทรัพย์',cashScope:'เรทสำนักงานใหญ่ / ธนบัตรที่ระบุ โปรดยืนยันสาขาและเงื่อนไข'},
};
const keyOf = (s: Selection) => JSON.stringify(s);
const number = (n: number, digits = 2) => new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(n);
function date(value: string, locale: ContentLocale) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' }).format(time) : '—';
}

export function ExchangePicker({ locale, initialMode = 'cash', showModeSwitch = true }: { locale: ContentLocale; initialMode?: ComparisonMode; showModeSwitch?: boolean }) {
  const c = words[locale];
  const lc = locationCopy[locale];
  const ui = isAdditionalLocale(locale) ? additionalCopy[locale].ui : null;
  const e = extra[locale];
  const initial: Selection = { mode: initialMode, unit: initialMode === 'cash' ? defaultCashCurrency(locale) : 'USDT', amount: '1000', side: 'sell', distance: '20', banknote: '', coords: null };
  const [selection, setSelection] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [nearest, setNearest] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [quoteClock, setQuoteClock] = useState(() => Date.now());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const request = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionRef = useRef(selection);

  useEffect(() => {
    const timer = setInterval(() => setQuoteClock(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!autoRefresh || selection.mode !== 'crypto' || pending) return;
    const timer = setInterval(() => {
      if (!document.hidden && result?.key === keyOf(selection)) void compare(selection, false);
    }, 30_000);
    return () => clearInterval(timer);
    // Refresh only the selection whose current result is displayed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, selection, pending, result?.key]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = showModeSwitch && params.get('mode') === 'crypto' ? 'crypto' : initialMode;
    const requestedUnit = params.get(mode === 'cash' ? 'currency' : 'symbol');
    const units = mode === 'cash' ? cashUnits : cryptoUnits;
    const next: Selection = { ...initial, mode, unit: requestedUnit && units.includes(requestedUnit) ? requestedUnit : (mode === 'cash' ? defaultCashCurrency(locale) : units[0]),
      amount: params.get('amount') && validAmount(params.get('amount')!) ? params.get('amount')! : '1000',
      side: params.get('side') === 'buy' ? 'buy' : 'sell',
      banknote: validAmount(params.get('banknote') || '')&&Number(params.get('banknote'))<=1e6?params.get('banknote')!:'',
      distance: validAmount(params.get('maxDistanceKm') || '') && Number(params.get('maxDistanceKm')) <= 100 ? params.get('maxDistanceKm')! : '20' };
    setSelection(next);
    void compare(next, false);
    selectionRef.current = next;
    return () => { request.current += 1; controller.current?.abort(); if (debounce.current) clearTimeout(debounce.current); };
    // Initialize once; subsequent edits trigger automatic comparison.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function change(patch: Partial<Selection>) {
    request.current += 1;
    controller.current?.abort();
    setPending(false);
    setError('');
    setShowAll(false);
    const next = { ...selectionRef.current, ...patch };
    selectionRef.current = next;
    setSelection(next);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (validAmount(next.amount) && validAmount(next.distance) && Number(next.distance) <= 100 && (!next.banknote || (validAmount(next.banknote) && Number(next.banknote) <= 1e6))) void compare(next, 'unit' in patch);
    }, 'amount' in patch || 'distance' in patch || 'banknote' in patch ? 400 : 0);
  }

  async function compare(next: Selection, scroll = true) {
    if (!validAmount(next.amount) || !validAmount(next.distance) || Number(next.distance) > 100 || (next.banknote !== '' && (!validAmount(next.banknote) || Number(next.banknote)>1e6))) { setError(c.invalid); return; }
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    const id = ++request.current;
    const timer = setTimeout(() => abort.abort(), 20_000);
    setPending(true);
    setError('');
    setShowAll(false);
    trackEvent('comparison_started', { mode: next.mode, unit: next.unit, side: next.side, amount_bucket: amountBucket(next.amount) });
    const params = new URLSearchParams({ amount: next.amount });
    if (next.mode === 'cash') {
      params.set('side', next.side);
      if (next.banknote) params.set('banknote',next.banknote);
      params.set('currency', next.unit); params.set('maxDistanceKm', next.distance);
      if (next.coords) { params.set('userLat', String(next.coords.lat)); params.set('userLng', String(next.coords.lng)); }
    } else { params.set('symbol', next.unit); params.set('side', next.side); }
    try {
      const response = await fetch(`/api/compare/${next.mode}?${params}`, { signal: abort.signal });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error('comparison_failed');
      if (id !== request.current) return;
      setResult({ key: keyOf(next), mode: next.mode, selection: next,
        cash: next.mode === 'cash' ? payload.data.all : [], crypto: next.mode === 'crypto' ? payload.data : [], cacheStale: next.mode === 'cash' && payload.data.cacheStale });
      const publicParams = new URLSearchParams(params);
      publicParams.delete('userLat'); publicParams.delete('userLng');
      const campaigns=new URLSearchParams(window.location.search);
      for(const [key, values] of Object.entries({utm_source:['google','facebook','line','telegram','tiktok','x','qrcode','partner'],utm_medium:['organic','social','referral','email','cpc','offline'],utm_campaign:['exchange_thb_launch','cash_comparison','crypto_comparison']})) {const value=campaigns.get(key); if(value&&values.includes(value)) publicParams.set(key,value);}
      if (showModeSwitch) publicParams.set('mode', next.mode);
      window.history.replaceState(null, '', `${window.location.pathname}?${publicParams}`);
      trackEvent('comparison_success', { mode: next.mode, unit: next.unit, result_count: next.mode === 'cash' ? payload.data.all.length : payload.data.length });
      if (scroll && window.matchMedia('(max-width: 767px)').matches) resultsRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } catch {
      if (id === request.current) { setError(c.error); setResult(null); trackEvent('comparison_failed', { mode: next.mode }); }
    } finally {
      clearTimeout(timer);
      if (id === request.current) setPending(false);
    }
  }

  function submit(event: FormEvent) { event.preventDefault(); if (debounce.current) clearTimeout(debounce.current); void compare(selection, false); }
  function locate() {
    if (!navigator.geolocation) { setLocationError(c.locationError); return; }
    setLocating(true); setLocationError('');
    navigator.geolocation.getCurrentPosition((position) => {
      change({ coords: { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy } });
      setLocating(false); trackEvent('cash_location_enabled');
    }, () => { setLocating(false); setLocationError(c.locationError); }, { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 });
  }

  const matches = result?.key === keyOf(selection);
  const rows = matches && !pending ? (result!.mode === 'cash' ? result!.cash.filter(row => !openOnly || (row.isOpen && row.openingKnown !== false)) : result!.crypto) : [];
  const fresh = (row: CashRow | CryptoRow) => 'provider' in row
    ? row.current !== false && cashQuoteCurrent(row, quoteClock)
    : isFreshQuote(row.updatedAt, row.live, 'crypto', quoteClock);
  const current = rows.filter(fresh);
  const referenceRows = rows.filter(row => !fresh(row));
  if (selection.mode === 'cash' && nearest) {
    const byDistance = (a: CashRow | CryptoRow, b: CashRow | CryptoRow) => Number((b as CashRow).distanceKnown !== false) - Number((a as CashRow).distanceKnown !== false) || (a as CashRow).distanceKm - (b as CashRow).distanceKm;
    current.sort(byDistance);
    referenceRows.sort(byDistance);
  }
  const visibleCurrent = showAll ? current : current.slice(0, 3);
  const buying = selection.side === 'buy';

  function card(row: CashRow | CryptoRow, index: number, referenceOnly: boolean) {
    const cash = 'provider' in row ? row : null;
    const crypto = 'exchange' in row ? row : null;
    const provider = cash?.provider || crypto!.exchange;
    const slug = cash?.providerSlug || crypto!.slug;
    const value = cash ? cash.estimatedThb : buying ? crypto!.estimatedTotalCost : crypto!.estimatedReceive;
    const canRank = !referenceOnly && !nearest && (!crypto || (crypto.fillRatio >= 0.9999 && (!buying || crypto.estimatedReceive > 0))) && value > 0;
    return <article className={`quote-card ${canRank && index === 0 ? 'quote-card-first' : ''}`} key={`${slug}-${cash?.branchName || ''}-${cash?.denomination || ''}`}>
      <div className="quote-top"><div><h3>{provider}</h3><p>{cash ? `${cash.area} · ${cash.distanceKnown === false ? e.unknownDistance : `${number(cash.distanceKm, 1)} km · ${cash.distanceOrigin === 'user' ? lc.user : lc.reference}`}` : buying ? `THB → ${selection.unit}` : `${selection.unit} → THB`}</p></div>
        <span className={`quote-tag ${referenceOnly ? 'quote-tag-reference' : ''}`}>{referenceOnly ? c.cached : canRank && index === 0 ? crypto && crypto.feeStatus !== 'verified' ? e.marketBest : buying ? c.cheapest : c.bestLabel : c.fresh}</span></div>
      {cash && <p className="quote-status">{cash.openingKnown===false?c.hours:cash.isOpen ? c.open : c.closed} · {cash.distanceKnown===false?e.unknownDistance:selection.coords ? c.locationActive : c.reference}</p>}
      <div className="quote-value"><span>{buying ? c.payment : c.receive}{crypto&&crypto.fillRatio<0.999999 ? locale==='zh'?'（可成交部分）':locale==='th'?' (ส่วนที่ซื้อขายได้)':' (fillable portion)' : ''}</span><strong>฿{number(value)}{!buying && crypto?.estimatedReceiveMax !== undefined && crypto.estimatedReceiveMax > value ? `–${number(crypto.estimatedReceiveMax)}` : ''}</strong></div>
      {crypto && <dl className="quote-costs" aria-label={c.details}>
        <div><dt>{c.rate}</dt><dd>฿{number(crypto.averagePrice,4)} / {selection.unit}</dd></div>
        <div><dt>{c.trading}</dt><dd>{number(crypto.averagePrice*crypto.filledAmount>0?crypto.tradingFee/(crypto.averagePrice*crypto.filledAmount)*100:0,4)}% · {crypto.tradingFeeAsset ? `${number(crypto.tradingFeeAsset,8)} ${selection.unit} (≈ ฿${number(crypto.tradingFee)})` : `฿${number(crypto.tradingFee)}`}</dd></div>
        {!buying && <div><dt>{c.withdraw}</dt><dd>{crypto.thbWithdrawKnown===false?'—':`฿${crypto.thbWithdrawMin!==undefined&&crypto.thbWithdrawMin<crypto.thbWithdraw?`${number(crypto.thbWithdrawMin)}–`:''}${number(crypto.thbWithdraw)}`}</dd></div>}
        {buying && <><div><dt>{c.network}</dt><dd>{crypto.withdrawalFeeKnown===false?'—':`${number(crypto.networkFee,8)} ${selection.unit}`}</dd></div><div><dt>{c.assetReceive}</dt><dd>{number(crypto.estimatedReceive,8)} {selection.unit}</dd></div></>}
      </dl>}
      {crypto && crypto.fillRatio < 0.9999 && <p className="quote-warning">{c.fill}: {number(crypto.fillRatio * 100, 1)}% · {c.gap}: {number(crypto.liquidityGap, 8)} {selection.unit}</p>}
      {crypto && crypto.feeStatus !== 'verified' && <p className="quote-warning">{e.feeWarning}</p>}
      {crypto && buying && crypto.withdrawalFeeKnown === false && <p className="quote-warning">{e.unknownWithdrawal}</p>}
      {crypto && !buying && crypto.thbWithdrawKnown === false && <p className="quote-warning">{unknownFiatWithdrawal[locale]}</p>}
      {cash&&<p className="quote-warning">{c.banknote}: {banknoteLabel(cash.denomination, locale)}</p>}
      <p className="quote-time">{(cash?.timestampKind || crypto?.timestampKind) === 'published' ? e.published : e.collected} · {date(cash?.observedAt || crypto!.updatedAt, locale)}</p>
      <details className="quote-details" onToggle={event => { if (event.currentTarget.open) trackEvent('result_expanded', { mode: selection.mode, provider: slug, rank: index + 1 }); }}><summary>{c.details}</summary>
        <dl><div><dt>{c.rate}</dt><dd>{number(cash ? buying ? cash.sellRate || 0 : cash.buyRate : crypto!.averagePrice, 4)} THB / {selection.unit}</dd></div>
          {cash ? <><div><dt>{c.banknote}</dt><dd>{banknoteLabel(cash.denomination, locale)}</dd></div><div><dt>{c.hours}</dt><dd>{cash.hours}</dd></div><div><dt>{cash.distanceOrigin === 'user' ? lc.user : lc.reference}</dt><dd>{cash.branchName} · {cash.locationPrecision === 'reference' ? c.reference : cash.area}</dd></div></> : <>
            <div><dt>{c.trading}</dt><dd>{crypto!.tradingFeeAsset ? <>{number(crypto!.tradingFeeAsset, 8)} {selection.unit} (≈ ฿{number(crypto!.tradingFee)})</> : <>฿{number(crypto!.tradingFee)}</>}</dd></div><div><dt>{c.withdraw}</dt><dd>{crypto!.thbWithdrawKnown === false ? "—" : <>฿{crypto!.thbWithdrawMin !== undefined && crypto!.thbWithdrawMin < crypto!.thbWithdraw ? `${number(crypto!.thbWithdrawMin)}–` : ""}{number(crypto!.thbWithdraw)}</>}</dd></div>
            {buying && <><div><dt>{c.network}</dt><dd>{crypto!.withdrawalFeeKnown === false ? '—' : <>{number(crypto!.networkFee, 8)} {selection.unit}</>}</dd></div><div><dt>{c.assetReceive}</dt><dd>{number(crypto!.estimatedReceive, 8)} {selection.unit}</dd></div></>}
            <div><dt>{c.fill}</dt><dd>{number(crypto!.fillRatio * 100, 1)}%</dd></div></>}
        </dl><p className="evidence-note">{cash ? e.cashScope : (buying && crypto?.withdrawalFeeKnown === false) || (!buying && crypto?.thbWithdrawKnown === false) ? e.feeWarning : e.feeAssumption}</p>{cash?.sourceUrl&&<a className="quote-provider-link" href={cash.sourceUrl} target="_blank" rel="noopener noreferrer">{quoteSourceLabel[locale][referenceOnly ? 'reference' : 'current']} ↗</a>}{crypto&&<ExchangeBackground slug={slug} locale={locale}/>}<Link className="quote-provider-link" href={cash ? `/${locale}/money-changers/${slug}` : `/${locale}/exchanges/${slug}`}>{c.details} →</Link></details>
      <ProviderContext key={`${slug}-${cash?.branchId || ''}`} mode={cash?'cash':'crypto'} slug={slug} branchId={cash?.branchId} locale={locale}/>
      <div className="quote-actions">{cash && <a className="picker-action" target="_blank" rel="noopener noreferrer" href={cash.mapsUrl} onClick={() => trackEvent('map_click', { provider: slug })}>{c.map} ↗</a>}
        <a className={cash ? 'picker-secondary' : 'picker-action'} target="_blank" rel={crypto && crypto.affiliateStatus !== 'official_only' ? 'noopener noreferrer sponsored' : 'noopener noreferrer'} href={cash?.officialUrl || crypto!.affiliateUrl} onClick={() => trackEvent(crypto?.affiliateStatus !== 'official_only' && crypto ? 'affiliate_click' : 'official_click', { provider: slug, mode: selection.mode })}>{c.official} ↗</a>
      </div>
    </article>;
  }

  return <section className="exchange-picker" aria-label={c.results}>
    <form className="picker-form" onSubmit={submit}>
      {showModeSwitch && <div className="picker-mode" role="group" aria-label={ui ? ui.nav : locale === 'ja' ? '両替の種類' : locale === 'zh' ? '选择兑换方式' : locale === 'th' ? 'เลือกวิธีแลก' : 'Exchange type'}>{(['cash', 'crypto'] as const).map(mode => <button type="button" key={mode} aria-pressed={selection.mode === mode} className={selection.mode === mode ? 'selected' : ''} onClick={() => { change({ mode, unit: mode === 'cash' ? defaultCashCurrency(locale) : 'USDT', amount: '1000', side: 'sell', banknote: '' }); setOpenOnly(false); setNearest(false); }}><span>{mode === 'cash' ? '↔' : '◇'} {c[mode]}</span><small>{mode === 'cash' ? c.cashHint : c.cryptoHint}</small></button>)}</div>}
      <div className="picker-direction" role="group" aria-label={selection.mode==='cash'?c.cash:c.crypto}>{(['sell', 'buy'] as const).map(side => <button type="button" aria-pressed={selection.side === side} key={side} className={selection.side === side ? 'selected' : ''} onClick={() => change({ side })}>{selection.mode==='cash'?side==='buy'?e.cashBuy:e.cashSell:c[side]}</button>)}</div>
      <div className="picker-fields"><label><span>{selection.mode === 'cash' ? c.currency : c.asset}</span><select aria-label={selection.mode === 'cash' ? c.currency : c.asset} value={selection.unit} onChange={event => change({ unit: event.target.value, banknote: '' })}>{(selection.mode === 'cash' ? cashUnits : cryptoUnits).map((unit, i) => <option value={unit} key={unit}>{unit}{selection.mode === 'cash' ? ` · ${isAdditionalLocale(locale) ? new Intl.DisplayNames([locale], {type:'currency'}).of(unit) : currencyNames[locale][i]}` : ''}</option>)}</select></label>
        <label><span>{selection.mode === 'cash' ? c.amount : c.assetAmount}</span><div className="picker-amount"><input required aria-label={selection.mode === 'cash' ? c.amount : c.assetAmount} type="number" inputMode="decimal" min="0.00000001" step="any" value={selection.amount} onChange={event => change({ amount: event.target.value })} /><span>{selection.unit}</span></div></label></div>
      <p className="picker-route">{buying ? selection.mode==='cash'?e.buyNote:c.buyNote : `${selection.unit} → THB · ${c.valueRoute}`}</p>
      <p className="picker-auto-note">{ui ? ui.autoNote : locale === 'ja' ? '選択すると自動で比較します。ボタン操作は不要です。' : locale === 'zh' ? '选择后自动比较，无需点击按钮。' : locale === 'th' ? 'เปรียบเทียบอัตโนมัติเมื่อเปลี่ยนตัวเลือก' : 'Options update automatically as you choose.'}</p>
      {error && <button className="picker-submit" type="submit" disabled={pending}>{ui ? ui.retry : locale === 'ja' ? '再試行' : locale === 'zh' ? '重试' : locale === 'th' ? 'ลองอีกครั้ง' : 'Retry'}</button>}
      {selection.mode==='crypto'&&<label className="picker-check picker-auto"><input type="checkbox" checked={autoRefresh} onChange={event=>setAutoRefresh(event.target.checked)}/>{e.auto}</label>}
      {selection.mode === 'cash' && <div className="picker-location"><button type="button" className="picker-secondary" onClick={locate} disabled={locating}>{locating ? c.locating : c.location}</button><p>{selection.coords ? c.locationActive : c.reference}{selection.coords?.accuracy !== undefined && Number.isFinite(selection.coords.accuracy) && <> · {lc.precision} ±{new Intl.NumberFormat(locale, {maximumFractionDigits:0}).format(selection.coords.accuracy)} m</>}</p>{selection.coords?.accuracy !== undefined && selection.coords.accuracy > 1000 && <p role="status" className="quote-warning">{lc.low}</p>}{locationError && <p role="status" className="quote-warning">{locationError}</p>}</div>}
      {selection.mode === 'cash' && <details className="picker-options"><summary>{c.advanced}</summary><label><span>{c.distance} · km</span><input type="number" min="1" max="100" step="1" aria-label={c.distance} value={selection.distance} onChange={event => change({ distance: event.target.value })} /></label>
        <label><span>{c.banknote}</span><input type="number" aria-label={c.banknote} min="1" max="1000000" step="1" placeholder="100" value={selection.banknote} onChange={event=>change({banknote:event.target.value})}/></label>
        
        <label className="picker-check"><input type="checkbox" checked={openOnly} onChange={event => setOpenOnly(event.target.checked)} />{c.openOnly}</label>
        <label className="picker-check"><input type="checkbox" checked={nearest} onChange={event => setNearest(event.target.checked)} />{c.nearest}</label>
      </details>}
      {error && <p className="picker-error" role="alert">{error}</p>}
    </form>
    <div className="picker-results" ref={resultsRef} aria-busy={pending}>
      <div className="picker-results-heading"><h2>{c.results}</h2>{matches && !pending && <span>{result?.selection.amount} {result?.selection.unit}</span>}</div>
      <div role="status" aria-live="polite" className="picker-status">{pending ? c.loading : !matches ? result ? c.changed : c.ready : selection.mode === 'crypto' ? c.rankNote : c.note}</div>
      {pending && <div className="picker-skeleton" aria-hidden="true"><div /><div /><div /></div>}
      {!pending && matches && <>
        {visibleCurrent.map((row, index) => card(row, index, false))}
        {current.length > 3 && <button type="button" className="picker-more" onClick={() => setShowAll(!showAll)}>{showAll ? c.less : `${c.all} (${current.length - 3})`}</button>}
        {referenceRows.length > 0 && <details className="picker-reference" open={current.length === 0}><summary>{c.referenceResults} ({referenceRows.length})</summary><p className="quote-warning">{c.stale}</p>{referenceRows.map((row, index) => card(row, index, true))}</details>}
        {rows.length === 0 && <div className="picker-empty"><p>{selection.mode === 'cash' ? cashEmptyCopy[locale] : cryptoEmptyCopy[locale]}</p>{selection.mode === 'cash' && <Link href={`/${locale}/data-status`}>{c.details}</Link>}</div>}
      </>}
    </div>
    <div className="picker-notes">
      {selection.mode === 'cash' && <p className="picker-distance-note">{lc.straight}</p>}
      <p className="picker-disclaimer">{c.note} {ui ? ui.disclaimer : locale === 'ja' ? '当サイトは第三者の情報を比較するサービスです。両替、取引、入金受付、資金の保管は行いません。取引は利用者と第三者の間で行われます。為替・資産・取引先のリスクを確認してください。紹介リンクから報酬を受ける場合がありますが、順位には影響しません。' : locale === 'zh' ? '本站仅比较第三方信息，不提供换汇、交易、收款或资金保管服务。交易由你与第三方直接办理；汇率、资产及交易对手风险需自行评估。推广链接可能带来佣金，不影响排序。' : locale === 'th' ? 'เราเปรียบเทียบข้อมูลบุคคลที่สามเท่านั้น ไม่ให้บริการแลกเงิน ซื้อขาย รับเงิน หรือดูแลสินทรัพย์ คุณทำรายการกับผู้ให้บริการโดยตรงและควรประเมินความเสี่ยง ลิงก์แนะนำอาจให้ค่าตอบแทนแก่เราโดยไม่กระทบการจัดอันดับ' : 'We compare third-party information only. We do not exchange, trade, receive or custody funds. Transactions are directly with the provider; assess currency, asset and counterparty risks. Referral links may earn us commission without affecting ranking.'} <Link href={`/${locale}/legal/disclaimer`}>{ui ? ui.fullDisclaimer : locale === 'ja' ? '免責事項の全文' : locale === 'zh' ? '完整声明' : locale === 'th' ? 'อ่านข้อจำกัดความรับผิดชอบ' : 'Full disclaimer'}</Link></p>
    </div>
  </section>;
}
