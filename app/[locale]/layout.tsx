import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { gaMeasurementId, gaScript } from '@/lib/analytics';
import { isLocale } from '@/lib/i18n';

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
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{gaScript()}</Script>
    </>
  );
}
