import type { MetadataRoute } from 'next';
import { exchanges, publicCashProviders } from '@/data/site';
import { locales } from '@/lib/i18n';
import { localeAlternates, siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const localeRoutes = locales.flatMap((locale) => ([
    { url: `${siteUrl}/${locale}`, priority: 1, changeFrequency: 'daily' as const, alternates: { languages: localeAlternates() } },
    { url: `${siteUrl}/${locale}/crypto`, priority: 0.9, changeFrequency: 'hourly' as const, alternates: { languages: localeAlternates('/crypto') } },
    { url: `${siteUrl}/${locale}/cash`, priority: 0.9, changeFrequency: 'hourly' as const, alternates: { languages: localeAlternates('/cash') } },
    { url: `${siteUrl}/${locale}/legal/methodology`, priority: 0.5, changeFrequency: 'monthly' as const, alternates: { languages: localeAlternates('/legal/methodology') } },
    { url: `${siteUrl}/${locale}/legal/disclaimer`, priority: 0.5, changeFrequency: 'monthly' as const, alternates: { languages: localeAlternates('/legal/disclaimer') } },
    { url: `${siteUrl}/${locale}/legal/privacy-policy`, priority: 0.5, changeFrequency: 'monthly' as const, alternates: { languages: localeAlternates('/legal/privacy-policy') } },
  ]));

  const exchangeRoutes = locales.flatMap((locale) => exchanges.map((exchange) => ({
    url: `${siteUrl}/${locale}/exchanges/${exchange.slug}`,
    priority: 0.7,
    changeFrequency: 'daily' as const,
    alternates: { languages: localeAlternates(`/exchanges/${exchange.slug}`) },
  })));

  const changerRoutes = locales.flatMap((locale) => publicCashProviders.map((provider) => ({
    url: `${siteUrl}/${locale}/money-changers/${provider.slug}`,
    priority: 0.7,
    changeFrequency: 'daily' as const,
    alternates: { languages: localeAlternates(`/money-changers/${provider.slug}`) },
  })));

  return [...localeRoutes, ...exchangeRoutes, ...changerRoutes];
}
