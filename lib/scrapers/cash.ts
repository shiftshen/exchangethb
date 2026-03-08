import { CurrencyCode } from '@/lib/types';

export interface ScrapedCashRate {
  providerSlug: string;
  currency: CurrencyCode;
  denomination: string;
  buyRate: number;
  sellRate: number;
  observedAt: string;
  sourceUrl: string;
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

export async function runCashScrapers(): Promise<ScrapeResult[]> {
  const results = await Promise.all([scrapeVasu(), scrapeRatchada()]);
  return [
    ...results,
    { provider: 'superrich-1965', ok: false, observedAt: new Date().toISOString(), notes: ['Official page confirmed reachable; structured parser pending branch-specific source discovery.'] },
    { provider: 'superrich-thailand', ok: false, observedAt: new Date().toISOString(), notes: ['Official page confirmed reachable; parser pending app/API source mapping.'] },
    { provider: 'sia', ok: false, observedAt: new Date().toISOString(), notes: ['Public website has certificate mismatch; keep official/manual review fallback for now.'] },
  ];
}
