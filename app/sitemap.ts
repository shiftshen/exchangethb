import type { MetadataRoute } from 'next';
import { cashProviders, exchanges } from '@/data/site';
import { locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const localeRoutes = locales.flatMap((locale) => ([
    { url: `${siteUrl}/${locale}`, priority: 1, changeFrequency: 'daily' as const },
    { url: `${siteUrl}/${locale}/crypto`, priority: 0.9, changeFrequency: 'hourly' as const },
    { url: `${siteUrl}/${locale}/cash`, priority: 0.9, changeFrequency: 'hourly' as const },
    { url: `${siteUrl}/${locale}/legal/methodology`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/${locale}/legal/disclaimer`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/${locale}/legal/privacy-policy`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/${locale}/legal/affiliate-disclosure`, priority: 0.5, changeFrequency: 'monthly' as const },
  ]));

  const exchangeRoutes = locales.flatMap((locale) => exchanges.map((exchange) => ({
    url: `${siteUrl}/${locale}/exchanges/${exchange.slug}`,
    priority: 0.7,
    changeFrequency: 'daily' as const,
  })));

  const changerRoutes = locales.flatMap((locale) => cashProviders.map((provider) => ({
    url: `${siteUrl}/${locale}/money-changers/${provider.slug}`,
    priority: 0.7,
    changeFrequency: 'daily' as const,
  })));

  return [...localeRoutes, ...exchangeRoutes, ...changerRoutes];
}
