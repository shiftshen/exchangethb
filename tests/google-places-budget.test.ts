import { afterEach, expect, it, vi } from 'vitest';
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();vi.unstubAllEnvs();vi.resetModules();});
it('stops requests at the monthly guard even across daily resets, then permits a new month',async()=>{
 vi.resetModules();vi.useFakeTimers();vi.stubEnv('GOOGLE_PLACES_ENABLED','1');vi.stubEnv('GOOGLE_MAPS_API_KEY','test-key');
 const fetch=vi.fn(async()=>({ok:true,json:async()=>({id:'ChIJabcdefghijk',displayName:{text:'Test branch'},formattedAddress:'Test address'})}));vi.stubGlobal('fetch',fetch);
 const {getGooglePlace}=await import('@/lib/google-places');
 for(let day=1;day<=20;day++)for(let hour=0;hour<3;hour++){
  vi.setSystemTime(new Date(Date.UTC(2026,0,day,hour)));
  for(let i=0;i<(hour===2?5:10);i++)expect((await getGooglePlace('ChIJabcdefghijk',true)).status).toBe('available');
 }
 expect(fetch).toHaveBeenCalledTimes(500);
 vi.setSystemTime(new Date('2026-01-21T00:00:00Z'));
 expect((await getGooglePlace('ChIJabcdefghijk',true)).status).toBe('limited');expect(fetch).toHaveBeenCalledTimes(500);
 vi.setSystemTime(new Date('2026-02-01T00:00:00Z'));
 expect((await getGooglePlace('ChIJabcdefghijk',true)).status).toBe('available');expect(fetch).toHaveBeenCalledTimes(501);
});
