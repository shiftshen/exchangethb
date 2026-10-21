import { notFound } from 'next/navigation';
import { ProviderContext } from '@/components/provider-context';
import { ProfileRateTable } from '@/components/profile-rate-table';
import { formatBangkokStamp, ratchadaMeta, rateLocale } from '@/lib/rate-format';
import { getRateTable } from '@/lib/rate-table';
import { buildPeerComparisonRows } from '@/lib/profile-compare';
import type { Metadata } from 'next';
import { TrackAnchor, TrackLink } from '@/components/track-link';
import { cashProviders, publicCashProviderSlugs } from '@/data/site';
import { buildRatchadaAnswer, buildVersusAnswer, quotesFromRows, ratchadaFaqQuestion, versusFaqQuestion } from '@/lib/ai-answers';
import { getEffectiveCashBranches } from '@/lib/cash-entities';
import { resolveContentLocale } from '@/lib/i18n';
import { shouldIndexMoneyChangerProfile } from '@/lib/indexing-policy';
import { getBangkokOpenState } from '@/lib/opening-hours';
import {
  buildMoneyChangerSeo,
  currencyExchangeJsonLd,
  formatOpeningHours,
  getMoneyChangerProfile,
  moneyChangerProfileSlugs,
} from '@/lib/money-changer-seo';
import { breadcrumbJsonLd, faqPageJsonLd, metadataAlternatesForPolicy, robotsForPage, withLocalePath } from '@/lib/seo';
import { CurrencyCode, Locale } from '@/lib/types';

const currencies: CurrencyCode[] = ['USD', 'EUR', 'JPY', 'CNY', 'GBP'];

const labels = {
  en: {
    rate: 'Observed buy rate',
    receive: 'Estimated THB for 1,000',
    distance: 'Reference distance',
    observed: 'Observed',
    denomination: 'Banknote',
    live: 'Live',
    hybrid: 'Hybrid',
    fallback: 'Fallback',
    open: 'Open now',
    closed: 'Closed now',
    rates: 'Observed currency examples',
    practicalHeading: 'What makes this changer different',
    officialRate: 'Official rate page',
    rateEntry: 'Open the live comparison',
  },
  th: {
    rate: 'เรตรับซื้อที่สังเกต',
    receive: 'THB โดยประมาณสำหรับ 1,000',
    distance: 'ระยะอ้างอิง',
    observed: 'สังเกตเมื่อ',
    denomination: 'ชนิดธนบัตร',
    live: 'สด',
    hybrid: 'ผสม',
    fallback: 'สำรอง',
    open: 'เปิดตอนนี้',
    closed: 'ปิดตอนนี้',
    rates: 'ตัวอย่างเรตตามสกุลเงิน',
    practicalHeading: 'จุดต่างของร้านนี้',
    officialRate: 'หน้าเรททางการ',
    rateEntry: 'เปิดหน้าคอมแพร์สด',
  },
  zh: {
    rate: '观测买入汇率',
    receive: '1,000 现钞预计获得 THB',
    distance: '参考距离',
    observed: '观测时间',
    denomination: '纸币条件',
    live: '实时',
    hybrid: '混合',
    fallback: '备用',
    open: '营业中',
    closed: '已打烊',
    rates: '不同币种观测示例',
    practicalHeading: '这家店的差别',
    officialRate: '官方汇率页',
    rateEntry: '打开实时比较',
  },
} as const;

function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

function sundayLabel(value: boolean | null, content: { sundayYes: string; sundayNo: string; sundayUnknown: string }) {
  if (value === null) return content.sundayUnknown;
  return value ? content.sundayYes : content.sundayNo;
}

export default async function MoneyChangerDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  if (!publicCashProviderSlugs.includes(slug as typeof publicCashProviderSlugs[number])) notFound();
  const provider = cashProviders.find((item) => item.slug === slug);
  const seo = buildMoneyChangerSeo(slug, locale);
  if (!provider || !seo) notFound();
  const profile = seo.profile;

  const contentLocale = resolveContentLocale(locale);
  const c = labels[locale === 'th' || locale === 'zh' ? locale : 'en'];
  const content = seo.content;

  // SEO-24: Ratchada gets the full 15-currency table; the other profiles keep their five examples.
  const isRatchada = slug === 'ratchada';
  const rateTable = await getRateTable(slug, isRatchada);
  const comparisons = currencies.map((currency) => {
    const found = rateTable.comparisons.find((item) => item.currency === currency);
    const row = found?.all.find((item) => item.providerSlug === slug);
    return row ? { currency, row, all: found?.all ?? [] } : null;
  });
  const rateRows = comparisons.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const usdComparison = comparisons.find((item) => item?.currency === 'USD');
  const primary = usdComparison?.row || rateRows[0]?.row;
  const staticBranch = (await getEffectiveCashBranches()).find((item) => item.providerSlug === slug);
  const branchName = primary?.branchName || staticBranch?.name || profile.branchName;
  const address = staticBranch?.address || profile.streetAddress || profile.addressNote || '';
  const hours = content.hoursDisplay;
  const mapsUrl = primary?.mapsUrl || staticBranch?.mapsUrl || profile.mapUrl;
  const openState = primary?.isOpen ?? (getBangkokOpenState(hours) ?? staticBranch?.isOpen ?? false);
  const sourceType = primary?.current ? 'live' : primary?.sourceType === 'hybrid' ? 'hybrid' : 'fallback';

  // The three profiles shipped on this site share one comparison table so a visitor can
  // see how the current changer differs from the other two we cover.
  const peers = moneyChangerProfileSlugs.map((peerSlug) => {
    const peerProfile = getMoneyChangerProfile(peerSlug);
    const peerRow = usdComparison?.all.find((row) => row.providerSlug === peerSlug);
    return peerProfile
      ? {
          profile: peerProfile,
          row: peerRow,
          current: peerSlug === slug,
          hours: formatOpeningHours(peerProfile.hoursSpec, peerProfile.hours, seo.locale),
        }
      : null;
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  // Same USD comparison rows the table below shows, keyed by profile slug. The helper
  // reads rateTable.comparisons, i.e. the same cash cache /cash renders.
  const peerComparisonRows = buildPeerComparisonRows(rateTable.comparisons);
  const peerRate = (peerSlug: string) => peerComparisonRows.find((row) => row.slug === peerSlug) ?? null;

  // SEO-19: one direct answer per mapped question (Ratchada rate en/th, SuperRich vs Ratchada en),
  // built from the same USD rows as the table below and appended to the visible FAQ + JSON-LD.
  const usdQuotes = quotesFromRows((usdComparison?.all ?? []) as Parameters<typeof quotesFromRows>[0], locale);
  const ai = slug === 'ratchada' && (locale === 'en' || locale === 'th')
    ? { id: 'ratchada-rate', question: ratchadaFaqQuestion[locale] ?? '', answer: buildRatchadaAnswer(locale, usdQuotes) }
    : slug === 'superrich-thailand' && locale === 'en'
      ? { id: 'superrich-vs-ratchada', question: versusFaqQuestion, answer: buildVersusAnswer('en', usdQuotes) }
      : null;
  const faqEntries = ai?.answer ? [...content.faqs, { question: ai.question, answer: ai.answer }] : content.faqs;

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: locale === 'th' ? 'เงินสดเป็น THB' : locale === 'zh' ? '现金换 THB' : 'Cash to THB', item: withLocalePath(locale, '/cash') },
    { name: provider.name, item: withLocalePath(locale, `/money-changers/${provider.slug}`) },
  ]);
  const exchangeLd = currencyExchangeJsonLd({
    name: profile.name,
    url: withLocalePath(locale, `/money-changers/${profile.slug}`),
    officialUrl: profile.officialUrl,
    area: profile.area,
    streetAddress: profile.streetAddress,
    hoursSpec: profile.hoursSpec,
    geo: profile.geo,
    mapUrl: profile.mapUrl,
  });

  return (
    <div className="space-y-6">
      <ProviderContext mode="cash" slug={slug} branchId={staticBranch?.id} locale={contentLocale}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqEntries)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(exchangeLd) }} />

      {isRatchada ? (
        <>
          <header className="rounded-[32px] bg-[#0f2e22] p-6 text-white sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0b1]">{content.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{seo.locale === 'th' && profile.brandThai ? profile.brandThai : provider.name}</h1>
            {profile.brandThai ? <p className="mt-2 text-lg font-semibold text-[#9fd0b1]">{seo.locale === 'th' ? provider.name : profile.brandThai}</p> : null}
          </header>

          <ProfileRateTable table={rateTable} locale={rateLocale(locale)} heading={content.rateHeading} />

          <section id="store-status" className="rounded-[28px] bg-[#0f2e22] p-5 text-white sm:p-7" aria-label={branchName}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${openState ? 'bg-emerald-400/15 text-emerald-200' : 'bg-stone-500/20 text-stone-300'}`}>{openState ? c.open : c.closed}</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-stone-200">{hours}</span>
            </div>
            <p className="mt-3 text-base font-semibold">{branchName}</p>
            <p className="mt-1 text-sm leading-6 text-[#d7e4dc]">{address}</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#d7e4dc]">{content.answer}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <TrackAnchor href={provider.officialUrl} target="_blank" rel="noreferrer" eventName="money_changer_profile_official_click" eventParams={{ provider: provider.slug, source_type: sourceType, position: 'status' }} className="rounded-full bg-[#dcebdd] px-5 py-3 text-sm font-semibold text-[#18583d]">{content.officialCta}</TrackAnchor>
              <TrackAnchor href={mapsUrl} target="_blank" rel="noreferrer" eventName="money_changer_profile_map_click" eventParams={{ provider: provider.slug }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{content.mapCta}</TrackAnchor>
              <TrackLink href={`/${locale}/cash?currency=USD&amount=1000`} eventName="money_changer_profile_compare_click" eventParams={{ provider: provider.slug }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{c.rateEntry}</TrackLink>
            </div>
          </section>

      {ai?.answer ? (
        <section className="rounded-[28px] border border-white/10 bg-[#151a18] p-6" aria-labelledby="ai-answer-heading">
          <h2 id="ai-answer-heading" className="text-xl font-semibold text-white">{ai.question}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-stone-200" data-ai-answer={ai.id}>{ai.answer}</p>
        </section>
      ) : null}
        </>
      ) : (
        <>
      <header className="grid gap-6 rounded-[32px] bg-[#0f2e22] p-6 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0b1]">{content.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{seo.locale === 'th' && profile.brandThai ? profile.brandThai : provider.name}</h1>
          {profile.brandThai ? <p className="mt-2 text-lg font-semibold text-[#9fd0b1]">{seo.locale === 'th' ? provider.name : profile.brandThai}</p> : null}
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#d7e4dc]">{content.answer}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${openState ? 'bg-emerald-400/15 text-emerald-200' : 'bg-stone-500/20 text-stone-300'}`}>{openState ? c.open : c.closed}</span>
            {primary ? <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-stone-200">{c[sourceType]}</span> : null}
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-stone-200">{hours}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <TrackAnchor href={mapsUrl} target="_blank" rel="noreferrer" eventName="money_changer_profile_map_click" eventParams={{ provider: provider.slug }} className="rounded-full bg-[#dcebdd] px-5 py-3 text-sm font-semibold text-[#18583d]">{content.mapCta}</TrackAnchor>
          <TrackAnchor href={provider.officialUrl} target="_blank" rel="noreferrer" eventName="money_changer_profile_official_click" eventParams={{ provider: provider.slug, source_type: sourceType }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{content.officialCta}</TrackAnchor>
          <TrackLink href={`/${locale}/cash?currency=USD&amount=1000`} eventName="money_changer_profile_compare_click" eventParams={{ provider: provider.slug }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{c.rateEntry}</TrackLink>
        </div>
      </header>

      {ai?.answer ? (
        <section className="rounded-[28px] border border-white/10 bg-[#151a18] p-6" aria-labelledby="ai-answer-heading">
          <h2 id="ai-answer-heading" className="text-xl font-semibold text-white">{ai.question}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-stone-200" data-ai-answer={ai.id}>{ai.answer}</p>
        </section>
      ) : null}

      <section id="rate" className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151a18]">
        <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#76aa8b]">{content.rateHeading}</p>
            <p className="mt-3 text-lg font-semibold text-white">{content.areaDisplay} · {content.hoursDisplay}</p>
            <p className="mt-1 text-sm text-stone-400">{content.rateBody}</p>
          </div>
          <div className="lg:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{c.receive}</p>
            <p className="mt-1 text-5xl font-semibold tracking-[-0.05em] text-white">{primary ? `฿${formatNumber(primary.estimatedThb, 0)}` : '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
          <Metric label={c.rate} value={primary ? formatNumber(primary.buyRate, 4) : '—'} />
          <Metric label={c.distance} value={primary && primary.distanceKnown !== false ? `${formatNumber(primary.distanceKm, 1)} km` : '-'} />
          <Metric label={c.denomination} value={primary?.denomination || '-'} />
          <Metric label={c.observed} value={primary ? new Date(primary.observedAt).toLocaleString() : '-'} />
        </div>
        <p className="border-t border-white/10 px-6 py-4 text-xs text-stone-500">{content.verifyNote}</p>
      </section>
        </>
      )}

      <section className={isRatchada ? 'grid gap-4' : 'grid gap-4 lg:grid-cols-[0.8fr_1.2fr]'}>
        <div className="rounded-[28px] border border-black/10 bg-[#ece8dc] p-6 text-[#11271e]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#657169]">{content.locationHeading}</p>
          <h2 className="mt-3 text-xl font-semibold">{branchName}</h2>
          <div className="mt-5 space-y-4 text-sm">
            <Fact label={content.areaLabel} value={content.areaDisplay} />
            <Fact label={content.addressLabel} value={address || '-'} />
            <Fact label={content.hoursLabel} value={hours || '-'} />
            <Fact label={content.tableSunday} value={sundayLabel(profile.sundayOpen, content)} />
            <Fact label={c.distance} value={primary && primary.distanceKnown !== false ? `${formatNumber(primary.distanceKm, 1)} km` : '-'} />
          </div>
        </div>
        {isRatchada ? null : (
        <div className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
          <h2 className="text-xl font-semibold text-white">{c.rates}</h2>
          <p className="mt-2 text-sm text-stone-400">{content.sourceNote}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {rateRows.map(({ currency, row }) => (
              <div key={currency} className="rounded-2xl border border-white/10 bg-[#111614] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{currency}</p>
                  <span className="text-xs text-stone-500">{row.denomination}</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{formatNumber(row.buyRate, 4)}</p>
                <p className="mt-1 text-xs text-stone-500">1,000 → ฿{formatNumber(row.estimatedThb, 0)}</p>
              </div>
            ))}
          </div>
        </div>
        )}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
        <h2 className="text-xl font-semibold text-white">{content.compareTableHeading}</h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-400">{content.compareTableBody}</p>
        <div className="mt-5 space-y-3 sm:hidden">
          {peers.map((peer) => {
            const rate = peerRate(peer.profile.slug);
            return (
            <div key={`card-${peer.profile.slug}`} data-peer-row={peer.profile.slug} data-peer-buy={rate?.buyRate ?? ''} data-peer-observed={rate?.observedAt ?? ''} className={`rounded-2xl border p-4 ${peer.current ? 'border-emerald-400/30 bg-white/[0.06]' : 'border-white/10 bg-[#111614]'}`}>
              <p className="text-sm font-semibold text-white">
                {peer.current ? <span className="mr-2 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">{content.currentBadge}</span> : null}
                {peer.current
                  ? peer.profile.name
                  : <TrackLink href={`/${locale}/money-changers/${peer.profile.slug}`} eventName="money_changer_profile_peer_click" eventParams={{ provider: provider.slug, target: peer.profile.slug, position: 'mobile' }} className="underline decoration-white/30 underline-offset-4">{peer.profile.name}</TrackLink>}
              </p>
              <p className="mt-1 text-xs text-stone-400">{peer.profile.area} · {peer.hours}</p>
              <p className="mt-2 text-sm text-stone-300">
                {sundayLabel(peer.profile.sundayOpen, content)}
                <span className="mx-2 text-stone-600">|</span>
                {content.tableRate}: {rate?.buyRate != null ? formatNumber(rate.buyRate, 4) : '—'}
              </p>
              <p className="mt-1 text-xs text-stone-500">{content.tableUpdated}: {rate?.observedAt ? formatBangkokStamp(rate.observedAt, rateLocale(locale)) : '—'}</p>
            </div>
            );
          })}
        </div>
        <div className="mt-5 hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.14em] text-stone-500">
                <th className="border-b border-white/10 py-2 pr-3 font-medium">{content.tableChanger}</th>
                <th className="border-b border-white/10 py-2 pr-3 font-medium">{content.tableArea}</th>
                <th className="border-b border-white/10 py-2 pr-3 font-medium">{content.tableHours}</th>
                <th className="border-b border-white/10 py-2 pr-3 font-medium">{content.tableSunday}</th>
                <th className="border-b border-white/10 py-2 pr-3 font-medium">{content.tableRate}</th>
                <th className="border-b border-white/10 py-2 font-medium">{content.tableUpdated}</th>
              </tr>
            </thead>
            <tbody>
              {peers.map((peer) => {
                const rate = peerRate(peer.profile.slug);
                return (
                <tr key={peer.profile.slug} data-peer-row={peer.profile.slug} data-peer-buy={rate?.buyRate ?? ''} data-peer-observed={rate?.observedAt ?? ''} className={peer.current ? 'bg-white/[0.06] text-white' : 'text-stone-300'}>
                  <td className="border-b border-white/5 py-3 pr-3 font-semibold">
                    {peer.current ? <span className="mr-2 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">{content.currentBadge}</span> : null}
                    {peer.current
                      ? peer.profile.name
                      : <TrackLink href={`/${locale}/money-changers/${peer.profile.slug}`} eventName="money_changer_profile_peer_click" eventParams={{ provider: provider.slug, target: peer.profile.slug }} className="underline decoration-white/30 underline-offset-4">{peer.profile.name}</TrackLink>}
                  </td>
                  <td className="border-b border-white/5 py-3 pr-3">{peer.profile.area}</td>
                  <td className="border-b border-white/5 py-3 pr-3">{peer.hours}</td>
                  <td className="border-b border-white/5 py-3 pr-3">{sundayLabel(peer.profile.sundayOpen, content)}</td>
                  <td className="border-b border-white/5 py-3 pr-3">{rate?.buyRate != null ? formatNumber(rate.buyRate, 4) : '—'}</td>
                  <td className="border-b border-white/5 py-3">{rate?.observedAt ? formatBangkokStamp(rate.observedAt, rateLocale(locale)) : '—'}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <nav className="mt-5 flex flex-wrap items-center gap-3 text-sm" data-peer-links>
          {peers.filter((peer) => !peer.current).map((peer) => (
            <TrackLink key={`link-${peer.profile.slug}`} href={`/${locale}/money-changers/${peer.profile.slug}`} data-peer-link={peer.profile.slug} eventName="money_changer_profile_peer_nav_click" eventParams={{ provider: provider.slug, target: peer.profile.slug }} className="rounded-full border border-white/15 px-4 py-2 font-semibold text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{peer.profile.name}</TrackLink>
          ))}
        </nav>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
        <h2 className="text-xl font-semibold text-white">{c.practicalHeading}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">{seo.positioning}</p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-400">
          {seo.practical.map((item) => (
            <li key={item} className="border-l border-[#76aa8b]/40 pl-4">{item}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <TrackLink href={`/${locale}/cash?currency=USD&amount=1000`} eventName="money_changer_profile_compare_click" eventParams={{ provider: provider.slug, position: 'table' }} className="rounded-full bg-[#dcebdd] px-5 py-3 text-sm font-semibold text-[#18583d]">{content.compareCta}</TrackLink>
          <TrackAnchor href={provider.officialUrl} target="_blank" rel="noreferrer" eventName="money_changer_profile_official_click" eventParams={{ provider: provider.slug, position: 'practical' }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{c.officialRate}</TrackAnchor>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
        <h2 className="text-xl font-semibold text-white">{content.faqHeading}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {faqEntries.map((item) => (
            <div key={item.question} className="border-l border-[#76aa8b]/40 pl-4">
              <h3 className="font-semibold text-white">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="bg-[#111614] p-4"><p className="text-xs text-stone-500">{label}</p><p className="mt-1 font-semibold text-white">{value}</p></div>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-[#657169]">{label}</p><p className="mt-1 leading-6">{value}</p></div>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!publicCashProviderSlugs.includes(slug as typeof publicCashProviderSlugs[number])) return {};
  const seo = buildMoneyChangerSeo(slug, locale);
  if (!seo) return {};
  let { metaTitle: title, metaDescription: description } = seo.content;
  // SEO-25: put the observed USD cash buying rate in the title/description of every public
  // money changer profile — the number is what the query is about, and it changes hourly.
  const table = await getRateTable(slug, true);
  const stamp = formatBangkokStamp(table.latestObservedAt, rateLocale(locale));
  const usd = table.rows.find((row) => row.currency === 'USD')?.buyRate ?? null;
  if (slug === 'ratchada') {
    const meta = ratchadaMeta(rateLocale(locale), stamp, table.available, usd);
    title = meta.title;
    description = meta.description;
  } else if (usd) {
    const rate = usd.toFixed(2);
    const names = { en: 'USD cash rate', th: 'เรทรับซื้อ USD', zh: '美元买入价' } as const;
    const label = names[(rateLocale(locale) === 'th' ? 'th' : rateLocale(locale) === 'zh' ? 'zh' : 'en')];
    if (!title.includes(rate)) {
      title = `${title} · ${label} ${rate}${stamp ? ` (${stamp})` : ''}`;
      description = `${label} ${rate} THB. ${description}`;
    }
  }
  const path = `/money-changers/${slug}`;
  return {
    title,
    description,
    alternates: metadataAlternatesForPolicy(locale, path, ['en', 'th', 'zh']),
    robots: robotsForPage(locale, shouldIndexMoneyChangerProfile(locale, slug)),
    openGraph: { title, description, url: withLocalePath(locale, path) },
  };
}
