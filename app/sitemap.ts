import type { MetadataRoute } from 'next';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { exchanges, publicCashProviders } from '@/data/site';
import { coreIndexLocales, hubAlternateLocales, indexedAboutLocales, indexedLegalSlugs, indexedRouteLocales, indexedRouteSlugs } from '@/lib/indexing-policy';
import { localeAlternates, siteUrl } from '@/lib/seo';

function fileDate(paths: string[]) {
  return paths
    .map((path) => {
      try {
        return statSync(join(process.cwd(), path)).mtime;
      } catch {
        return undefined;
      }
    })
    .filter((value): value is Date => Boolean(value))
    .sort((left, right) => right.getTime() - left.getTime())[0];
}

function englishThaiAndChinese(path: string) {
  return {
    en: `${siteUrl}/en${path}`,
    th: `${siteUrl}/th${path}`,
    zh: `${siteUrl}/zh${path}`,
    'x-default': `${siteUrl}/en${path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const coreUpdated = fileDate([
    'app/[locale]/page.tsx',
    'app/[locale]/cash/page.tsx',
    'app/[locale]/crypto/page.tsx',
    'components/home-comparison.tsx',
    'components/cash-decision-tool.tsx',
    'components/crypto-decision-tool.tsx',
    'components/exchange-picker.tsx',
    'components/exchange-guide.tsx',
  ]);
  const legalUpdated = fileDate(['app/[locale]/legal/[slug]/page.tsx', 'lib/japanese-legal.ts', 'lib/additional-languages.json', 'lib/locale-preferences.ts']);
  const exchangeUpdated = fileDate(['app/[locale]/exchanges/[slug]/page.tsx', 'lib/exchange-seo.ts', 'data/site.ts']);
  const moneyChangerUpdated = fileDate(['app/[locale]/money-changers/[slug]/page.tsx', 'data/site.ts']);
  const routeUpdated = fileDate(['app/[locale]/routes/[slug]/page.tsx', 'lib/route-guides.ts']);
  const exchangeHubUpdated = fileDate(['app/[locale]/exchanges/page.tsx', 'data/site.ts']);

  const core = coreIndexLocales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      priority: 1,
      changeFrequency: 'daily' as const,
      lastModified: coreUpdated,
      alternates: { languages: localeAlternates() },
    },
    {
      url: `${siteUrl}/${locale}/cash`,
      priority: 0.95,
      changeFrequency: 'hourly' as const,
      lastModified: coreUpdated,
      alternates: { languages: localeAlternates('/cash') },
    },
    {
      url: `${siteUrl}/${locale}/crypto`,
      priority: 0.95,
      changeFrequency: 'hourly' as const,
      lastModified: coreUpdated,
      alternates: { languages: localeAlternates('/crypto') },
    },
  ]);

  const legal = coreIndexLocales.flatMap((locale) => indexedLegalSlugs.map((slug) => ({
    url: `${siteUrl}/${locale}/legal/${slug}`,
    priority: 0.35,
    changeFrequency: 'monthly' as const,
    lastModified: legalUpdated,
    alternates: { languages: localeAlternates(`/legal/${slug}`) },
  })));

  const aboutUpdated = fileDate(['app/[locale]/about/page.tsx', 'lib/brand-entity.ts']);
  const about = indexedAboutLocales.map((locale) => ({
    url: `${siteUrl}/${locale}/about`,
    priority: 0.5,
    changeFrequency: 'monthly' as const,
    lastModified: aboutUpdated,
    alternates: { languages: englishThaiAndChinese('/about') },
  }));

  const exchangeProfiles = exchanges.flatMap((exchange) => [
    {
      url: `${siteUrl}/en/exchanges/${exchange.slug}`,
      priority: 0.72,
      changeFrequency: 'weekly' as const,
      lastModified: exchangeUpdated,
      alternates: { languages: englishThaiAndChinese(`/exchanges/${exchange.slug}`) },
    },
    {
      url: `${siteUrl}/th/exchanges/${exchange.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: exchangeUpdated,
      alternates: { languages: englishThaiAndChinese(`/exchanges/${exchange.slug}`) },
    },
    {
      url: `${siteUrl}/zh/exchanges/${exchange.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: exchangeUpdated,
      alternates: { languages: englishThaiAndChinese(`/exchanges/${exchange.slug}`) },
    },
  ]);

  const moneyChangerProfiles = publicCashProviders.flatMap((provider) => [
    {
      url: `${siteUrl}/en/money-changers/${provider.slug}`,
      priority: 0.82,
      changeFrequency: 'daily' as const,
      lastModified: moneyChangerUpdated,
      alternates: { languages: englishThaiAndChinese(`/money-changers/${provider.slug}`) },
    },
    {
      url: `${siteUrl}/th/money-changers/${provider.slug}`,
      priority: 0.78,
      changeFrequency: 'daily' as const,
      lastModified: moneyChangerUpdated,
      alternates: { languages: englishThaiAndChinese(`/money-changers/${provider.slug}`) },
    },
    {
      url: `${siteUrl}/zh/money-changers/${provider.slug}`,
      priority: 0.78,
      changeFrequency: 'daily' as const,
      lastModified: moneyChangerUpdated,
      alternates: { languages: englishThaiAndChinese(`/money-changers/${provider.slug}`) },
    },
  ]);

  const routes = indexedRouteSlugs.flatMap((slug) => indexedRouteLocales.map((locale) => ({
    url: `${siteUrl}/${locale}/routes/${slug}`,
    priority: 0.58,
    changeFrequency: 'weekly' as const,
    lastModified: routeUpdated,
    alternates: { languages: englishThaiAndChinese(`/routes/${slug}`) },
  })));

  const hubs = hubAlternateLocales().flatMap((locale) => ['/exchanges', '/money-changers'].map((path) => ({
    url: `${siteUrl}/${locale}${path}`,
    priority: 0.9,
    changeFrequency: 'daily' as const,
    lastModified: path === '/exchanges' ? exchangeHubUpdated : moneyChangerUpdated,
    alternates: { languages: englishThaiAndChinese(path) },
  })));

  return [...core, ...legal, ...about, ...hubs, ...exchangeProfiles, ...moneyChangerProfiles, ...routes];
}
