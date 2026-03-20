import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { exchanges } from '@/data/site';
import { exchangeAdapters } from '@/lib/adapters/exchanges';
import { TrackAnchor, TrackLink } from '@/components/track-link';
import { resolveAffiliateLink } from '@/lib/affiliate';
import { readAdminConfig } from '@/lib/content-store';
import { describeMarketSource } from '@/lib/market-data';
import { localizeExchangeLicense } from '@/lib/exchange-text';
import { resolveContentLocale, t } from '@/lib/i18n';
import { localizeAdapterNote, localizeMarketFallbackReason, localizeMarketFreshness, localizeMarketSource } from '@/lib/market-text';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

const copy = {
  th: {
    heroKicker: 'โปรไฟล์แพลตฟอร์ม',
    statusLive: 'ข้อมูลตลาดสด',
    statusFallback: 'โหมดข้อมูลสำรอง',
    snapshotSummaryLive: 'ข้อมูลราคาหน้านี้อ้างอิงจากรอบดึงข้อมูลล่าสุดของแหล่งทางการ',
    snapshotSummaryFallback: 'ข้อมูลราคาหน้านี้ใช้ข้อมูลสำรองที่ผ่านการทบทวน เพราะแหล่งสดยังไม่พร้อมเต็มรูปแบบ',
    profileStatus: 'สถานะโปรไฟล์',
    profileRecommended: 'แนะนำ',
    profileWatchlist: 'เฝ้าดู',
    tags: 'แท็ก',
    riskNote: 'บันทึกความเสี่ยง',
    noRiskNote: 'ไม่มีบันทึกเพิ่มเติม',
    healthTitle: 'หมายเหตุจากตัวเชื่อมต่อข้อมูล',
    noHealthNote: 'ยังไม่มีหมายเหตุจากตัวเชื่อมต่อข้อมูล',
    strengthsTitle: 'จุดเด่นและข้อควรระวัง',
    factsTitle: 'ก่อนไปยังแพลตฟอร์ม ควรดูอะไรบ้าง',
    tradingFee: 'ค่าธรรมเนียมเทรด',
    withdrawFee: 'ค่าถอน THB',
    pairs: 'คู่ที่กำลังเปิดให้เปรียบเทียบ',
    pairCount: 'จำนวนคู่ที่เปรียบเทียบได้ตอนนี้',
    sourceLayer: 'แหล่งข้อมูล',
    freshness: 'ความสดของข้อมูล',
    fallbackReason: 'เหตุผลที่ใช้ข้อมูลสำรอง',
    reviewed: 'รีวิวล่าสุด',
    marketUpdated: 'อัปเดตตลาดล่าสุด',
    openTracked: 'ไปยังเว็บเทรด',
    compareRoute: 'กลับไปเปรียบเทียบคริปโต',
    affiliateStatus: 'ลิงก์ที่ใช้ตอนกดออก',
    affiliateReady: 'พร้อมติดตามผลแล้ว',
    affiliatePending: 'ตอนนี้ยังใช้ลิงก์ทางการปกติ',
    sourceFallbackLabel: 'ชุดข้อมูลสำรองที่ผ่านการทบทวน',
    freshnessFallback: 'สแนปช็อตข้อมูลสำรอง',
    marketUpdatedFallback: 'ยังไม่มีเวลาตลาดล่าสุด',
    statPairs: 'คู่ที่กำลังเทียบ',
    statFee: 'ค่าธรรมเนียมเทรด',
    statLink: 'ลิงก์ออกปัจจุบัน',
    decisionTitle: 'ก่อนกดออกจากหน้านี้',
    decisionOneTitle: 'ดูต้นทุนที่แท้จริง',
    decisionOneBody: 'ค่าธรรมเนียมเทรด ค่าถอน และสภาพคล่องมีผลต่อผลลัพธ์มากกว่าราคา headline เพียงตัวเดียว',
    decisionTwoTitle: 'ดูสถานะข้อมูล',
    decisionTwoBody: 'ถ้ารอบนี้เป็นข้อมูลสด คุณควรเชื่อใจตัวเลขได้มากกว่าโหมดสำรอง',
    decisionThreeTitle: 'เช็กลิงก์ปลายทาง',
    decisionThreeBody: 'ถ้ามี tracking link ระบบจะใช้ให้ทันที ไม่งั้นจะกลับไปที่ลิงก์ทางการปกติ',
  },
  en: {
    heroKicker: 'Exchange profile',
    statusLive: 'Live market data',
    statusFallback: 'Using backup market data',
    snapshotSummaryLive: 'Prices on this page are based on the latest successful refresh from an official source.',
    snapshotSummaryFallback: 'This page is currently using a reviewed fallback snapshot because the live source is not fully available.',
    profileStatus: 'Profile status',
    profileRecommended: 'Recommended',
    profileWatchlist: 'Watchlist',
    tags: 'Tags',
    riskNote: 'Risk note',
    noRiskNote: 'No additional note',
    healthTitle: 'Adapter note',
    noHealthNote: 'No source note available yet',
    strengthsTitle: 'Strengths and cautions',
    factsTitle: 'What to check before you leave this page',
    tradingFee: 'Trading fee',
    withdrawFee: 'THB withdrawal fee',
    pairs: 'Pairs currently compared',
    pairCount: 'Comparable pair count',
    sourceLayer: 'Data source',
    freshness: 'Freshness',
    fallbackReason: 'Fallback reason',
    reviewed: 'Last reviewed',
    marketUpdated: 'Latest market update',
    openTracked: 'Open exchange',
    compareRoute: 'Back to crypto compare',
    affiliateStatus: 'Current outbound link',
    affiliateReady: 'Tracking-ready',
    affiliatePending: 'Using the standard official link right now',
    sourceFallbackLabel: 'Reviewed fallback dataset',
    freshnessFallback: 'Reviewed backup snapshot',
    marketUpdatedFallback: 'No market timestamp available yet',
    statPairs: 'Compared pairs',
    statFee: 'Trading fee',
    statLink: 'Outbound link',
    decisionTitle: 'What matters before you click out',
    decisionOneTitle: 'Look at real cost',
    decisionOneBody: 'Trading fee, withdrawal fee, and depth matter more than a single headline quote.',
    decisionTwoTitle: 'Check data state',
    decisionTwoBody: 'A live snapshot deserves more trust than a reviewed fallback route.',
    decisionThreeTitle: 'Check destination link',
    decisionThreeBody: 'If a tracking link is active, the button will use it. Otherwise it falls back to the official link.',
  },
  zh: {
    heroKicker: '交易所画像',
    statusLive: '实时市场数据',
    statusFallback: '当前使用备用市场数据',
    snapshotSummaryLive: '本页价格基于最近一次成功抓取到的官方数据源。',
    snapshotSummaryFallback: '当前页面使用经过审核的备用快照，因为实时源暂时不能完整提供数据。',
    profileStatus: '平台状态',
    profileRecommended: '推荐',
    profileWatchlist: '观察名单',
    tags: '标签',
    riskNote: '风险备注',
    noRiskNote: '暂无额外备注',
    healthTitle: '数据源说明',
    noHealthNote: '暂无额外说明',
    strengthsTitle: '优势与注意点',
    factsTitle: '跳转前更值得先看的信息',
    tradingFee: '交易费',
    withdrawFee: 'THB 提现费',
    pairs: '当前可比较的交易对',
    pairCount: '当前可比较交易对数量',
    sourceLayer: '数据来源',
    freshness: '新鲜度',
    fallbackReason: '回退原因',
    reviewed: '最近审核时间',
    marketUpdated: '最近市场更新时间',
    openTracked: '前往交易所',
    compareRoute: '返回加密比较',
    affiliateStatus: '当前跳转链接',
    affiliateReady: '已接入跟踪',
    affiliatePending: '当前使用官方普通链接',
    sourceFallbackLabel: '已审核的备用数据集',
    freshnessFallback: '已审核的备用快照',
    marketUpdatedFallback: '暂无最新市场时间',
    statPairs: '可比较交易对',
    statFee: '交易费率',
    statLink: '当前外跳链接',
    decisionTitle: '跳转前最该确认的事',
    decisionOneTitle: '先看真实成本',
    decisionOneBody: '交易费、提现费和深度，比单一挂牌价更影响最终结果。',
    decisionTwoTitle: '再看数据状态',
    decisionTwoBody: '实时快照比备用路径更值得信任，页面会直接告诉你当前状态。',
    decisionThreeTitle: '最后看跳转链接',
    decisionThreeBody: '有 tracking 链接时会优先使用，没有就回退到官网链接。',
  },
} as const;

export default async function ExchangeDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const exchange = exchanges.find((item) => item.slug === slug);
  if (!exchange) notFound();

  const adapter = exchangeAdapters.find((item) => item.slug === slug);
  const [health, snapshots, config] = adapter
    ? await Promise.all([adapter.checkHealth(), adapter.fetchSnapshots('BTC'), readAdminConfig()])
    : [null, [], await readAdminConfig()];
  const latestSnapshot = snapshots[0];
  const source = latestSnapshot ? describeMarketSource(latestSnapshot) : null;
  const profile = config.exchangeProfiles[exchange.slug] || { recommended: true, tags: [], riskNote: '' };
  const affiliate = resolveAffiliateLink(config.affiliateLinks[exchange.slug] || exchange.affiliate);
  const outboundUrl = affiliate.outboundUrl;
  const c = copy[resolveContentLocale(locale)];
  const affiliateStatusLabel = affiliate.trackingUrl && !affiliate.downgraded ? c.affiliateReady : c.affiliatePending;
  const sourceLabel = source ? localizeMarketSource(source.label, locale) : c.sourceFallbackLabel;
  const freshnessLabel = source ? localizeMarketFreshness(source.freshness, locale) : c.freshnessFallback;
  const fallbackReason = source?.fallbackReason ? localizeMarketFallbackReason(source.fallbackReason, locale) : null;
  const localizedLicense = localizeExchangeLicense(exchange.license, locale);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: locale === 'th' ? 'คริปโตเป็นบาท' : locale === 'zh' ? '加密换泰铢' : 'Crypto to THB', item: withLocalePath(locale, '/crypto') },
    { name: exchange.name, item: withLocalePath(locale, `/exchanges/${exchange.slug}`) },
  ]);

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="card overflow-hidden border-brand-500/20 bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900 p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-5">
            <Pill>{c.heroKicker}</Pill>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{exchange.name}</h1>
              <p className="max-w-3xl text-base text-stone-300">{t(exchange.summary, locale)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TrackAnchor href={outboundUrl} target="_blank" rel="noreferrer" eventName="affiliate_click" eventParams={{ exchange: exchange.slug, status: affiliate.effectiveStatus }} className="inline-flex rounded-full bg-brand-500 px-5 py-3 font-semibold text-surface-950 transition hover:bg-brand-400">{c.openTracked}</TrackAnchor>
              <TrackLink href={`/${locale}/crypto?symbol=BTC&amount=0.01&side=buy`} eventName="exchange_detail_compare_click" eventParams={{ exchange: exchange.slug }} className="inline-flex rounded-full border border-surface-600 px-5 py-3 font-medium text-stone-200 transition hover:border-brand-500 hover:text-brand-300">{c.compareRoute}</TrackLink>
              <TrackLink href={`/${locale}/exchanges`} eventName="exchange_detail_hub_click" eventParams={{ exchange: exchange.slug }} className="inline-flex rounded-full border border-surface-600 px-5 py-3 font-medium text-stone-200 transition hover:border-brand-500 hover:text-brand-300">{locale === 'th' ? 'ดูหน้ารวมแพลตฟอร์ม' : locale === 'zh' ? '查看交易所总览' : 'Browse exchange hub'}</TrackLink>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/8 bg-surface-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.statPairs}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{exchange.pairs.length}</p>
              <p className="mt-2 text-sm text-stone-400">{exchange.pairs.join(', ')}</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-surface-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.statFee}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{exchange.fee.tradingFeePct}%</p>
              <p className="mt-2 text-sm text-stone-400">{c.withdrawFee}: {exchange.fee.thbWithdraw} THB</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-surface-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.statLink}</p>
              <p className="mt-2 text-lg font-semibold text-white">{affiliateStatusLabel}</p>
              <p className="mt-2 text-sm text-stone-400">{t(affiliate.disclosure, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <Section title={exchange.name} description={t(exchange.summary, locale)}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card space-y-5 p-6">
            <Pill>{localizedLicense}</Pill>
            <div className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${source?.live ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300' : 'border border-amber-500/30 bg-amber-500/15 text-amber-300'}`}>
              {source?.live ? c.statusLive : c.statusFallback}
            </div>
            <p className="text-sm text-stone-300">{source?.live ? c.snapshotSummaryLive : c.snapshotSummaryFallback}</p>
            <div className="rounded-2xl border border-surface-700 bg-surface-850 p-4 text-sm text-stone-300">
              <p>{c.profileStatus}: {profile.recommended ? c.profileRecommended : c.profileWatchlist}</p>
              <p className="mt-1">{c.tags}: {profile.tags.length ? profile.tags.join(', ') : '-'}</p>
              <p className="mt-1">{c.riskNote}: {profile.riskNote || c.noRiskNote}</p>
            </div>
            <div className="rounded-2xl border border-surface-700 bg-surface-850 p-4 text-sm text-stone-300">
              <p className="font-semibold text-white">{c.healthTitle}</p>
              <p className="mt-2">{health?.note ? localizeAdapterNote(health.note, locale) : c.noHealthNote}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{c.strengthsTitle}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {exchange.strengths.map((item) => <div key={item.en} className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4 text-sm text-brand-100">{t(item, locale)}</div>)}
              {exchange.cautions.map((item) => <div key={item.en} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">{t(item, locale)}</div>)}
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white">{c.factsTitle}</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-300">
              <p>{c.tradingFee}: {exchange.fee.tradingFeePct}%</p>
              <p>{c.withdrawFee}: {exchange.fee.thbWithdraw} THB</p>
              <p>{c.pairs}: {exchange.pairs.join(', ')}</p>
              <p>{c.pairCount}: {exchange.pairs.length}</p>
              <p>{c.sourceLayer}: {sourceLabel}</p>
              <p>{c.freshness}: {freshnessLabel}</p>
              {fallbackReason ? <p>{c.fallbackReason}: {fallbackReason}</p> : null}
              <p>{c.reviewed}: {new Date(exchange.lastUpdated).toLocaleString()}</p>
              <p>{c.marketUpdated}: {latestSnapshot ? new Date(latestSnapshot.lastUpdated).toLocaleString() : c.marketUpdatedFallback}</p>
            </div>
            <p className="mt-3 text-xs text-stone-400">{t(affiliate.disclosure, locale)}</p>
            <p className="mt-1 text-xs text-stone-400">{c.affiliateStatus}: {affiliateStatusLabel}</p>
          </div>
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
  const exchange = exchanges.find((item) => item.slug === slug);
  if (!exchange) return {};

  const title = locale === 'th'
    ? `${exchange.name} รีวิวและเปรียบเทียบแลก THB`
    : locale === 'zh'
      ? `${exchange.name} 交易所详情与 THB 比较`
      : `${exchange.name} Thailand Review | Crypto Exchange to THB`;
  const description = locale === 'en'
    ? `Review ${exchange.name} for Thailand THB conversion. Compare supported coins, fee structure, THB access, and exchange-specific risks before trading.`
    : t(exchange.summary, locale);
  const path = `/exchanges/${slug}`;

  return {
    title,
    description,
    alternates: localeMetadataAlternates(locale, path),
    robots: localeRobots(locale),
    keywords: locale === 'en'
      ? [`${exchange.name} Thailand`, `${exchange.name} THB`, `${exchange.name} review`, 'Thailand crypto exchange']
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
