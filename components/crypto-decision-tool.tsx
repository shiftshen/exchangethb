'use client';

import { FormEvent, startTransition, useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics-client';
import { ContentLocale, CryptoSymbol } from '@/lib/types';

type CryptoRow = {
  exchange: string;
  slug: string;
  estimatedReceive: number;
  estimatedTotalCost: number;
  averagePrice: number;
  requestedAmount: number;
  filledAmount: number;
  fillRatio: number;
  liquidityGap: number;
  tradingFee: number;
  networkFee: number;
  thbWithdraw: number;
  affiliateUrl: string;
  affiliateStatus: string;
  updatedAt: string;
  source: string;
  live: boolean;
  freshness: string;
  fallbackReason?: string;
};

export type CryptoDecisionResult = CryptoRow[];

const copy = {
  en: {
    symbol: 'Asset',
    side: 'Direction',
    buy: 'Buy with THB',
    sell: 'Sell to THB',
    amount: 'Asset amount',
    compare: 'Update comparison',
    updating: 'Updating…',
    receiveBuy: 'Estimated asset received',
    receiveSell: 'Estimated net THB',
    costBuy: 'Estimated THB payment',
    costSell: 'Total fees',
    average: 'Average execution',
    fees: 'Fees',
    depth: 'Market depth filled',
    gap: 'Liquidity gap',
    updated: 'Updated',
    live: 'Live',
    fallback: 'Fallback',
    best: 'Best practical result',
    differenceBuy: 'more than best',
    differenceSell: 'less than best',
    open: 'Open official exchange',
    detail: 'Exchange details',
    noResults: 'No market data is currently available for this route.',
    sourceNote: 'Rows are ranked by complete fills first, then by total cost for buys or net THB for sells.',
    calculation: 'Show fee and depth calculation',
  },
  th: {
    symbol: 'สินทรัพย์',
    side: 'ทิศทาง',
    buy: 'ซื้อด้วย THB',
    sell: 'ขายเป็น THB',
    amount: 'จำนวนสินทรัพย์',
    compare: 'อัปเดตการเปรียบเทียบ',
    updating: 'กำลังอัปเดต…',
    receiveBuy: 'สินทรัพย์ที่คาดว่าจะได้รับ',
    receiveSell: 'THB สุทธิโดยประมาณ',
    costBuy: 'ยอดจ่าย THB โดยประมาณ',
    costSell: 'ค่าธรรมเนียมรวม',
    average: 'ราคาเฉลี่ยที่คำนวณได้',
    fees: 'ค่าธรรมเนียม',
    depth: 'สัดส่วนที่เติมเต็ม',
    gap: 'ส่วนที่สภาพคล่องไม่พอ',
    updated: 'อัปเดต',
    live: 'สด',
    fallback: 'สำรอง',
    best: 'ผลลัพธ์ที่ใช้งานได้ดีที่สุด',
    differenceBuy: 'แพงกว่าอันดับแรก',
    differenceSell: 'น้อยกว่าอันดับแรก',
    open: 'เปิดเว็บเทรดทางการ',
    detail: 'รายละเอียดแพลตฟอร์ม',
    noResults: 'ขณะนี้ยังไม่มีข้อมูลตลาดสำหรับเส้นทางนี้',
    sourceNote: 'ระบบจัดอันดับจากการเติมเต็มก่อน แล้วจึงดูต้นทุนรวมสำหรับซื้อหรือ THB สุทธิสำหรับขาย',
    calculation: 'ดูการคำนวณค่าธรรมเนียมและ depth',
  },
  zh: {
    symbol: '资产',
    side: '方向',
    buy: '使用 THB 买入',
    sell: '卖出换 THB',
    amount: '资产数量',
    compare: '更新比较',
    updating: '正在更新…',
    receiveBuy: '预计获得资产',
    receiveSell: '预计净到手 THB',
    costBuy: '预计支付 THB',
    costSell: '总费用',
    average: '平均成交价',
    fees: '费用',
    depth: '订单簿成交率',
    gap: '流动性缺口',
    updated: '更新时间',
    live: '实时',
    fallback: '备用',
    best: '当前更实际的结果',
    differenceBuy: '比第一名多支付',
    differenceSell: '比第一名少获得',
    open: '打开官方交易所',
    detail: '交易所详情',
    noResults: '当前没有这条兑换路径的市场数据。',
    sourceNote: '排名先考虑能否完整成交，再比较买入总成本或卖出后的净 THB。',
    calculation: '展开费用与深度计算',
  },
} as const;

function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

function formatObserved(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(date);
}

export function CryptoDecisionTool({
  locale,
  initialResult,
  initialSymbol,
  initialSide,
  initialAmount,
}: {
  locale: ContentLocale;
  initialResult: CryptoDecisionResult;
  initialSymbol: CryptoSymbol;
  initialSide: 'buy' | 'sell';
  initialAmount: number;
}) {
  const c = copy[locale];
  const [symbol, setSymbol] = useState<CryptoSymbol>(initialSymbol);
  const [side, setSide] = useState<'buy' | 'sell'>(initialSide);
  const [amount, setAmount] = useState(String(initialAmount));
  const [result, setResult] = useState(initialResult);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedSymbol = params.get('symbol') as CryptoSymbol | null;
    const nextSymbol = requestedSymbol && ['USDT', 'BTC', 'ETH', 'XRP', 'SOL', 'DOGE'].includes(requestedSymbol) ? requestedSymbol : initialSymbol;
    const nextSide = params.get('side') === 'buy' ? 'buy' : initialSide;
    const nextAmount = Number(params.get('amount')) > 0 ? String(params.get('amount')) : String(initialAmount);
    setSymbol(nextSymbol);
    setSide(nextSide);
    setAmount(nextAmount);
    void refresh({ symbol: nextSymbol, side: nextSide, amount: nextAmount });
    // Initial refresh replaces build-time data with the current production snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(overrides?: { symbol?: CryptoSymbol; side?: 'buy' | 'sell'; amount?: string }) {
    const requestSymbol = overrides?.symbol || symbol;
    const requestSide = overrides?.side || side;
    const requestAmount = overrides?.amount || amount;
    setPending(true);
    setError('');
    try {
      const response = await fetch(`/api/compare/crypto?symbol=${requestSymbol}&side=${requestSide}&amount=${encodeURIComponent(requestAmount)}`);
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'compare_failed');
      startTransition(() => setResult(payload.data));
      trackEvent('crypto_comparison_generated', {
        symbol: requestSymbol,
        side: requestSide,
        amount: requestAmount,
        result_count: payload.data.length,
        live_rows: payload.data.filter((row: CryptoRow) => row.live).length,
        full_fill_rows: payload.data.filter((row: CryptoRow) => row.fillRatio >= 0.9999).length,
      });
    } catch {
      setError(c.noResults);
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    trackEvent('crypto_comparison_started', { symbol, side, amount });
    void refresh();
  }

  const best = result[0];
  const bestMetric = best ? (side === 'buy' ? best.estimatedTotalCost : best.estimatedReceive) : 0;

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
      <form onSubmit={submit} className="h-fit rounded-[28px] border border-black/10 bg-[#ece8dc] p-5 text-[#11271e] lg:sticky lg:top-28">
        <Field label={c.symbol}>
          <select aria-label={c.symbol} value={symbol} onChange={(event) => setSymbol(event.target.value as CryptoSymbol)} className="decision-input">
            {['USDT', 'BTC', 'ETH', 'XRP', 'SOL', 'DOGE'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#657169]">{c.side}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(['sell', 'buy'] as const).map((item) => (
              <button key={item} type="button" onClick={() => setSide(item)} className={`rounded-xl px-3 py-3 text-sm font-semibold ${side === item ? 'bg-[#123d2c] text-white' : 'bg-white text-[#657169]'}`}>
                {c[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Field label={c.amount}>
            <div className="flex overflow-hidden rounded-2xl border border-black/10 bg-white">
              <input aria-label={c.amount} type="number" min="0.00000001" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3 font-semibold tabular-nums outline-none" />
              <span className="border-l border-black/10 px-4 py-3 text-sm font-semibold text-[#657169]">{symbol}</span>
            </div>
          </Field>
        </div>

        <button type="submit" disabled={pending} className="mt-6 w-full rounded-2xl bg-[#123d2c] px-4 py-4 font-semibold text-white disabled:opacity-60">
          {pending ? c.updating : c.compare}
        </button>
      </form>

      <div className="min-w-0">
        <p className="mb-4 text-sm text-stone-400">{c.sourceNote}</p>
        {error ? <p className="mb-4 rounded-2xl bg-red-950/40 p-4 text-sm text-red-200">{error}</p> : null}

        {result.length ? (
          <div className="grid gap-4">
            {result.map((row, index) => {
              const metric = side === 'buy' ? row.estimatedTotalCost : row.estimatedReceive;
              const difference = side === 'buy' ? Math.max(0, metric - bestMetric) : Math.max(0, bestMetric - metric);
              const receive = side === 'buy' ? `${formatNumber(row.estimatedReceive, 8)} ${symbol}` : `฿${formatNumber(row.estimatedReceive)}`;
              const cost = side === 'buy' ? `฿${formatNumber(row.estimatedTotalCost)}` : `฿${formatNumber(row.estimatedTotalCost)}`;
              return (
                <article key={row.slug} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151a18]">
                  <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#24352d] text-xs font-bold text-[#9fd0b1]">{index + 1}</span>
                        <h2 className="text-xl font-semibold text-white">{row.exchange}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.live ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                          {row.live ? c.live : c.fallback}
                        </span>
                        {index === 0 ? <span className="rounded-full border border-[#76aa8b]/30 px-2.5 py-1 text-xs text-[#9fd0b1]">{c.best}</span> : null}
                      </div>
                      <p className="mt-2 text-sm text-stone-400">{row.source} · {row.freshness}</p>
                      {row.fallbackReason ? <p className="mt-1 text-xs text-amber-300">{row.fallbackReason}</p> : null}
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{side === 'buy' ? c.receiveBuy : c.receiveSell}</p>
                      <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-white">{receive}</p>
                      <p className={`mt-1 text-xs ${difference === 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {difference === 0 ? c.best : `${side === 'buy' ? '+' : '−'}฿${formatNumber(difference)} ${side === 'buy' ? c.differenceBuy : c.differenceSell}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-px border-y border-white/10 bg-white/10 sm:grid-cols-4">
                    <Metric label={side === 'buy' ? c.costBuy : c.costSell} value={cost} />
                    <Metric label={c.average} value={`฿${formatNumber(row.averagePrice, 4)}`} />
                    <Metric label={c.depth} value={`${formatNumber(row.fillRatio * 100, 2)}%`} />
                    <Metric label={c.updated} value={formatObserved(row.updatedAt)} />
                  </div>

                  <details
                    className="border-b border-white/10 p-5 text-sm text-stone-300 sm:p-6"
                    onToggle={(event) => {
                      if (event.currentTarget.open) {
                        trackEvent('crypto_result_expanded', {
                          exchange: row.slug,
                          rank: index + 1,
                          side,
                          symbol,
                          source_live: row.live,
                        });
                      }
                    }}
                  >
                    <summary className="cursor-pointer font-semibold text-[#9fd0b1]">{c.calculation}</summary>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <Detail label={c.fees} value={`Trade ฿${formatNumber(row.tradingFee)} · Network ${formatNumber(row.networkFee, 8)} · THB ฿${formatNumber(row.thbWithdraw)}`} />
                      <Detail label={c.gap} value={`${formatNumber(row.liquidityGap, 8)} ${symbol}`} />
                      <Detail label={c.depth} value={`${formatNumber(row.filledAmount, 8)} / ${formatNumber(row.requestedAmount, 8)} ${symbol}`} />
                    </div>
                  </details>

                  <div className="flex flex-wrap gap-3 p-5 sm:p-6">
                    <a href={row.affiliateUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('crypto_official_click', { exchange: row.slug, rank: index + 1, side, symbol, source_live: row.live })} className="rounded-full bg-[#dcebdd] px-5 py-3 text-sm font-semibold text-[#18583d]">{c.open}</a>
                    <Link href={`/${locale}/exchanges/${row.slug}`} onClick={() => trackEvent('crypto_exchange_detail_click', { exchange: row.slug, rank: index + 1 })} className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">{c.detail}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[#151a18] p-8 text-stone-300">{c.noResults}</div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#657169]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#111614] p-4">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 text-stone-300">{value}</p>
    </div>
  );
}
