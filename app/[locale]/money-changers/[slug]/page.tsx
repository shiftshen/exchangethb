import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cashBranches, cashProviders, cashRates, publicCashProviderSlugs } from '@/data/site';
import { readCashCache } from '@/lib/cash-cache-store';
import { localizeCashText, localizeScrapeNote } from '@/lib/cash-text';
import { readAdminConfig } from '@/lib/content-store';
import { resolveContentLocale, t } from '@/lib/i18n';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { TrackAnchor, TrackLink } from '@/components/track-link';
import { Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

const copy = {
  th: {
    heroKicker: 'โปรไฟล์ร้านแลกเงิน',
    coverage: 'ความครอบคลุมในกรุงเทพ',
    coverageBody: 'หน้านี้รวม {count} จุดอ้างอิงของแบรนด์ พร้อมลิงก์แผนที่หรือหน้าอ้างอิง และอัตราที่ผ่านการทบทวนจากแหล่งสาธารณะ',
    official: 'เปิดเว็บไซต์ทางการ',
    locationLink: 'เปิดพิกัด / หน้าอ้างอิง',
    scraper: 'สถานะตัวดึงข้อมูล',
    live: 'กำลังดึงข้อมูลทางการแบบสด',
    fallback: 'กำลังใช้ข้อมูลสำรองที่ผ่านการทบทวน',
    liveSummary: 'ตัวเลขอัตราอ้างอิงด้านล่างมาจากรอบดึงข้อมูลล่าสุดของแหล่งทางการ',
    fallbackSummary: 'บางตัวเลขอาจมาจากชุดข้อมูลสำรองที่ผ่านการทบทวน เพราะแหล่งสดยังไม่ครบถ้วน',
    branches: 'สาขาปัจจุบัน',
    rates: 'อัตราที่สังเกตได้',
    ratesDesc: 'ตัวอย่างอัตราล่าสุดจากแหล่งสาธารณะทางการที่ผ่านการตรวจทาน',
    maps: 'เปิดแผนที่',
    referencePage: 'เปิดหน้าอ้างอิง',
    observed: 'สังเกตเมื่อ',
    buy: 'รับซื้อ',
    source: 'แหล่งอ้างอิง',
    cacheUpdated: 'อัปเดตแคชล่าสุด',
    referenceDistance: 'ระยะอ้างอิงจากใจกลางกรุงเทพ',
    precisionExact: 'ตำแหน่งร้าน',
    precisionAddress: 'อิงจากที่อยู่',
    precisionReference: 'จุดอ้างอิงแบรนด์',
    compareRoute: 'กลับไปเปรียบเทียบเงินสด',
    mode: 'โหมดการทบทวน',
    modeAuto: 'อัตโนมัติ',
    modeForceFallback: 'บังคับใช้ข้อมูลสำรอง',
    modeForceLive: 'บังคับใช้ข้อมูลสด',
    note: 'หมายเหตุการทบทวน',
    branchDetail: 'กลับไปเปรียบเทียบเส้นทางนี้',
    statBranches: 'จุดอ้างอิงที่แสดงอยู่',
    statMode: 'โหมดข้อมูล',
    statRates: 'เรตตัวอย่างล่าสุด',
    decisionTitle: 'ก่อนออกไปยังร้านจริง',
    decisionOneTitle: 'ดูเรตและระยะควบคู่กัน',
    decisionOneBody: 'ร้านที่ให้เรตดีที่สุดอาจไม่ใช่ร้านที่เดินทางสะดวกที่สุดสำหรับคุณ',
    decisionTwoTitle: 'เช็กความแม่นของตำแหน่ง',
    decisionTwoBody: 'บางจุดเป็นพิกัดจริง บางจุดเป็นที่อยู่หรือจุดอ้างอิงแบรนด์',
    decisionThreeTitle: 'ยืนยันกับหน้าอ้างอิงอีกครั้ง',
    decisionThreeBody: 'ก่อนเดินทางจริง ควรเปิดเว็บไซต์หรือหน้าอ้างอิงของแบรนด์เพื่อตรวจสอบล่าสุด',
  },
  en: {
    heroKicker: 'Money changer profile',
    coverage: 'Bangkok coverage',
    coverageBody: 'This page currently tracks {count} provider reference locations with map or reference-page links and reviewed public rates.',
    official: 'Open official website',
    locationLink: 'Open location / reference page',
    scraper: 'Scraper status',
    live: 'Live official parsing active.',
    fallback: 'Reviewed fallback mode is active.',
    liveSummary: 'The rate samples below come from the latest successful refresh of an official public source.',
    fallbackSummary: 'Some values may come from a reviewed fallback dataset because the live source is incomplete right now.',
    branches: 'Current branches',
    rates: 'Observed rates',
    ratesDesc: 'Latest reviewed rate samples from official public sources.',
    maps: 'Open map',
    referencePage: 'Open reference page',
    observed: 'Observed',
    buy: 'Buy',
    source: 'Source reference',
    cacheUpdated: 'Latest cache update',
    referenceDistance: 'Reference distance from central Bangkok',
    precisionExact: 'Exact branch point',
    precisionAddress: 'Address-based',
    precisionReference: 'Brand reference',
    compareRoute: 'Back to cash compare',
    mode: 'Review mode',
    modeAuto: 'Automatic',
    modeForceFallback: 'Force fallback',
    modeForceLive: 'Force live',
    note: 'Review note',
    branchDetail: 'Compare this route',
    statBranches: 'Reference points shown',
    statMode: 'Data mode',
    statRates: 'Latest rate samples',
    decisionTitle: 'Before you head out',
    decisionOneTitle: 'Balance rate and trip',
    decisionOneBody: 'The best THB output may not be the most convenient branch for your route.',
    decisionTwoTitle: 'Check location precision',
    decisionTwoBody: 'Some points are exact, while others are address-based or brand reference points.',
    decisionThreeTitle: 'Confirm on the provider side',
    decisionThreeBody: 'Use the official site or reference page one more time before traveling.',
  },
  zh: {
    heroKicker: '换汇品牌画像',
    coverage: '曼谷覆盖情况',
    coverageBody: '当前页面收录了 {count} 个品牌参考点，并提供地图或参考页跳转以及经过审核的公开汇率。',
    official: '打开官网',
    locationLink: '打开位置 / 参考页',
    scraper: '抓取状态',
    live: '官方数据解析正常运行。',
    fallback: '当前使用经过审核的备用数据。',
    liveSummary: '下方汇率样本来自最近一次成功抓取到的官方公开来源。',
    fallbackSummary: '由于实时源暂时不完整，部分数字可能来自经过审核的备用数据。',
    branches: '当前门店',
    rates: '观测汇率',
    ratesDesc: '来自官方公开来源并经过审核的最新汇率样本。',
    maps: '打开地图',
    referencePage: '打开参考页',
    observed: '观测时间',
    buy: '买入',
    source: '来源参考',
    cacheUpdated: '最近缓存更新时间',
    referenceDistance: '距曼谷中心参考点',
    precisionExact: '精确门店点位',
    precisionAddress: '按地址估算',
    precisionReference: '品牌参考点',
    compareRoute: '返回现金比较',
    mode: '审核模式',
    modeAuto: '自动',
    modeForceFallback: '强制使用备用数据',
    modeForceLive: '强制使用实时数据',
    note: '审核备注',
    branchDetail: '比较这条路径',
    statBranches: '当前展示点位',
    statMode: '数据模式',
    statRates: '最新汇率样本',
    decisionTitle: '去门店前该先确认什么',
    decisionOneTitle: '汇率和路程一起看',
    decisionOneBody: '最划算的门店，不一定是对你来说最省路程的门店。',
    decisionTwoTitle: '确认位置精度',
    decisionTwoBody: '有些点位是精确门店，有些只是地址估算或品牌参考点。',
    decisionThreeTitle: '最后再核对品牌页面',
    decisionThreeBody: '真正出发前，最好再打开官网或参考页确认最新地址和营业状态。',
  },
} as const;

function faqJsonLd(entries: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };
}

function financialServiceJsonLd(
  locale: Locale,
  provider: { slug: string; name: string; officialUrl: string },
  branch: {
    name: string;
    address: string;
    mapsUrl: string;
    hours: string;
    latitude?: number;
    longitude?: number;
  } | undefined,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: provider.name,
    url: withLocalePath(locale, `/money-changers/${provider.slug}`),
    sameAs: provider.officialUrl,
    image: withLocalePath('en', '/brand-logo.svg'),
    areaServed: 'Bangkok',
    address: branch ? {
      '@type': 'PostalAddress',
      streetAddress: branch.address,
      addressLocality: 'Bangkok',
      addressCountry: 'TH',
    } : undefined,
    openingHours: branch?.hours,
    geo: branch?.latitude && branch?.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: branch.latitude,
      longitude: branch.longitude,
    } : undefined,
    hasMap: branch?.mapsUrl,
  };
}

function isGoogleMapsUrl(url: string) {
  return /google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.com/i.test(url);
}

function locationPrecisionLabel(
  localeCopy: { precisionExact: string; precisionAddress: string; precisionReference: string },
  precision: 'exact' | 'address' | 'reference' | undefined,
) {
  if (precision === 'exact') return localeCopy.precisionExact;
  if (precision === 'address') return localeCopy.precisionAddress;
  return localeCopy.precisionReference;
}

async function getScrapeCache() {
  return readCashCache() as Promise<{ generatedAt: string | null; results: Array<{ provider: string; ok: boolean; notes: string[]; rates?: Array<{ providerSlug: string; currency: string; denomination: string; buyRate: number; sellRate: number; observedAt: string; sourceUrl: string; }> }> }>;
}

export default async function MoneyChangerDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  if (!publicCashProviderSlugs.includes(slug as typeof publicCashProviderSlugs[number])) notFound();
  const provider = cashProviders.find((item) => item.slug === slug);
  if (!provider) notFound();
  const config = await readAdminConfig();
  const reviewMode = config.scrapeReview.providerModes[slug] || 'auto';
  const reviewNote = config.scrapeReview.reviewNotes[slug] || '';
  const effectiveBranches = cashBranches
    .map((branch) => {
      const override = config.branchOverrides[branch.id] || {};
      return {
        ...branch,
        name: override.name || branch.name,
        address: override.address || branch.address,
        hours: override.hours || branch.hours,
        mapsUrl: override.mapsUrl || branch.mapsUrl,
        isVisible: override.isVisible ?? true,
      };
    })
    .filter((branch) => branch.isVisible);

  const branches = effectiveBranches.filter((branch) => branch.providerSlug === slug);
  const cache = await getScrapeCache();
  const scrape = cache.results.find((item) => item.provider === slug || item.provider === provider.slug);
  const liveRates = (scrape?.rates || []).filter((rate) => rate.providerSlug === slug);
  const rates = liveRates.length
    ? liveRates
    : cashRates.filter((rate) => branches.some((branch) => branch.id === rate.branchId));
  const c = copy[resolveContentLocale(locale)];
  const reviewModeLabel = reviewMode === 'force_fallback' ? c.modeForceFallback : reviewMode === 'force_live' ? c.modeForceLive : c.modeAuto;
  const rateSummary = scrape?.ok ? c.liveSummary : c.fallbackSummary;
  const isSia = provider.slug === 'sia';
  const heroSummary = locale === 'th'
    ? isSia
      ? 'SIA Money Exchange เป็นร้านแลกเงินย่านประตูน้ำในกรุงเทพ หน้านี้ช่วยเช็กเรทตัวอย่าง เวลาเปิดทำการ จุดอ้างอิงสาขา และลิงก์ทางการก่อนแลกเงินสดเป็น THB'
      : t(provider.summary, locale)
    : locale === 'zh'
      ? isSia
        ? '如果你在找 SIA Money Exchange Bangkok，这个页面会集中展示汇率样本、Pratunam 参考位置、营业时间，以及换入 THB 前可用的官网与地图链接。'
        : t(provider.summary, locale)
      : isSia
        ? 'Looking for SIA Money Exchange Bangkok? This page helps you check SIA rate samples, Pratunam branch details, opening hours, and official links before changing cash to THB.'
        : t(provider.summary, locale);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: locale === 'th' ? 'เงินสด/ฟอเร็กซ์เป็นบาท' : locale === 'zh' ? '现金换泰铢' : 'Cash / FX to THB', item: withLocalePath(locale, '/cash') },
    { name: provider.name, item: withLocalePath(locale, `/money-changers/${provider.slug}`) },
  ]);
  const primaryBranch = branches[0];
  const faqEntries = locale === 'th'
    ? isSia
      ? [
          { question: 'SIA Money Exchange อยู่ตรงไหนในกรุงเทพ', answer: 'จุดอ้างอิงปัจจุบันของหน้านี้คือสำนักงานใหญ่ SIA Money Exchange ย่านประตูน้ำ พร้อมที่อยู่ เวลาเปิดทำการ และลิงก์แผนที่สำหรับตรวจสอบก่อนเดินทางจริง' },
          { question: 'หน้านี้มีเรท SIA Money Exchange แบบสดหรือไม่', answer: 'หน้านี้แสดง rate samples พร้อมสถานะแหล่งข้อมูลและเวลาที่สังเกตล่าสุด แต่เรทหน้าร้านจริงควรยืนยันกับผู้ให้บริการอีกครั้งเสมอ' },
          { question: 'ควรเทียบ SIA กับร้านอื่นอย่างไร', answer: 'ให้ดูเรทตัวอย่าง เวลาเปิดทำการ ระยะอ้างอิง และความสะดวกของเส้นทางร่วมกัน ไม่ควรดูแค่ตัวเลขเรทเพียงอย่างเดียว' },
        ]
      : [
          { question: `${provider.name} อยู่ตรงไหน`, answer: 'หน้านี้รวมจุดอ้างอิงสาขา ลิงก์แผนที่หรือหน้าอ้างอิง และเวลาเปิดทำการเพื่อช่วยตรวจสอบก่อนเดินทางจริง' },
          { question: 'เรทในหน้านี้ใช้ตัดสินใจได้อย่างไร', answer: 'ใช้เพื่อเปรียบเทียบเส้นทางแลก THB ร่วมกับระยะทาง เวลาเปิดทำการ และสถานะข้อมูล แล้วค่อยยืนยันกับผู้ให้บริการอีกครั้ง' },
        ]
    : locale === 'zh'
      ? isSia
        ? [
            { question: 'SIA Money Exchange 在曼谷哪里', answer: '当前数据中的参考点是位于 Pratunam 一带的 SIA Money Exchange HQ，页面提供地址、营业时间和地图链接供你出发前再次确认。' },
            { question: '这里展示的是 SIA 实时汇率吗', answer: '这里展示的是经过审核的汇率样本和来源状态，最终门店汇率仍应以 SIA 官方页面或现场为准。' },
            { question: '如何判断 SIA 是否适合换入 THB', answer: '建议把 SIA 与其他曼谷换汇店一起比较，看汇率样本、营业时间、位置和路程是否都适合你。' },
          ]
        : [
            { question: `${provider.name} 在哪里`, answer: '这个页面汇总了品牌参考点、地图或参考页，以及营业时间，帮助你在前往前再次确认。' },
            { question: '如何使用这里的汇率样本', answer: '应把这里的样本与距离、营业时间和数据状态一起看，再决定是否前往该品牌换入 THB。' },
          ]
      : isSia
        ? [
            { question: 'What is SIA Money Exchange in Bangkok?', answer: 'SIA Money Exchange is a Bangkok money changer in the Pratunam area. This page shows reference rates, branch details, and official links for THB cash exchange decisions.' },
            { question: 'Where is SIA Money Exchange located?', answer: 'The current reference location in this dataset is SIA Money Exchange HQ in Pratunam, with address, map link, and opening hours shown on the page.' },
            { question: 'Is SIA Money Exchange good for THB cash exchange?', answer: 'It can be a practical option, but users should compare SIA with other Bangkok money changers based on rate samples, opening hours, and travel convenience.' },
            { question: 'Does this page show live SIA Money Exchange rates?', answer: 'It shows reviewed rate samples and source status. Final in-store rates should still be confirmed with SIA directly.' },
          ]
        : [
            { question: `What does this ${provider.name} page show?`, answer: 'It shows reference locations, rate samples, source status, opening hours, and outbound official links for users comparing cash exchange routes into THB.' },
            { question: `How should I compare ${provider.name} with other Bangkok money changers?`, answer: 'Check the rate sample, source state, location accuracy, opening hours, and route convenience together before choosing a branch.' },
          ];
  const faqLd = faqJsonLd(faqEntries);
  const businessLd = financialServiceJsonLd(locale, provider, primaryBranch);

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd) }} />
      <section className="card overflow-hidden border-brand-500/20 bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900 p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-5">
            <Pill>{c.heroKicker}</Pill>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{provider.name}</h1>
              <p className="max-w-3xl text-base text-stone-300">{heroSummary}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TrackAnchor href={provider.officialUrl} target="_blank" rel="noreferrer" eventName="affiliate_click" eventParams={{ provider: provider.slug, status: provider.affiliate.status }} className="inline-flex rounded-full bg-brand-500 px-5 py-3 font-semibold text-surface-950 transition hover:bg-brand-400">{c.official}</TrackAnchor>
              <TrackAnchor href={`/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=10`} eventName="cash_provider_compare_click" eventParams={{ provider: provider.slug }} className="inline-flex rounded-full border border-surface-600 px-5 py-3 font-medium text-stone-200 transition hover:border-brand-500 hover:text-brand-300">{c.compareRoute}</TrackAnchor>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/8 bg-surface-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.statBranches}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{branches.length}</p>
              <p className="mt-2 text-sm text-stone-400">{c.coverage}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-surface-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.statMode}</p>
              <p className="mt-2 text-xl font-semibold text-white">{scrape?.ok ? c.live : c.fallback}</p>
              <p className="mt-2 text-sm text-stone-400">{c.mode}: {reviewModeLabel}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-surface-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.statRates}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{rates.length}</p>
              <p className="mt-2 text-sm text-stone-400">{c.cacheUpdated}: {cache.generatedAt ? new Date(cache.generatedAt).toLocaleString() : '-'}</p>
            </div>
          </div>
        </div>
      </section>

      <Section title={provider.name} description={t(provider.summary, locale)}>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card p-6">
            <Pill>{c.coverage}</Pill>
            <p className="mt-4 text-stone-300">{c.coverageBody.replace('{count}', String(branches.length))}</p>
            <p className="mt-3 text-xs text-stone-400">{t(provider.affiliate.disclosure, locale)}</p>
            <div className="mt-6 rounded-2xl border border-surface-700 bg-surface-850 p-4 text-sm text-stone-300">
              <p className="font-semibold text-white">{c.scraper}</p>
              <p className="mt-2">{scrape?.ok ? c.live : c.fallback}</p>
              <p className="mt-2">{rateSummary}</p>
              {scrape?.notes?.map((note) => <p key={note} className="mt-1">- {localizeScrapeNote(note, locale)}</p>)}
              <p className="mt-2">{c.cacheUpdated}: {cache.generatedAt ? new Date(cache.generatedAt).toLocaleString() : '-'}</p>
              <p className="mt-2">{c.mode}: {reviewModeLabel}</p>
              {reviewNote ? <p className="mt-1">{c.note}: {reviewNote}</p> : null}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white">{c.branches}</h2>
            <div className="mt-4 space-y-4">
              {branches.map((branch) => (
                <div key={branch.id} className="rounded-2xl border border-surface-700 bg-surface-850/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{localizeCashText(branch.name, locale)}</p>
                      <p className="text-sm text-stone-400">{localizeCashText(branch.address, locale)}</p>
                    </div>
                    <TrackAnchor href={branch.mapsUrl} target="_blank" rel="noreferrer" eventName="map_click" eventParams={{ provider: provider.slug, branch: branch.id }} className="text-sm font-medium text-brand-300 transition hover:text-brand-200">
                      {isGoogleMapsUrl(branch.mapsUrl) ? c.maps : c.referencePage}
                    </TrackAnchor>
                  </div>
                  <p className="mt-3 text-sm text-stone-300">{localizeCashText(branch.hours, locale)} · {c.referenceDistance} {branch.distanceKm} km · {locationPrecisionLabel(c, branch.locationPrecision)}</p>
                  <TrackAnchor href={`/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=${Math.max(1, Math.ceil(branch.distanceKm))}`} eventName="cash_branch_compare_click" eventParams={{ provider: provider.slug, branch: branch.id }} className="mt-3 inline-flex text-sm font-medium text-stone-300 transition hover:text-brand-300">{c.branchDetail}</TrackAnchor>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title={locale === 'th' ? 'คำถามที่คนค้นหาหน้านี้มักอยากรู้' : locale === 'zh' ? '搜索这个品牌时最常见的问题' : 'Questions users ask before choosing this Bangkok money changer'}
        description={locale === 'th' ? 'ส่วนนี้ช่วยให้ทั้งผู้ใช้และ search engine เข้าใจว่าหน้านี้ตอบเรื่องเรท เวลาเปิดทำการ ตำแหน่ง และการเทียบร้านอื่นอย่างไร' : locale === 'zh' ? '这一部分明确说明页面回答的是汇率、营业时间、位置和与其他曼谷换汇店的比较问题。' : 'This section helps search users understand rates, opening hours, location, and how to compare this provider with other Bangkok money changers.'}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {faqEntries.map((item) => (
            <div key={item.question} className="card p-6">
              <h2 className="text-lg font-semibold text-white">{item.question}</h2>
              <p className="mt-3 text-sm text-stone-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={locale === 'th' ? 'ลิงก์ที่ควรเทียบต่อ' : locale === 'zh' ? '继续比较时最有用的入口' : 'Where to compare next'}
        description={locale === 'th' ? 'หากกำลังเทียบร้านแลกเงินในกรุงเทพ ให้ไหลต่อไปยังหน้าคอมแพร์และคู่มือย่านที่เกี่ยวข้องกับประตูน้ำ' : locale === 'zh' ? '如果你在比较曼谷换汇路径，下面这些入口最接近 Pratunam 与现金换入 THB 的真实决策流程。' : 'If you are deciding between Bangkok money changers, these pages are the closest next step after checking this provider.'}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              href: `/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=10`,
              label: locale === 'th' ? 'เทียบ SIA กับร้านอื่นทันที' : locale === 'zh' ? '立即把 SIA 与其他换汇店一起比较' : 'Compare SIA with other Bangkok money changers',
              body: locale === 'th' ? 'เปิดหน้าคอมแพร์เงินสดพร้อมค่าเริ่มต้นที่ใช้บ่อยที่สุด' : locale === 'zh' ? '直接进入 USD 现金换 THB 的实际比较页。' : 'Open the live USD cash to THB compare flow with a practical starting amount.',
            },
            {
              href: `/${locale}/routes/pratunam-money-exchange-guide`,
              label: locale === 'th' ? 'คู่มือร้านแลกเงินย่านประตูน้ำ' : locale === 'zh' ? 'Pratunam 换汇路线指南' : 'Pratunam money exchange guide',
              body: locale === 'th' ? 'เหมาะกับผู้ที่กำลังหาจุดแลกเงินใกล้ย่านประตูน้ำ' : locale === 'zh' ? '适合需要在 Pratunam 一带换入 THB 的用户。' : 'Useful if you are comparing Pratunam-area exchange stops before changing cash to THB.',
            },
            {
              href: `/${locale}/routes/bangkok-money-changer-near-me-guide`,
              label: locale === 'th' ? 'ร้านแลกเงินใกล้ฉันในกรุงเทพ' : locale === 'zh' ? '曼谷附近换汇店指南' : 'Bangkok money changer near me guide',
              body: locale === 'th' ? 'ต่อยอดจากการดูแบรนด์ ไปสู่การตัดสินใจตามทำเลและระยะทาง' : locale === 'zh' ? '把品牌搜索继续转成按位置与路程比较的决策。' : 'Turn a brand search into a location-based Bangkok money changer decision.',
            },
          ].map((item) => (
            <TrackLink key={item.href} href={item.href} eventName="money_changer_related_link_click" eventParams={{ provider: provider.slug, href: item.href }} className="card card-interactive p-5">
              <h2 className="text-lg font-semibold text-white">{item.label}</h2>
              <p className="mt-3 text-sm text-stone-400">{item.body}</p>
            </TrackLink>
          ))}
        </div>
      </Section>

      <Section title={c.rates} description={c.ratesDesc}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rates.map((rate) => {
            const branch = 'branchId' in rate ? branches.find((entry) => entry.id === rate.branchId) : null;
            const label = 'providerSlug' in rate ? `${rate.currency} · ${rate.denomination}` : `${rate.currency}`;
            const sourceUrl = 'sourceUrl' in rate ? rate.sourceUrl : provider.officialUrl;
            return <div key={`${label}-${rate.observedAt}`} className="card p-5"><p className="text-sm text-stone-400">{branch?.name || provider.name}</p><p className="mt-2 text-2xl font-semibold text-white">{label}</p><p className="mt-1 text-lg text-brand-300">{c.buy} {rate.buyRate}</p><p className="mt-1 text-sm text-stone-400">{c.observed} {new Date(rate.observedAt).toLocaleString()}</p><TrackAnchor href={sourceUrl} target="_blank" rel="noreferrer" eventName="cash_source_click" eventParams={{ provider: provider.slug, currency: rate.currency }} className="mt-3 inline-flex text-sm font-medium text-brand-300 transition hover:text-brand-200">{isGoogleMapsUrl(sourceUrl) ? c.locationLink : c.source}</TrackAnchor></div>;
          })}
        </div>
      </Section>

      <Section title={c.decisionTitle}>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { title: c.decisionOneTitle, body: c.decisionOneBody },
            { title: c.decisionTwoTitle, body: c.decisionTwoBody },
            { title: c.decisionThreeTitle, body: c.decisionThreeBody },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-stone-400">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!publicCashProviderSlugs.includes(slug as typeof publicCashProviderSlugs[number])) return {};
  const provider = cashProviders.find((item) => item.slug === slug);
  if (!provider) return {};

  const isSia = provider.slug === 'sia';
  const title = locale === 'th'
    ? isSia
      ? 'SIA Money Exchange กรุงเทพ | เรท เวลาเปิดทำการ และพิกัดร้านแลกเงิน'
      : `${provider.name} เรทเงินสดและข้อมูลร้านแลกเงินกรุงเทพ`
    : locale === 'zh'
      ? isSia
        ? 'SIA Money Exchange Bangkok | 汇率、营业时间与门店位置'
        : `${provider.name} 汇率与曼谷换汇门店参考`
      : isSia
        ? 'SIA Money Exchange Bangkok | Rates, Hours, Location, Cash Exchange to THB'
        : `${provider.name} Bangkok rates and branch guide`;
  const description = locale === 'th'
    ? isSia
      ? 'เช็กเรท SIA Money Exchange, เวลาเปิดทำการ, พิกัดย่านประตูน้ำ และลิงก์ทางการก่อนเทียบร้านแลกเงินกรุงเทพเพื่อแลกเป็น THB'
      : `${provider.name} พร้อมเรทตัวอย่าง จุดอ้างอิงสาขาในกรุงเทพ เวลาเปิดทำการ และลิงก์หน้าอ้างอิงก่อนแลก THB`
    : locale === 'zh'
      ? isSia
        ? '查看 SIA Money Exchange Bangkok 汇率样本、Pratunam 位置、营业时间与官网链接，再决定如何把现金换入 THB，并与其他曼谷换汇店比较。'
        : `查看 ${provider.name} 汇率样本、曼谷门店参考点、营业信息与官网链接，再决定如何换入 THB。`
      : isSia
        ? 'Check SIA Money Exchange Bangkok rate samples, opening hours, Pratunam location, and official site links before changing cash to THB. Compare SIA with other Bangkok money changers.'
        : `Check ${provider.name} rate samples, Bangkok branch references, opening hours, and official links before converting cash to THB.`;
  const path = `/money-changers/${slug}`;

  return {
    title,
    description,
    alternates: localeMetadataAlternates(locale, path),
    robots: localeRobots(locale),
    keywords: locale === 'en'
      ? isSia
        ? ['SIA Money Exchange', 'SIA Money Exchange Bangkok', 'SIA exchange', 'SIA exchange rate', 'SIA branch guide', 'Bangkok money changer', 'cash exchange Thailand', 'Pratunam money exchange']
        : [`${provider.name} Bangkok`, `${provider.name} exchange rate`, 'Bangkok money changer', 'cash exchange Thailand']
      : undefined,
    openGraph: {
      title,
      description,
      url: withLocalePath(locale, path),
    },
    twitter: {
      title,
      description,
    },
  };
}
