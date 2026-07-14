import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TrackAnchor, TrackLink } from '@/components/track-link';
import { exchanges } from '@/data/site';
import { resolveAffiliateLink } from '@/lib/affiliate';
import { compareCrypto } from '@/lib/compare';
import { readAdminConfig } from '@/lib/content-store';
import { localizeExchangeLicense } from '@/lib/exchange-text';
import { resolveContentLocale, t } from '@/lib/i18n';
import { shouldIndexExchangeProfile } from '@/lib/indexing-policy';
import { breadcrumbJsonLd, metadataAlternatesForPolicy, robotsForPage, withLocalePath } from '@/lib/seo';
import { Locale } from '@/lib/types';

const copy = {
  en: {
    eyebrow: 'Thai exchange profile',
    current: 'Current USDT → THB example',
    net: 'Estimated net THB',
    average: 'Average execution',
    fees: 'Trading + THB withdrawal',
    depth: 'Order-book fill',
    updated: 'Observed',
    pairs: 'Compared assets',
    tradingFee: 'Trading fee',
    withdrawal: 'THB withdrawal',
    license: 'License context',
    strengths: 'Where this exchange can fit',
    cautions: 'What to verify first',
    official: 'Open official exchange',
    compare: 'Compare against other exchanges',
    live: 'Live source',
    fallback: 'Reviewed fallback',
    unavailable: 'A current market example is temporarily unavailable. Use the comparison tool to refresh all exchanges.',
  },
  th: {
    eyebrow: 'โปรไฟล์แพลตฟอร์มไทย',
    current: 'ตัวอย่าง USDT → THB ตอนนี้',
    net: 'THB สุทธิโดยประมาณ',
    average: 'ราคาเฉลี่ย',
    fees: 'ค่าธรรมเนียมเทรด + ถอน THB',
    depth: 'การเติมเต็ม order book',
    updated: 'สังเกตเมื่อ',
    pairs: 'สินทรัพย์ที่เปรียบเทียบ',
    tradingFee: 'ค่าธรรมเนียมเทรด',
    withdrawal: 'ค่าถอน THB',
    license: 'บริบทใบอนุญาต',
    strengths: 'แพลตฟอร์มนี้เหมาะตรงไหน',
    cautions: 'สิ่งที่ต้องยืนยันก่อน',
    official: 'เปิดเว็บเทรดทางการ',
    compare: 'เปรียบเทียบกับแพลตฟอร์มอื่น',
    live: 'ข้อมูลสด',
    fallback: 'ข้อมูลสำรองที่ตรวจแล้ว',
    unavailable: 'ตัวอย่างตลาดปัจจุบันไม่พร้อมชั่วคราว ให้เปิดหน้าคอมแพร์เพื่อรีเฟรชทุกแพลตฟอร์ม',
  },
  zh: {
    eyebrow: '泰国交易所实体页',
    current: '当前 USDT → THB 示例',
    net: '预计净到手 THB',
    average: '平均成交价',
    fees: '交易费 + THB 提现费',
    depth: '订单簿成交率',
    updated: '观测时间',
    pairs: '参与比较的资产',
    tradingFee: '交易费',
    withdrawal: 'THB 提现费',
    license: '牌照背景',
    strengths: '适合使用它的情况',
    cautions: '使用前需要确认',
    official: '打开官方交易所',
    compare: '与其他交易所比较',
    live: '实时来源',
    fallback: '审核备用数据',
    unavailable: '当前市场示例暂时不可用，请进入比较工具刷新所有交易所。',
  },
} as const;

function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

export default async function ExchangeDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const exchange = exchanges.find((item) => item.slug === slug);
  if (!exchange) notFound();
  const contentLocale = resolveContentLocale(locale);
  const c = copy[contentLocale];

  const [config, comparison] = await Promise.all([
    readAdminConfig(),
    compareCrypto({
      symbol: 'USDT',
      side: 'sell',
      amount: 1000,
      quoteMode: 'coin',
      includeWithdrawal: true,
      withdrawThb: true,
    }).catch(() => []),
  ]);
  const current = comparison.find((row) => row.slug === exchange.slug);
  const affiliate = resolveAffiliateLink(config.affiliateLinks[exchange.slug] || exchange.affiliate);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: locale === 'th' ? 'คริปโตเป็น THB' : locale === 'zh' ? '加密换 THB' : 'Crypto to THB', item: withLocalePath(locale, '/crypto') },
    { name: exchange.name, item: withLocalePath(locale, `/exchanges/${exchange.slug}`) },
  ]);

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <header className="grid gap-6 rounded-[32px] bg-[#0f2e22] p-6 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0b1]">{c.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{exchange.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7e4dc]">{t(exchange.summary, locale)}</p>
          <p className="mt-4 text-sm text-[#9fb7aa]">{localizeExchangeLicense(exchange.license, locale)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <TrackAnchor href={affiliate.outboundUrl} target="_blank" rel="noopener noreferrer" eventName="exchange_profile_official_click" eventParams={{ exchange: exchange.slug, status: affiliate.effectiveStatus }} className="rounded-full bg-[#dcebdd] px-5 py-3 text-sm font-semibold text-[#18583d]">{c.official}</TrackAnchor>
          <TrackLink href={`/${locale}/crypto?symbol=USDT&side=sell&amount=1000`} eventName="exchange_profile_compare_click" eventParams={{ exchange: exchange.slug }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">{c.compare}</TrackLink>
        </div>
      </header>

      {current ? (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151a18]">
          <div className="grid gap-5 p-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#76aa8b]">{c.current}</p>
              <p className="mt-3 text-sm text-stone-400">{current.source} · {current.freshness}</p>
              <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${current.live ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                {current.live ? c.live : c.fallback}
              </span>
            </div>
            <div className="lg:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{c.net}</p>
              <p className="mt-1 text-5xl font-semibold tracking-[-0.05em] text-white">฿{formatNumber(current.estimatedReceive)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
            <Metric label={c.average} value={`฿${formatNumber(current.averagePrice, 4)}`} />
            <Metric label={c.fees} value={`฿${formatNumber(current.tradingFee + current.thbWithdraw)}`} />
            <Metric label={c.depth} value={`${formatNumber(current.fillRatio * 100, 2)}%`} />
            <Metric label={c.updated} value={new Date(current.updatedAt).toLocaleString()} />
          </div>
        </section>
      ) : (
        <section className="rounded-[28px] border border-white/10 bg-[#151a18] p-6 text-stone-300">{c.unavailable}</section>
      )}

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-black/10 bg-[#ece8dc] p-6 text-[#11271e]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#657169]">{c.license}</p>
          <p className="mt-3 font-semibold">{localizeExchangeLicense(exchange.license, locale)}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Fact label={c.tradingFee} value={`${exchange.fee.tradingFeePct}%`} />
            <Fact label={c.withdrawal} value={`฿${exchange.fee.thbWithdraw}`} />
            <Fact label={c.pairs} value={exchange.pairs.join(', ')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
            <h2 className="text-xl font-semibold text-white">{c.strengths}</h2>
            <div className="mt-4 space-y-3">
              {exchange.strengths.map((item) => <p key={item.en} className="border-l border-emerald-400/40 pl-4 text-sm leading-6 text-stone-300">{t(item, locale)}</p>)}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#151a18] p-6">
            <h2 className="text-xl font-semibold text-white">{c.cautions}</h2>
            <div className="mt-4 space-y-3">
              {exchange.cautions.map((item) => <p key={item.en} className="border-l border-amber-400/40 pl-4 text-sm leading-6 text-stone-300">{t(item, locale)}</p>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="bg-[#111614] p-4"><p className="text-xs text-stone-500">{label}</p><p className="mt-1 font-semibold text-white">{value}</p></div>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-[#657169]">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const exchange = exchanges.find((item) => item.slug === slug);
  if (!exchange) return {};
  const title = locale === 'th'
    ? `${exchange.name} ค่าธรรมเนียมและผลลัพธ์ THB`
    : locale === 'zh'
      ? `${exchange.name} 费用与 THB 净到手`
      : `${exchange.name} Thailand | Fees, Net THB, Market Depth`;
  const description = locale === 'en'
    ? `Check ${exchange.name} fees, THB withdrawal cost, supported assets, live source status, and a current USDT-to-THB execution example.`
    : t(exchange.summary, locale);
  const path = `/exchanges/${slug}`;
  return {
    title,
    description,
    alternates: metadataAlternatesForPolicy(locale, path, ['en']),
    robots: robotsForPage(locale, shouldIndexExchangeProfile(locale)),
    openGraph: { title, description, url: withLocalePath(locale, path) },
  };
}
