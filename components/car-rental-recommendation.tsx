import { TrackAnchor } from '@/components/track-link';
import { carRentalAffiliate, carRentalCopy, supportsCarRental } from '@/lib/car-rental-affiliate';

export function CarRentalRecommendation({ locale }: { locale: string }) {
  if (!supportsCarRental(locale)) return null;
  const c = carRentalCopy[locale];
  return (
    <section id="car-rental" aria-labelledby="car-rental-title" className="space-y-5">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold tracking-widest text-brand-300">{c.eyebrow}</p>
        <h2 id="car-rental-title" className="section-title">{c.title}</h2>
        <p className="text-sm leading-7 text-stone-300">{c.intro}</p>
      </header>
      <div data-rental-grid className="grid gap-5 md:grid-cols-2">
        <article className="flex min-w-0 flex-col rounded-[28px] border border-brand-500/25 bg-gradient-to-br from-surface-850 to-surface-900 p-6 sm:p-8">
          <p className="text-xs font-medium text-brand-200">{c.label}</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">Localrent<span className="text-brand-300">.</span></h3>
          <p className="mt-4 text-base leading-7 text-stone-100">{c.scenario}</p>
          <p className="mt-3 text-sm leading-6 text-stone-400">{c.thirdParty}</p>
          <div className="mt-auto pt-7">
            <TrackAnchor href={carRentalAffiliate.localrent.href} target="_blank" rel="sponsored noopener noreferrer" referrerPolicy="no-referrer"
              eventName="car_rental_guide_cta_click" eventParams={{ provider: 'localrent' }}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-brand-500 px-5 py-3 text-center text-sm font-semibold leading-6 text-surface-950 hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300">
              {c.cta}<span aria-hidden="true">↗</span>
            </TrackAnchor>
            <p className="mt-3 text-xs leading-5 text-stone-400">{c.external}</p>
          </div>
        </article>
        <aside className="card-panel min-w-0 p-6 sm:p-8" aria-labelledby="rental-checklist-title">
          <h3 id="rental-checklist-title" className="text-lg font-semibold text-white">{c.checklist}</h3>
          <ul className="mt-5 space-y-4">
            {c.checks.map((check, index) => <li key={check} className="flex gap-3 text-sm leading-6 text-stone-300"><span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs text-brand-200">{index + 1}</span><span>{check}</span></li>)}
          </ul>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-stone-400">{c.terms}</p>
        </aside>
      </div>
      <p data-rental-disclosure className="rounded-2xl border border-white/10 bg-surface-900/60 px-5 py-4 text-xs leading-6 text-stone-300">{c.disclosure}</p>
    </section>
  );
}
