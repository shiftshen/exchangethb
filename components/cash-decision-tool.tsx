'use client';

import { FormEvent, startTransition, useDeferredValue, useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics-client';
import { ContentLocale, CurrencyCode } from '@/lib/types';

type CashRow = {
  provider: string;
  providerSlug: string;
  branchName: string;
  area: string;
  distanceKm: number;
  distanceOrigin: string;
  locationPrecision: 'exact' | 'address' | 'reference';
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

export type CashDecisionResult = {
  all: CashRow[];
  cacheGeneratedAt: string | null;
  cacheStale: boolean;
  distanceOrigin: string;
  quality: {
    liveRows: number;
    hybridRows: number;
    fallbackRows: number;
    missingProviders: string[];
    anomalyCount: number;
  };
};

const copy = {
  en: {
    currency: 'Cash currency',
    amount: 'Amount',
    distance: 'Max distance',
    useLocation: 'Use my location',
    locating: 'Finding you…',
    locationActive: 'Using your real location',
    locationReference: 'Using central Bangkok reference',
    locationError: 'Location was not available. Reference distance remains active.',
    bestRate: 'Best net THB',
    nearest: 'Closest practical option',
    openOnly: 'Open now only',
    compare: 'Update comparison',
    updating: 'Updating…',
    rate: 'Buy rate',
    receive: 'Estimated receive',
    difference: 'less than best',
    distanceLabel: 'Distance',
    observed: 'Observed',
    denomination: 'Banknote',
    live: 'Live',
    hybrid: 'Hybrid',
    fallback: 'Fallback',
    open: 'Open now',
    closed: 'Closed now',
    map: 'Open map',
    official: 'Verify official rate',
    detail: 'Provider details',
    noResults: 'No matching open providers. Increase the distance or remove the open-now filter.',
    sourceNote: 'Source status and observation time are shown on every result. Counter rates can still change.',
    quality: 'Current data coverage',
    details: 'Show branch and source details',
  },
  th: {
    currency: 'สกุลเงินสด',
    amount: 'จำนวน',
    distance: 'ระยะสูงสุด',
    useLocation: 'ใช้ตำแหน่งของฉัน',
    locating: 'กำลังหาตำแหน่ง…',
    locationActive: 'กำลังใช้ตำแหน่งจริงของคุณ',
    locationReference: 'กำลังใช้จุดอ้างอิงกลางกรุงเทพ',
    locationError: 'ไม่สามารถใช้ตำแหน่งได้ ระบบยังใช้ระยะอ้างอิง',
    bestRate: 'THB สุทธิสูงสุด',
    nearest: 'ตัวเลือกใกล้ที่ใช้งานได้',
    openOnly: 'เฉพาะร้านที่เปิดตอนนี้',
    compare: 'อัปเดตการเปรียบเทียบ',
    updating: 'กำลังอัปเดต…',
    rate: 'เรตรับซื้อ',
    receive: 'ยอดรับโดยประมาณ',
    difference: 'น้อยกว่าอันดับแรก',
    distanceLabel: 'ระยะทาง',
    observed: 'สังเกตเมื่อ',
    denomination: 'ชนิดธนบัตร',
    live: 'สด',
    hybrid: 'ผสม',
    fallback: 'สำรอง',
    open: 'เปิดตอนนี้',
    closed: 'ปิดตอนนี้',
    map: 'เปิดแผนที่',
    official: 'ยืนยันเรททางการ',
    detail: 'รายละเอียดผู้ให้บริการ',
    noResults: 'ไม่พบร้านที่เปิดตามเงื่อนไข ลองเพิ่มระยะหรือปิดตัวกรองร้านที่เปิด',
    sourceNote: 'ทุกผลลัพธ์แสดงสถานะแหล่งข้อมูลและเวลาที่สังเกต เรทหน้าร้านอาจเปลี่ยนได้',
    quality: 'ความครอบคลุมข้อมูลปัจจุบัน',
    details: 'ดูรายละเอียดสาขาและแหล่งข้อมูล',
  },
  zh: {
    currency: '现金币种',
    amount: '金额',
    distance: '最大距离',
    useLocation: '使用我的位置',
    locating: '正在定位…',
    locationActive: '正在使用你的真实位置',
    locationReference: '正在使用曼谷中心参考点',
    locationError: '无法取得位置，继续使用参考距离。',
    bestRate: '净到手最高',
    nearest: '距离更近的实际选择',
    openOnly: '只看营业中的门店',
    compare: '更新比较',
    updating: '正在更新…',
    rate: '买入汇率',
    receive: '预计到手',
    difference: '比第一名少',
    distanceLabel: '距离',
    observed: '观测时间',
    denomination: '纸币条件',
    live: '实时',
    hybrid: '混合',
    fallback: '备用',
    open: '营业中',
    closed: '已打烊',
    map: '打开地图',
    official: '确认官方汇率',
    detail: '服务商详情',
    noResults: '没有符合条件且正在营业的门店，请增加距离或关闭营业筛选。',
    sourceNote: '每个结果都显示来源状态和观测时间，实际柜台汇率仍可能变化。',
    quality: '当前数据覆盖',
    details: '展开门店与来源详情',
  },
} as const;

function formatNumber(value: number, digits = 0) {
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

export function CashDecisionTool({
  locale,
  initialResult,
  initialCurrency,
  initialAmount,
  initialMaxDistance,
}: {
  locale: ContentLocale;
  initialResult: CashDecisionResult;
  initialCurrency: CurrencyCode;
  initialAmount: number;
  initialMaxDistance: number;
}) {
  const c = copy[locale];
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [amount, setAmount] = useState(String(initialAmount));
  const [maxDistance, setMaxDistance] = useState(String(initialMaxDistance));
  const [sort, setSort] = useState<'best' | 'nearest'>('best');
  const [openOnly, setOpenOnly] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [result, setResult] = useState(initialResult);
  const [pending, setPending] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const deferredOpenOnly = useDeferredValue(openOnly);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCurrency = params.get('currency') as CurrencyCode | null;
    const nextCurrency = requestedCurrency && ['USD', 'EUR', 'JPY', 'CNY', 'GBP'].includes(requestedCurrency) ? requestedCurrency : initialCurrency;
    const nextAmount = Number(params.get('amount')) > 0 ? String(params.get('amount')) : String(initialAmount);
    const nextDistance = Number(params.get('maxDistanceKm')) > 0 ? String(params.get('maxDistanceKm')) : String(initialMaxDistance);
    setCurrency(nextCurrency);
    setAmount(nextAmount);
    setMaxDistance(nextDistance);
    void refresh(null, 'best', { currency: nextCurrency, amount: nextAmount, maxDistance: nextDistance });
    // Initial refresh replaces build-time data with the current production snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(
    nextCoords = coords,
    nextSort = sort,
    overrides?: { currency?: CurrencyCode; amount?: string; maxDistance?: string },
  ) {
    const requestCurrency = overrides?.currency || currency;
    const requestAmount = overrides?.amount || amount;
    const requestDistance = overrides?.maxDistance || maxDistance;
    setPending(true);
    const params = new URLSearchParams({
      currency: requestCurrency,
      amount: requestAmount,
      maxDistanceKm: requestDistance,
      prioritizeNearest: String(nextSort === 'nearest'),
    });
    if (nextCoords) {
      params.set('userLat', String(nextCoords.lat));
      params.set('userLng', String(nextCoords.lng));
    }

    try {
      const response = await fetch(`/api/compare/cash?${params}`);
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'compare_failed');
      startTransition(() => setResult(payload.data));
      trackEvent('cash_comparison_generated', {
        currency: requestCurrency,
        amount: requestAmount,
        distance_km: requestDistance,
        sort: nextSort,
        location_mode: nextCoords ? 'user' : 'reference',
        result_count: payload.data.all.length,
        live_rows: payload.data.quality.liveRows,
        fallback_rows: payload.data.quality.fallbackRows,
      });
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    trackEvent('cash_comparison_started', { currency, amount, distance_km: maxDistance, sort });
    void refresh();
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError(c.locationError);
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoords(next);
        setLocating(false);
        trackEvent('cash_location_enabled', { accuracy_m: Math.round(position.coords.accuracy) });
        void refresh(next);
      },
      () => {
        setLocating(false);
        setLocationError(c.locationError);
        trackEvent('cash_location_failed');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  const rows = result.all.filter((row) => !deferredOpenOnly || row.isOpen);
  const bestValue = result.all.reduce((max, row) => Math.max(max, row.estimatedThb), 0);

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
      <form onSubmit={submit} className="h-fit rounded-[28px] border border-black/10 bg-[#ece8dc] p-5 text-[#11271e] lg:sticky lg:top-28">
        <div className="grid gap-5">
          <Field label={c.currency}>
            <select aria-label={c.currency} value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="decision-input">
              {['USD', 'EUR', 'JPY', 'CNY', 'GBP'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label={c.amount}>
            <input aria-label={c.amount} type="number" min="0.01" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} className="decision-input tabular-nums" />
          </Field>
          <Field label={c.distance}>
            <div className="flex overflow-hidden rounded-2xl border border-black/10 bg-white">
              <input aria-label={c.distance} type="number" min="1" max="100" value={maxDistance} onChange={(event) => setMaxDistance(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3 font-semibold outline-none" />
              <span className="border-l border-black/10 px-4 py-3 text-sm font-semibold text-[#657169]">km</span>
            </div>
          </Field>
        </div>

        <button type="button" onClick={requestLocation} disabled={locating} className="mt-5 w-full rounded-2xl border border-[#1c6b4a]/25 bg-white px-4 py-3 text-sm font-semibold text-[#18583d]">
          {locating ? c.locating : c.useLocation}
        </button>
        <p className="mt-2 text-xs text-[#657169]">{coords ? c.locationActive : c.locationReference}</p>
        {locationError ? <p className="mt-2 text-xs text-red-700">{locationError}</p> : null}

        <div className="mt-5 grid grid-cols-2 gap-2">
          {(['best', 'nearest'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSort(item);
                void refresh(coords, item);
              }}
              className={`rounded-xl px-3 py-2 text-xs font-semibold ${sort === item ? 'bg-[#123d2c] text-white' : 'bg-white text-[#657169]'}`}
            >
              {item === 'best' ? c.bestRate : c.nearest}
            </button>
          ))}
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={openOnly} onChange={(event) => setOpenOnly(event.target.checked)} className="h-4 w-4 accent-[#18583d]" />
          {c.openOnly}
        </label>

        <button type="submit" disabled={pending} className="mt-6 w-full rounded-2xl bg-[#123d2c] px-4 py-4 font-semibold text-white disabled:opacity-60">
          {pending ? c.updating : c.compare}
        </button>
      </form>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-400">{c.sourceNote}</p>
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-stone-300">
            {c.quality}: {result.quality.liveRows} {c.live} / {result.quality.fallbackRows} {c.fallback}
          </span>
        </div>

        {rows.length ? (
          <div className="grid gap-4">
            {rows.map((row, index) => {
              const delta = Math.max(0, bestValue - row.estimatedThb);
              return (
                <article key={`${row.providerSlug}-${row.branchName}-${row.denomination}`} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151a18]">
                  <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#24352d] text-xs font-bold text-[#9fd0b1]">{index + 1}</span>
                        <h2 className="text-xl font-semibold text-white">{row.provider}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.isOpen ? 'bg-emerald-500/10 text-emerald-300' : 'bg-stone-700 text-stone-300'}`}>
                          {row.isOpen ? c.open : c.closed}
                        </span>
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-stone-300">{c[row.sourceType]}</span>
                      </div>
                      <p className="mt-2 text-sm text-stone-400">{row.branchName} · {row.area}</p>
                      <p className="mt-1 text-xs text-stone-500">{row.hours}</p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{c.receive}</p>
                      <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-white">฿{formatNumber(row.estimatedThb)}</p>
                      <p className={`mt-1 text-xs ${delta === 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {delta === 0 ? c.bestRate : `−฿${formatNumber(delta)} ${c.difference}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-px border-y border-white/10 bg-white/10 sm:grid-cols-4">
                    <Metric label={c.rate} value={formatNumber(row.buyRate, 4)} />
                    <Metric label={c.distanceLabel} value={`${formatNumber(row.distanceKm, 1)} km`} />
                    <Metric label={c.denomination} value={row.denomination} />
                    <Metric label={c.observed} value={formatObserved(row.observedAt)} />
                  </div>

                  <details
                    className="border-b border-white/10 px-5 py-4 text-sm text-stone-300 sm:px-6"
                    onToggle={(event) => {
                      if (event.currentTarget.open) {
                        trackEvent('cash_result_expanded', {
                          provider: row.providerSlug,
                          rank: index + 1,
                          source_type: row.sourceType,
                          open_now: row.isOpen,
                        });
                      }
                    }}
                  >
                    <summary className="cursor-pointer font-semibold text-[#9fd0b1]">{c.details}</summary>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <p>{row.branchName} · {row.area}</p>
                      <p>{row.hours}</p>
                      <p>{c.observed}: {formatObserved(row.observedAt)}</p>
                      <p>{c.denomination}: {row.denomination}</p>
                    </div>
                  </details>

                  <div className="flex flex-wrap gap-3 p-5 sm:p-6">
                    <a href={row.mapsUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('cash_map_click', { provider: row.providerSlug, rank: index + 1, distance_km: row.distanceKm })} className="rounded-full bg-[#dcebdd] px-5 py-3 text-sm font-semibold text-[#18583d]">{c.map}</a>
                    <a href={row.officialUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('cash_official_click', { provider: row.providerSlug, rank: index + 1, source_type: row.sourceType })} className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">{c.official}</a>
                    <Link href={`/${locale}/money-changers/${row.providerSlug}`} onClick={() => trackEvent('cash_provider_detail_click', { provider: row.providerSlug, rank: index + 1 })} className="rounded-full px-4 py-3 text-sm font-semibold text-stone-400">{c.detail}</Link>
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
