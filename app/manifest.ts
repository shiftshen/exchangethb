import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ExchangeTHB',
    short_name: 'ExchangeTHB',
    description: 'Compare Crypto → THB and Cash / FX → THB with transparent source labels.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0b0f19',
    theme_color: '#f0b90b',
    icons: [
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
