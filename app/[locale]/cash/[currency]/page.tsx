import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui';
import {
  cashCurrencyCodes,
  cashCurrencyPath,
  currencyCopy,
  currencyName,
  formatObserved,
  formatRate,
  indexedCashCurrencyLocales,
  isCashCurrencyCode,
  loadCurrencyRates,
} from '@/lib/cash-currency-pages';
import { breadcrumbJsonLd, metadataAlternatesForPolicy, robotsForPage, siteUrl, withLocalePath } from '@/lib/seo';
import type { Locale } from '@/lib/types';

export const revalidate = 60;

export function generateStaticParams() {
  return cashCurrencyCodes.flatMap((code) =>
    indexedCashCurrencyLocales.map((locale) => ({ locale, currency: code.toLowerCase() })),
  );
}

function currencyFromParam(value: string) {
  const upper = value.toUpperCase();
  return isCashCurrencyCode(upper) ? upper : null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; currency: string }> }): Promise<Metadata> {
  const { locale, currency } = await params;
  const code = currencyFromParam(currency);
  if (!code || !indexedCashCurrencyLocales.includes(locale)) return {};
  const copy = currencyCopy(locale, code);
  return {
    title: copy.title,
    description: copy.description,
    alternates: metadataAlternatesForPolicy(locale, cashCurrencyPath(code), indexedCashCurrencyLocales),
    robots: robotsForPage(locale, indexedCashCurrencyLocales.includes(locale)),
    openGraph: { title: copy.title, description: copy.description, url: withLocalePath(locale, cashCurrencyPath(code)) },
  };
}

export default async function CashCurrencyPage({ params }: { params: Promise<{ locale: Locale; currency: string }> }) {
  const { locale, currency } = await params;
  const code = currencyFromParam(currency);
  if (!code) notFound();
  if (!indexedCashCurrencyLocales.includes(locale)) notFound();

  const copy = currencyCopy(locale, code);
  const rates = await loadCurrencyRates(code);
  const best = rates.rows[0] ?? null;
  const others = cashCurrencyCodes.filter((item) => item !== code);
  const path = cashCurrencyPath(code);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.title,
    url: `${siteUrl}${withLocalePath(locale, path)}`,
    description: copy.description,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: 'ExchangeTHB', url: siteUrl },
    dateModified: rates.latestObservedAt ?? undefined,
  };

  return (
    <div className="simple-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'ExchangeTHB', item: withLocalePath(locale) },
        { name: locale === 'th' ? 'แลกเงินสด' : locale === 'zh' ? '现金换汇' : 'Cash exchange', item: withLocalePath(locale, '/cash') },
        { name: `${code} / THB`, item: withLocalePath(locale, path) },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="simple-intro">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </header>

      <Section
        title={copy.bestLabel}
        description={rates.latestObservedAt ? `${copy.tableHeaders.observed}: ${formatObserved(rates.latestObservedAt, locale)}` : undefined}
      >
        {rates.rows.length ? (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm" data-currency-rates={code}>
              <thead className="text-xs uppercase tracking-wide text-stone-400">
                <tr>
                  <th className="px-4 py-3">{copy.tableHeaders.provider}</th>
                  <th className="px-4 py-3">{copy.tableHeaders.denomination}</th>
                  <th className="px-4 py-3">{copy.tableHeaders.buy}</th>
                  <th className="px-4 py-3">{copy.tableHeaders.sell}</th>
                  <th className="px-4 py-3">{copy.tableHeaders.observed}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rates.rows.map((row, index) => (
                  <tr key={row.slug} data-rate-provider={row.slug} className={index === 0 ? 'bg-brand-500/5' : undefined}>
                    <td className="px-4 py-3">
                      <a className="text-brand-300 hover:text-brand-200" href={`/${locale}/money-changers/${row.slug}`}>{row.name}</a>
                    </td>
                    <td className="px-4 py-3 text-stone-300">{row.denomination}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatRate(row.buyRate)}</td>
                    <td className="px-4 py-3 text-stone-300">{formatRate(row.sellRate)}</td>
                    <td className="px-4 py-3 text-stone-400">{formatObserved(row.observedAt, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="card p-6 text-stone-300">{copy.noData}</p>
        )}
        {best ? (
          <p className="mt-4 text-sm text-stone-300" data-best-rate={best.slug}>
            {copy.exampleLabel} 1,000 {code} → <strong className="text-white">฿{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(1000 * best.buyRate)}</strong>
            {' · '}{best.name} ({formatObserved(best.observedAt, locale)})
          </p>
        ) : null}
        <p className="mt-4">
          <a className="text-brand-300 hover:text-brand-200" href={withLocalePath(locale, '/cash')}>{copy.backLabel}</a>
        </p>
      </Section>

      <Section title={copy.tableHeaders.provider}>
        <ul className="space-y-2 text-sm text-stone-300">
          {copy.notes.map((note) => <li key={note}>· {note}</li>)}
        </ul>
      </Section>

      <Section title="FAQ">
        <div className="space-y-4">
          {copy.faq.map((item) => (
            <div key={item.question} className="card p-5">
              <h3 className="text-base font-semibold text-white">{item.question}</h3>
              <p className="mt-2 text-sm text-stone-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={copy.relatedLabel}>
        <div className="flex flex-wrap gap-3 text-sm">
          {others.map((item) => (
            <a key={item} className="rounded-full border border-white/10 px-4 py-2 text-stone-200 hover:border-brand-500/40 hover:text-brand-300" href={withLocalePath(locale, cashCurrencyPath(item))}>
              {currencyName(locale, item)} ({item})
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
