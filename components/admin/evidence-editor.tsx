'use client';
import { useState } from 'react';
import type { EvidenceCheck } from '@/lib/content-store';
const names = { license: '牌照', fees: '费用与提现规则', operations: '服务状态' };
export function EvidenceEditor({initial,providers}:{initial:Record<string,Record<string,EvidenceCheck>>;providers:Array<{slug:string;name:string}>}) {
  const [evidence,setEvidence]=useState(initial);const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  function update(slug:string,key:string,patch:Partial<EvidenceCheck>) {
    const previous=evidence[slug]?.[key] || {status:'unknown' as const,sourceUrl:'',checkedAt:'',expiresAt:'',note:''};
    setEvidence({...evidence,[slug]:{...evidence[slug],[key]:{...previous,...patch}}});
  }
  async function save(){setBusy(true);setMessage('');try{const response=await fetch('/api/admin/config',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({evidence})});setMessage(response.ok?'已保存核验依据。':'保存失败，请检查 HTTPS 来源和核验/到期时间。');}catch{setMessage('连接失败，请重试。');}finally{setBusy(false);}}
  return <div className="space-y-6"><p>不填写综合分。核验必须有官方来源和有效期；未核验或过期将显示待核验。费用依据需覆盖当前计算采用的交易、提现与网络规则。</p>{providers.map(p=><section className="card p-5" key={p.slug}><h2>{p.name}</h2>{Object.entries(names).map(([key,name])=>{const row=evidence[p.slug]?.[key];return <details className="mt-4" key={key}><summary>{name} · {row?.status || 'unknown'}</summary><div className="mt-3 grid gap-3 sm:grid-cols-2"><label>核验状态<select className="input" value={row?.status || 'unknown'} onChange={e=>update(p.slug,key,{status:e.target.value as EvidenceCheck['status']})}><option value="unknown">待核验</option><option value="verified">已核验</option><option value="issue">发现问题</option></select></label><label>HTTPS 官方来源<input className="input" type="url" value={row?.sourceUrl || ''} onChange={e=>update(p.slug,key,{sourceUrl:e.target.value})}/></label><label>核验时间（ISO UTC）<input className="input" placeholder="2026-10-01T00:00:00Z" value={row?.checkedAt || ''} onChange={e=>update(p.slug,key,{checkedAt:e.target.value})}/></label><label>到期时间（ISO UTC）<input className="input" value={row?.expiresAt || ''} onChange={e=>update(p.slug,key,{expiresAt:e.target.value})}/></label><label className="sm:col-span-2">核验说明<textarea className="input" value={row?.note || ''} onChange={e=>update(p.slug,key,{note:e.target.value})}/></label></div></details>;})}</section>)}<button className="btn-primary" disabled={busy} onClick={()=>void save()}>{busy?'保存中…':'保存依据'}</button><p role="status">{message}</p></div>;
}
