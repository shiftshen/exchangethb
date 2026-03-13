import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { gaMeasurementId, gaScript } from '@/lib/analytics';
import { isLocale } from '@/lib/i18n';
import { localeAlternates, withLocalePath } from '@/lib/seo';

const localeMeta = {
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
  ja: {
    title: 'タイバーツへの交換ルート比較',
    description: 'Crypto -> THB と Cash / FX -> THB を、データ状態を明示しながら比較します。',
  },
  ko: {
    title: '태국 바트 전환 경로 비교',
    description: 'Crypto -> THB 및 Cash / FX -> THB 경로를 데이터 상태와 함께 비교합니다.',
  },
  de: {
    title: 'Vergleich von THB-Wechselrouten',
    description: 'Vergleiche Krypto- und Bargeldrouten in THB mit transparenten Datenstatus-Hinweisen.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = localeMeta[locale];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: withLocalePath(locale),
      languages: localeAlternates(),
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: withLocalePath(locale),
    },
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
    <>
      <Script id="locale-html-lang" strategy="beforeInteractive">{`document.documentElement.lang = ${JSON.stringify(locale)};`}</Script>
      <SiteHeader locale={locale} />
      <main className="container-shell py-10">{children}</main>
      <SiteFooter locale={locale} />
      {gaMeasurementId ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" /> : null}
      {gaMeasurementId ? <Script id="ga4-init" strategy="afterInteractive">{gaScript()}</Script> : null}
    </>
  );
}
