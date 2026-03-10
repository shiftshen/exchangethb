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

function extractVasuRates(html: string): ScrapedCashRate[] {
  const observedAt = new Date().toISOString();
  const text = stripText(html);
  const output: ScrapedCashRate[] = [];

  for (const match of text.matchAll(/USD\s+(100|50|5-20|1-2)\s+(\d+\.\d{2,4})\s+(\d+\.\d{2,4})/gi)) {
    output.push({ providerSlug: 'vasu', currency: 'USD', denomination: match[1], buyRate: Number(match[2]), sellRate: Number(match[3]), observedAt, sourceUrl: 'https://www.vasuexchange.com/' });
  }
  for (const match of text.matchAll(/(?:EURO|EUR)\s+(100-500|50|5-20)\s+(\d+\.\d{2,4})\s+(\d+\.\d{2,4})/gi)) {
    output.push({ providerSlug: 'vasu', currency: 'EUR', denomination: match[1], buyRate: Number(match[2]), sellRate: Number(match[3]), observedAt, sourceUrl: 'https://www.vasuexchange.com/' });
  }
  for (const match of text.matchAll(/GBP\s+(50|5-20)\s+(\d+\.\d{2,4})\s+(\d+\.\d{2,4})/gi)) {
    output.push({ providerSlug: 'vasu', currency: 'GBP', denomination: match[1], buyRate: Number(match[2]), sellRate: Number(match[3]), observedAt, sourceUrl: 'https://www.vasuexchange.com/' });
  }
  for (const match of text.matchAll(/JPY\s+(\d+\.\d{4})\s+(\d+\.\d{4})/gi)) {
    output.push({ providerSlug: 'vasu', currency: 'JPY', denomination: '10000-1000', buyRate: Number(match[1]), sellRate: Number(match[2]), observedAt, sourceUrl: 'https://www.vasuexchange.com/' });
  }
  for (const match of text.matchAll(/CNY\s+(\d+\.\d{2,4})\s+(\d+\.\d{2,4})/gi)) {
    output.push({ providerSlug: 'vasu', currency: 'CNY', denomination: 'notes', buyRate: Number(match[1]), sellRate: Number(match[2]), observedAt, sourceUrl: 'https://www.vasuexchange.com/' });
  }
  return output;
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

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
  return response.text();
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

export async function scrapeVasu(): Promise<ScrapeResult> {
  try {
    const html = await fetchHtml('https://www.vasuexchange.com/');
    const rates = extractVasuRates(html);
    return { provider: 'vasu', ok: rates.length > 0, observedAt: new Date().toISOString(), notes: [`Parsed ${rates.length} rate rows from official page.`], rates };
  } catch (error) {
    return { provider: 'vasu', ok: false, observedAt: new Date().toISOString(), notes: [error instanceof Error ? error.message : 'Unknown scrape error'] };
  }
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
    const response = await fetch('https://www.superrichthailand.com/api/v1/rates', {
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

export async function scrapeSuperrich1965(): Promise<ScrapeResult> {
  const observedAt = new Date().toISOString();
  const supported = new Set<CurrencyCode>(['USD', 'CNY', 'EUR', 'JPY', 'GBP']);
  const normalizeDenomination = (value: string) => value.replace(/\s+/g, '').replace(/–/g, '-').toUpperCase();
  try {
    const guestTokenResponse = await fetch('https://superrichrate2.ztidev.com/superRich/getGuestToken', {
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
    const locationsResponse = await fetch('https://superrichrate2.ztidev.com/superRich/getLocationsRate?isBooking=0&page=0&sizeContents=100', {
      headers: {
        'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0',
        token,
      },
      cache: 'no-store',
    });
    const bookingsResponse = await fetch('https://superrichrate2.ztidev.com/superRich/getBooking?page=0&sizeContents=120', {
      headers: {
        'user-agent': 'Mozilla/5.0 ExchangeTHB/1.0',
        token,
      },
      cache: 'no-store',
    });
    if (!locationsResponse.ok || !bookingsResponse.ok) {
      return {
        provider: 'superrich-1965',
        ok: false,
        observedAt,
        notes: [
          `Guest feed request failed: locations ${locationsResponse.status}, bookings ${bookingsResponse.status}.`,
          'Superrich-1965 keeps public booking feed available but can still block some requests by account state.',
        ],
      };
    }
    const locationsPayload = await locationsResponse.json() as { data?: { content?: Array<{ dynLastUpdate?: string }> } };
    const bookingsPayload = await bookingsResponse.json() as { data?: { content?: Array<{ rateUpdateDate?: number; updateDate?: number; createDate?: number; currencyList?: Array<{ currencyCode?: string; denominationList?: Array<{ denom?: string; sell?: string }> }> }> } };
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
    for (const booking of bookingsPayload.data?.content || []) {
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
    const mergedRows = new Map<string, ScrapedCashRate & { __ts: number }>();
    for (const [key, sell] of latestSellMap.entries()) {
      const fallback = fallbackMap.get(key) || fallbackByCurrency.get(sell.currency);
      if (!fallback) continue;
      const rowKey = `${fallback.currency}:${fallback.denomination}`;
      const candidate: ScrapedCashRate & { __ts: number } = {
        providerSlug: 'superrich-1965',
        currency: fallback.currency,
        denomination: fallback.denomination,
        buyRate: fallback.buyRate,
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
        'Buy side still follows verified fallback table; live feed currently exposes sell-side only.',
        latestDynUpdate ? `Latest branch rate update marker: ${latestDynUpdate}` : 'No branch update marker in guest feed.',
      ],
      rates,
    };
  } catch (error) {
    return { provider: 'superrich-1965', ok: false, observedAt, notes: [error instanceof Error ? error.message : 'Unknown scrape error'] };
  }
}

export async function runCashScrapers(): Promise<ScrapeResult[]> {
  const results = await Promise.all([scrapeVasu(), scrapeRatchada(), scrapeSuperrichThailand(), scrapeSuperrich1965()]);
  return [
    ...results,
    { provider: 'sia', ok: false, observedAt: new Date().toISOString(), notes: ['Public website has certificate mismatch; keep official/manual review fallback for now.'] },
  ];
}
