import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ExchangeTHB',
    short_name: 'ExchangeTHB',
    description: 'Compare Crypto → THB and Cash / FX → THB with transparent source labels.',
    start_url: '/th',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f766e',
    icons: [],
  };
}
