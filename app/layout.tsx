import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { googleSiteVerification, organizationJsonLd, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ExchangeTHB',
    template: '%s | ExchangeTHB',
  },
  description: 'ExchangeTHB compares crypto and cash routes into Thai baht with source transparency and risk disclosures.',
  openGraph: {
    type: 'website',
    siteName: 'ExchangeTHB',
    title: 'ExchangeTHB',
    description: 'Compare Crypto → THB and Cash / FX → THB with transparent source status.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExchangeTHB',
    description: 'Compare routes into Thai baht with transparent source labels.',
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
