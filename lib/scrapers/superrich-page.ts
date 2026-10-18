import { cashCurrencies, type CurrencyCode } from '../types';
import { plainText } from './additional-cash';
import type { ScrapedCashRate } from './cash';

export function parseSuperRichPage(html: string, fetchedAt = new Date().toISOString()): ScrapedCashRate[] {
  if (!Number.isFinite(Date.parse(fetchedAt))) return [];
  const table = [...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].find(match => /Currency\s+Denomination\s+Buying Rate\s+Selling Rate/i.test(plainText(match[1])));
  if (!table) return [];
  const supported = new Set<string>(cashCurrencies);
  const rates: ScrapedCashRate[] = [];
  let currency: CurrencyCode | undefined;
  for (const row of table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(cell => plainText(cell[1]).trim());
    if (cells.length === 4) {
      const symbol = cells.shift()?.match(/\b[A-Z]{3}\b/)?.[0];
      currency = symbol && supported.has(symbol) ? symbol as CurrencyCode : undefined;
    }
    if (!currency || cells.length !== 3) continue;
    const [denomination, buy, sell] = cells;
    const buyRate = Number(buy.replace(/,/g, ''));
    const sellRate = Number(sell.replace(/,/g, ''));
    if (!denomination || !Number.isFinite(buyRate) || buyRate <= 0 || !Number.isFinite(sellRate) || sellRate < buyRate) continue;
    rates.push({ providerSlug: 'superrich-thailand', currency, denomination, buyRate, sellRate, observedAt: fetchedAt, fetchedAt, timestampKind: 'collected', sourceKind: 'live', sourceUrl: 'https://www.superrichthailand.com' });
  }
  return rates;
}
