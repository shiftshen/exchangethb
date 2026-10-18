import { expect, it } from 'vitest';
import { effectiveBranchLocation } from '@/lib/cash-entities';
it('uses verified Google coordinates for under thirty days and then returns to the reference location',()=>{
 const branch={latitude:13,longitude:100,locationPrecision:'reference'};
 const fetchedAt='2026-10-02T00:00:00Z'; const override={googlePlaceVerified:true,googleLocation:{latitude:13.7785195,longitude:100.5763319,fetchedAt}};
 expect(effectiveBranchLocation(branch,override,Date.parse(fetchedAt)+1000).latitude).toBe(13.7785195);
 expect(effectiveBranchLocation(branch,override,Date.parse(fetchedAt)+30*86400000).latitude).toBe(13);
 expect(effectiveBranchLocation(branch,{...override,googlePlaceVerified:false},Date.parse(fetchedAt)+1000).latitude).toBe(13);
});
