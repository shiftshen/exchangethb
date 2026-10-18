import backgrounds from '@/lib/exchange-background.json';
import labels from '@/lib/exchange-background-labels.json';
import type { ContentLocale } from '@/lib/types';

export function ExchangeBackground({ slug, locale }: { slug: string; locale: ContentLocale }) {
  if (!(slug in backgrounds)) return null;
  const background = backgrounds[slug as keyof typeof backgrounds];
  const c = labels[locale];
  return <section className="mt-4 space-y-2 text-sm leading-6" aria-label={c[0]}>
    <h3 className="font-semibold">{c[0]}</h3>
    <p>{background[locale]}</p>
    <p>{c[1]}: <span translate="no">{background.operator}</span></p>
    <a className="underline underline-offset-4" href={background.url} target="_blank" rel="noopener noreferrer">{c[2]} ↗</a>
    <p className="text-xs opacity-80">{c[3]}: <time dateTime="2026-10-03">2026-10-03</time> · {c[4]}</p>
  </section>;
}
