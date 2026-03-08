import { notFound } from 'next/navigation';
import { Locale } from '@/lib/types';

const legalPages = {
  methodology: {
    title: 'Methodology',
    sections: [
      'Crypto rankings use orderbook depth, trading fees, withdrawal rules, and standardized estimated receive outputs.',
      'Cash rankings use official public rates, branch distance, opening hours, denomination conditions, and manual anomaly review.',
      'Every output is labeled estimated and can differ from final execution due to timing, liquidity, queue position, branch discretion, or provider updates.',
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    sections: [
      'ExchangeTHB is an informational comparison website only and does not execute trades, hold customer assets, or provide brokerage services.',
      'Nothing on this website is personal investment advice, foreign exchange advice, or a promise of the best final rate.',
      'Platform rules, fees, eligibility, and campaigns can change without notice. Always verify final terms on the official provider website before acting.',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    sections: [
      'We collect limited analytics and click-tracking data to understand route interest, improve UX, and monitor performance.',
      'We do not provide public user accounts in V1 and do not sell personal information. Admin access is restricted to authorized operators.',
      'Cookies and analytics tools may be used for aggregate measurement and operational diagnostics. You can control them through your browser settings where applicable.',
    ],
  },
  'affiliate-disclosure': {
    title: 'Affiliate Disclosure',
    sections: [
      'Some outbound links may be official campaign links or tracked recommendation links where allowed by the platform.',
      'If a reward or campaign is uncertain, ExchangeTHB defaults the listing to official-only presentation.',
      'Any incentive availability is controlled by the provider and can start, stop, or change at any time under the provider’s latest terms.',
    ],
  },
} as const;

export default async function LegalPage({ params }: { params: Promise<{ locale: Locale; slug: keyof typeof legalPages }> }) {
  const { slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Legal</p>
        <h1 className="text-4xl font-semibold tracking-tight">{page.title}</h1>
      </div>
      <div className="space-y-4 text-lg text-stone-600">
        {page.sections.map((section) => <p key={section}>{section}</p>)}
      </div>
    </article>
  );
}
