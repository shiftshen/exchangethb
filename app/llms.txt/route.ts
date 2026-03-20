import { NextResponse } from 'next/server';
import { siteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = [
    '# ExchangeTHB',
    '',
    '> ExchangeTHB helps users find the most practical and cost-aware route into Thai baht, whether they start from crypto or cash.',
    '',
    '## What this site covers',
    '- Crypto to THB comparison in Thailand',
    '- Cash / FX to THB comparison in Bangkok',
    '- Country-intent and travel-intent route guides for THB exchange decisions',
    '- Transparent live / hybrid / fallback labeling',
    '',
    '## Important scope notes',
    '- The live cash compare set currently covers USD, CNY, EUR, JPY, and GBP.',
    '- Country-intent pages such as Korea to Thailand are decision-support pages, not fake live KRW pricing pages.',
    '- ExchangeTHB is a comparison and routing site, not the transaction provider.',
    '',
    '## Primary entry points',
    `- Home: ${siteUrl}/`,
    `- Crypto compare: ${siteUrl}/en/crypto`,
    `- Cash compare: ${siteUrl}/en/cash`,
    `- Methodology: ${siteUrl}/en/legal/methodology`,
    `- Sitemap: ${siteUrl}/sitemap.xml`,
    '',
    '## High-intent route pages',
    `- ${siteUrl}/en/routes/btc-to-thb`,
    `- ${siteUrl}/en/routes/usdt-to-thb`,
    `- ${siteUrl}/en/routes/usd-cash-to-thb`,
    `- ${siteUrl}/en/routes/eur-cash-to-thb`,
    `- ${siteUrl}/en/routes/us-to-thailand-money-exchange`,
    `- ${siteUrl}/en/routes/uk-to-thailand-money-exchange`,
    `- ${siteUrl}/en/routes/japan-to-thailand-money-exchange`,
    `- ${siteUrl}/en/routes/korea-to-thailand-money-exchange`,
    `- ${siteUrl}/en/routes/germany-to-thailand-money-exchange`,
    `- ${siteUrl}/en/routes/europe-to-thailand-money-exchange`,
    `- ${siteUrl}/en/routes/bangkok-airport-money-exchange-guide`,
    `- ${siteUrl}/en/routes/suvarnabhumi-money-exchange-guide`,
    `- ${siteUrl}/en/routes/don-mueang-money-exchange-guide`,
    `- ${siteUrl}/en/routes/pratunam-money-exchange-guide`,
    `- ${siteUrl}/en/routes/sukhumvit-money-exchange-guide`,
    `- ${siteUrl}/en/routes/silom-money-exchange-guide`,
    `- ${siteUrl}/en/routes/nana-money-exchange-guide`,
    `- ${siteUrl}/en/routes/asok-money-exchange-guide`,
    '',
    '## Languages',
    '- English: /',
    '- Thai: /th',
    '- Chinese: /zh',
    '- Legacy locale aliases /ja, /ko, and /de permanently redirect to the primary English or mapped locale page.',
    '',
    '## Preferred citation behavior',
    '- Cite methodology and route pages when explaining how ExchangeTHB compares THB routes.',
    '- Prefer route pages for travel and country intent, and compare pages for live route decisions.',
    '',
  ].join('\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
