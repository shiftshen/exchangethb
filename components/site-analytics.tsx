'use client';
import { additionalCopy, isAdditionalLocale } from '@/lib/additional-copy';
import Script from 'next/script';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gaMeasurementId, gaScript } from '@/lib/analytics';
import { trackEvent,flushAnalyticsEvents } from '@/lib/analytics-client';
import type { Locale } from '@/lib/types';

export function SiteAnalytics({locale}:{locale:Locale}) {
  const pathname=usePathname();
  const [choice,setChoice]=useState<string|null>(null);
  const [ready,setReady]=useState(false);
  const lastView=useRef('');
  useEffect(()=>{try {setChoice(localStorage.getItem('exchangethb-analytics-consent') || 'pending');} catch {setChoice('declined');}},[]);
  useEffect(()=>{
    if(choice==='accepted'&&ready&&lastView.current!==pathname) { lastView.current=pathname; trackEvent('page_view',{page_location:location.origin+pathname,page_referrer:window.exchangeAnalyticsReferrer||'',locale}); }
  },[choice,ready,pathname,locale]);
  if(!gaMeasurementId) return null;
  const copy=isAdditionalLocale(locale)?additionalCopy[locale].consent:locale==='ja'?['比較体験の改善のため、利用状況の分析を許可しますか？','分析を許可','必要な機能のみ','分析設定']:locale==='zh'?['允许访问统计，帮助改进比较体验？','允许统计','仅必要功能','统计设置']:locale==='th'?['อนุญาตสถิติการใช้งานเพื่อปรับปรุงบริการหรือไม่','อนุญาต','เฉพาะที่จำเป็น','ตั้งค่าสถิติ']:['Allow usage analytics to improve comparisons?','Allow analytics','Essential only','Analytics settings'];
  function choose(value:string){try {localStorage.setItem('exchangethb-analytics-consent',value);} catch {return;} setChoice(value); window.gtag?.('consent','update',{analytics_storage:value==='accepted'?'granted':'denied'});}
  return <>
    {choice==='accepted'&&<><Script id="ga4-init" strategy="afterInteractive" onReady={()=>{flushAnalyticsEvents();setReady(true);}}>{gaScript()}</Script><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" /></>}
    {choice==='pending'?<div className="analytics-consent" role="region" aria-label={copy[3]}><p>{copy[0]}</p><button onClick={()=>choose('accepted')}>{copy[1]}</button><button onClick={()=>choose('declined')}>{copy[2]}</button></div>:choice&&<button className="analytics-settings" onClick={()=>setChoice('pending')}>{copy[3]}</button>}
  </>;
}
