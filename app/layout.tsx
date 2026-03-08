import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://exchangethb.com'),
  title: 'ExchangeTHB',
  description: 'Find the best way to exchange into Thai baht.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
