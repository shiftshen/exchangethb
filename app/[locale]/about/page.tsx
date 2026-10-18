import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { aboutContentLocale, aboutCopy, aboutMetadata } from '@/lib/brand-entity';
import { isLocale, locales } from '@/lib/i18n';
import { aboutPageJsonLd, breadcrumbJsonLd, localeRoutePath, withLocalePath } from '@/lib/seo';
import type { Locale } from '@/lib/types';

export const revalidate = 3600;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // Locales without hand-written copy render the English page (noindex, canonical to /en/about).
  const c = aboutCopy[aboutContentLocale(locale)];
  const about = aboutPageJsonLd(locale, c.metaTitle, c.metaDescription);
  const breadcrumb = breadcrumbJsonLd([
    { name: c.breadcrumbHome, item: withLocalePath(locale) },
    { name: c.title, item: withLocalePath(locale, '/about') },
  ]);
  const links: Array<[string, string]> = [
    [localeRoutePath(locale, '/cash'), c.links.cash],
    [localeRoutePath(locale, '/crypto'), c.links.crypto],
    [localeRoutePath(locale, '/legal/methodology'), c.links.methodology],
    [localeRoutePath(locale, '/data-status'), c.links.dataStatus],
    [localeRoutePath(locale, '/legal/disclaimer'), c.links.disclaimer],
    [localeRoutePath(locale, '/legal/privacy-policy'), c.links.privacy],
  ];
  return (
    <article className="simple-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(about) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="simple-intro"><h1>{c.title}</h1><p className="seo-answer">{c.intro}</p></header>
      {c.sections.map((section) => (
        <section className="seo-section" key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}
      <nav className="seo-section seo-links" aria-labelledby="about-more-heading">
        <h2 id="about-more-heading">{c.linksHeading}</h2>
        <ul>{links.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
      </nav>
    </article>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return aboutMetadata(locale);
}
