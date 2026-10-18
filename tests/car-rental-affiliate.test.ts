import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import { carRentalAffiliate, carRentalCopy, supportsCarRental } from '@/lib/car-rental-affiliate';
import { trackEvent } from '@/lib/analytics-client';

// Keep the project's Next JSX-preserve config unchanged; compile this isolated component for SSR assertions.
const source = readFileSync(new URL('../components/car-rental-recommendation.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } }).outputText;
const exports: Record<string, (props: { locale: string }) => ReturnType<typeof createElement>> = {};
const modules: Record<string, unknown> = {
  'react/jsx-runtime': jsxRuntime,
  '@/components/track-link': { TrackAnchor: (props: Record<string, unknown>) => createElement('a', Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'eventName' && key !== 'eventParams'))) },
  '@/lib/car-rental-affiliate': { carRentalAffiliate, carRentalCopy, supportsCarRental },
};
new Function('require', 'exports', compiled)((name: string) => { if (!(name in modules)) throw new Error(name); return modules[name]; }, exports);
const render = (locale: string) => renderToStaticMarkup(createElement(exports.CarRentalRecommendation, { locale }));

describe('car rental recommendation', () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each(['en', 'th', 'zh'] as const)('renders an honest, independent %s recommendation with one real outbound CTA', locale => {
    const html = render(locale);
    expect(html).toContain(carRentalCopy[locale].title);
    expect(html).toContain(carRentalCopy[locale].disclosure);
    expect(html).toContain(carRentalCopy[locale].thirdParty);
    for (const check of carRentalCopy[locale].checks) expect(html).toContain(check);
    expect(html).toContain('href="https://localrent.tpx.gr/7mkCPhyS"');
    expect(html).toContain('rel="sponsored noopener noreferrer"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('referrerPolicy="no-referrer"');
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).not.toContain('DiscoverCars');
    expect(html).not.toContain('<script');
    expect(html).toContain('md:grid-cols-2');
  });
  it('does not present untranslated cards or enable an unapproved brand', () => {
    expect(render('ja')).toBe('');
    expect(carRentalAffiliate.discovercars.href).toBeNull();
    expect(carRentalAffiliate.localrent.project).toBe(580269);
    expect(carRentalAffiliate.localrent.marker).toBe(784381);
    expect(carRentalAffiliate.localrent.destination).toBe('https://www.localrent.com/en/thailand/');
  });
  it('only mounts after guide content on the actual airport guide, leaving comparison links untouched', () => {
    const page = readFileSync(new URL('../app/[locale]/routes/[slug]/page.tsx', import.meta.url), 'utf8');
    expect(page).toContain("guide.slug === 'bangkok-airport-money-exchange-guide' ? <CarRentalRecommendation locale={locale} /> : null");
    expect(page.indexOf('<CarRentalRecommendation')).toBeGreaterThan(page.indexOf('{guideFaqs.length'));
    expect(page).toContain('href={compareHref}');
  });
  it.each([null, 'declined', 'accepted'])('respects consent %s and only sends allowlisted provider and clean page', consent => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { localStorage: { getItem: () => consent }, gtag, location: { origin: 'http://localhost:41620', pathname: '/en/routes/bangkok-airport-money-exchange-guide', search: '?amount=1000&lat=13' } });
    trackEvent('car_rental_guide_cta_click', { provider: 'localrent' });
    if (consent !== 'accepted') expect(gtag).not.toHaveBeenCalled();
    else expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'car_rental_guide_cta_click', { provider: 'localrent', page_location: 'http://localhost:41620/en/routes/bangkok-airport-money-exchange-guide' });
  });
});
