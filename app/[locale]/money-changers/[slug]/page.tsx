import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TrackAnchor, TrackLink } from '@/components/track-link';
import { cashBranches, cashProviders, publicCashProviderSlugs } from '@/data/site';
import { compareCashLive } from '@/lib/cash-live';
import { resolveContentLocale, t } from '@/lib/i18n';
import { shouldIndexMoneyChangerProfile } from '@/lib/indexing-policy';
import { getBangkokOpenState } from '@/lib/opening-hours';
import { breadcrumbJsonLd, metadataAlternatesForPolicy, robotsForPage, withLocalePath } from '@/lib/seo';
import { CurrencyCode, Locale } from '@/lib/types';

const currencies: CurrencyCode[] = ['USD', 'EUR', 'JPY', 'CNY', 'GBP'];

const copy = {
  en: {
    eyebrow: 'Bangkok money changer profile',
    current: 'Current practical status',
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
    official: 'Verify on official site',
    map: 'Open map',
    compare: 'Compare with other money changers',
    rates: 'Observed currency examples',
    sourceNote: 'Rates are observations from public sources, not guaranteed counter quotes.',
    location: 'Branch and location',
    hours: 'Opening hours',
    address: 'Address',
    questions: 'Useful checks before visiting',
  },
  th: {
    eyebrow: 'โปรไฟล์ร้านแลกเงินกรุงเทพ',
    current: 'สถานะที่ใช้งานได้ตอนนี้',
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
    official: 'ยืนยันกับเว็บไซต์ทางการ',
    map: 'เปิดแผนที่',
    compare: 'เปรียบเทียบกับร้านอื่น',
    rates: 'ตัวอย่างเรตตามสกุลเงิน',
    sourceNote: 'เรทเป็นค่าที่สังเกตจากแหล่งสาธารณะ ไม่ใช่เรทหน้าร้านที่รับประกัน',
    location: 'สาขาและตำแหน่ง',
    hours: 'เวลาเปิด',
    address: 'ที่อยู่',
    questions: 'สิ่งที่ควรเช็กก่อนเดินทาง',
  },
  zh: {
    eyebrow: '曼谷换汇商实体页',
    current: '当前实际状态',
    rate: '观测买入汇率',
    receive: '1,000 现金预计获得 THB',
    distance: '参考距离',
    observed: '观测时间',
    denomination: '纸币条件',
    live: '实时',
    hybrid: '混合',
    fallback: '备用',
    open: '营业中',
    closed: '已打烊',
    official: '前往官网确认',
    map: '打开地图',
    compare: '与其他换汇店比较',
    rates: '不同币种观测示例',
    sourceNote: '汇率来自公开来源观测，不代表保证柜台成交价。',
    location: '门店与位置',
    hours: '营业时间',
    address: '地址',
    questions: '前往门店前应确认',
  },
} as const;

function faqJsonLd(entries: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

export default async function MoneyChangerDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  if (!publicCashProviderSlugs.includes(slug as typeof publicCashProviderSlugs[number])) notFound();
  const provider = cashProviders.find((item) => item.slug === slug);
  if (!provider) notFound();
  const contentLocale = resolveContentLocale(locale);
  const c = copy[contentLocale];

  const comparisons = await Promise.all(currencies.map(async (currency) => {
    const result = await compareCashLive({ currency, amount: 1000, maxDistanceKm: 100, locale: contentLocale }).catch(() => null);
    const row = result?.all.find((item) => item.providerSlug === slug);
    return row ? { currency, row } : null;
  }));
  const rateRows = comparisons.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const primary = rateRows.find((item) => item.currency === 'USD')?.row || rateRows[0]?.row;
  const staticBranch = cashBranches.find((item) => item.providerSlug === slug);
  const branchName = primary?.branchName || staticBranch?.name || provider.name;
  const address = staticBranch?.address || '';
  const hours = primary?.hours || staticBranch?.hours || '';
  const mapsUrl = primary?.mapsUrl || staticBranch?.mapsUrl || provider.officialUrl;
  const openState = primary?.isOpen ?? (getBangkokOpenState(hours) ?? staticBranch?.isOpen ?? false);
  const sourceType = primary?.sourceType || 'fallback';

  const faqEntries = contentLocale === 'th'
    ? [
        { question: `${provider.name} อยู่ตรงไหน`, answer: `${branchName} อยู่ในพื้นที่ ${primary?.area || staticBranch?.area || 'Bangkok'} หน้าเว็บนี้มีที่อยู่ เวลาเปิด และลิงก์แผนที่สำหรับตรวจสอบก่อนเดินทาง` },
        { question: `เรท ${provider.name} เป็นเรทสดหรือไม่`, answer: `หน้าเว็บแสดงสถานะแหล่งข้อมูลและเวลาที่สังเกตอย่างชัดเจน ควรยืนยันเรทล่าสุดกับร้านก่อนแลกเงินจริง` },
      ]
    : contentLocale === 'zh'
      ? [
          { question: `${provider.name} 在哪里`, answer: `${branchName} 位于 ${primary?.area || staticBranch?.area || 'Bangkok'}，页面提供地址、营业时间和地图入口。` },
          { question: `${provider.name} 汇率是实时的吗`, answer: '页面会显示来源状态和观测时间，实际换汇前仍应向门店确认最新柜台汇率。' },
        ]
      : [
          { question: `Where is ${provider.name}?`, answer: `${branchName} is in ${primary?.area || staticBranch?.area || 'Bangkok'}. This page shows the address, opening hours, and map link.` },
          { question: `Are these ${provider.name} rates live?`, answer: 'The page labels the source state and observation time. Always verify the latest counter rate with the provider before exchanging money.' },
        ];

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: locale === 'th' ? 'เงินสดเป็น THB' : locale === 'zh' ? '现金换 THB' : 'Cash to THB', item: withLocalePath(locale, '/cash') },
    { name: provider.name, item: withLocalePath(locale, `/money-changers/${provider.slug}`) },
  ]);
  const businessLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: provider.name,
    url: withLocalePath(locale, `/money-changers/${provider.slug}`),
    sameAs: provider.officialUrl,
    areaServed: 'Bangkok',
    address: address ? { '@type': 'PostalAddress', streetAddress: address, addressLocality: 'Bangkok', addressCountry: 'TH' } : undefined,
    openingHours: hours,
    hasMap: mapsUrl,
  };

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqEntries)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd) }} />

      <header className="grid gap-6 rounded-[32px] bg-[#0f2e22] p-6 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0b1]">{c.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{provider.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7e4dc]">{t(provider.summary, locale)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${openState ? 'bg-emerald-400/15 text-emerald-200' : 'bg-stone-500/20 text-stone-300'}`}>{openState ? c.open : c.closed}</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-stone-200">{c[sourceType]}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <TrackAnchor href={mapsUrl} target="_blank" rel="noreferrer" eventName="money_changer_profile_map_click" eventParams={{ provider: provider.slug }} className="rounded-full bg-[#dcebdd] px-5 py-3 text-sm font-semibold text-[#18583d]">{c.map}</TrackAnchor>
          <TrackAnchor href={provider.officialUrl} target="_blank" rel="noreferrer" eventName="money_changer_profile_official_click" eventParams={{ provider: provider.slug, source_type: sourceType }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{c.official}</TrackAnchor>
          <TrackLink href={`/${locale}/cash?currency=USD&amount=1000`} eventName="money_changer_profile_compare_click" eventParams={{ provider: provider.slug }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{c.compare}</TrackLink>
        </div>
      </header>

      {primary ? (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151a18]">
          <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#76aa8b]">{c.current}</p>
              <p className="mt-3 text-lg font-semibold text-white">{primary.area} · {primary.hours}</p>
              <p className="mt-1 text-sm text-stone-400">{c.sourceNote}</p>
            </div>
            <div className="lg:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{c.receive}</p>
              <p className="mt-1 text-5xl font-semibold tracking-[-0.05em] text-white">฿{formatNumber(primary.estimatedThb, 0)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
            <Metric label={c.rate} value={formatNumber(primary.buyRate, 4)} />
            <Metric label={c.distance} value={`${formatNumber(primary.distanceKm, 1)} km`} />
            <Metric label={c.denomination} value={primary.denomination} />
            <Metric label={c.observed} value={new Date(primary.observedAt).toLocaleString()} />
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-black/10 bg-[#ece8dc] p-6 text-[#11271e]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#657169]">{c.location}</p>
          <h2 className="mt-3 text-xl font-semibold">{branchName}</h2>
          <div className="mt-5 space-y-4 text-sm">
            <Fact label={c.address} value={address || '-'} />
            <Fact label={c.hours} value={hours || '-'} />
            <Fact label={c.distance} value={primary ? `${formatNumber(primary.distanceKm, 1)} km` : '-'} />
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
          <h2 className="text-xl font-semibold text-white">{c.rates}</h2>
          <p className="mt-2 text-sm text-stone-400">{c.sourceNote}</p>
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
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
        <h2 className="text-xl font-semibold text-white">{c.questions}</h2>
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
  const provider = cashProviders.find((item) => item.slug === slug);
  if (!provider) return {};
  const isRatchada = slug === 'ratchada';
  const isSia = slug === 'sia';
  const title = locale === 'th'
    ? `${provider.name} เรท เวลาเปิด และแผนที่`
    : locale === 'zh'
      ? `${provider.name} 曼谷｜汇率、营业时间与地图`
      : isRatchada
        ? 'Ratchada Exchange Rate, Hours & Map | Huai Khwang'
        : isSia
          ? 'SIA Money Exchange Bangkok | Rates, Hours & Map'
          : `${provider.name} Bangkok | Rates, Hours & Map`;
  const description = locale === 'en'
    ? `Check ${provider.name} observed rates, estimated THB, opening status, Bangkok location, map, and official verification link.`
    : t(provider.summary, locale);
  const path = `/money-changers/${slug}`;
  return {
    title,
    description,
    alternates: metadataAlternatesForPolicy(locale, path, ['en', 'th']),
    robots: robotsForPage(locale, shouldIndexMoneyChangerProfile(locale, slug)),
    openGraph: { title, description, url: withLocalePath(locale, path) },
  };
}
