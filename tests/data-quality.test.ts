import { describe,expect,it } from 'vitest';
import { cashQuoteCurrent,validateMarketSnapshot,banknoteMatches } from '@/lib/data-quality';
import { cycleStatus,workerInterval } from '@/lib/data-status';

describe('source quality gates',()=>{
  it('does not apply a large-note quote to smaller or unknown banknotes',()=>{
    expect(banknoteMatches('100',20)).toBe(false);
    expect(banknoteMatches('50-100',100)).toBe(true);
    expect(banknoteMatches('20-5',10)).toBe(true);
    expect(banknoteMatches('Confirm at counter',100)).toBe(false);
  });
  const now=Date.parse('2026-10-01T15:00:00Z');
  it('keeps daily published cash quotes current only with a recent collection',()=>{
    const r={observedAt:'2026-10-01T02:00:00Z',fetchedAt:'2026-10-01T14:59:00Z',timestampKind:'published',sourceKind:'live'};
    expect(cashQuoteCurrent(r,now)).toBe(true);
    expect(cashQuoteCurrent({...r,fetchedAt:'2026-09-24T00:00:00Z'},now)).toBe(false);
    expect(cashQuoteCurrent({...r,observedAt:'2026-09-24T00:00:00Z'},now)).toBe(false);
    expect(cashQuoteCurrent({...r,sourceKind:'hybrid'},now)).toBe(false);
    expect(cashQuoteCurrent({...r,timestampKind:'collected'},now)).toBe(false);
  });
  it('sorts books before calculating and rejects malformed or stale books',()=>{
    const book={exchange:'binance-th' as const,symbol:'BTC' as const,lastUpdated:'2026-10-01T14:59:30Z',asks:[{price:11,quantity:1},{price:10,quantity:1}],bids:[{price:8,quantity:1},{price:9,quantity:1}]};
    expect(validateMarketSnapshot(book,now).asks[0].price).toBe(10);
    expect(validateMarketSnapshot(book,now).bids[0].price).toBe(9);
    for(const patch of [{asks:[]},{asks:[{price:NaN,quantity:1}]},{bids:[{price:12,quantity:1}]},{lastUpdated:'2026-09-01T00:00:00Z'},{lastUpdated:'2026-10-02T00:00:00Z'}])expect(()=>validateMarketSnapshot({...book,...patch},now)).toThrow();
  });
  it('never reports a healthy update cycle for empty cash data',()=>{
    expect(cycleStatus({binance:true,orbix:true},{generatedAt:null,results:[]})).toBe('degraded');
    expect(workerInterval('NaN')).toBe(10);expect(workerInterval('Infinity')).toBe(10);expect(workerInterval('0')).toBe(10);expect(workerInterval('15')).toBe(15);
  });
});
