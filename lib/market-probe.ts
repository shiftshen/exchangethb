export type MarketSourceSample = {
  exchange: string;
  live: boolean;
  freshness?: string;
  fallbackReason?: string | null;
};

export type SymbolProbe = {
  symbol: string;
  sources: MarketSourceSample[];
};

export type SymbolEvaluation = {
  symbol: string;
  liveCount: number;
  totalCount: number;
  ok: boolean;
  unavailable: string[];
};

export type MarketProbeEvaluation = {
  ok: boolean;
  minLive: number;
  perSymbol: SymbolEvaluation[];
  failingSymbols: string[];
};

/**
 * Judgement for the market-source probe. A symbol is healthy when at least
 * `minLive` sources return a live official order book for this request; sources
 * shown from the reviewed fallback dataset are listed so flapping stays visible
 * instead of being averaged away.
 */
export function evaluateMarketSources(probes: SymbolProbe[], minLive = 2): MarketProbeEvaluation {
  const perSymbol = probes.map((probe) => {
    const liveCount = probe.sources.filter((source) => source.live).length;
    return {
      symbol: probe.symbol,
      liveCount,
      totalCount: probe.sources.length,
      ok: liveCount >= minLive,
      unavailable: probe.sources.filter((source) => !source.live).map((source) => source.exchange),
    };
  });
  const failingSymbols = perSymbol.filter((item) => !item.ok).map((item) => item.symbol);
  return { ok: failingSymbols.length === 0, minLive, perSymbol, failingSymbols };
}

export function describeMarketProbe(evaluation: MarketProbeEvaluation) {
  const detail = evaluation.perSymbol
    .map((item) => `${item.symbol} ${item.liveCount}/${item.totalCount}${item.unavailable.length ? ` (fallback: ${item.unavailable.join(', ')})` : ''}`)
    .join(' | ');
  return evaluation.ok
    ? `行情源正常（阈值 ≥${evaluation.minLive} live）：${detail}`
    : `行情源不足（阈值 ≥${evaluation.minLive} live）：${detail}`;
}
