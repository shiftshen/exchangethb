import { expect, it, vi } from 'vitest';
import { sourceJson } from '@/lib/source-http';
import { getLiveMarketSnapshots } from '@/lib/market-data';
vi.mock('@/lib/source-http', () => ({ sourceJson: vi.fn() }));
it('uses official V3 depth symbols and price/size tuples', async () => {
  vi.mocked(sourceJson).mockImplementation(async url => {
    if (!url.includes('bitkub.com')) throw Error('unavailable');
    expect(url).toContain('/api/v3/market/depth?sym=usdt_thb&lmt=100');
    return {error:0,result:{asks:[[33.4,1000]],bids:[[33.3,2000]]}};
  });
  const row = (await getLiveMarketSnapshots('USDT')).find(x => x.exchange === 'bitkub');
  expect(row).toMatchObject({source:'live',asks:[{price:33.4,quantity:1000}],bids:[{price:33.3,quantity:2000}]});
});
it('uses Orbix public V3 depth price/size tuples', async () => {
  vi.mocked(sourceJson).mockImplementation(async url => {
    if (!url.includes('orbixtrade.com')) throw Error('unavailable');
    expect(url).toContain('/api/v3/depth?symbol=usdt_thb&limit=100');
    return {asks:[['33.6','1000']],bids:[['33.59','2000']]};
  });
  const row = (await getLiveMarketSnapshots('USDT')).find(x => x.exchange === 'orbix');
  expect(row).toMatchObject({source:'live',asks:[{price:33.6,quantity:1000}],bids:[{price:33.59,quantity:2000}]});
});
it('keeps valid Upbit depth while dropping only empty zero/zero side placeholders', async () => {
  vi.mocked(sourceJson).mockImplementation(async url => {
    if (!url.includes('upbit.com')) throw Error('unavailable');
    return [{timestamp:Date.now(),orderbook_units:[{ask_price:34,ask_size:100,bid_price:33,bid_size:50},{ask_price:35,ask_size:20,bid_price:0,bid_size:0}]}];
  });
  const row=(await getLiveMarketSnapshots('USDT')).find(x=>x.exchange==='upbit-thailand');
  expect(row).toMatchObject({source:'live',asks:[{price:34,quantity:100},{price:35,quantity:20}],bids:[{price:33,quantity:50}]});
});
