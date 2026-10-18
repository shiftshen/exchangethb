import { describe,expect,it } from 'vitest';
import { evidenceState,providerEvidence } from '@/lib/provider-evidence';
import { parseAdminConfig } from '@/lib/content-store';
describe('evidence-backed assessment',()=>{
  const now=Date.parse('2026-10-01T12:00:00Z');
  const e={status:'verified' as const,sourceUrl:'https://www.binance.th/en',checkedAt:'2026-10-01T00:00:00Z',expiresAt:'2026-10-02T00:00:00Z',note:'Official rule checked'};
  it('does not invent verification for absent, future or expired evidence',()=>{expect(evidenceState(undefined,now)).toBe('unknown');expect(evidenceState(e,now)).toBe('verified');expect(evidenceState({...e,expiresAt:'2026-09-30T00:00:00Z'},now)).toBe('expired');expect(evidenceState({...e,checkedAt:'2026-10-02T00:00:00Z'},now)).toBe('expired');expect(providerEvidence('bitkub').every(r=>r.state==='unknown')).toBe(true);});
  it('preserves new fields and rejects unusable evidence and negative fees',()=>{const p=parseAdminConfig({evidence:{'binance-th':{fees:e}},branchOverrides:{'sia-hq-pratunam':{googlePlaceId:'ChIJabcdefghijk',googlePlaceVerified:true}}});expect(p.evidence['binance-th'].fees).toEqual(e);expect(p.branchOverrides['sia-hq-pratunam'].googlePlaceVerified).toBe(true);expect(()=>parseAdminConfig({evidence:{a:{fees:{...e,sourceUrl:'javascript:alert(1)'}}}})).toThrow();expect(()=>parseAdminConfig({feeOverrides:{a:-1}})).toThrow();});
});
