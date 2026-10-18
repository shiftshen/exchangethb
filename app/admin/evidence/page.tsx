import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { readAdminConfig } from '@/lib/content-store';
import { exchanges } from '@/data/site';
import { EvidenceEditor } from '@/components/admin/evidence-editor';
export default async function EvidencePage(){if(!await getAdminSession())redirect('/admin/login');const config=await readAdminConfig();return <main className="container-shell py-10"><h1 className="mb-6 text-3xl">平台核验依据</h1><EvidenceEditor initial={config.evidence} providers={exchanges.map(({slug,name})=>({slug,name}))}/></main>;}
