import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import LocaleHomePage, { generateMetadata as generateLocaleHomeMetadata } from '@/app/[locale]/page';
import { gaMeasurementId, gaScript } from '@/lib/analytics';

export async function generateMetadata(): Promise<Metadata> {
  return generateLocaleHomeMetadata({ params: Promise.resolve({ locale: 'en' }) });
}

export default function IndexPage() {
  return (
    <>
      <SiteHeader locale="en" />
      <main className="container-shell py-10">
        <LocaleHomePage params={Promise.resolve({ locale: 'en' })} />
      </main>
      <SiteFooter locale="en" />
      {gaMeasurementId ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" /> : null}
      {gaMeasurementId ? <Script id="ga4-init" strategy="afterInteractive">{gaScript()}</Script> : null}
    </>
  );
}
