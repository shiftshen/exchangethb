import { cashCurrencies, CurrencyCode } from '@/lib/types';
import { scrapeAdditionalCash } from '@/lib/scrapers/additional-cash';
import { sourceText } from '@/lib/source-http';

export interface ScrapedCashRate {
  providerSlug: string;
  currency: CurrencyCode;
  denomination: string;
  buyRate: number;
  sellRate: number;
  observedAt: string;
  sourceUrl: string;
  sourceKind?: 'live' | 'hybrid';
  fetchedAt?: string;
  timestampKind?: 'published' | 'collected';
}

export interface ScrapeResult {
  provider: string;
  ok: boolean;
  observedAt: string;
  notes: string[];
  rates?: ScrapedCashRate[];
  lastSuccessAt?: string;
}

export function extractRatchadaRates(html: string, fetchedAt = new Date().toISOString()): ScrapedCashRate[] {
  const publication = html.match(/getElementById\(['"]rateTime['"]\)\.innerHTML\s*=\s*['"](\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})['"]/);
  if (!publication) return [];
  const publishedTime = Date.parse(`${publication[1]}T${publication[2]}+07:00`);
  if (!Number.isFinite(publishedTime)) return [];
  const observedAt = new Date(publishedTime).toISOString();
  const rows = [...html.matchAll(/id="(USD|EUR|JPY|CNY|GBP|AUD|CAD|SGD|HKD|CHF|NZD|KRW|TWD|MYR|INR)"[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>(\d+\.\d{2,4})<\/td>\s*<td[^>]*>(\d+\.\d{2,4})<\/td>/gi)];
  return rows.map((match) => ({
    providerSlug: 'ratchada',
    currency: match[1] as CurrencyCode,
    denomination: match[2].trim(),
    buyRate: Number(match[3]),
    sellRate: Number(match[4]),
    observedAt,
    sourceUrl: 'https://www.ratchadaexchange.com/',
    sourceKind: 'live' as const,
    fetchedAt,
    timestampKind: 'published' as const,
  })).filter(row => Number.isFinite(row.buyRate) && row.buyRate > 0 && row.sellRate >= row.buyRate);
}

function extractSiaRates(html: string): ScrapedCashRate[] {
  const observedAt = new Date().toISOString();
  const supported = new Set<CurrencyCode>(cashCurrencies);
  const rows = [...html.matchAll(/<tr class="list-(?:over|none)">[\s\S]*?<td[^>]*align="center">([^<]+)<\/td>[\s\S]*?<td[^>]*align="center">([^<]+)<\/td>[\s\S]*?<td[^>]*class="show-rate"[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*class="show-rate"[^>]*>([^<]+)<\/td>[\s\S]*?<\/tr>/gi)];
  const output: ScrapedCashRate[] = [];

  for (const match of rows) {
    const currencyLabel = match[2].replace(/\s+/g, ' ').trim();
    const symbol = (currencyLabel.match(/USD|EUR|JPY|CNY|GBP|AUD|CAD|SGD|HKD|CHF|NZD|KRW|TWD|MYR|INR/) || [])[0] as CurrencyCode | undefined;
    if (!symbol || !supported.has(symbol)) continue;
    const buyRate = Number(match[3].trim());
    const sellRaw = match[4].trim();
    const sellRate = sellRaw === '-' ? 0 : Number(sellRaw);
    if (!Number.isFinite(buyRate) || buyRate <= 0) continue;
    output.push({
      providerSlug: 'sia',
      currency: symbol,
      denomination: currencyLabel.replace(symbol, '').replace('/', '').trim() || 'notes',
      buyRate,
      sellRate: Number.isFinite(sellRate) ? sellRate : 0,
      observedAt,
      sourceUrl: 'http://www.siamoneyexchange.com/rate/',
      sourceKind: 'live',
    });
  }

  return output;
}

async function fetchHtml(url: string) {
  return sourceText(url, 15000, {
    headers: { 'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0' },
    cache: 'no-store',
  });
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    const payload = response.ok ? await response.json() : null;
    return { ok: response.ok, status: response.status, json: async () => payload };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timeout ${url} after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function extractSuperrichThailandRates(payload: unknown): ScrapedCashRate[] {
  const observedAt = new Date().toISOString();
  const supported = new Set<CurrencyCode>(cashCurrencies);
  const rows = (payload as { data?: { exchangeRate?: Array<{ cUnit?: string; rate?: Array<{ cBuying?: number; cSelling?: number; denom?: string; dateTime?: string }> }> } })?.data?.exchangeRate;
  if (!Array.isArray(rows)) return [];
  const output: ScrapedCashRate[] = [];
  for (const row of rows) {
    const currency = row.cUnit as CurrencyCode;
    if (!supported.has(currency)) continue;
    for (const rate of row.rate || []) {
      const buyRate = Number(rate.cBuying);
      const sellRate = Number(rate.cSelling);
      if (!Number.isFinite(buyRate) || !Number.isFinite(sellRate) || buyRate <= 0 || sellRate <= 0) continue;
      output.push({
        providerSlug: 'superrich-thailand',
        currency,
        denomination: String(rate.denom || 'notes').replace(/\s+/g, ' ').trim() || 'notes',
        buyRate,
        sellRate,
        observedAt: typeof rate.dateTime === 'string' && Number.isFinite(Date.parse(rate.dateTime)) ? new Date(rate.dateTime).toISOString() : observedAt,
        sourceUrl: 'https://www.superrichthailand.com/api/v1/rates',
        sourceKind: 'live',
        fetchedAt: observedAt,
        timestampKind: typeof rate.dateTime === 'string' && Number.isFinite(Date.parse(rate.dateTime)) ? 'published' : 'collected',
      });
    }
  }
  return output;
}

export async function scrapeRatchada(): Promise<ScrapeResult> {
  try {
    const html = await fetchHtml('https://www.ratchadaexchange.com/');
    const rates = extractRatchadaRates(html);
    return { provider: 'ratchada', ok: rates.length > 0, observedAt: new Date().toISOString(), notes: [`Parsed ${rates.length} rate rows from official page.`], rates };
  } catch (error) {
    return { provider: 'ratchada', ok: false, observedAt: new Date().toISOString(), notes: [error instanceof Error ? error.message : 'Unknown scrape error'] };
  }
}

export async function scrapeSuperrichThailand(): Promise<ScrapeResult> {
  try {
    const response = await fetchWithTimeout('https://www.superrichthailand.com/api/v1/rates', {
      headers: {
        'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0',
        ...(process.env.SUPERRICH_TH_AUTHORIZATION ? { authorization: process.env.SUPERRICH_TH_AUTHORIZATION } : {}),
      },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Failed https://www.superrichthailand.com/api/v1/rates: ${response.status}`);
    const payload = await response.json();
    const rates = extractSuperrichThailandRates(payload);
    return { provider: 'superrich-thailand', ok: rates.length > 0, observedAt: new Date().toISOString(), notes: [`Parsed ${rates.length} structured rate rows from official API.`], rates };
  } catch (error) {
    return { provider: 'superrich-thailand', ok: false, observedAt: new Date().toISOString(), notes: [error instanceof Error ? error.message : 'Unknown scrape error'] };
  }
}

export async function scrapeSia(): Promise<ScrapeResult> {
  try {
    const html = await fetchHtml('http://www.siamoneyexchange.com/rate/');
    const rates = extractSiaRates(html);
    return {
      provider: 'sia',
      ok: rates.length > 0,
      observedAt: new Date().toISOString(),
      notes: [`Parsed ${rates.length} rate rows from official rate page over HTTP.`],
      rates,
    };
  } catch (error) {
    return { provider: 'sia', ok: false, observedAt: new Date().toISOString(), notes: [error instanceof Error ? error.message : 'Unknown scrape error'] };
  }
}

export async function scrapeSuperrich1965(): Promise<ScrapeResult> {
  const observedAt = new Date().toISOString();
  const supported = new Set<CurrencyCode>(cashCurrencies);
  const normalizeDenomination = (value: string) => value.replace(/\s+/g, '').replace(/–/g, '-').toUpperCase();
  try {
    const guestTokenResponse = await fetchWithTimeout('https://superrichrate2.ztidev.com/superRich/getGuestToken', {
      headers: { 'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0' },
      cache: 'no-store',
    });
    if (!guestTokenResponse.ok) {
      return {
        provider: 'superrich-1965',
        ok: false,
        observedAt,
        notes: [`Guest token endpoint unavailable: ${guestTokenResponse.status}`],
      };
    }
    const guestTokenPayload = await guestTokenResponse.json() as { data?: string };
    const token = guestTokenPayload.data;
    if (!token) {
      return {
        provider: 'superrich-1965',
        ok: false,
        observedAt,
        notes: ['Guest token endpoint returned empty token.'],
      };
    }
    const locationsResponse = await fetchWithTimeout('https://superrichrate2.ztidev.com/superRich/getLocationsRate?isBooking=0&page=0&sizeContents=100', {
      headers: {
        'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0',
        token,
      },
      cache: 'no-store',
    });
    const bookingPages: Array<{ data?: { content?: Array<{ rateUpdateDate?: number; updateDate?: number; createDate?: number; currencyList?: Array<{ currencyCode?: string; denominationList?: Array<{ denom?: string; sell?: string; buy?: string }> }> }> } }> = [];
    for (let page = 0; page < 6; page += 1) {
      const bookingsResponse = await fetchWithTimeout(`https://superrichrate2.ztidev.com/superRich/getBooking?page=${page}&sizeContents=100`, {
        headers: {
          'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0',
          token,
        },
        cache: 'no-store',
      });
      if (!bookingsResponse.ok) break;
      const payload = await bookingsResponse.json() as { data?: { content?: Array<{ rateUpdateDate?: number; updateDate?: number; createDate?: number; currencyList?: Array<{ currencyCode?: string; denominationList?: Array<{ denom?: string; sell?: string; buy?: string }> }> }> } };
      const rows = payload.data?.content || [];
      if (!rows.length) break;
      bookingPages.push(payload);
      if (rows.length < 100) break;
    }
    if (!locationsResponse.ok || !bookingPages.length) {
      return {
        provider: 'superrich-1965',
        ok: false,
        observedAt,
        notes: [
          `Guest feed request failed: locations ${locationsResponse.status}, bookings unavailable.`,
          'Superrich-1965 keeps public booking feed available but can still block some requests by account state.',
        ],
      };
    }
    const locationsPayload = await locationsResponse.json() as { data?: { content?: Array<{ dynLastUpdate?: string }> } };
    const latestSellMap = new Map<string, { sellRate: number; buyRate: number; timestamp: number; denomination: string; currency: CurrencyCode }>();
    for (const pagePayload of bookingPages) {
      for (const booking of pagePayload.data?.content || []) {
        const timestamp = Number(booking.rateUpdateDate || booking.updateDate || booking.createDate);
        if (!Number.isFinite(timestamp) || timestamp <= 0) continue;
        for (const currencyRow of booking.currencyList || []) {
          const currency = currencyRow.currencyCode as CurrencyCode;
          if (!supported.has(currency)) continue;
          for (const denomRow of currencyRow.denominationList || []) {
            const denomination = String(denomRow.denom || '').trim();
            const normalizedDenomination = normalizeDenomination(denomination);
            const sellRate = Number(denomRow.sell);
            const buyRate = Number(denomRow.buy);
            if (!normalizedDenomination || !Number.isFinite(sellRate) || sellRate <= 0 || !Number.isFinite(buyRate) || buyRate <= 0 || buyRate > sellRate) continue;
            const key = `${currency}:${normalizedDenomination}`;
            const previous = latestSellMap.get(key);
            if (!previous || timestamp > previous.timestamp) {
              latestSellMap.set(key, { sellRate, buyRate, timestamp, denomination, currency });
            }
          }
        }
      }
    }
    const mergedRows = new Map<string, ScrapedCashRate & { __ts: number }>();
    for (const [key, sell] of latestSellMap.entries()) {
      const rowKey = key;
      const candidate: ScrapedCashRate & { __ts: number } = {
        providerSlug: 'superrich-1965',
        currency: sell.currency,
        denomination: sell.denomination,
        buyRate: sell.buyRate,
        sellRate: sell.sellRate,
        observedAt: new Date(sell.timestamp).toISOString(),
        sourceUrl: 'https://superrichrate2.ztidev.com/superRich/getBooking (guest feed)',
        sourceKind: 'live',
        __ts: sell.timestamp,
      };
      const existing = mergedRows.get(rowKey);
      if (!existing || candidate.__ts > existing.__ts) mergedRows.set(rowKey, candidate);
    }
    const rates = [...mergedRows.values()].map((row): ScrapedCashRate => ({
      providerSlug: row.providerSlug,
      currency: row.currency,
      denomination: row.denomination,
      buyRate: row.buyRate,
      sellRate: row.sellRate,
      observedAt: row.observedAt,
      sourceUrl: row.sourceUrl,
      sourceKind: row.sourceKind,
    }));
    const latestDynUpdate = (locationsPayload.data?.content || [])
      .map((row) => row.dynLastUpdate)
      .filter((value): value is string => Boolean(value))
      .sort()
      .pop();
    return {
      provider: 'superrich-1965',
      ok: rates.length > 0,
      observedAt,
      notes: [
        `Parsed ${rates.length} two-sided rows from official guest booking feed.`,
        'Rows without official buy and sell prices or a published timestamp are excluded; no spread-derived prices.',
        latestDynUpdate ? `Latest branch rate update marker: ${latestDynUpdate}` : 'No branch update marker in guest feed.',
      ],
      rates,
    };
  } catch (error) {
    return { provider: 'superrich-1965', ok: false, observedAt, notes: [error instanceof Error ? error.message : 'Unknown scrape error'] };
  }
}

export async function runCashScrapers(): Promise<ScrapeResult[]> {
  return Promise.all([scrapeRatchada(), scrapeSuperrichThailand(), scrapeSuperrich1965(), scrapeAdditionalCash('twelve-victory')]);
}
