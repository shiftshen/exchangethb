import { describe,it,expect,vi,afterEach } from 'vitest';
import { safeAnalyticsParams,trackEvent,flushAnalyticsEvents } from '@/lib/analytics-client';
describe('analytics privacy',()=>{
  afterEach(()=>vi.unstubAllGlobals());
  it('queues initial events only after consent and drains them once the tag is ready',()=>{
    const browser={localStorage:{getItem:()=> 'accepted'},gtag:undefined as unknown as ReturnType<typeof vi.fn>,exchangeAnalyticsQueue:[] as unknown[]};
    vi.stubGlobal('window',browser);
    trackEvent('comparison_started',{mode:'cash',amount:1000,email:'person@example.com'});
    browser.gtag=vi.fn();flushAnalyticsEvents();flushAnalyticsEvents();
    expect(browser.gtag).toHaveBeenCalledExactlyOnceWith('event','comparison_started',{mode:'cash'});
    browser.localStorage.getItem=()=> 'declined';trackEvent('official_click',{provider:'sia'});
    expect(browser.gtag).toHaveBeenCalledTimes(1);
  });
  it('removes personal data, exact amounts and location from events',()=>{
    expect(safeAnalyticsParams({amount:10000,latitude:13.7,longitude:100.5,email:'person@example.com',provider:'binance-th',amount_bucket:'1000-10000',page_location:'https://www.exchangethb.com/zh?amount=10000&lat=13.7#secret',page_referrer:'https://example.com/?token=private'})).toEqual({provider:'binance-th',amount_bucket:'1000-10000',page_location:'https://www.exchangethb.com/zh',page_referrer:''});
  });
});
