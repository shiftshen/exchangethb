import { cashBranches, cashRates } from '@/data/site';
import { CurrencyCode } from '@/lib/types';

export interface ScrapedCashRate {
  providerSlug: string;
  currency: CurrencyCode;
  denomination: string;
  buyRate: number;
  sellRate: number;
  observedAt: string;
  sourceUrl: string;
  sourceKind?: 'live' | 'hybrid';
}

export interface ScrapeResult {
  provider: string;
  ok: boolean;
  observedAt: string;
  notes: string[];
  rates?: ScrapedCashRate[];
}

function stripText(html: string) {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractRatchadaRates(html: string): ScrapedCashRate[] {
  const observedAt = new Date().toISOString();
  const rows = [...html.matchAll(/id="(USD|EUR|GBP|JPY|CNY)"[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>(\d+\.\d{2,4})<\/td>\s*<td[^>]*>(\d+\.\d{2,4})<\/td>/gi)];
  return rows.map((match) => ({
    providerSlug: 'ratchada',
    currency: match[1] as CurrencyCode,
    denomination: match[2].trim(),
    buyRate: Number(match[3]),
    sellRate: Number(match[4]),
    observedAt,
    sourceUrl: 'https://www.ratchadaexchange.com/',
  }));
}

function extractSiaRates(html: string): ScrapedCashRate[] {
  const observedAt = new Date().toISOString();
  const supported = new Set<CurrencyCode>(['USD', 'CNY', 'EUR', 'JPY', 'GBP']);
  const rows = [...html.matchAll(/<tr class="list-(?:over|none)">[\s\S]*?<td[^>]*align="center">([^<]+)<\/td>[\s\S]*?<td[^>]*align="center">([^<]+)<\/td>[\s\S]*?<td[^>]*class="show-rate"[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*class="show-rate"[^>]*>([^<]+)<\/td>[\s\S]*?<\/tr>/gi)];
  const output: ScrapedCashRate[] = [];

  for (const match of rows) {
    const currencyLabel = match[2].replace(/\s+/g, ' ').trim();
    const symbol = (currencyLabel.match(/USD|CNY|EUR|JPY|GBP/) || [])[0] as CurrencyCode | undefined;
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
  const response = await fetchWithTimeout(url, {
    headers: { 'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
  return response.text();
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
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
  const supported = new Set<CurrencyCode>(['USD', 'CNY', 'EUR', 'JPY', 'GBP']);
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
        observedAt: typeof rate.dateTime === 'string' ? new Date(rate.dateTime).toISOString() : observedAt,
        sourceUrl: 'https://www.superrichthailand.com/api/v1/rates',
        sourceKind: 'live',
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
        authorization: 'Basic c3VwZXJyaWNoVGg6aFRoY2lycmVwdXM=',
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
  const supported = new Set<CurrencyCode>(['USD', 'CNY', 'EUR', 'JPY', 'GBP']);
  const spreadTemplate: Record<CurrencyCode, number> = {
    USD: 0.16,
    CNY: 0.12,
    EUR: 0.2,
    JPY: 0.002,
    GBP: 0.25,
  };
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
    const bookingPages: Array<{ data?: { content?: Array<{ rateUpdateDate?: number; updateDate?: number; createDate?: number; currencyList?: Array<{ currencyCode?: string; denominationList?: Array<{ denom?: string; sell?: string }> }> }> } }> = [];
    for (let page = 0; page < 6; page += 1) {
      const bookingsResponse = await fetchWithTimeout(`https://superrichrate2.ztidev.com/superRich/getBooking?page=${page}&sizeContents=100`, {
        headers: {
          'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0',
          token,
        },
        cache: 'no-store',
      });
      if (!bookingsResponse.ok) break;
      const payload = await bookingsResponse.json() as { data?: { content?: Array<{ rateUpdateDate?: number; updateDate?: number; createDate?: number; currencyList?: Array<{ currencyCode?: string; denominationList?: Array<{ denom?: string; sell?: string }> }> }> } };
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
    const fallbackRows = cashRates
      .filter((rate) => {
        const branch = cashBranches.find((entry) => entry.id === rate.branchId);
        return branch?.providerSlug === 'superrich-1965' && supported.has(rate.currency);
      })
      .map((rate) => {
        const branch = cashBranches.find((entry) => entry.id === rate.branchId)!;
        return {
          currency: rate.currency,
          denomination: rate.denomination,
          normalizedDenomination: normalizeDenomination(rate.denomination),
          buyRate: rate.buyRate,
          sellRate: rate.sellRate,
          branchId: branch.id,
        };
      });
    const fallbackMap = new Map(fallbackRows.map((row) => [`${row.currency}:${row.normalizedDenomination}`, row]));
    const fallbackByCurrency = new Map<CurrencyCode, (typeof fallbackRows)[number]>();
    for (const row of fallbackRows) {
      const existing = fallbackByCurrency.get(row.currency);
      if (!existing || row.buyRate > existing.buyRate) fallbackByCurrency.set(row.currency, row);
    }
    const latestSellMap = new Map<string, { sellRate: number; timestamp: number; denomination: string; currency: CurrencyCode }>();
    for (const pagePayload of bookingPages) {
      for (const booking of pagePayload.data?.content || []) {
        const timestamp = Number(booking.rateUpdateDate || booking.updateDate || booking.createDate || Date.now());
        for (const currencyRow of booking.currencyList || []) {
          const currency = currencyRow.currencyCode as CurrencyCode;
          if (!supported.has(currency)) continue;
          for (const denomRow of currencyRow.denominationList || []) {
            const denomination = String(denomRow.denom || '').trim();
            const normalizedDenomination = normalizeDenomination(denomination);
            const sellRate = Number(denomRow.sell);
            if (!normalizedDenomination || !Number.isFinite(sellRate) || sellRate <= 0) continue;
            const key = `${currency}:${normalizedDenomination}`;
            const previous = latestSellMap.get(key);
            if (!previous || timestamp > previous.timestamp) {
              latestSellMap.set(key, { sellRate, timestamp, denomination, currency });
            }
          }
        }
      }
    }
    const mergedRows = new Map<string, ScrapedCashRate & { __ts: number }>();
    for (const [key, sell] of latestSellMap.entries()) {
      const fallback = fallbackMap.get(key) || fallbackByCurrency.get(sell.currency);
      const rowKey = `${sell.currency}:${(fallback?.denomination || sell.denomination || 'notes')}`;
      const spread = Math.max(0.0001, fallback ? fallback.sellRate - fallback.buyRate : spreadTemplate[sell.currency]);
      const derivedBuy = Number(Math.max(0, sell.sellRate - spread).toFixed(4));
      const candidate: ScrapedCashRate & { __ts: number } = {
        providerSlug: 'superrich-1965',
        currency: sell.currency,
        denomination: fallback?.denomination || sell.denomination || 'notes',
        buyRate: derivedBuy,
        sellRate: sell.sellRate,
        observedAt: new Date(sell.timestamp).toISOString(),
        sourceUrl: 'https://superrichrate2.ztidev.com/superRich/getBooking (guest feed)',
        sourceKind: 'hybrid',
        __ts: sell.timestamp,
      };
      const existing = mergedRows.get(rowKey);
      if (!existing || candidate.__ts > existing.__ts) mergedRows.set(rowKey, candidate);
    }
    const rates = [...mergedRows.values()].map(({ __ts, ...row }) => row);
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
        `Parsed ${rates.length} hybrid rows from official guest booking feed.`,
        'Buy side is derived from validated fallback spread model; live feed currently exposes sell-side only.',
        latestDynUpdate ? `Latest branch rate update marker: ${latestDynUpdate}` : 'No branch update marker in guest feed.',
      ],
      rates,
    };
  } catch (error) {
    return { provider: 'superrich-1965', ok: false, observedAt, notes: [error instanceof Error ? error.message : 'Unknown scrape error'] };
  }
}

export async function runCashScrapers(): Promise<ScrapeResult[]> {
  return Promise.all([scrapeRatchada(), scrapeSuperrichThailand(), scrapeSuperrich1965(), scrapeSia()]);
}
