import { cashCurrencies, type CurrencyCode } from '@/lib/types';
import type { ScrapedCashRate, ScrapeResult } from '@/lib/scrapers/cash';
import { sourceText } from '@/lib/source-http';

const units: CurrencyCode[] = [...cashCurrencies];
export function plainText(html: string) {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function isoTime(value: string) { const date=new Date(value); return Number.isFinite(date.getTime()) ? date.toISOString() : null; }

export function publicationTime(html: string) {
  const text = plainText(html);
  const iso = text.match(/Latest\s+Update\s*:?\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2})?)/i);
  if (iso) return isoTime(`${iso[1]}T${iso[2].length === 5 ? `${iso[2]}:00` : iso[2]}+07:00`);
  const named = text.match(/Latest\s+Update\s*:?\s*(?:\w+\s+)?(\d{1,2})\s+(\w+)\s+(\d{4})\s*-?\s*(\d{2}:\d{2})/i);
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  if (named) {
    const month = months.indexOf(named[2].toLowerCase()) + 1;
    if (month) return isoTime(`${named[3]}-${String(month).padStart(2,'0')}-${named[1].padStart(2,'0')}T${named[4]}:00+07:00`);
  }
  return null;
}

export function parseAdditionalCash(html: string, providerSlug: 'vasu' | 'twelve-victory', now = new Date().toISOString()): ScrapedCashRate[] {
  const observedAt = publicationTime(html);
  // A missing official publication marker must never be replaced by the fetch time.
  if (!observedAt) return [];
  const sourceUrl = providerSlug === 'vasu' ? 'https://www.vasuexchange.co.th/' : 'https://www.twelvevictory.com/en';
  const rows: ScrapedCashRate[] = [];
  for (const match of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(cell => plainText(cell[1]));
    const currency = units.find(unit => new RegExp(`\\b${unit}\\b`).test(cells.join(' ')));
    const numeric = cells.map((text,index)=>({ value:Number(text.replace(/,/g,'')),index })).filter(row=>Number.isFinite(row.value)&&row.value>0);
    if (!currency || numeric.length < 2) continue;
    const [buy,sell] = numeric.slice(-2);
    if (sell.value < buy.value) continue;
    const denomination = cells.slice(0,buy.index).reverse().find(cell=>/\d/.test(cell)) || 'Official headline rate; banknote must be confirmed';
    rows.push({ providerSlug,currency,denomination,buyRate:buy.value,sellRate:sell.value,observedAt,sourceUrl,sourceKind:'live',fetchedAt:now,timestampKind:'published' });
  }
  if (providerSlug === 'twelve-victory' && !rows.length) {
    const text=plainText(html);
    for (const currency of units) {
      const match=text.match(new RegExp(`\\b${currency}\\b(?:(?!\\b(?:USD|EUR|JPY|CNY|GBP|AUD|CAD|SGD|HKD|CHF|NZD|KRW|TWD|MYR|INR)\\b).){0,100}?Buying\\s+([\\d,.]+)\\s+Selling\\s+([\\d,.]+)`,'i'));
      if (!match) continue;
      const buyRate=Number(match[1].replace(/,/g,'')),sellRate=Number(match[2].replace(/,/g,''));
      if (buyRate>0&&sellRate>=buyRate) rows.push({providerSlug,currency,denomination:'Official headline rate; banknote must be confirmed',buyRate,sellRate,observedAt,sourceUrl,sourceKind:'live',fetchedAt:now,timestampKind:'published'});
    }
  }
  return rows;
}

export async function scrapeAdditionalCash(provider: 'vasu' | 'twelve-victory'): Promise<ScrapeResult> {
  const url=provider==='vasu'?'https://www.vasuexchange.co.th/':'https://www.twelvevictory.com/en';
  try {
    const html=await sourceText(url);
    const rates=parseAdditionalCash(html,provider);
    return {provider,ok:rates.length>0,observedAt:new Date().toISOString(),rates,notes:[rates.length?`Parsed ${rates.length} official published rates; scope is the listed head office.`:'No valid rate table or official publication timestamp found.']};
  } catch { return {provider,ok:false,observedAt:new Date().toISOString(),notes:['Official source unavailable; no new rates accepted.']}; }
}
