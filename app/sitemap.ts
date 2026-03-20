import type { MetadataRoute } from 'next';
import { cashRates, exchanges, publicCashProviders } from '@/data/site';
import { indexableLocales } from '@/lib/i18n';
import { routeGuides } from '@/lib/route-guides';
import { localeAlternates, siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const latestExchangeUpdate = exchanges
    .map((exchange) => new Date(exchange.lastUpdated))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const latestCashUpdate = cashRates
    .map((rate) => new Date(rate.observedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const latestSiteUpdate = [latestExchangeUpdate, latestCashUpdate]
    .filter((value): value is Date => Boolean(value))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const localeRoutes = indexableLocales.flatMap((locale) => ([
    { url: locale === 'en' ? siteUrl : `${siteUrl}/${locale}`, priority: 1, changeFrequency: 'daily' as const, lastModified: latestSiteUpdate, alternates: { languages: localeAlternates() } },
    { url: `${siteUrl}/${locale}/crypto`, priority: 0.9, changeFrequency: 'hourly' as const, lastModified: latestExchangeUpdate, alternates: { languages: localeAlternates('/crypto') } },
    { url: `${siteUrl}/${locale}/cash`, priority: 0.9, changeFrequency: 'hourly' as const, lastModified: latestCashUpdate, alternates: { languages: localeAlternates('/cash') } },
    { url: `${siteUrl}/${locale}/routes`, priority: 0.85, changeFrequency: 'weekly' as const, lastModified: latestSiteUpdate, alternates: { languages: localeAlternates('/routes') } },
    ...routeGuides.map((guide) => ({
      url: `${siteUrl}/${locale}/routes/${guide.slug}`,
      priority: guide.type === 'cash' ? 0.82 : 0.8,
      changeFrequency: 'weekly' as const,
      lastModified: guide.type === 'cash' ? latestCashUpdate : latestExchangeUpdate,
      alternates: { languages: localeAlternates(`/routes/${guide.slug}`) },
    })),
    { url: `${siteUrl}/${locale}/legal/methodology`, priority: 0.5, changeFrequency: 'monthly' as const, alternates: { languages: localeAlternates('/legal/methodology') } },
    { url: `${siteUrl}/${locale}/legal/disclaimer`, priority: 0.5, changeFrequency: 'monthly' as const, alternates: { languages: localeAlternates('/legal/disclaimer') } },
    { url: `${siteUrl}/${locale}/legal/privacy-policy`, priority: 0.5, changeFrequency: 'monthly' as const, alternates: { languages: localeAlternates('/legal/privacy-policy') } },
  ]));

  const exchangeRoutes = indexableLocales.flatMap((locale) => exchanges.map((exchange) => ({
    url: `${siteUrl}/${locale}/exchanges/${exchange.slug}`,
    priority: 0.7,
    changeFrequency: 'daily' as const,
    lastModified: new Date(exchange.lastUpdated),
    alternates: { languages: localeAlternates(`/exchanges/${exchange.slug}`) },
  })));

  const changerRoutes = indexableLocales.flatMap((locale) => publicCashProviders.map((provider) => ({
    url: `${siteUrl}/${locale}/money-changers/${provider.slug}`,
    priority: 0.8,
    changeFrequency: 'daily' as const,
    lastModified: latestCashUpdate,
    alternates: { languages: localeAlternates(`/money-changers/${provider.slug}`) },
  })));

  return [...localeRoutes, ...exchangeRoutes, ...changerRoutes];
}
