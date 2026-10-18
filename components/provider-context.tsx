'use client';
import { additionalCopy } from '@/lib/additional-copy';
import { useState } from 'react';
import type { ContentLocale } from '@/lib/types';
import type { GooglePlaceResult } from '@/lib/google-places';
import type { providerEvidence } from '@/lib/provider-evidence';

const copy = {
 ru: additionalCopy.ru.provider,
 ko: additionalCopy.ko.provider,
 fr: additionalCopy.fr.provider,
 de: additionalCopy.de.provider,
 id: additionalCopy.id.provider,
 vi: additionalCopy.vi.provider,

 ja: {"title": "根拠とレビュー", "retry": "根拠を読み込む", "loading": "読み込み中…", "failed": "読み込めません。再試行してください。", "license": "免許の確認", "fees": "手数料の確認", "operations": "サービスの確認", "verified": "確認済み", "issue": "問題あり", "unknown": "未確認", "expired": "確認期限切れ", "not_configured": "Googleレビューは未接続です", "identity_unverified": "この支店のGoogle上の所在地は未確認です", "limited": "レビューの照会上限に達しました", "unavailable": "Googleレビューを利用できません", "reviewNote": "Googleは関連性のあるレビューを最大5件表示します。全件や最新順ではありません。", "original": "元のレビュー", "noRating": "評価なし", "all": "Google Mapsで見る", "date": "確認日", "source": "根拠を見る", "feeNote": "未確認の手数料は概算です。レビューは資金の安全性評価ではありません。"},
  zh: {title:'平台依据与口碑',retry:'加载依据',loading:'正在加载…',failed:'暂时无法加载，可重试。',license:'牌照核验',fees:'费用核验',operations:'服务状态核验',verified:'已核验',issue:'发现问题',unknown:'待核验',expired:'核验已过期',not_configured:'Google 口碑尚未接入',identity_unverified:'具体分店尚未匹配 Google 地点',limited:'评论查询暂时达到限额',unavailable:'Google 口碑暂不可用',reviewNote:'Google 按相关性提供最多5条评论，并非全部或最新评论。',original:'查看原评论',noRating:'暂无评分',all:'查看 Google Maps',date:'核验时间',source:'查看依据',feeNote:'未核验费用仅供估算；口碑不代表资金安全评级。'},
  en: {title:'Evidence and reviews',retry:'Load evidence',loading:'Loading…',failed:'Unable to load. Please retry.',license:'License check',fees:'Fee check',operations:'Service check',verified:'Verified',issue:'Issue found',unknown:'Not verified',expired:'Verification expired',not_configured:'Google reviews are not connected',identity_unverified:'This branch has not been matched to Google',limited:'Review query limit reached',unavailable:'Google reviews unavailable',reviewNote:'Google returns up to 5 relevant reviews, not all or the latest reviews.',original:'Original review',noRating:'No rating',all:'View on Google Maps',date:'Verified on',source:'View evidence',feeNote:'Unverified fees are estimates. Reviews do not rate fund safety.'},
  th: {title:'หลักฐานและรีวิว',retry:'โหลดข้อมูล',loading:'กำลังโหลด…',failed:'โหลดไม่ได้ โปรดลองอีกครั้ง',license:'ตรวจใบอนุญาต',fees:'ตรวจค่าธรรมเนียม',operations:'ตรวจบริการ',verified:'ตรวจสอบแล้ว',issue:'พบปัญหา',unknown:'ยังไม่ได้ตรวจ',expired:'การตรวจหมดอายุ',not_configured:'ยังไม่ได้เชื่อมรีวิว Google',identity_unverified:'ยังไม่ได้จับคู่สาขานี้กับ Google',limited:'ถึงขีดจำกัดการค้นรีวิว',unavailable:'รีวิว Google ไม่พร้อม',reviewNote:'Google ให้สูงสุด 5 รีวิวที่เกี่ยวข้อง ไม่ใช่รีวิวทั้งหมดหรือล่าสุด',original:'ดูรีวิวต้นฉบับ',noRating:'ไม่มีคะแนน',all:'ดูใน Google Maps',date:'วันที่ตรวจ',source:'ดูหลักฐาน',feeNote:'ค่าธรรมเนียมที่ยังไม่ตรวจเป็นประมาณการ รีวิวไม่ใช่คะแนนความปลอดภัยของเงิน'},
};
type Context = { evidence: ReturnType<typeof providerEvidence>; google: GooglePlaceResult | null };
export function ProviderContext({mode,slug,branchId,locale}:{mode:'cash'|'crypto';slug:string;branchId?:string;locale:ContentLocale}) {
  const c=copy[locale];const [data,setData]=useState<Context|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState(false);
  async function load() {
    if(busy)return;setBusy(true);setError(false);
    try {const p=await(await fetch(`/api/providers/${mode}/${slug}${branchId?`?branch=${encodeURIComponent(branchId)}`:''}`,{cache:'no-store',signal:AbortSignal.timeout(15000)})).json();if(!p.ok)throw Error();setData(p.data);}catch{setError(true);}finally{setBusy(false);}
  }
  return <details className="provider-context" onToggle={e=>{if(e.currentTarget.open&&!data&&!busy&&!error)void load();}}><summary>{c.title}</summary>
    {busy&&<p role="status">{c.loading}</p>}{error&&<><p role="alert">{c.failed}</p><button type="button" onClick={()=>void load()}>{c.retry}</button></>}
    {data&&<>{data.evidence.map(e=><div className="evidence-row" key={e.key}><strong>{c[e.key]}</strong><span>{c[e.state]}</span>{e.sourceUrl&&<a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">{c.source} ↗</a>}{e.checkedAt&&<small>{c.date}: {new Date(e.checkedAt).toLocaleDateString(locale==='ja'?'ja-JP':locale==='zh'?'zh-CN':locale==='th'?'th-TH':'en-GB')}</small>}{e.note&&<p>{e.note}</p>}</div>)}
    {data.google&& (data.google.status==='available'?<div className="google-content">
      <p className="google-attribution" translate="no">Google Maps</p><strong>{data.google.name}</strong><p>{data.google.address}</p><p>{data.google.rating===null?c.noRating:`★ ${data.google.rating} · ${data.google.count}`}</p>
      {data.google.mapsUrl&&<a href={data.google.mapsUrl} target="_blank" rel="noopener noreferrer">{c.all} ↗</a>}
      <p>{c.reviewNote}</p>{data.google.reviews.map((r,i)=><blockquote key={i}><div>{/* Google author imagery uses its original remote URL and is never downloaded. */}
        {r.avatar&&<span className="review-avatar" style={{backgroundImage:`url(${JSON.stringify(r.avatar)})`}} role="img" aria-label={r.author}/>}
        {r.authorUrl?<a href={r.authorUrl} target="_blank" rel="noopener noreferrer">{r.author}</a>:r.author} · {r.rating}/5</div><p>{r.text}</p>{r.publishedAt&&<small>{new Date(r.publishedAt).toLocaleDateString()}</small>} {r.url&&<a href={r.url} target="_blank" rel="noopener noreferrer">{c.original} ↗</a>}</blockquote>)}
      {data.google.attributions.map((a,i)=><small key={i}>{a.url?<a href={a.url} target="_blank" rel="noopener noreferrer">{a.provider}</a>:a.provider}</small>)}
    </div>:<p>{c[data.google.status]}</p>)}<p className="evidence-note">{c.feeNote}</p></>}
  </details>;
}
