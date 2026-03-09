import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { cashBranches, cashProviders, cashRates } from '@/data/site';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

const copy = {
  th: {
    coverage: 'ความครอบคลุมในกรุงเทพ',
    coverageBody: 'มี {count} สาขาในชุดข้อมูลเปิดตัว พร้อมลิงก์ Google Maps และอัตราที่ผ่านการทบทวนจากแหล่งสาธารณะ',
    official: 'เปิดเว็บไซต์ทางการ',
    scraper: 'สถานะตัวดึงข้อมูล',
    live: 'กำลังดึงข้อมูลทางการแบบสด',
    fallback: 'โหมด fallback / manual review',
    branches: 'สาขาปัจจุบัน',
    rates: 'อัตราที่สังเกตได้',
    ratesDesc: 'ตัวอย่างอัตราล่าสุดจากแหล่งสาธารณะทางการที่ผ่านการตรวจทาน',
    maps: 'Google Maps',
    observed: 'สังเกตเมื่อ',
    buy: 'รับซื้อ',
  },
  en: {
    coverage: 'Bangkok coverage',
    coverageBody: '{count} branches in current launch dataset with Google Maps jump-outs and reviewed public rates.',
    official: 'Open official website',
    scraper: 'Scraper status',
    live: 'Live official parsing active.',
    fallback: 'Fallback / manual review mode.',
    branches: 'Current branches',
    rates: 'Observed rates',
    ratesDesc: 'Latest reviewed rate samples from official public sources.',
    maps: 'Google Maps',
    observed: 'Observed',
    buy: 'Buy',
  },
  zh: {
    coverage: '曼谷覆盖情况',
    coverageBody: '当前首发数据包含 {count} 家门店，并提供 Google Maps 跳转与审核后的公开汇率。',
    official: '打开官网',
    scraper: '抓取状态',
    live: '官方数据解析正常运行。',
    fallback: '处于 fallback / 人工审核模式。',
    branches: '当前门店',
    rates: '观测汇率',
    ratesDesc: '来自官方公开来源并经过审核的最新汇率样本。',
    maps: 'Google Maps',
    observed: '观测时间',
    buy: '买入',
  },
} as const;

async function getScrapeCache() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'content', 'cash-scrape-cache.json'), 'utf8');
    return JSON.parse(raw) as { generatedAt: string | null; results: Array<{ provider: string; ok: boolean; notes: string[]; rates?: Array<{ providerSlug: string; currency: string; denomination: string; buyRate: number; sellRate: number; observedAt: string; sourceUrl: string; }> }> };
  } catch {
    return { generatedAt: null, results: [] };
  }
}

export default async function MoneyChangerDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const provider = cashProviders.find((item) => item.slug === slug);
  if (!provider) notFound();

  const branches = cashBranches.filter((branch) => branch.providerSlug === slug);
  const cache = await getScrapeCache();
  const scrape = cache.results.find((item) => item.provider === slug || item.provider === provider.slug);
  const liveRates = (scrape?.rates || []).filter((rate) => rate.providerSlug === slug);
  const rates = liveRates.length
    ? liveRates
    : cashRates.filter((rate) => branches.some((branch) => branch.id === rate.branchId));
  const c = copy[locale];

  return (
    <div className="space-y-12">
      <Section title={provider.name} description={t(provider.summary, locale)}>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card p-6">
            <Pill>{c.coverage}</Pill>
            <p className="mt-4 text-stone-600">{c.coverageBody.replace('{count}', String(branches.length))}</p>
            <a href={provider.officialUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 font-medium text-white">{c.official}</a>
            <p className="mt-3 text-xs text-stone-500">{t(provider.affiliate.disclosure, locale)}</p>
            <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
              <p className="font-semibold text-ink">{c.scraper}</p>
              <p className="mt-2">{scrape?.ok ? c.live : c.fallback}</p>
              {scrape?.notes?.map((note) => <p key={note} className="mt-1">- {note}</p>)}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">{c.branches}</h2>
            <div className="mt-4 space-y-4">
              {branches.map((branch) => (
                <div key={branch.id} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{branch.name}</p>
                      <p className="text-sm text-stone-500">{branch.address}</p>
                    </div>
                    <a href={branch.mapsUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-700">{c.maps}</a>
                  </div>
                  <p className="mt-3 text-sm text-stone-600">{branch.hours} · {branch.distanceKm} km</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title={c.rates} description={c.ratesDesc}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rates.map((rate) => {
            const branch = branches[0];
            const label = 'providerSlug' in rate ? `${rate.currency} · ${rate.denomination}` : `${rate.currency}`;
            return <div key={`${label}-${rate.observedAt}`} className="card p-5"><p className="text-sm text-stone-500">{branch?.name || provider.name}</p><p className="mt-2 text-2xl font-semibold">{label}</p><p className="mt-1 text-lg">{c.buy} {rate.buyRate}</p><p className="mt-1 text-sm text-stone-500">{c.observed} {new Date(rate.observedAt).toLocaleString()}</p></div>;
          })}
        </div>
      </Section>
    </div>
  );
}
