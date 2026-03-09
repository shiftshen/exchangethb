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
    title: 'Compare Routes Into THB',
    description: 'Compare Crypto → THB and Cash / FX → THB with transparent source and fallback states.',
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
    alternates: {
      canonical: withLocalePath(locale),
      languages: localeAlternates(),
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: withLocalePath(locale),
    },
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
      <SiteHeader locale={locale} />
      <main className="container-shell py-10">{children}</main>
      <SiteFooter locale={locale} />
      {gaMeasurementId ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" /> : null}
      {gaMeasurementId ? <Script id="ga4-init" strategy="afterInteractive">{gaScript()}</Script> : null}
    </>
  );
}
