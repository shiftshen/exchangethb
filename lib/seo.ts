import type { Metadata } from 'next';
import { indexableLocales, isIndexableLocale, resolveContentLocale } from '@/lib/i18n';
import { Locale } from '@/lib/types';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const siteUrl = configuredSiteUrl && /^https?:\/\//.test(configuredSiteUrl)
  ? configuredSiteUrl.replace(/\/+$/, '')
  : 'https://www.exchangethb.com';

export const googleSiteVerification = googleVerification || undefined;

export function withLocalePath(locale: Locale, path = '') {
  const normalizedPath = !path || path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);
  return `${siteUrl}/${locale}${normalizedPath}`;
}

export function localeAlternates(path = '') {
  return Object.fromEntries([
    ...indexableLocales.map((locale) => [locale, withLocalePath(locale, path)]),
    ['x-default', withLocalePath('en', path)],
  ]) as Record<string, string>;
}

export function localeMetadataAlternates(locale: Locale, path = ''): NonNullable<Metadata['alternates']> {
  const canonicalLocale = isIndexableLocale(locale) ? locale : resolveContentLocale(locale);
  const canonical = withLocalePath(canonicalLocale, path);
  if (!isIndexableLocale(locale)) {
    return { canonical };
  }
  return {
    canonical,
    languages: localeAlternates(path),
  };
}

export function metadataAlternatesForPolicy(
  locale: Locale,
  path: string,
  indexedLocales: Locale[],
): NonNullable<Metadata['alternates']> {
  if (!indexedLocales.length) {
    return { canonical: withLocalePath(locale, path) };
  }
  const canonicalLocale = indexedLocales.includes(locale) ? locale : indexedLocales[0];
  return {
    canonical: withLocalePath(canonicalLocale, path),
    languages: Object.fromEntries([
      ...indexedLocales.map((indexedLocale) => [indexedLocale, withLocalePath(indexedLocale, path)]),
      ['x-default', withLocalePath(indexedLocales.includes('en') ? 'en' : indexedLocales[0], path)],
    ]),
  };
}

export function localeRobots(locale: Locale): Metadata['robots'] | undefined {
  if (indexableLocales.includes(locale as (typeof indexableLocales)[number])) return undefined;
  return {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  };
}

export function robotsForPage(locale: Locale, shouldIndex: boolean): Metadata['robots'] | undefined {
  if (shouldIndex) return localeRobots(locale);
  return {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  };
}

export function localeRoutePath(locale: Locale, path = '') {
  const normalizedPath = !path || path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);
  return `/${locale}${normalizedPath}`;
}

export function breadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export const brandAlternateNames = ['Exchange THB', 'exchangethb.com', 'ExchangeTHB.com'];
export const organizationId = () => `${siteUrl}/#organization`;
export const websiteId = () => `${siteUrl}/#website`;

// One sentence, taken from the description already published in llms.txt.
export const brandDescription = 'ExchangeTHB compares what it actually costs to get Thai baht (THB): cash money changers in Bangkok against Thai SEC-licensed crypto exchanges. It is a comparison site, not the transaction provider.';

/** Organization node without @context, so it can sit inside an @graph. */
/** Drop the top-level @context so a schema.org object can be placed inside an @graph. */
export function graphNode<T extends { '@context'?: unknown }>(entry: T): Omit<T, '@context'> {
  const copy = { ...entry };
  delete copy['@context'];
  return copy;
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': organizationId(),
    name: 'ExchangeTHB',
    alternateName: brandAlternateNames,
    url: `${siteUrl}/`,
    // public/ has only SVG brand assets (no PNG), so the ImageObject points at the SVG.
    logo: { '@type': 'ImageObject', url: `${siteUrl}/brand-logo.svg`, width: 1280, height: 360 },
    image: `${siteUrl}/brand-logo.svg`,
    description: brandDescription,
    // No official social profile exists yet; never invent one.
    sameAs: [] as string[],
  };
}

export function organizationJsonLd() {
  return { '@context': 'https://schema.org', ...organizationNode() };
}

/** WebSite node without @context. It names the brand and points at the Organization by @id. */
export function websiteNode(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    name: 'ExchangeTHB',
    alternateName: brandAlternateNames,
    url: `${siteUrl}/`,
    inLanguage: locale,
    publisher: { '@id': organizationId() },
  };
}

/** Homepage graph: WebSite + Organization (+ the page-level nodes passed in). */
export function homeGraphJsonLd(locale: Locale, extra: Array<Record<string, unknown>> = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(locale), organizationNode(), ...extra],
  };
}

export function aboutPageJsonLd(locale: Locale, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${withLocalePath(locale, '/about')}#aboutpage`,
    name,
    description,
    url: withLocalePath(locale, '/about'),
    inLanguage: locale,
    about: { '@id': organizationId() },
    isPartOf: { '@id': websiteId() },
    publisher: { '@id': organizationId() },
  };
}

export function websiteJsonLd(locale: Locale, path = '', description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ExchangeTHB',
    url: withLocalePath(locale, path),
    inLanguage: locale,
    description,
  };
}

export function collectionPageJsonLd(locale: Locale, path: string, name: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: withLocalePath(locale, path),
    inLanguage: locale,
    description,
    isPartOf: { '@id': websiteId() },
  };
}

export function faqPageJsonLd(entries: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

export function itemListJsonLd(items: Array<{ name: string; url: string }>, name?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
