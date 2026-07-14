'use client';

import { FormEvent, startTransition, useEffect, useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics-client';
import { ContentLocale, CryptoSymbol, CurrencyCode } from '@/lib/types';

type CryptoRow = {
  exchange: string;
  slug: string;
  estimatedReceive: number;
  estimatedTotalCost: number;
  averagePrice: number;
  fillRatio: number;
  tradingFee: number;
  thbWithdraw: number;
  updatedAt: string;
  source: string;
  live: boolean;
  freshness: string;
  affiliateUrl: string;
};

type CashRow = {
  provider: string;
  providerSlug: string;
  branchName: string;
  area: string;
  distanceKm: number;
  distanceOrigin: string;
  isOpen: boolean;
  hours: string;
  buyRate: number;
  estimatedThb: number;
  mapsUrl: string;
  officialUrl: string;
  observedAt: string;
  denomination: string;
  sourceType: 'live' | 'hybrid' | 'fallback';
};

type CashResult = {
  all: CashRow[];
  cacheGeneratedAt: string | null;
  cacheStale: boolean;
  distanceOrigin: string;
};

const copy = {
  en: {
    crypto: 'Crypto to THB',
    cash: 'Cash to THB',
    sell: 'Sell',
    amount: 'Amount',
    compare: 'Compare now',
    comparing: 'Updating…',
    bestResult: 'Best practical result',
    netReceive: 'Estimated net receive',
    totalCost: 'Estimated total cost',
    rate: 'Rate',
    difference: 'Difference from best',
    fee: 'Trading + THB withdrawal',
    updated: 'Observed',
    live: 'Live source',
    hybrid: 'Mixed source',
    fallback: 'Reviewed fallback',
    open: 'Open',
    verify: 'Verify hours',
    map: 'Open map',
    official: 'Official site',
    fullCrypto: 'Open full crypto comparison',
    fullCash: 'Open full cash comparison',
    referenceDistance: 'Reference distance from central Bangkok',
    error: 'Live comparison is temporarily unavailable. Try again shortly.',
    resultCount: 'Compared providers',
  },
  th: {
    crypto: 'คริปโตเป็น THB',
    cash: 'เงินสดเป็น THB',
    sell: 'ขาย',
    amount: 'จำนวน',
    compare: 'เปรียบเทียบตอนนี้',
    comparing: 'กำลังอัปเดต…',
    bestResult: 'ผลลัพธ์ที่ใช้งานได้ดีที่สุด',
    netReceive: 'ยอดรับสุทธิโดยประมาณ',
    totalCost: 'ต้นทุนรวมโดยประมาณ',
    rate: 'เรท',
    difference: 'ต่างจากอันดับแรก',
    fee: 'ค่าธรรมเนียม + ถอน THB',
    updated: 'สังเกตเมื่อ',
    live: 'ข้อมูลสด',
    hybrid: 'ข้อมูลผสม',
    fallback: 'ข้อมูลสำรองที่ตรวจแล้ว',
    open: 'เปิด',
    verify: 'ตรวจสอบเวลา',
    map: 'เปิดแผนที่',
    official: 'เว็บไซต์ทางการ',
    fullCrypto: 'เปิดหน้าคริปโตแบบเต็ม',
    fullCash: 'เปิดหน้าเงินสดแบบเต็ม',
    referenceDistance: 'ระยะอ้างอิงจากใจกลางกรุงเทพ',
    error: 'ข้อมูลเปรียบเทียบสดไม่พร้อมชั่วคราว โปรดลองอีกครั้ง',
    resultCount: 'จำนวนผู้ให้บริการ',
  },
  zh: {
    crypto: '加密资产换 THB',
    cash: '现金换 THB',
    sell: '卖出',
    amount: '金额',
    compare: '立即比较',
    comparing: '正在更新…',
    bestResult: '当前更实际的结果',
    netReceive: '预计净到手',
    totalCost: '预计总成本',
    rate: '汇率',
    difference: '与最优结果差额',
    fee: '交易费 + THB 提现费',
    updated: '观测时间',
    live: '实时来源',
    hybrid: '混合来源',
    fallback: '审核备用数据',
    open: '营业中',
    verify: '确认营业时间',
    map: '打开地图',
    official: '官方网站',
    fullCrypto: '打开完整加密比较',
    fullCash: '打开完整现金比较',
    referenceDistance: '距曼谷中心参考距离',
    error: '实时比较暂时不可用，请稍后再试。',
    resultCount: '已比较服务商',
  },
} as const;

function money(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);
}

function timeLabel(value: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(parsed);
}

function sourceLabel(locale: ContentLocale, sourceType: 'live' | 'hybrid' | 'fallback') {
  return copy[locale][sourceType];
}

export function HomeComparison({
  locale,
  initialCrypto,
  initialCash,
}: {
  locale: ContentLocale;
  initialCrypto: CryptoRow[];
  initialCash: CashResult;
}) {
  const c = copy[locale];
  const [mode, setMode] = useState<'cash' | 'crypto'>('cash');
  const [cryptoSymbol, setCryptoSymbol] = useState<CryptoSymbol>('USDT');
  const [cryptoAmount, setCryptoAmount] = useState('1000');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [cashAmount, setCashAmount] = useState('1000');
  const [cryptoRows, setCryptoRows] = useState(initialCrypto);
  const [cashResult, setCashResult] = useState(initialCash);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/compare/crypto?symbol=USDT&side=sell&amount=1000').then((response) => response.json()),
      fetch('/api/compare/cash?currency=USD&amount=1000&maxDistanceKm=20').then((response) => response.json()),
    ]).then(([cryptoPayload, cashPayload]) => {
      startTransition(() => {
        if (cryptoPayload.ok) setCryptoRows(cryptoPayload.data);
        if (cashPayload.ok) setCashResult(cashPayload.data);
      });
    }).catch(() => {
      // Build-time examples remain visible if a live refresh is temporarily unavailable.
    });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError('');
    trackEvent('homepage_comparison_started', {
      mode,
      symbol: mode === 'crypto' ? cryptoSymbol : currency,
      amount: mode === 'crypto' ? cryptoAmount : cashAmount,
    });

    try {
      const endpoint = mode === 'crypto'
        ? `/api/compare/crypto?symbol=${cryptoSymbol}&side=sell&amount=${encodeURIComponent(cryptoAmount)}`
        : `/api/compare/cash?currency=${currency}&amount=${encodeURIComponent(cashAmount)}&maxDistanceKm=20`;
      const response = await fetch(endpoint);
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'comparison_failed');

      startTransition(() => {
        if (mode === 'crypto') setCryptoRows(payload.data);
        else setCashResult(payload.data);
      });
      trackEvent('homepage_comparison_generated', {
        mode,
        result_count: mode === 'crypto' ? payload.data.length : payload.data.all.length,
      });
    } catch {
      setError(c.error);
    } finally {
      setPending(false);
    }
  }

  const bestCrypto = cryptoRows[0];
  const bestCash = cashResult.all[0];
  const fullHref = mode === 'crypto'
    ? `/${locale}/crypto?symbol=${cryptoSymbol}&side=sell&amount=${cryptoAmount}`
    : `/${locale}/cash?currency=${currency}&amount=${cashAmount}`;

  return (
    <div className="min-w-0 overflow-hidden rounded-[30px] border border-black/10 bg-[#f7f5ee] shadow-[0_30px_90px_rgba(5,18,13,0.18)]">
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <form onSubmit={submit} className="min-w-0 border-b border-black/10 bg-[#ece8dc] p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 p-1">
            {(['cash', 'crypto'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === item ? 'bg-[#123d2c] text-white' : 'text-[#536059] hover:text-[#123d2c]'
                }`}
              >
                {c[item]}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#657169]">
                {mode === 'crypto' ? c.sell : c.cash}
              </span>
              <select
                value={mode === 'crypto' ? cryptoSymbol : currency}
                onChange={(event) => mode === 'crypto'
                  ? setCryptoSymbol(event.target.value as CryptoSymbol)
                  : setCurrency(event.target.value as CurrencyCode)}
                className="mt-2 w-full appearance-none rounded-2xl border border-black/10 bg-white px-4 py-4 text-lg font-semibold text-[#11271e] outline-none ring-[#1c6b4a]/20 focus:ring-4"
              >
                {(mode === 'crypto' ? ['USDT', 'BTC', 'ETH', 'XRP', 'SOL', 'DOGE'] : ['USD', 'EUR', 'JPY', 'CNY', 'GBP']).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#657169]">{c.amount}</span>
              <div className="mt-2 flex overflow-hidden rounded-2xl border border-black/10 bg-white focus-within:ring-4 focus-within:ring-[#1c6b4a]/20">
                <input
                  type="number"
                  min="0.000001"
                  step="any"
                  value={mode === 'crypto' ? cryptoAmount : cashAmount}
                  onChange={(event) => mode === 'crypto' ? setCryptoAmount(event.target.value) : setCashAmount(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-2xl font-semibold tabular-nums text-[#11271e] outline-none"
                />
                <span className="flex items-center border-l border-black/10 px-4 font-semibold text-[#657169]">
                  {mode === 'crypto' ? cryptoSymbol : currency}
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-7 w-full rounded-2xl bg-[#123d2c] px-5 py-4 font-semibold text-white transition hover:bg-[#18583d] disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? c.comparing : c.compare}
          </button>

          <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5 text-xs text-[#657169]">
            <span>{c.resultCount}</span>
            <span className="font-semibold text-[#123d2c]">
              {mode === 'crypto' ? cryptoRows.length : cashResult.all.length}
            </span>
          </div>
        </form>

        <div className="min-w-0 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#657169]">{c.bestResult}</p>
              <p className="mt-2 text-xl font-semibold text-[#11271e]">
                {mode === 'crypto' ? bestCrypto?.exchange || '—' : bestCash?.provider || '—'}
              </p>
              <p className="mt-1 text-sm text-[#657169]">
                {mode === 'crypto' ? bestCrypto?.source : bestCash ? `${bestCash.area} · ${bestCash.hours}` : '—'}
              </p>
            </div>
            <span className="rounded-full bg-[#dcebdd] px-3 py-1.5 text-xs font-semibold text-[#18583d]">
              {mode === 'crypto'
                ? (bestCrypto?.live ? c.live : c.fallback)
                : bestCash ? sourceLabel(locale, bestCash.sourceType) : c.fallback}
            </span>
          </div>

          <div className="mt-8 border-y border-black/10 py-7">
            <p className="text-sm text-[#657169]">{mode === 'crypto' ? c.netReceive : c.netReceive}</p>
            <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
              <span className="text-4xl font-semibold tracking-[-0.04em] text-[#11271e] sm:text-6xl">
                ฿{money(mode === 'crypto' ? bestCrypto?.estimatedReceive || 0 : bestCash?.estimatedThb || 0)}
              </span>
              <span className="pb-2 text-sm font-semibold text-[#657169]">THB</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Metric
                label={mode === 'crypto' ? c.rate : c.rate}
                value={mode === 'crypto'
                  ? `฿${money(bestCrypto?.averagePrice || 0, 2)}`
                  : `${money(bestCash?.buyRate || 0, 4)}`}
              />
              <Metric
                label={mode === 'crypto' ? c.fee : c.referenceDistance}
                value={mode === 'crypto'
                  ? `฿${money((bestCrypto?.tradingFee || 0) + (bestCrypto?.thbWithdraw || 0), 2)}`
                  : `${money(bestCash?.distanceKm || 0, 1)} km`}
              />
              <Metric
                label={c.updated}
                value={timeLabel(mode === 'crypto' ? bestCrypto?.updatedAt || null : bestCash?.observedAt || cashResult.cacheGeneratedAt)}
              />
            </div>
          </div>

          {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <div className="mt-5 divide-y divide-black/10">
            {(mode === 'crypto' ? cryptoRows.slice(0, 3) : cashResult.all.slice(0, 3)).map((row, index) => {
              const name = mode === 'crypto' ? (row as CryptoRow).exchange : (row as CashRow).provider;
              const value = mode === 'crypto' ? (row as CryptoRow).estimatedReceive : (row as CashRow).estimatedThb;
              const bestValue = mode === 'crypto' ? bestCrypto?.estimatedReceive || value : bestCash?.estimatedThb || value;
              const delta = Math.max(0, bestValue - value);
              return (
                <div key={`${name}-${index}`} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-4 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e6e2d6] text-xs font-bold text-[#526159]">{index + 1}</span>
                      <p className="truncate font-semibold text-[#11271e]">{name}</p>
                    </div>
                    <p className="mt-1 pl-8 text-xs text-[#758078]">
                      {mode === 'crypto'
                        ? (row as CryptoRow).source
                        : `${(row as CashRow).area} · ${(row as CashRow).distanceKm.toFixed(1)} km`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums text-[#11271e]">฿{money(value)}</p>
                    <p className={`mt-1 text-xs ${delta === 0 ? 'text-[#1c6b4a]' : 'text-[#8a5c3b]'}`}>
                      {delta === 0 ? c.bestResult : `−฿${money(delta)}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={fullHref}
              onClick={() => trackEvent('homepage_full_comparison_click', { mode })}
              className="rounded-full bg-[#123d2c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#18583d]"
            >
              {mode === 'crypto' ? c.fullCrypto : c.fullCash}
            </Link>
            {mode === 'cash' && bestCash ? (
              <>
                <a
                  href={bestCash.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('homepage_best_map_click', { provider: bestCash.providerSlug })}
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#123d2c] hover:border-[#1c6b4a]/40"
                >
                  {c.map}
                </a>
                <a
                  href={bestCash.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('homepage_best_official_click', { provider: bestCash.providerSlug })}
                  className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-[#536059] hover:text-[#123d2c]"
                >
                  {c.official}
                </a>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#758078]">{label}</p>
      <p className="mt-1 font-semibold tabular-nums text-[#11271e]">{value}</p>
    </div>
  );
}
