import { notFound } from 'next/navigation';
import { exchanges } from '@/data/site';
import { exchangeAdapters } from '@/lib/adapters/exchanges';
import { TrackAnchor } from '@/components/track-link';
import { resolveAffiliateLink } from '@/lib/affiliate';
import { readAdminConfig } from '@/lib/content-store';
import { describeMarketSource } from '@/lib/market-data';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

export default async function ExchangeDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const exchange = exchanges.find((item) => item.slug === slug);
  if (!exchange) notFound();

  const adapter = exchangeAdapters.find((item) => item.slug === slug);
  const [health, snapshots, config] = adapter
    ? await Promise.all([adapter.checkHealth(), adapter.fetchSnapshots('BTC'), readAdminConfig()])
    : [null, [], await readAdminConfig()];
  const latestSnapshot = snapshots[0];
  const source = latestSnapshot ? describeMarketSource(latestSnapshot) : null;
  const profile = config.exchangeProfiles[exchange.slug] || { recommended: true, tags: [], riskNote: '' };
  const score = Object.values(exchange.score).reduce((sum, value) => sum + value, 0);
  const affiliate = resolveAffiliateLink(config.affiliateLinks[exchange.slug] || exchange.affiliate);
  const outboundUrl = affiliate.outboundUrl;

  return (
    <div className="space-y-12">
      <Section title={exchange.name} description={t(exchange.summary, locale)}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-5 p-6">
            <Pill>{exchange.license}</Pill>
            <div className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${source?.live ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {source?.live ? 'Live market adapter' : 'Fallback snapshot mode'}
            </div>
            <div>
              <p className="text-sm text-stone-500">Editorial score</p>
              <p className="mt-2 text-4xl font-semibold">{score}/100</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
              <p>Recommendation: {profile.recommended ? 'recommended' : 'watchlist'}</p>
              <p className="mt-1">Tags: {profile.tags.length ? profile.tags.join(', ') : '-'}</p>
              <p className="mt-1">Risk note: {profile.riskNote || '-'}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
              {health?.note || 'No adapter health note available.'}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {exchange.strengths.map((item) => <div key={item.en} className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">{t(item, locale)}</div>)}
              {exchange.cautions.map((item) => <div key={item.en} className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">{t(item, locale)}</div>)}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Fees and routing</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-600">
              <p>Trading fee: {exchange.fee.tradingFeePct}%</p>
              <p>THB withdrawal fee: {exchange.fee.thbWithdraw} THB</p>
              <p>Supported launch pairs: {exchange.pairs.join(', ')}</p>
              <p>Source layer: {source?.label || 'Reviewed fallback dataset'}</p>
              <p>Freshness: {source?.freshness || 'Fallback snapshot'}</p>
              {source?.fallbackReason ? <p>Fallback reason: {source.fallbackReason}</p> : null}
              <p>Last reviewed: {new Date(exchange.lastUpdated).toLocaleString()}</p>
              <p>Latest market update: {latestSnapshot ? new Date(latestSnapshot.lastUpdated).toLocaleString() : 'N/A'}</p>
            </div>
            <TrackAnchor href={outboundUrl} target="_blank" rel="noreferrer" eventName="affiliate_click" eventParams={{ exchange: exchange.slug, status: affiliate.effectiveStatus }} className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 font-medium text-white">Open official / tracked link</TrackAnchor>
            <p className="mt-3 text-xs text-stone-500">{t(affiliate.disclosure, locale)}</p>
            <p className="mt-1 text-xs text-stone-500">Affiliate status: {affiliate.effectiveStatus}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
