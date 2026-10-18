import { createRequire } from 'node:module';
import { expect, it } from 'vitest';
const { validatePayload }=createRequire(import.meta.url)('../scripts/import-cash-cache.cjs');
const now=Date.parse('2026-10-02T00:00:00Z');
const date=new Date(now).toISOString();
const payload=()=>({generatedAt:date,results:[{provider:'superrich-thailand',ok:true,observedAt:date,rates:[{providerSlug:'superrich-thailand',currency:'SGD',denomination:'100 - 50',sourceUrl:'https://www.superrichthailand.com',sourceKind:'live',buyRate:26.15,sellRate:26.3,timestampKind:'collected',observedAt:date,fetchedAt:date}]}]});
it('accepts verified current quotes and failed empty sources',()=>{
  expect(()=>validatePayload(payload(),now)).not.toThrow();
  const p=payload();p.results[0].ok=false;p.results[0].rates=[];expect(()=>validatePayload(p,now)).not.toThrow();
});
it('rejects future, unsupported, mismatched or contradictory quote data before cache writes',()=>{
  for(const change of [{currency:'RUB'},{sourceUrl:'https://example.com'},{buyRate:NaN},{sellRate:20},{fetchedAt:'2026-10-03T00:00:00Z'},{observedAt:'2026-10-03T00:00:00Z'},{timestampKind:'published'}]){
    const p=payload();Object.assign(p.results[0].rates[0],change);expect(()=>validatePayload(p,now)).toThrow();
  }
  const duplicate=payload();duplicate.results.push(duplicate.results[0]);expect(()=>validatePayload(duplicate,now)).toThrow();
  const contradictory=payload();contradictory.results[0].ok=false;expect(()=>validatePayload(contradictory,now)).toThrow();
  expect(()=>validatePayload(payload(),now+600000)).toThrow();
});
