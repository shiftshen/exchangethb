import { describeMarketProbe, evaluateMarketSources, SymbolProbe } from '../lib/market-probe';

const DEFAULT_SITE = process.env.SITE_URL || 'https://www.exchangethb.com';
const DEFAULT_SYMBOLS = ['BTC', 'USDT'];
const TIMEOUT_MS = Number(process.env.MARKET_PROBE_TIMEOUT_MS || 20_000);

function argValue(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function probeSymbol(site: string, symbol: string): Promise<SymbolProbe> {
  const url = `${site.replace(/\/+$/, '')}/api/compare/crypto?symbol=${encodeURIComponent(symbol)}&side=sell&amount=1000`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`http_${response.status}`);
    const payload = await response.json() as { ok?: boolean; data?: Array<Record<string, unknown>> };
    if (!payload.ok || !Array.isArray(payload.data)) throw new Error('api_not_ok');
    return {
      symbol,
      sources: payload.data.map((row) => ({
        exchange: String(row.exchange ?? row.slug ?? 'unknown'),
        live: row.live === true,
        freshness: typeof row.freshness === 'string' ? row.freshness : undefined,
        fallbackReason: typeof row.fallbackReason === 'string' ? row.fallbackReason : null,
      })),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const site = argValue('--site') || DEFAULT_SITE;
  const minLive = Number(argValue('--min-live') || process.env.MARKET_PROBE_MIN_LIVE || 2);
  const symbols = (argValue('--symbols') || DEFAULT_SYMBOLS.join(',')).split(',').map((value) => value.trim()).filter(Boolean);

  const probes: SymbolProbe[] = [];
  for (const symbol of symbols) {
    try {
      probes.push(await probeSymbol(site, symbol));
    } catch (error) {
      probes.push({ symbol, sources: [] });
      console.error(`${symbol}: 探测失败 ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const evaluation = evaluateMarketSources(probes, minLive);
  console.log(JSON.stringify({
    site,
    checkedAt: new Date().toISOString(),
    minLive,
    probes,
    evaluation,
  }, null, 2));
  console.log(describeMarketProbe(evaluation));
  if (!evaluation.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
