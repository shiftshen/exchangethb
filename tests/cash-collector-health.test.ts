import { describe, expect, it } from 'vitest';
import {
  SOURCES,
  cycleTimestamp,
  evaluate,
  failureCodes,
  parseCycleLine,
  readCycles,
} from '../scripts/check-cash-collector-health';

// Real shapes taken from 2026-10-05: the migration broke the collector for 50
// consecutive cycles while the process stayed alive and launchd kept reporting
// `running`, and the shared health-watch still reported fail=0.

const STAMP = {
  down: '2026-10-05T14-00-20-416Z',
  down1: '2026-10-05T14-10-28-712Z',
  down2: '2026-10-05T14-20-36-576Z',
  ok: '2026-10-05T14-23-40-886Z',
  okLater: '2026-10-05T14-33-51-544Z',
} as const;

function cycleLine(stamp: string, ok: boolean[], rows: number[] = [31, 31, 5]): string {
  return JSON.stringify({
    output: `artifacts/cash-cycle-${stamp}/results.json`,
    sources: SOURCES.map((provider, i) => ({
      provider,
      ok: ok[i],
      rows: ok[i] ? rows[i] : 0,
    })),
  });
}

/** One minute after a cycle, so staleness never masks the verdict under test. */
function afterMinutes(stamp: string, minutes = 1): number {
  const iso = stamp.replace(/^(\d{4}-\d{2}-\d{2}T\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, '$1:$2:$3.$4Z');
  return Date.parse(iso) + minutes * 60_000;
}

const DOWN = cycleLine(STAMP.down, [false, false, false]);
const DOWN_1 = cycleLine(STAMP.down1, [false, false, false]);
const DOWN_2 = cycleLine(STAMP.down2, [false, false, false]);
const OK = cycleLine(STAMP.ok, [true, true, true]);
const OK_LATER = cycleLine(STAMP.okLater, [true, true, true]);

describe('cash collector cycle parsing', () => {
  it('parses a real collector stdout line', () => {
    expect(parseCycleLine(DOWN)).toEqual({
      output: `artifacts/cash-cycle-${STAMP.down}/results.json`,
      providers: [
        { provider: 'superrich-thailand', ok: false, rows: 0 },
        { provider: 'ratchada', ok: false, rows: 0 },
        { provider: 'twelve-victory', ok: false, rows: 0 },
      ],
      at: Date.parse('2026-10-05T14:00:20.416Z'),
    });
  });

  it('ignores blank, non-JSON and stderr lines', () => {
    expect(parseCycleLine('')).toBeNull();
    expect(parseCycleLine('Private collection cycle stopped; no fallback used.')).toBeNull();
    expect(parseCycleLine('{"output":123}')).toBeNull();
    expect(parseCycleLine('{}')).toBeNull();
    expect(parseCycleLine('{"output":"x","sources":[{"provider":"p"}]}')).toBeNull();
  });

  it('reads only well-formed cycles in order', () => {
    const cycles = readCycles([DOWN, 'noise', '', OK].join('\n'));
    expect(cycles.map(c => c.providers[0].ok)).toEqual([false, true]);
  });

  it('derives the timestamp only from the expected artifact shape', () => {
    expect(cycleTimestamp(`artifacts/cash-cycle-${STAMP.down}/results.json`))
      .toBe(Date.parse('2026-10-05T14:00:20.416Z'));
    expect(cycleTimestamp(`artifacts/cash-cycle-${STAMP.down}/superrich.html`)).toBeNull();
    expect(cycleTimestamp('artifacts/other/results.json')).toBeNull();
    expect(cycleTimestamp(undefined)).toBeNull();
  });

  it('reads failure codes without exposing anything else', () => {
    expect(failureCodes({ results: [{ failure: { code: 'output_rejected', httpStatus: null } }] })).toEqual(['output_rejected']);
    expect(failureCodes({ results: [{ ok: false }] })).toEqual([]);
    expect(failureCodes(null)).toEqual([]);
  });
});

describe('cash collector health verdict', () => {
  it('passes when the newest cycles are healthy', () => {
    const verdict = evaluate({ logText: [OK, OK_LATER].join('\n'), now: afterMinutes(STAMP.okLater) });
    expect(verdict.ok).toBe(true);
    expect(verdict.code).toBe('ok');
    expect(verdict.message).toContain('superrich-thailand=31');
  });

  it('fails on the consecutive all-source outage that health-watch missed', () => {
    const verdict = evaluate({ logText: [DOWN, DOWN_1, DOWN_2].join('\n'), now: afterMinutes(STAMP.down2) });
    expect(verdict.ok).toBe(false);
    expect(verdict.code).toBe('all_sources_failed');
    expect(verdict.consecutive).toBe(3);
  });

  it('names output_rejected when the newest cycle artifact carries that code', () => {
    const verdict = evaluate({
      logText: [DOWN, DOWN_1, DOWN_2].join('\n'),
      artifacts: [{ name: `cash-cycle-${STAMP.down2}`, payload: { results: [{ failure: { code: 'output_rejected' } }] } }],
      now: afterMinutes(STAMP.down2),
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.code).toBe('output_rejected');
    expect(verdict.message).toContain('output_rejected');
  });

  it('tolerates a short outage below the threshold', () => {
    const verdict = evaluate({ logText: [OK, DOWN].join('\n'), now: afterMinutes(STAMP.down) });
    expect(verdict.ok).toBe(true);
    expect(verdict.code).toBe('degraded_below_threshold');
    expect(verdict.consecutive).toBe(1);
  });

  it('recovers as soon as a healthy cycle lands', () => {
    const verdict = evaluate({ logText: [DOWN, DOWN_1, OK_LATER].join('\n'), now: afterMinutes(STAMP.okLater) });
    expect(verdict.ok).toBe(true);
    expect(verdict.code).toBe('ok');
  });

  it('does not count a single degraded source as a full outage', () => {
    const partial = cycleLine(STAMP.down, [true, false, true], [31, 0, 5]);
    const verdict = evaluate({ logText: [partial, partial, partial].join('\n'), now: afterMinutes(STAMP.down) });
    expect(verdict.ok).toBe(true);
    expect(verdict.code).toBe('ok');
  });

  it('fails when the collector stopped cycling altogether', () => {
    const verdict = evaluate({ logText: OK, now: afterMinutes(STAMP.ok, 90) });
    expect(verdict.ok).toBe(false);
    expect(verdict.code).toBe('stale');
  });

  it('fails when the log holds no usable cycles', () => {
    const verdict = evaluate({ logText: 'Private collection cycle stopped; no fallback used.\n', now: Date.now() });
    expect(verdict.ok).toBe(false);
    expect(verdict.code).toBe('no_cycles');
  });

  it('keeps the threshold configurable', () => {
    const verdict = evaluate({
      logText: [DOWN, DOWN_1].join('\n'),
      now: afterMinutes(STAMP.down1),
      threshold: 2,
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.code).toBe('all_sources_failed');
  });
});
