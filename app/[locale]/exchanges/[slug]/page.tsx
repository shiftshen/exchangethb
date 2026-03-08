import { notFound } from 'next/navigation';
import { exchanges } from '@/data/site';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

export default async function ExchangeDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const exchange = exchanges.find((item) => item.slug === slug);
  if (!exchange) notFound();

  const score = Object.values(exchange.score).reduce((sum, value) => sum + value, 0);
  const outboundUrl = exchange.affiliate.trackingUrl || exchange.affiliate.officialUrl;

  return (
    <div className="space-y-12">
      <Section title={exchange.name} description={t(exchange.summary, locale)}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-5 p-6">
            <Pill>{exchange.license}</Pill>
            <div>
              <p className="text-sm text-stone-500">Editorial score</p>
              <p className="mt-2 text-4xl font-semibold">{score}/100</p>
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
              <p>Last reviewed: {new Date(exchange.lastUpdated).toLocaleString()}</p>
            </div>
            <a href={outboundUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 font-medium text-white">Open official / tracked link</a>
            <p className="mt-3 text-xs text-stone-500">{t(exchange.affiliate.disclosure, locale)}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
