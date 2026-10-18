function validatePayload(payload, now = Date.now()) {
  const sources = {
    ratchada: 'https://www.ratchadaexchange.com/',
    vasu: 'https://www.vasuexchange.co.th/',
    'twelve-victory': 'https://www.twelvevictory.com/en',
    'superrich-thailand': 'https://www.superrichthailand.com',
  };
  const currencies = new Set(['USD','EUR','JPY','CNY','GBP','AUD','CAD','SGD','HKD','CHF','NZD','KRW','TWD','MYR','INR']);
  const fresh = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) && now - Date.parse(value) >= -60_000 && now - Date.parse(value) <= 300_000;
  if (!payload || !fresh(payload.generatedAt) || !Array.isArray(payload.results) || payload.results.length < 1 || payload.results.length > 4) throw Error('invalid_payload');
  const seen = new Set();
  for (const row of payload.results) {
    if (!row || !Object.hasOwn(sources, row.provider) || seen.has(row.provider) || typeof row.ok !== 'boolean' || !fresh(row.observedAt) || !Array.isArray(row.rates) || row.rates.length > 200 || row.ok !== (row.rates.length > 0)) throw Error('invalid_provider');
    seen.add(row.provider);
    for (const rate of row.rates) {
      if (!rate || rate.providerSlug !== row.provider || !currencies.has(rate.currency) || rate.sourceUrl !== sources[row.provider] || rate.sourceKind !== 'live' || typeof rate.denomination !== 'string' || !rate.denomination.trim() || rate.denomination.length > 100 || !Number.isFinite(rate.buyRate) || rate.buyRate <= 0 || !Number.isFinite(rate.sellRate) || rate.sellRate < rate.buyRate || rate.timestampKind !== (row.provider === 'superrich-thailand' ? 'collected' : 'published') || !fresh(rate.fetchedAt) || !Number.isFinite(Date.parse(rate.observedAt)) || Date.parse(rate.observedAt) > now + 60_000 || (rate.timestampKind === 'collected' && rate.observedAt !== rate.fetchedAt)) throw Error('invalid_rates');
    }
  }
}
module.exports = { validatePayload };
if (!module.parent) {
const prismaReady = import('@prisma/client').then(({ PrismaClient }) => new PrismaClient());
let input = '';
process.stdin.on('data', chunk => { input += chunk; if (input.length > 2_000_000) process.exit(1); });
process.stdin.on('end', async () => {
  const prisma = await prismaReady;
  try {
    const payload = JSON.parse(input);
    validatePayload(payload);
    await prisma.$transaction(async tx => {
      const state = await tx.cashScrapeCacheState.findUnique({ where: { key: 'latest' } });
      const previous = state?.value || {};
      const results = payload.results.map(row => {
        const old = (previous.results || []).find(entry => entry.provider === row.provider);
        return row.ok && row.rates.length ? row : { ...row, ok: false, rates: old?.rates || [], lastSuccessAt: old?.lastSuccessAt || null };
      });
      for (const row of previous.results || []) if (!results.some(entry => entry.provider === row.provider)) results.push(row);
      const value = { ...previous, generatedAt: results.some(row => row.ok) ? payload.generatedAt : previous.generatedAt, lastAttemptAt: payload.generatedAt, lastAttempts: payload.results.map(({ provider, ok, observedAt, notes }) => ({ provider, ok, observedAt, notes })), results };
      await tx.cashScrapeCacheState.upsert({ where: { key: 'latest' }, create: { key: 'latest', value }, update: { value, previousValue: previous } });
    });
    console.log(JSON.stringify({ status: 'saved', providers: payload.results.map(row => ({ provider: row.provider, ok: row.ok, rows: row.rates.length })) }));
  } catch { console.error('Verified cash cache import failed.'); process.exitCode = 1; }
  finally { await prisma.$disconnect(); }
});

}
