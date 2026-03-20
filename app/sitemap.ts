import type { MetadataRoute } from 'next';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { cashBranches, cashRates, exchanges, marketSnapshots, publicCashProviders } from '@/data/site';
import { indexableLocales } from '@/lib/i18n';
import { routeGuides } from '@/lib/route-guides';
import { localeAlternates, siteUrl } from '@/lib/seo';

function latestDate(values: Array<string | Date | undefined>) {
  const timestamps = values
    .filter((value): value is string | Date => Boolean(value))
    .map((value) => new Date(value))
    .sort((a, b) => b.getTime() - a.getTime());
  return timestamps[0];
}

function latestFileDate(paths: string[]) {
  const timestamps = paths
    .map((filePath) => {
      try {
        return statSync(join(process.cwd(), filePath)).mtime;
      } catch {
        return undefined;
      }
    })
    .filter((value): value is Date => Boolean(value))
    .sort((a, b) => b.getTime() - a.getTime());
  return timestamps[0];
}

function maxDate(...values: Array<Date | undefined>) {
  return values
    .filter((value): value is Date => Boolean(value))
    .sort((a, b) => b.getTime() - a.getTime())[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latestExchangeUpdate = latestDate(exchanges.map((exchange) => exchange.lastUpdated));
  const latestCashUpdate = latestDate(cashRates.map((rate) => rate.observedAt));
  const homePageUpdate = latestFileDate(['app/[locale]/page.tsx', 'components/site-footer.tsx']);
  const exchangeHubUpdate = latestFileDate(['app/[locale]/exchanges/page.tsx']);
  const moneyHubUpdate = latestFileDate(['app/[locale]/money-changers/page.tsx']);
  const exchangeProfilePageUpdate = latestFileDate(['app/[locale]/exchanges/[slug]/page.tsx']);
  const moneyProfilePageUpdate = latestFileDate(['app/[locale]/money-changers/[slug]/page.tsx', 'data/site.ts']);
  const routePageUpdate = latestFileDate(['app/[locale]/routes/[slug]/page.tsx', 'lib/route-guides.ts']);
  const routesIndexUpdate = latestFileDate(['app/[locale]/routes/page.tsx', 'lib/route-guides.ts']);
  const legalPageUpdate = latestFileDate(['app/[locale]/legal/[slug]/page.tsx']);
  const latestSiteUpdate = maxDate(latestExchangeUpdate, latestCashUpdate, homePageUpdate);
  const providerLastModified = Object.fromEntries(publicCashProviders.map((provider) => {
    const branchIds = new Set(cashBranches.filter((branch) => branch.providerSlug === provider.slug).map((branch) => branch.id));
    const scopedRates = cashRates.filter((rate) => branchIds.has(rate.branchId));
    return [provider.slug, maxDate(latestDate(scopedRates.map((rate) => rate.observedAt)) || latestCashUpdate, moneyProfilePageUpdate)];
  })) as Record<string, Date | undefined>;
  const routeLastModified = Object.fromEntries(routeGuides.map((guide) => {
    if (guide.symbol) {
      return [guide.slug, maxDate(latestDate(marketSnapshots.filter((snapshot) => snapshot.symbol === guide.symbol).map((snapshot) => snapshot.lastUpdated)) || latestExchangeUpdate, routePageUpdate)];
    }
    if (guide.currency) {
      return [guide.slug, maxDate(latestDate(cashRates.filter((rate) => rate.currency === guide.currency).map((rate) => rate.observedAt)) || latestCashUpdate, routePageUpdate)];
    }
    return [guide.slug, maxDate(guide.type === 'cash' ? latestCashUpdate : latestExchangeUpdate, routePageUpdate)];
  })) as Record<string, Date | undefined>;

  const localeRoutes = indexableLocales.flatMap((locale) => ([
    { url: locale === 'en' ? siteUrl : `${siteUrl}/${locale}`, priority: 1, changeFrequency: 'daily' as const, lastModified: latestSiteUpdate, alternates: { languages: localeAlternates() } },
    { url: `${siteUrl}/${locale}/crypto`, priority: 0.93, changeFrequency: 'hourly' as const, lastModified: latestExchangeUpdate, alternates: { languages: localeAlternates('/crypto') } },
    { url: `${siteUrl}/${locale}/cash`, priority: 0.93, changeFrequency: 'hourly' as const, lastModified: latestCashUpdate, alternates: { languages: localeAlternates('/cash') } },
    { url: `${siteUrl}/${locale}/exchanges`, priority: 0.88, changeFrequency: 'daily' as const, lastModified: maxDate(latestExchangeUpdate, exchangeHubUpdate), alternates: { languages: localeAlternates('/exchanges') } },
    { url: `${siteUrl}/${locale}/money-changers`, priority: 0.9, changeFrequency: 'daily' as const, lastModified: maxDate(latestCashUpdate, moneyHubUpdate), alternates: { languages: localeAlternates('/money-changers') } },
    { url: `${siteUrl}/${locale}/routes`, priority: 0.74, changeFrequency: 'weekly' as const, lastModified: maxDate(latestSiteUpdate, routesIndexUpdate), alternates: { languages: localeAlternates('/routes') } },
    ...routeGuides.map((guide) => ({
      url: `${siteUrl}/${locale}/routes/${guide.slug}`,
      priority: guide.currency || guide.symbol ? (guide.type === 'cash' ? 0.68 : 0.66) : 0.62,
      changeFrequency: 'weekly' as const,
      lastModified: routeLastModified[guide.slug],
      alternates: { languages: localeAlternates(`/routes/${guide.slug}`) },
    })),
    { url: `${siteUrl}/${locale}/legal/methodology`, priority: 0.5, changeFrequency: 'monthly' as const, lastModified: legalPageUpdate, alternates: { languages: localeAlternates('/legal/methodology') } },
    { url: `${siteUrl}/${locale}/legal/disclaimer`, priority: 0.5, changeFrequency: 'monthly' as const, lastModified: legalPageUpdate, alternates: { languages: localeAlternates('/legal/disclaimer') } },
    { url: `${siteUrl}/${locale}/legal/privacy-policy`, priority: 0.5, changeFrequency: 'monthly' as const, lastModified: legalPageUpdate, alternates: { languages: localeAlternates('/legal/privacy-policy') } },
  ]));

  const exchangeRoutes = indexableLocales.flatMap((locale) => exchanges.map((exchange) => ({
    url: `${siteUrl}/${locale}/exchanges/${exchange.slug}`,
    priority: 0.82,
    changeFrequency: 'daily' as const,
    lastModified: maxDate(new Date(exchange.lastUpdated), exchangeProfilePageUpdate),
    alternates: { languages: localeAlternates(`/exchanges/${exchange.slug}`) },
  })));

  const changerRoutes = indexableLocales.flatMap((locale) => publicCashProviders.map((provider) => ({
    url: `${siteUrl}/${locale}/money-changers/${provider.slug}`,
    priority: 0.84,
    changeFrequency: 'daily' as const,
    lastModified: providerLastModified[provider.slug] || latestCashUpdate,
    alternates: { languages: localeAlternates(`/money-changers/${provider.slug}`) },
  })));

  return [...localeRoutes, ...exchangeRoutes, ...changerRoutes];
}
