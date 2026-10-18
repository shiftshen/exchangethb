import { isLocale } from '@/lib/i18n';
import './globals.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
import { googleSiteVerification, organizationJsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Thailand Crypto Exchange and Bangkok Money Changer Comparison | ExchangeTHB',
    template: '%s | ExchangeTHB',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
  },
  description: 'Compare crypto exchanges and Bangkok money changers for THB conversion with transparent fees, rate context, and branch references.',
  openGraph: {
    type: 'website',
    siteName: 'ExchangeTHB',
    title: 'Thailand Crypto Exchange and Bangkok Money Changer Comparison | ExchangeTHB',
    description: 'Compare crypto exchanges and Bangkok money changers for THB conversion with transparent fees, rate context, and branch references.',
    url: siteUrl,
    images: [
      {
        url: '/brand-logo.svg',
        width: 1280,
        height: 360,
        alt: 'ExchangeTHB',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thailand Crypto Exchange and Bangkok Money Changer Comparison | ExchangeTHB',
    description: 'Compare crypto exchanges and Bangkok money changers for THB conversion with transparent fees, rate context, and branch references.',
    images: ['/brand-logo.svg'],
  },
  verification: {
    google: googleSiteVerification,
  },
  other: {
    'google-adsense-account': 'ca-pub-8386341379958173',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const organization = organizationJsonLd();
  const requestHeaders = await headers();
  const locale = requestHeaders.get('x-resolved-locale');
  // The homepage emits Organization inside its own @graph; every other page emits it here.
  const isHome = requestHeaders.get('x-public-home') === '1';
  const htmlLang = locale && isLocale(locale) ? locale : 'en';
  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <script
          id="travelpayouts-drive"
          {...{ nowprocket: '', 'seraph-accel-crit': '1' }}
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          data-no-defer="1"
          data-cmp-ab="2"
          dangerouslySetInnerHTML={{ __html: `(function () {
            if (document.querySelector('script[src="https://tpembars.com/NTgwMjY5.js?t=580269"]')) return;
            var script = document.createElement("script");
            script.async = 1;
            script.setAttribute("data-cmp-ab", "2");
            script.src = 'https://tpembars.com/NTgwMjY5.js?t=580269';
            document.head.appendChild(script);
          })();` }}
        />
        {requestHeaders.get('x-public-adsense') === '1' && <script async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8386341379958173"
          crossOrigin="anonymous" />}
      </head>
      <body>
        {!isHome && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />}
        {children}
      </body>
    </html>
  );
}
