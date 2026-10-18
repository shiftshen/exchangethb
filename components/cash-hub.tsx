import { TrackLink } from '@/components/track-link';
import { compareCashLive } from '@/lib/cash-live';
import {
  buildCashHubContent,
  cashHubCurrencies,
  getCashHubChangers,
  isCashHubLocale,
  type CashHubCurrency,
  type CashHubLocale,
} from '@/lib/cash-hub-seo';
import type { Locale } from '@/lib/types';

// Answer-first block, per-currency sections and visible FAQ for /cash (en/th/zh). Other
// locales render nothing here and keep the page unchanged. Copy lives in lib/cash-hub-seo.ts.
const dateLocale: Record<CashHubLocale, string> = {
  en: 'en-GB',
  // Gregorian calendar on purpose: the same year number as every other locale on the page.
  th: 'th-TH-u-ca-gregory',
  zh: 'zh-CN',
};

function formatObserved(value: string, locale: CashHubLocale) {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return null;
  const text = new Intl.DateTimeFormat(dateLocale[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(time));
  return `${text} (GMT+7)`;
}

function formatRate(value: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
}

function isBanknoteSpec(value: string) {
  return /^[\d\s,\-–]+$/.test(value);
}

export function CashHubAnswer({ locale }: { locale: Locale }) {
  if (!isCashHubLocale(locale)) return null;
  const content = buildCashHubContent(locale);
  return (
    <section className="cash-hub-answer" aria-labelledby="cash-hub-answer-heading">
      <h2 id="cash-hub-answer-heading">{content.answerHeading}</h2>
      <p className="cash-hub-answer-text">{content.answer}</p>
    </section>
  );
}

async function loadRows(currency: CashHubCurrency, locale: CashHubLocale) {
  const result = await compareCashLive({ currency, amount: 1000, maxDistanceKm: 100, locale }).catch(() => null);
  return result?.all ?? [];
}

export async function CashHubCurrencies({ locale }: { locale: Locale }) {
  if (!isCashHubLocale(locale)) return null;
  const content = buildCashHubContent(locale);
  const changers = getCashHubChangers(locale);
  const sections = await Promise.all(cashHubCurrencies.map(async (currency) => {
    const all = await loadRows(currency, locale);
    // Fixed provider order: the list is not a ranking.
    const rows = changers
      .map((changer) => ({ changer, row: all.find((item) => item.providerSlug === changer.slug) }))
      .filter((item): item is { changer: typeof item.changer; row: NonNullable<typeof item.row> } => Boolean(item.row));
    const missing = changers.filter((changer) => !rows.some((item) => item.changer.slug === changer.slug));
    return { currency, rows, missing };
  }));

  return (
    <div className="cash-hub-currencies">
      {sections.map(({ currency, rows, missing }) => {
        const copy = content.currencies[currency];
        const headingId = `cash-hub-${currency.toLowerCase()}`;
        return (
          <section key={currency} className="cash-hub-currency" aria-labelledby={headingId}>
            <h2 id={headingId}>{copy.heading}</h2>
            <p className="cash-hub-currency-intro">{copy.intro}</p>
            {rows.length ? (
              <ul className="cash-hub-rows">
                {rows.map(({ changer, row }) => {
                  const observed = formatObserved(row.observedAt, locale);
                  return (
                    <li key={changer.slug}>
                      <TrackLink
                        href={`/${locale}/money-changers/${changer.slug}`}
                        eventName="cash_hub_changer_click"
                        eventParams={{ locale, provider: changer.slug, currency }}
                        className="cash-hub-name"
                      >
                        {changer.name}
                      </TrackLink>
                      <span className="cash-hub-rate">{content.labels.rate}: {formatRate(row.buyRate)}</span>
                      <span className="cash-hub-meta">
                        {isBanknoteSpec(row.denomination) ? `${content.labels.banknotes}: ${row.denomination}` : content.labels.headline}
                        {observed ? ` · ${content.labels.observed} ${observed}` : ''}
                        {` · ${row.current ? content.labels.recent : content.labels.reference}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="cash-hub-empty">{content.labels.noneAtAll}</p>}
            {rows.length && missing.length ? <p className="cash-hub-missing">{content.labels.noQuote}{locale === 'zh' ? '' : ' '}{missing.map((item) => item.name).join(locale === 'zh' ? '、' : ', ')}</p> : null}
            <TrackLink
              href={`/${locale}/cash?currency=${currency}`}
              eventName="cash_hub_compare_click"
              eventParams={{ locale, currency }}
              className="cash-hub-cta"
            >
              {copy.cta}
            </TrackLink>
          </section>
        );
      })}
    </div>
  );
}

export function CashHubFaq({ locale }: { locale: Locale }) {
  if (!isCashHubLocale(locale)) return null;
  const content = buildCashHubContent(locale);
  return (
    <section className="cash-hub-faq" aria-labelledby="cash-hub-faq-heading">
      <h2 id="cash-hub-faq-heading">{content.faqHeading}</h2>
      {content.faqs.map((item) => (
        <div key={item.question} className="cash-hub-faq-item">
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </section>
  );
}
