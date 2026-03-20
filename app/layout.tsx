import './globals.css';
import type { Metadata } from 'next';
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organization = organizationJsonLd();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        {children}
      </body>
    </html>
  );
}
