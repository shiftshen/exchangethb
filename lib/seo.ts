import { Locale } from '@/lib/types';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const siteUrl = configuredSiteUrl && /^https?:\/\//.test(configuredSiteUrl)
  ? configuredSiteUrl.replace(/\/+$/, '')
  : 'https://www.exchangethb.com';

export const googleSiteVerification = googleVerification || undefined;

export function withLocalePath(locale: Locale, path = '') {
  return `${siteUrl}/${locale}${path}`;
}

export function localeAlternates(path = '') {
  return {
    th: withLocalePath('th', path),
    en: withLocalePath('en', path),
    zh: withLocalePath('zh', path),
    ja: withLocalePath('ja', path),
    ko: withLocalePath('ko', path),
    de: withLocalePath('de', path),
    'x-default': withLocalePath('en', path),
  };
}

export function localeRoutePath(locale: Locale, path = '') {
  return `/${locale}${path}`;
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

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ExchangeTHB',
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    sameAs: [],
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
    potentialAction: {
      '@type': 'SearchAction',
      target: `${withLocalePath(locale)}/crypto?symbol={symbol}&amount={amount}`,
      'query-input': ['required name=symbol', 'required name=amount'],
    },
  };
}
