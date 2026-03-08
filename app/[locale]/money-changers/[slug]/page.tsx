import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { cashBranches, cashProviders, cashRates } from '@/data/site';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

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

  return (
    <div className="space-y-12">
      <Section title={provider.name} description={t(provider.summary, locale)}>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card p-6">
            <Pill>Bangkok coverage</Pill>
            <p className="mt-4 text-stone-600">{branches.length} branches in current launch dataset with Google Maps jump-outs and reviewed public rates.</p>
            <a href={provider.officialUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 font-medium text-white">Open official website</a>
            <p className="mt-3 text-xs text-stone-500">{t(provider.affiliate.disclosure, locale)}</p>
            <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
              <p className="font-semibold text-ink">Scraper status</p>
              <p className="mt-2">{scrape?.ok ? 'Live official parsing active.' : 'Fallback / manual review mode.'}</p>
              {scrape?.notes?.map((note) => <p key={note} className="mt-1">- {note}</p>)}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Current branches</h2>
            <div className="mt-4 space-y-4">
              {branches.map((branch) => (
                <div key={branch.id} className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{branch.name}</p>
                      <p className="text-sm text-stone-500">{branch.address}</p>
                    </div>
                    <a href={branch.mapsUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-700">Google Maps</a>
                  </div>
                  <p className="mt-3 text-sm text-stone-600">{branch.hours} · {branch.distanceKm} km</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Observed rates" description="Latest reviewed rate samples from official public sources.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rates.map((rate) => {
            const branch = branches[0];
            const label = 'providerSlug' in rate ? `${rate.currency} · ${rate.denomination}` : `${rate.currency}`;
            return <div key={`${label}-${rate.observedAt}`} className="card p-5"><p className="text-sm text-stone-500">{branch?.name || provider.name}</p><p className="mt-2 text-2xl font-semibold">{label}</p><p className="mt-1 text-lg">Buy {rate.buyRate}</p><p className="mt-1 text-sm text-stone-500">Observed {new Date(rate.observedAt).toLocaleString()}</p></div>;
          })}
        </div>
      </Section>
    </div>
  );
}
