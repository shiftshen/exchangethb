import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui';
import { formatObserved, formatRate } from '@/lib/cash-currency-pages';
import { loadRatesMatrix, ratesCopy, ratesMatrixLocales } from '@/lib/cash-rates-matrix';
import { breadcrumbJsonLd, metadataAlternatesForPolicy, robotsForPage, siteUrl, withLocalePath } from '@/lib/seo';
import type { Locale } from '@/lib/types';

export const revalidate = 60;

export function generateStaticParams() {
  return ratesMatrixLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!ratesMatrixLocales.includes(locale)) return {};
  const copy = ratesCopy(locale);
  return {
    title: copy.title,
    description: copy.description,
    alternates: metadataAlternatesForPolicy(locale, '/rates', ratesMatrixLocales),
    robots: robotsForPage(locale, ratesMatrixLocales.includes(locale)),
    openGraph: { title: copy.title, description: copy.description, url: withLocalePath(locale, '/rates') },
  };
}

export default async function RatesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!ratesMatrixLocales.includes(locale)) notFound();
  const copy = ratesCopy(locale);
  const matrix = await loadRatesMatrix();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <div className="simple-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'ExchangeTHB', item: withLocalePath(locale) },
        { name: copy.title, item: withLocalePath(locale, '/rates') },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: copy.title,
        url: `${siteUrl}${withLocalePath(locale, '/rates')}`,
        description: copy.description,
        inLanguage: locale,
        dateModified: matrix.latestObservedAt ?? undefined,
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="simple-intro">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        {matrix.latestObservedAt ? <p className="text-sm text-stone-400" data-rates-updated={matrix.latestObservedAt}>{copy.headers.observed}: {formatObserved(matrix.latestObservedAt, locale)}</p> : null}
      </header>

      <Section title={copy.headers.currency}>
        {matrix.rows.length ? (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm" data-rates-matrix>
              <thead className="text-xs uppercase tracking-wide text-stone-400">
                <tr>
                  <th className="px-4 py-3">{copy.headers.currency}</th>
                  {matrix.providers.map((provider) => <th key={provider.slug} className="px-4 py-3">{provider.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matrix.rows.map((row) => (
                  <tr key={row.code} data-rates-row={row.code}>
                    <td className="px-4 py-3 font-semibold text-white">
                      <a className="hover:text-brand-200" href={withLocalePath(locale, `/cash/${row.code.toLowerCase()}`)}>{row.code}</a>
                    </td>
                    {matrix.providers.map((provider) => {
                      const cell = row.cells.find((item) => item.slug === provider.slug);
                      return (
                        <td key={provider.slug} className="px-4 py-3 text-stone-300" data-rates-cell={`${row.code}:${provider.slug}`}>
                          {cell ? (
                            <span>
                              <span className="font-medium text-white">{formatRate(cell.buyRate)}</span>
                              <span className="text-stone-500"> / {formatRate(cell.sellRate)}</span>
                            </span>
                          ) : <span className="text-stone-600">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="card p-6 text-stone-300">{copy.empty}</p>}
        <p className="mt-4"><a className="text-brand-300 hover:text-brand-200" href={withLocalePath(locale, '/cash')}>{copy.backLabel}</a></p>
      </Section>

      <Section title={copy.headers.provider}>
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
    </div>
  );
}
