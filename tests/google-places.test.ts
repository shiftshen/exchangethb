import { afterEach,describe,expect,it,vi } from 'vitest';
import { getGooglePlace } from '@/lib/google-places';
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
describe('branch-specific Google reviews',()=>{
  it('does not call Google without explicit configuration or verified branch identity',async()=>{const fetch=vi.fn();vi.stubGlobal('fetch',fetch);vi.stubEnv('GOOGLE_PLACES_ENABLED','0');expect((await getGooglePlace('ChIJabcdefghijk',true)).status).toBe('not_configured');vi.stubEnv('GOOGLE_PLACES_ENABLED','1');vi.stubEnv('GOOGLE_MAPS_API_KEY','test-key');expect((await getGooglePlace('ChIJabcdefghijk',false)).status).toBe('identity_unverified');expect(fetch).not.toHaveBeenCalled();});
  it('keeps at most five attributed original reviews and never leaks the key in a URL',async()=>{
    vi.stubEnv('GOOGLE_PLACES_ENABLED','1');vi.stubEnv('GOOGLE_MAPS_API_KEY','test-key');const fetch=vi.fn(async()=>({ok:true,json:async()=>({id:'ChIJabcdefghijk',displayName:{text:'Test branch'},formattedAddress:'Test address',rating:4.5,userRatingCount:100,googleMapsUri:'https://maps.google.com/?cid=1',reviews:Array.from({length:8},()=>({originalText:{text:'Original review'},authorAttribution:{displayName:'Author',uri:'https://www.google.com/maps/contrib/1',photoUri:'https://lh3.googleusercontent.com/photo'},rating:5,publishTime:'2026-10-01T00:00:00Z',googleMapsUri:'https://www.google.com/maps/reviews/1'}))})}));vi.stubGlobal('fetch',fetch);
    const p=await getGooglePlace('ChIJabcdefghijk',true);expect(p.status).toBe('available');if(p.status==='available'){expect(p.reviews).toHaveLength(5);expect(p.reviews[0].author).toBe('Author');expect(p.reviews[0].url).toBeTruthy();}expect(fetch).toHaveBeenCalledWith(expect.not.stringContaining('test-key'),expect.anything());
  });
  it('does not expose upstream errors or a different place',async()=>{vi.stubEnv('GOOGLE_PLACES_ENABLED','1');vi.stubEnv('GOOGLE_MAPS_API_KEY','test-key');vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({id:'different',displayName:{text:'Other'}})})));expect((await getGooglePlace('ChIJabcdefghijk',true)).status).toBe('unavailable');});
});
it('retries only a transient DNS failure once on the identical authenticated endpoint', async()=>{
 vi.stubEnv('GOOGLE_PLACES_ENABLED','1');vi.stubEnv('GOOGLE_MAPS_API_KEY','test-key');
 const fetch=vi.fn().mockRejectedValueOnce(Object.assign(new TypeError('fetch failed'),{cause:{code:'EAI_AGAIN'}})).mockResolvedValueOnce({ok:true,json:async()=>({id:'ChIJabcdefghijk',displayName:{text:'Test'},formattedAddress:'Address'})});vi.stubGlobal('fetch',fetch);
 expect((await getGooglePlace('ChIJabcdefghijk',true)).status).toBe('available');expect(fetch).toHaveBeenCalledTimes(2);expect(fetch.mock.calls[0][0]).toBe(fetch.mock.calls[1][0]);
});
it('does not retry API rejection or ordinary transport failures',async()=>{
 vi.stubEnv('GOOGLE_PLACES_ENABLED','1');vi.stubEnv('GOOGLE_MAPS_API_KEY','test-key');const fetch=vi.fn().mockResolvedValue({ok:false,status:403});vi.stubGlobal('fetch',fetch);
 expect((await getGooglePlace('ChIJabcdefghijk',true)).status).toBe('unavailable');expect(fetch).toHaveBeenCalledTimes(1);
});
