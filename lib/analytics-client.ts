'use client';

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: EventParams) => void;
    exchangeAnalyticsReferrer?: string;
    exchangeAnalyticsQueue?: Array<{name:string;params:EventParams}>;
  }
}

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === 'undefined') return;
  try { if (window.localStorage.getItem('exchangethb-analytics-consent') !== 'accepted') return; } catch { return; }
  params = {...params,...(window.location ? {page_location:window.location.origin+window.location.pathname} : {})};
  if (typeof window.gtag !== 'function') { window.exchangeAnalyticsQueue ||= []; if(window.exchangeAnalyticsQueue.length<20) window.exchangeAnalyticsQueue.push({name:eventName,params:safeAnalyticsParams(params)}); return; }
  window.gtag('event', eventName, safeAnalyticsParams(params));
}

export function flushAnalyticsEvents() {
  const queue=window.exchangeAnalyticsQueue || []; window.exchangeAnalyticsQueue=[];
  for(const event of queue) trackEvent(event.name,event.params);
}

const allowed = new Set(['mode','unit','side','amount_bucket','result_count','provider','rank','locale','from_locale','to_locale','page_location','page_referrer','debug_mode']);
export function safeAnalyticsParams(params?: EventParams): EventParams {
  return Object.fromEntries(Object.entries(params || {}).filter(([key,value])=>allowed.has(key)&&value!==undefined&&String(value).length<=150).map(([key,value])=>[key,key==='page_location' ? String(value).split(/[?#]/)[0] : key==='page_referrer' ? safeReferrer(String(value)) : value]));
}

function safeReferrer(value: string) {
  try {const url=new URL(value); return ['google.com','google.co.th','facebook.com','t.co','line.me','tiktok.com','t.me'].some(host=>url.hostname===host||url.hostname.endsWith('.'+host)) ? url.origin : '';} catch {return '';}
}
