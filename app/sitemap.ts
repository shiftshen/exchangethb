import type { MetadataRoute } from 'next';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { exchanges, publicCashProviders } from '@/data/site';
import { coreIndexLocales, indexedLegalSlugs, indexedRouteSlugs } from '@/lib/indexing-policy';
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

function englishOnly(path: string) {
  return {
    en: `${siteUrl}/en${path}`,
    'x-default': `${siteUrl}/en${path}`,
  };
}

function englishThai(path: string) {
  return {
    en: `${siteUrl}/en${path}`,
    th: `${siteUrl}/th${path}`,
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
  ]);
  const legalUpdated = fileDate(['app/[locale]/legal/[slug]/page.tsx']);
  const exchangeUpdated = fileDate(['app/[locale]/exchanges/[slug]/page.tsx', 'data/site.ts']);
  const moneyChangerUpdated = fileDate(['app/[locale]/money-changers/[slug]/page.tsx', 'data/site.ts']);
  const routeUpdated = fileDate(['app/[locale]/routes/[slug]/page.tsx', 'lib/route-guides.ts']);

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

  const exchangeProfiles = exchanges.map((exchange) => ({
    url: `${siteUrl}/en/exchanges/${exchange.slug}`,
    priority: 0.72,
    changeFrequency: 'weekly' as const,
    lastModified: exchangeUpdated,
    alternates: { languages: englishOnly(`/exchanges/${exchange.slug}`) },
  }));

  const moneyChangerProfiles = publicCashProviders.flatMap((provider) => [
    {
      url: `${siteUrl}/en/money-changers/${provider.slug}`,
      priority: 0.82,
      changeFrequency: 'daily' as const,
      lastModified: moneyChangerUpdated,
      alternates: { languages: englishThai(`/money-changers/${provider.slug}`) },
    },
    {
      url: `${siteUrl}/th/money-changers/${provider.slug}`,
      priority: 0.78,
      changeFrequency: 'daily' as const,
      lastModified: moneyChangerUpdated,
      alternates: { languages: englishThai(`/money-changers/${provider.slug}`) },
    },
  ]);

  const routes = indexedRouteSlugs.map((slug) => ({
    url: `${siteUrl}/en/routes/${slug}`,
    priority: 0.58,
    changeFrequency: 'weekly' as const,
    lastModified: routeUpdated,
    alternates: { languages: englishOnly(`/routes/${slug}`) },
  }));

  return [...core, ...legal, ...exchangeProfiles, ...moneyChangerProfiles, ...routes];
}
