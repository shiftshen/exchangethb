import { expect, it, vi } from 'vitest';
import { compareCrypto } from '@/lib/compare';
import { getLiveMarketSnapshots } from '@/lib/market-data';
vi.mock('@/lib/market-data', async importOriginal => ({...await importOriginal<typeof import('@/lib/market-data')>(),getLiveMarketSnapshots:vi.fn()}));
vi.mock('@/lib/content-store',()=>({readAdminConfig:vi.fn(async()=>({feeOverrides:{},affiliateLinks:{},evidence:{}}))}));
it.each(['buy','sell'] as const)('keeps historical prices behind current %s offers even when they look cheaper', async side => {
  vi.mocked(getLiveMarketSnapshots).mockResolvedValue([
    {exchange:'bitkub',symbol:'USDT',source:'fallback',lastUpdated:'2026-03-08T00:00:00Z',asks:[{price:1,quantity:1000}],bids:[{price:100,quantity:1000}]},
    {exchange:'binance-th',symbol:'USDT',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:34,quantity:1000}],bids:[{price:33,quantity:1000}]},
  ]);
  const rows=await compareCrypto({symbol:'USDT',side,amount:100,quoteMode:'coin'});
  expect(rows.map(x=>x.slug)).toEqual(['binance-th','bitkub']);
  expect(rows[0].live).toBe(true);
});

it('deducts Binance TH buy trading fees from received coins without also charging extra THB', async () => {
  vi.mocked(getLiveMarketSnapshots).mockResolvedValue([
    {exchange:'binance-th',symbol:'USDT',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:34,quantity:1000}],bids:[{price:33,quantity:1000}]},
  ]);
  const [row]=await compareCrypto({symbol:'USDT',side:'buy',amount:100,quoteMode:'coin',includeWithdrawal:false});
  expect(row.estimatedTotalCost).toBe(3400);
  expect(row.tradingFeeAsset).toBe(0.25);
  expect(row.estimatedReceive).toBe(99.75);
  const [sell]=await compareCrypto({symbol:'USDT',side:'sell',amount:100,quoteMode:'coin',withdrawThb:false});
  expect(sell.estimatedReceive).toBe(3291.75);
});

it('compares buy offers using cost per net received coin across fee currencies', async () => {
  vi.mocked(getLiveMarketSnapshots).mockResolvedValue([
    {exchange:'binance-th',symbol:'USDT',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:34,quantity:1000}],bids:[{price:33,quantity:1000}]},
    {exchange:'bitkub',symbol:'USDT',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:34,quantity:1000}],bids:[{price:33,quantity:1000}]},
  ]);
  const rows=await compareCrypto({symbol:'USDT',side:'buy',amount:100,quoteMode:'coin',includeWithdrawal:false});
  // Equal gross prices: quote-denominated fee is slightly cheaper per net coin
  // than reducing the received coins by the same percentage.
  expect(rows.map(r=>r.slug)).toEqual(['bitkub','binance-th']);
});

it('does not deduct an unverified static blockchain withdrawal fee', async () => {
  vi.mocked(getLiveMarketSnapshots).mockResolvedValue([
    {exchange:'binance-th',symbol:'BTC',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:2000000,quantity:2}],bids:[{price:1900000,quantity:2}]},
  ]);
  const [row]=await compareCrypto({symbol:'BTC',side:'buy',amount:1,quoteMode:'coin',includeWithdrawal:true});
  expect(row.withdrawalFeeKnown).toBe(false);
  expect(row.networkFee).toBe(0);
  expect(row.estimatedReceive).toBe(0.9975);
});

it('returns a bank-dependent withdrawal and received-THB range for a Bitkub sale', async()=>{
 vi.mocked(getLiveMarketSnapshots).mockResolvedValue([
  {exchange:'bitkub',symbol:'BTC',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:201000,quantity:2}],bids:[{price:200000,quantity:2}]},
 ]);
 const [row]=await compareCrypto({symbol:'BTC',side:'sell',amount:1,quoteMode:'coin',withdrawThb:true});
 expect(row.thbWithdrawMin).toBe(20);
 expect(row.thbWithdraw).toBe(75);
 expect(row.estimatedReceive).toBe(199425);
 expect(row.estimatedReceiveMax).toBe(199480);
});

it('shows unverified Orbix fiat withdrawal as unknown without deducting a seed fee',async()=>{
 vi.mocked(getLiveMarketSnapshots).mockResolvedValue([
 {exchange:'orbix',symbol:'BTC',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:200000,quantity:2}],bids:[{price:200000,quantity:2}]},
 ]);
 const [row]=await compareCrypto({symbol:'BTC',side:'sell',amount:1,quoteMode:'coin',withdrawThb:true});
 expect(row.thbWithdrawKnown).toBe(false);
 expect(row.thbWithdraw).toBe(0);
 expect(row.tradingFee).toBe(500);
 expect(row.estimatedReceive).toBe(199500);
});

it('does not apply a Bitkub fee outside the published withdrawal amount range',async()=>{
 vi.mocked(getLiveMarketSnapshots).mockResolvedValue([
 {exchange:'bitkub',symbol:'BTC',source:'live',lastUpdated:new Date().toISOString(),asks:[{price:30000000,quantity:2}],bids:[{price:30000000,quantity:2}]},
 ]);
 const [row]=await compareCrypto({symbol:'BTC',side:'sell',amount:1,quoteMode:'coin',withdrawThb:true});
 expect(row.thbWithdrawKnown).toBe(false);
 expect(row.thbWithdraw).toBe(0);
});
