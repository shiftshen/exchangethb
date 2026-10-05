import fs from 'node:fs';
import path from 'node:path';

// Cash collector health probe — read-only.
//
// WHY THIS EXISTS
//   On 2026-10-05 the project directory was moved and the old path kept as a
//   compatibility symlink, while the collector's launchd job still passed that
//   symlinked workspace to the shared fetch helper. The helper pins every path
//   component with O_NOFOLLOW, so it rejected the symlink: all three sources
//   began failing with `output_rejected`. The process stayed alive and kept
//   cycling (launchd still reported `running`), production silently degraded to
//   `reference` quotes, and the shared health-watch reported fail=0 for 8h48m.
//
//   Process liveness is therefore NOT a health signal for this service; cycle
//   outcome is. This probe answers the question the port/process checks cannot.
//
// CONTRACT
//   Exit 0 with a one-line summary when the collector is producing quotes.
//   Exit non-zero with a one-line diagnostic when it is not. Read-only: never
//   writes, never touches the network, never prints URLs, headers or credentials.

export const SOURCES = ['superrich-thailand', 'ratchada', 'twelve-victory'] as const;

const CYCLE_DIR = /^cash-cycle-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)$/;

export type CycleSource = { provider: string; ok: boolean; rows: number };
export type Cycle = { output: string; providers: CycleSource[]; at: number | null };
export type Artifact = { name: string; payload: unknown };
export type Verdict = {
  ok: boolean;
  code: string;
  consecutive: number;
  ageMinutes: number | null;
  message: string;
};

/** Parse one collector stdout line. Returns null for anything unexpected. */
export function parseCycleLine(line: unknown): Cycle | null {
  const text = typeof line === 'string' ? line.trim() : '';
  if (!text.startsWith('{')) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const record = parsed as { output?: unknown; sources?: unknown };
  if (typeof record.output !== 'string' || !Array.isArray(record.sources)) return null;
  const providers: CycleSource[] = [];
  for (const row of record.sources as unknown[]) {
    if (!row || typeof row !== 'object') return null;
    const entry = row as { provider?: unknown; ok?: unknown; rows?: unknown };
    if (typeof entry.provider !== 'string' || typeof entry.ok !== 'boolean') return null;
    providers.push({
      provider: entry.provider,
      ok: entry.ok,
      rows: typeof entry.rows === 'number' && Number.isInteger(entry.rows) ? entry.rows : 0,
    });
  }
  if (!providers.length) return null;
  return { output: record.output, providers, at: cycleTimestamp(record.output) };
}

/** Timestamp of a cycle artifact path, or null when the shape is unexpected. */
export function cycleTimestamp(output: unknown): number | null {
  if (typeof output !== 'string') return null;
  const normalised = output.replace(/\\/g, '/');
  if (path.posix.basename(normalised) !== 'results.json') return null;
  const match = CYCLE_DIR.exec(path.posix.basename(path.posix.dirname(normalised)));
  if (!match) return null;
  const iso = match[1].replace(
    /^(\d{4}-\d{2}-\d{2}T\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/,
    '$1:$2:$3.$4Z',
  );
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

/** All well-formed cycles from a log body, oldest first. */
export function readCycles(logText: unknown): Cycle[] {
  const cycles: Cycle[] = [];
  for (const line of String(logText ?? '').split('\n')) {
    const cycle = parseCycleLine(line);
    if (cycle) cycles.push(cycle);
  }
  return cycles;
}

/** A cycle is down when every source in it failed. */
export function cycleFailed(cycle: Cycle): boolean {
  return cycle.providers.length > 0 && cycle.providers.every(source => source.ok === false);
}

/** Failure codes recorded in an artifact payload, e.g. ['output_rejected']. */
export function failureCodes(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') return [];
  const results = (payload as { results?: unknown }).results;
  if (!Array.isArray(results)) return [];
  return results
    .map(row => {
      if (!row || typeof row !== 'object') return null;
      const failure = (row as { failure?: unknown }).failure;
      if (!failure || typeof failure !== 'object') return null;
      const code = (failure as { code?: unknown }).code;
      return typeof code === 'string' ? code : null;
    })
    .filter((code): code is string => code !== null);
}

/** Decide the collector's health from its own cycle log plus cycle artifacts. */
export function evaluate(input: {
  logText: unknown;
  artifacts?: Artifact[];
  now?: number;
  threshold?: number;
  maxStaleMinutes?: number;
}): Verdict {
  const { logText, artifacts = [], now = Date.now(), threshold = 3, maxStaleMinutes = 30 } = input;
  const cycles = readCycles(logText);
  if (!cycles.length) {
    return { ok: false, code: 'no_cycles', consecutive: 0, ageMinutes: null, message: '采集日志里没有可用轮次记录' };
  }

  const newest = cycles[cycles.length - 1];
  const ageMinutes = newest.at === null ? null : Math.floor((now - newest.at) / 60000);

  let consecutive = 0;
  for (let i = cycles.length - 1; i >= 0; i -= 1) {
    if (!cycleFailed(cycles[i])) break;
    consecutive += 1;
  }

  const rejected = codesFor(artifacts, newest).includes('output_rejected');

  if (ageMinutes !== null && ageMinutes > maxStaleMinutes) {
    return {
      ok: false,
      code: 'stale',
      consecutive,
      ageMinutes,
      message: `采集已停 ${ageMinutes} 分钟（超过 ${maxStaleMinutes} 分钟），最后一轮 ${formatTime(newest.at)}`,
    };
  }

  if (consecutive >= threshold) {
    const detail = rejected ? '，最近失败码 output_rejected' : '';
    return {
      ok: false,
      code: rejected ? 'output_rejected' : 'all_sources_failed',
      consecutive,
      ageMinutes,
      message: `连续 ${consecutive} 轮三源全挂${detail}，最后一轮 ${formatTime(newest.at)}`,
    };
  }

  if (consecutive > 0) {
    return {
      ok: true,
      code: 'degraded_below_threshold',
      consecutive,
      ageMinutes,
      message: `最近 ${consecutive} 轮三源全挂（未达 ${threshold} 轮阈值），最后一轮 ${formatTime(newest.at)}`,
    };
  }

  const rows = newest.providers.map(source => `${source.provider}=${source.rows}`).join(' ');
  return {
    ok: true,
    code: 'ok',
    consecutive: 0,
    ageMinutes,
    message: `三源正常（${rows}），最后一轮 ${formatTime(newest.at)}`,
  };
}

function codesFor(artifacts: Artifact[], cycle: Cycle): string[] {
  if (!cycle.at) return [];
  for (const item of artifacts) {
    if (!item || typeof item.name !== 'string') continue;
    if (!CYCLE_DIR.test(item.name)) continue;
    if (cycleTimestamp(`artifacts/${item.name}/results.json`) === cycle.at) return failureCodes(item.payload);
  }
  return [];
}

function formatTime(ms: number | null): string {
  if (ms === null) return '未知时间';
  return new Date(ms).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z');
}

/** Read cycle artifacts from disk, newest first. A missing directory yields []. */
export function readArtifacts(artifactsDir: string, limit = 5): Artifact[] {
  let names: string[];
  try {
    names = fs.readdirSync(artifactsDir);
  } catch {
    return [];
  }
  const cycles = names.filter(name => CYCLE_DIR.test(name)).sort().reverse().slice(0, limit);
  const out: Artifact[] = [];
  for (const name of cycles) {
    let payload: unknown = null;
    try {
      payload = JSON.parse(fs.readFileSync(path.join(artifactsDir, name, 'results.json'), 'utf8'));
    } catch {
      payload = null;
    }
    out.push({ name, payload });
  }
  return out;
}

type Options = { log: string; artifacts: string; threshold: number; maxStaleMinutes: number };

export function parseArgs(argv: string[]): Options {
  const root = path.dirname(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')));
  const options: Options = {
    log: process.env.CASH_COLLECTOR_LOG ?? '/Users/shift/Library/Logs/ExchangeTHB/cash-collector.log',
    artifacts: process.env.CASH_COLLECTOR_ARTIFACTS ?? path.join(root, 'artifacts'),
    threshold: 3,
    maxStaleMinutes: 30,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === '--log') { options.log = value; i += 1; }
    else if (flag === '--artifacts') { options.artifacts = value; i += 1; }
    else if (flag === '--threshold') { options.threshold = Number(value); i += 1; }
    else if (flag === '--max-stale-minutes') { options.maxStaleMinutes = Number(value); i += 1; }
  }
  return options;
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  let logText = '';
  try {
    logText = fs.readFileSync(options.log, 'utf8');
  } catch {
    console.log('采集日志不可读');
    process.exitCode = 1;
    return;
  }
  const verdict = evaluate({
    logText,
    artifacts: readArtifacts(options.artifacts),
    threshold: options.threshold,
    maxStaleMinutes: options.maxStaleMinutes,
  });
  console.log(verdict.message);
  process.exitCode = verdict.ok ? 0 : 1;
}

const invoked = process.argv[1] ? path.resolve(process.argv[1]) : '';
const self = path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
if (invoked === self || invoked.endsWith('/check-cash-collector-health.ts')) main();
