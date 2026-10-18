import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { extractRatchadaRates } from '../lib/scrapers/cash';
import { parseSuperRichPage } from '../lib/scrapers/superrich-page';
import { parseAdditionalCash } from '../lib/scrapers/additional-cash';
import { collectionFailure } from '../lib/scrapers/collection-failure';

// Public source collection uses the shared fail-closed helper, never native fetch.
const helper = '/Users/shift/LocalEnv/bin/localenv';
const workspaceIndex = process.argv.indexOf('--workspace');
const workspace = workspaceIndex >= 0 ? process.argv[workspaceIndex + 1] : process.cwd();
if (!workspace || !path.isAbsolute(workspace)) throw new Error('An absolute project workspace is required.');
process.chdir(workspace);
const sources = [
  { provider: 'superrich-thailand', url: 'https://www.superrichthailand.com' },
  { provider: 'ratchada', url: 'https://www.ratchadaexchange.com/' },
  { provider: 'twelve-victory', url: 'https://www.twelvevictory.com/en' },
] as const;

async function main() {
const cycle = new Date().toISOString().replace(/[:.]/g, '-');
const directory = path.join('artifacts', `cash-cycle-${cycle}`);
execFileSync(helper, ['collect', 'check'], { stdio: 'pipe' });
fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
const results = [];
for (const source of sources) {
  const observedAt = new Date().toISOString();
  const output = path.join(directory, `${source.provider}.html`);
  try {
    execFileSync(helper, ['collect', 'fetch', '--workspace', workspace, '--output', output, '--url', source.url], { stdio: 'pipe', timeout: 90_000 });
    const html = fs.readFileSync(output, 'utf8');
    const fetchedAt = new Date().toISOString();
    const rates = source.provider === 'ratchada' ? extractRatchadaRates(html, fetchedAt) : source.provider === 'superrich-thailand' ? parseSuperRichPage(html, fetchedAt) : parseAdditionalCash(html, source.provider, fetchedAt);
    results.push({ provider: source.provider, ok: rates.length > 0, observedAt, rates, ...(rates.length ? { lastSuccessAt: fetchedAt } : {}), notes: [rates.length ? 'Parsed official quotes; timestamp kind, banknote and branch scope apply.' : 'Official table or publication time unavailable.'] });
  } catch (error) {
    results.push({ provider: source.provider, ok: false, observedAt, rates: [], failure: collectionFailure(error), notes: ['Collection failed; no retry, direct fallback or exit rotation.'] });
  }
  // Global fixed pace in addition to the helper's redirect pacing.
  await new Promise(resolve => setTimeout(resolve, 2000));
}
const payload = { generatedAt: new Date().toISOString(), results };
const output = path.join(directory, 'results.json');
fs.writeFileSync(output, JSON.stringify(payload), { mode: 0o600 });
if (process.argv.includes('--publish')) {
  const code = fs.readFileSync(path.join(workspace, 'scripts/import-cash-cache.cjs'), 'utf8');
  const quoted = "'" + code.replace(/'/g, "'\\''") + "'";
  execFileSync('ssh', ['-o', 'BatchMode=yes', '1panel-happy', `docker exec -i exchangethb-web-1 node -e ${quoted}`], { input: JSON.stringify(payload), stdio: ['pipe', 'pipe', 'pipe'], timeout: 60_000 });
}
console.log(JSON.stringify({ output, sources: results.map(row => ({ provider: row.provider, ok: row.ok, rows: row.rates.length })) }));
}
async function run() {
  do {
    try { await main(); } catch { console.error('Private collection cycle stopped; no fallback used.'); if (!process.argv.includes('--loop')) process.exitCode = 1; }
    if (!process.argv.includes('--loop')) break;
    await new Promise(resolve => setTimeout(resolve, 10 * 60_000));
  } while (true);
}
void run();
