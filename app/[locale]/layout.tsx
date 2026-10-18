import { additionalCopy } from '@/lib/additional-copy';
import { SiteAnalytics } from '@/components/site-analytics';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { PublicMain } from '@/components/public-main';
import { isLocale } from '@/lib/i18n';
import { localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';

const localeMeta = {
 ru: {title:additionalCopy.ru.pages.home.title, description:additionalCopy.ru.pages.home.body},
 ko: {title:additionalCopy.ko.pages.home.title, description:additionalCopy.ko.pages.home.body},
 fr: {title:additionalCopy.fr.pages.home.title, description:additionalCopy.fr.pages.home.body},
 de: {title:additionalCopy.de.pages.home.title, description:additionalCopy.de.pages.home.body},
 id: {title:additionalCopy.id.pages.home.title, description:additionalCopy.id.pages.home.body},
 vi: {title:additionalCopy.vi.pages.home.title, description:additionalCopy.vi.pages.home.body},

  ja: { title: 'タイバーツ両替・暗号資産比較', description: '日本円からタイバーツへの両替と、タイの暗号資産取引所を比較。レートの時点、手数料の前提、第三者の情報を確認できます。' },
  th: {
    title: 'เปรียบเทียบเส้นทางแลก THB',
    description: 'เปรียบเทียบ Crypto → THB และ Cash / FX → THB ด้วยข้อมูลแหล่งที่มาแบบโปร่งใส',
  },
  en: {
    title: 'Thailand Crypto and Cash Exchange Comparison',
    description: 'Compare crypto-to-THB and cash-to-THB routes for travelers, expats, and international users with transparent source states.',
  },
  zh: {
    title: '比较换入 THB 路径',
    description: '透明展示 Crypto → THB 与 Cash / FX → THB 的来源状态与回退信息。',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = localeMeta[locale];
  return {
    title: m.title,
    description: m.description,
    alternates: localeMetadataAlternates(locale),
    openGraph: {
      title: m.title,
      description: m.description,
      url: withLocalePath(locale),
    },
    robots: localeRobots(locale),
    keywords: locale === 'en'
      ? ['Thailand exchange rates', 'crypto to THB', 'cash to THB', 'Bangkok money changer', 'THB comparison']
      : undefined,
    twitter: {
      title: m.title,
      description: m.description,
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="public-shell">
      <SiteHeader locale={locale} />
      <PublicMain>{children}</PublicMain>
      <SiteFooter locale={locale} />
      <SiteAnalytics locale={locale} />
    </div>
  );
}
