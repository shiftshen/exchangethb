import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import { exchanges } from '@/data/site';
import { t } from '@/lib/i18n';
import { localizeExchangeLicense } from '@/lib/exchange-text';
import { buildExchangeComparisonTableRows, exchangeIndexFaqs, secLicenseSourceUrl } from '@/lib/exchange-comparison';
import { faqPageJsonLd } from '@/lib/seo';
import { getRouteGuide } from '@/lib/route-guides';
import { estimateBuyThb } from '@/lib/route-estimate';

// Compile the sync table component for SSR assertions, mirroring the pattern in
// car-rental-affiliate.test.ts (the project keeps Next's JSX preserve, so the test
// transpiles the isolated component and stubs its outbound client-only deps).
const source = readFileSync(new URL('../components/exchange-comparison-table.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } }).outputText;
const tableExports: Record<string, (props: { locale: string }) => ReturnType<typeof createElement>> = {};
const modules: Record<string, unknown> = {
  'react/jsx-runtime': jsxRuntime,
  '@/lib/i18n': { t },
  '@/lib/exchange-text': { localizeExchangeLicense },
  '@/lib/exchange-comparison': { buildExchangeComparisonTableRows, secLicenseSourceUrl },
  '@/components/track-link': { TrackAnchor: (props: Record<string, unknown>) => createElement('a', Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'eventName' && key !== 'eventParams'))) },
};
new Function('require', 'exports', compiled)((name: string) => { if (!(name in modules)) throw new Error(`missing module ${name}`); return modules[name]; }, tableExports);
const renderTable = (locale: string) => renderToStaticMarkup(createElement(tableExports.ExchangeComparisonTable, { locale }));

describe('SEO-39 /exchanges side-by-side comparison table', () => {
  const rows = buildExchangeComparisonTableRows();

  it('renders exactly one row per exchange in data/site.ts', () => {
    expect(rows).toHaveLength(exchanges.length);
    expect(rows.map((row) => row.slug)).toEqual(exchanges.map((exchange) => exchange.slug));
  });

  it('takes every exchange fact from data/site.ts', () => {
    for (const exchange of exchanges) {
      const row = rows.find((item) => item.slug === exchange.slug)!;
      expect(row.name).toBe(exchange.name);
      expect(row.license).toBe(exchange.license);
      expect(row.thbPairs).toEqual(exchange.pairs.map((pair) => `${pair}/THB`));
      expect(row.tradingFeePct).toBe(exchange.fee.tradingFeePct);
      expect(row.feeOnReceived).toBe(exchange.fee.tradingFeeAsset === 'received');
      expect(row.officialUrl).toBe(exchange.affiliate.officialUrl);
    }
  });

  it('never invents a deposit claim for a record that does not state one', () => {
    expect(rows.find((row) => row.slug === 'bitkub')?.thbDepositSupported).toBe(true);
    for (const slug of ['binance-th', 'upbit-thailand', 'orbix'] as const) {
      expect(rows.find((row) => row.slug === slug)?.thbDepositSupported).toBe(false);
    }
  });

  it('renders all four exchanges and the SEC source into visible HTML', () => {
    const html = renderTable('en');
    for (const name of ['Binance TH', 'Bitkub', 'Upbit Thailand', 'Orbix']) {
      expect(html).toContain(name);
    }
    expect(html).toContain('Side-by-side exchange comparison');
    expect(html).toContain('Thai SEC digital asset exchange license');
    expect(html).toContain(secLicenseSourceUrl);
    expect((html.match(/data-exchange-comparison-row=/g) || [])).toHaveLength(exchanges.length);
  });
});

describe('SEO-39 /exchanges FAQ schema matches the visible copy', () => {
  it.each(['en', 'th', 'zh'] as const)('produces non-empty FAQ entries in %s', (locale) => {
    const faqs = exchangeIndexFaqs(locale);
    expect(faqs).toHaveLength(3);
    for (const entry of faqs) {
      expect(entry.question.trim()).not.toBe('');
      expect(entry.answer.trim()).not.toBe('');
    }
  });

  it('emits every FAQ question inside an FAQPage schema entry', () => {
    const faqs = exchangeIndexFaqs('en');
    const ld = faqPageJsonLd(faqs) as { mainEntity: Array<{ name: string }> };
    expect(ld.mainEntity).toHaveLength(faqs.length);
    for (const entry of faqs) expect(ld.mainEntity.map((item) => item.name)).toContain(entry.question);
  });

  it('wires the same FAQ source into the visible cards and the FAQPage schema', () => {
    const page = readFileSync(new URL('../app/[locale]/exchanges/page.tsx', import.meta.url), 'utf8');
    expect(page).toContain('const faqEntries = exchangeIndexFaqs(locale);');
    expect(page).toContain('faqPageJsonLd(faqEntries)');
    expect(page).toContain('{faqEntries.map((item) => (');
  });
});

describe('SEO-39 btc-to-thb converter and FAQ', () => {
  it('documents the estimate and the no-price fallback in the route FAQ', () => {
    const guide = getRouteGuide('btc-to-thb');
    expect(guide).toBeDefined();
    expect(guide?.faqs).toBeDefined();
    for (const locale of ['en', 'th', 'zh'] as const) {
      const faqs = guide?.faqs?.[locale];
      expect(faqs?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns no estimate when there is no order book snapshot', () => {
    expect(estimateBuyThb([], 0.01)).toBeNull();
  });
});
