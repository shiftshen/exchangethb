import Link from 'next/link';
import { cashBranches, exchanges, publicCashProviders } from '@/data/site';
import { homeSeoCopy } from '@/lib/home-seo-content';
import type { ContentLocale } from '@/lib/types';

const detailLocales: ContentLocale[] = ['en', 'th', 'zh'];

function providerLabel(locale: ContentLocale) {
  return homeSeoCopy[locale].links;
}

function priorityLinks(locale: ContentLocale) {
  const labels = providerLabel(locale);
  const base: Array<{ href: string; label: string }> = [
    { href: `/${locale}/cash`, label: labels.cash },
    { href: `/${locale}/crypto`, label: labels.crypto },
  ];
  if (detailLocales.includes(locale)) {
    base.push(
      { href: `/${locale}/money-changers/ratchada`, label: labels.ratchada },
      { href: `/${locale}/money-changers/superrich-thailand`, label: labels.superrich },
      { href: `/${locale}/money-changers/twelve-victory`, label: labels.twelve },
      { href: `/${locale}/routes/usd-cash-to-thb`, label: labels.usdCash },
      { href: `/${locale}/routes/btc-to-thb`, label: labels.btc },
      { href: `/${locale}/routes/bangkok-airport-money-exchange-guide`, label: labels.airport },
    );
  }
  base.push({ href: `/${locale}/legal/methodology`, label: labels.methodology });
  return base;
}

function money(value: number) {
  return `฿${new Intl.NumberFormat('en-US').format(value)}`;
}

/**
 * Answer-first homepage body: question-form H2s, conclusion-first answers, two
 * tables built from the provider data this site already holds, and a link hub to
 * the highest-priority indexable landing pages. No rate, fee or spread is typed
 * into copy; the numbers come from data/site.ts.
 */
export function HomeSeoSections({ locale }: { locale: ContentLocale }) {
  const copy = homeSeoCopy[locale];
  const [routeQuestion, branchQuestion, costQuestion, checksQuestion, nextQuestion] = copy.sections;
  const canLinkDetails = detailLocales.includes(locale);
  const links = priorityLinks(locale);

  return (
    <>
      <section className="seo-section">
        <h2>{routeQuestion.question}</h2>
        <p>{routeQuestion.answer}</p>
      </section>

      <section className="seo-section">
        <h2>{branchQuestion.question}</h2>
        <p>{branchQuestion.answer}</p>
        <div className="seo-table-wrap">
          <table className="seo-table">
            <caption>{copy.cashTable.title}</caption>
            <thead>
              <tr>
                <th scope="col">{copy.cashTable.head.provider}</th>
                <th scope="col">{copy.cashTable.head.area}</th>
                <th scope="col">{copy.cashTable.head.hours}</th>
              </tr>
            </thead>
            <tbody>
              {publicCashProviders.map((provider) => {
                const branch = cashBranches.find((item) => item.providerSlug === provider.slug);
                const name = provider.name;
                return (
                  <tr key={provider.slug}>
                    <th scope="row">
                      {canLinkDetails
                        ? <Link href={`/${locale}/money-changers/${provider.slug}`}>{name}</Link>
                        : name}
                    </th>
                    <td>{branch?.area || '—'}</td>
                    <td>{branch?.hours || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="seo-section">
        <h2>{costQuestion.question}</h2>
        <p>{costQuestion.answer}</p>
        <div className="seo-table-wrap">
          <table className="seo-table">
            <caption>{copy.exchangeTable.title}</caption>
            <thead>
              <tr>
                <th scope="col">{copy.exchangeTable.head.name}</th>
                <th scope="col">{copy.exchangeTable.head.licence}</th>
                <th scope="col">{copy.exchangeTable.head.fee}</th>
                <th scope="col">{copy.exchangeTable.head.withdraw}</th>
                <th scope="col">{copy.exchangeTable.head.pairs}</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((exchange) => (
                <tr key={exchange.slug}>
                  <th scope="row">
                    {canLinkDetails ? <Link href={`/${locale}/exchanges/${exchange.slug}`}>{exchange.name}</Link> : exchange.name}
                  </th>
                  <td>{exchange.license.includes('SEC') ? 'Thai SEC' : '—'}</td>
                  <td>{exchange.fee.tradingFeePct}%</td>
                  <td>{exchange.fee.thbWithdrawKnown === false ? copy.unknownMark : money(exchange.fee.thbWithdraw)}</td>
                  <td>{exchange.pairs.join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="seo-note">{copy.sourceNote}</p>
      </section>

      <section className="seo-section">
        <h2>{checksQuestion.question}</h2>
        <p>{checksQuestion.answer}</p>
      </section>

      <nav className="seo-section seo-links" aria-labelledby="seo-next-heading">
        <h2 id="seo-next-heading">{nextQuestion.question}</h2>
        <p>{nextQuestion.answer}</p>
        <ul>
          {links.map((link) => (
            <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
          ))}
        </ul>
      </nav>

      <section className="exchange-guide">
        <div className="seo-faq">
          <h2>{copy.faqHeading}</h2>
          {copy.faq.map((item) => (
            <div key={item.question} className="seo-faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
          <p className="seo-updated">{copy.updated}</p>
        </div>
      </section>
    </>
  );
}

export function homeFaqEntries(locale: ContentLocale) {
  return homeSeoCopy[locale].faq.map((item) => ({ question: item.question, answer: item.answer }));
}

export function homeQuickAnswer(locale: ContentLocale) {
  return homeSeoCopy[locale].quickAnswer;
}
