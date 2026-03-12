import Link from 'next/link';
import type { Metadata } from 'next';
import { exchanges, publicCashProviders } from '@/data/site';
import { TrackLink } from '@/components/track-link';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { breadcrumbJsonLd, localeAlternates, websiteJsonLd, withLocalePath } from '@/lib/seo';
import { Pill, Section, StatCard } from '@/components/ui';

const copy = {
  th: {
    heroKicker: 'ตัวช่วยเลือกทางแลกเงินบาทที่ดีกว่า',
    heroTitle: 'เปรียบเทียบคริปโตและร้านแลกเงิน เพื่อหาเส้นทางที่เหมาะกับคุณ',
    heroBody: 'ExchangeTHB เปรียบเทียบจำนวนเงินบาทประมาณการ ค่าธรรมเนียม สภาพคล่อง ระยะอ้างอิงจากใจกลางกรุงเทพ และเวลาเปิดทำการไว้ในที่เดียว',
    primary: 'เปรียบเทียบคริปโต',
    secondary: 'เปรียบเทียบเงินสด',
    trust: 'ใช้ข้อมูลจาก API ทางการ หน้าเว็บทางการ และกฎตรวจทานที่เปิดเผยสถานะข้อมูลอย่างตรงไปตรงมา',
    coverageTitle: 'ความครอบคลุม',
    coverageValue: '{exchangeCount} แพลตฟอร์ม / {cashCount} แบรนด์เงินสด',
    coverageHint: 'ขอบเขตเปิดตัวถูกล็อกเพื่อเน้นความแม่นยำ',
    localeTitle: 'ภาษาเริ่มต้น',
    localeValue: 'TH',
    localeHint: 'สลับ EN / 中文 ได้ในคลิกเดียว',
    mapsTitle: 'แผนที่',
    mapsValue: 'แผนที่ / หน้าอ้างอิง',
    mapsHint: 'เปิดแผนที่จริงเมื่อมี และใช้หน้าอ้างอิงของแบรนด์เมื่อยังไม่มีลิงก์แผนที่โดยตรง',
    complianceTitle: 'Compliance',
    complianceValue: 'Estimated only',
    complianceHint: 'ไม่แสดงเป็นราคาการทำรายการที่การันตี',
    quickTitle: 'เริ่มเปรียบเทียบทันที',
    quickDescription: 'เลือกเส้นทางที่เหมาะกับการตัดสินใจครั้งถัดไปของคุณ',
    cryptoCardTitle: 'เปรียบเทียบคริปโตแบบดูสภาพคล่อง',
    cryptoCardBody: 'รองรับ BTC, ETH, USDT, XRP, DOGE, SOL พร้อมแสดงค่าธรรมเนียมและผลลัพธ์ประมาณการ',
    cashCardTitle: 'เปรียบเทียบเงินสดตามเรตและระยะอ้างอิง',
    cashCardBody: 'ดูเรตดีที่สุด ตัวเลือกตามระยะอ้างอิง เวลาเปิดทำการ และลิงก์แผนที่หรือหน้าอ้างอิง',
    routeTitle: 'เส้นทางยอดนิยม',
    routeDescription: 'เส้นทางที่ใช้บ่อย เพื่อเข้าเปรียบเทียบได้เร็วขึ้นโดยไม่ต้องเริ่มใหม่',
    routeLabel: 'เส้นทางยอดนิยม',
    trustedTitle: 'แหล่งข้อมูลที่ตรวจสอบได้',
    trustedDescription: 'คัดเลือกจากแหล่งที่ตรวจสอบได้ พร้อมคำอธิบายวิธีการและสถานะข้อมูลอย่างโปร่งใส',
    exchangesTitle: 'แพลตฟอร์มคริปโต',
    changersTitle: 'ร้านแลกเงิน',
    viewProfile: 'ดูโปรไฟล์',
    startTitle: 'เริ่มจากโจทย์ที่ใกล้ตัวที่สุด',
    startDescription: 'กดหนึ่งครั้งเพื่อเริ่มด้วยค่าที่พบบ่อย แล้วค่อยปรับตัวเลขต่อในหน้าถัดไป',
    sourceTitle: 'สถานะข้อมูลที่คุณจะเห็น',
    sourceDescription: 'ทุกหน้าจะติดป้ายสถานะข้อมูลชัดเจน เพื่อแยกข้อมูลสดออกจากข้อมูลสำรอง',
    sourceLiveTitle: 'สด',
    sourceLiveBody: 'มาจาก official API หรือ official website ที่ดึงได้ในรอบล่าสุด',
    sourceHybridTitle: 'ผสม',
    sourceHybridBody: 'ผสมระหว่างแหล่งทางการกับการเติมข้อมูลที่ผ่านการทบทวน',
    sourceFallbackTitle: 'สำรอง',
    sourceFallbackBody: 'ใช้ข้อมูลสำรองเมื่อแหล่งสดไม่พร้อม และจะแสดงเหตุผลกำกับ',
    quickCryptoPill: 'คริปโต -> THB',
    quickCashPill: 'เงินสด / FX -> THB',
    startBuyBtc: 'ซื้อ 0.01 BTC',
    startSellUsdt: 'ขาย 1000 USDT',
    startUsdCash: 'แลกเงินสด 1000 USD',
    startCnyCash: 'แลกเงินสด 5000 CNY',
    missionEyebrow: 'เหตุผลที่คนใช้หน้านี้',
    missionTitle: 'ตัดสินใจก่อนออกไปยังแพลตฟอร์มหรือร้านจริง',
    missionBody: 'ดูต้นทุนรวม ค่าธรรมเนียม ความลึกของตลาด สถานะข้อมูล และลิงก์ออกจริงในหน้าที่ออกแบบมาเพื่อการตัดสินใจ ไม่ใช่หน้าแสดงตัวเลขอย่างเดียว',
    proofOneTitle: 'ข้อมูลสดที่เปิดสถานะชัด',
    proofOneBody: 'ทุกหน้าระบุ live, hybrid, fallback ให้เห็นตรงๆ',
    proofTwoTitle: 'ลิงก์ออกพร้อมใช้งาน',
    proofTwoBody: 'กดแล้วไปหน้าแพลตฟอร์มหรือหน้าอ้างอิงจริงได้ทันที',
    proofThreeTitle: 'เส้นทางยอดนิยมพร้อมใช้',
    proofThreeBody: 'เปิดหน้าแล้วมี route พร้อมเทียบ ไม่ต้องเริ่มจากศูนย์',
  },
  en: {
    heroKicker: 'Find a better path into Thai baht',
    heroTitle: 'Compare crypto and money changers in one decision-friendly flow',
    heroBody: 'ExchangeTHB compares estimated receive, fees, depth, central-Bangkok reference distance, and opening hours in one place.',
    primary: 'Compare crypto',
    secondary: 'Compare cash / FX',
    trust: 'Built on official APIs, official websites, and a reviewed rules engine.',
    coverageTitle: 'Coverage',
    coverageValue: '{exchangeCount} Exchanges / {cashCount} Cash Brands',
    coverageHint: 'Launch scope is frozen for quality',
    localeTitle: 'Default Locale',
    localeValue: 'TH',
    localeHint: 'One-tap switch to EN / 中文',
    mapsTitle: 'Maps',
    mapsValue: 'Maps / reference',
    mapsHint: 'Open a real map when available, otherwise go to the provider reference page.',
    complianceTitle: 'Compliance',
    complianceValue: 'Estimated only',
    complianceHint: 'Never presented as guaranteed execution',
    quickTitle: 'Quick compare',
    quickDescription: 'Choose the path that fits your next conversion decision.',
    cryptoCardTitle: 'Depth-aware exchange comparison',
    cryptoCardBody: 'BTC, ETH, USDT, XRP, DOGE, SOL with fee breakdowns and estimated receive.',
    cashCardTitle: 'Bangkok branch and rate comparison',
    cashCardBody: 'Best rate, reference-distance ranking, branch hours, and direct map or reference-page links.',
    routeTitle: 'Popular routes',
    routeDescription: 'Common starting routes so users can compare faster without starting from zero.',
    routeLabel: 'Popular route',
    trustedTitle: 'Trusted coverage',
    trustedDescription: 'Traceable sources with transparent methodology and visible data-state labels.',
    exchangesTitle: 'Exchanges',
    changersTitle: 'Money changers',
    viewProfile: 'View profile',
    startTitle: 'Start from a common use case',
    startDescription: 'One tap opens a prefilled comparison so you can adjust the numbers from there.',
    sourceTitle: 'Data states you will see',
    sourceDescription: 'Every comparison clearly labels live, hybrid, and fallback states instead of hiding them.',
    sourceLiveTitle: 'Live',
    sourceLiveBody: 'Pulled from an official API or official website in the latest refresh.',
    sourceHybridTitle: 'Hybrid',
    sourceHybridBody: 'Combines official data with reviewed completion where the source is partial.',
    sourceFallbackTitle: 'Fallback',
    sourceFallbackBody: 'Used only when a live source is unavailable, with the reason shown on page.',
    quickCryptoPill: 'Crypto -> THB',
    quickCashPill: 'Cash / FX -> THB',
    startBuyBtc: 'Buy 0.01 BTC',
    startSellUsdt: 'Sell 1000 USDT',
    startUsdCash: 'Exchange 1000 USD cash',
    startCnyCash: 'Exchange 5000 CNY cash',
    missionEyebrow: 'Why this page exists',
    missionTitle: 'Decide before you leave for the real provider',
    missionBody: 'See all-in cost, fees, liquidity, data state, and real outbound links in a screen built for decision-making instead of raw data dumping.',
    proofOneTitle: 'Live data with explicit states',
    proofOneBody: 'Every surface tells you whether the row is live, hybrid, or fallback.',
    proofTwoTitle: 'Ready outbound actions',
    proofTwoBody: 'Jump directly to the exchange, map, or provider reference page.',
    proofThreeTitle: 'Prefilled popular routes',
    proofThreeBody: 'Open the page with a realistic starting route instead of an empty state.',
  },
  zh: {
    heroKicker: '找到更适合你的换入泰铢路径',
    heroTitle: '把加密兑换与线下换汇放进同一个决策界面',
    heroBody: 'ExchangeTHB 统一比较预计到手、手续费、深度、距曼谷中心参考点的距离与营业时间。',
    primary: '比较加密兑换',
    secondary: '比较现金换汇',
    trust: '基于官方 API、官网页面与人工复核规则库。',
    coverageTitle: '覆盖范围',
    coverageValue: '{exchangeCount} 家交易所 / {cashCount} 家现金品牌',
    coverageHint: '首发范围已锁定以保证质量',
    localeTitle: '默认语言',
    localeValue: 'TH',
    localeHint: '一键切换 EN / 中文',
    mapsTitle: '地图',
    mapsValue: '地图 / 参考页',
    mapsHint: '有真实地图就直接跳地图，没有时跳到品牌参考页',
    complianceTitle: '合规说明',
    complianceValue: '仅为估算',
    complianceHint: '不承诺最终成交价格',
    quickTitle: '快速开始比较',
    quickDescription: '选择更符合你当前换汇决策的路径。',
    cryptoCardTitle: '深度感知的交易所比较',
    cryptoCardBody: '支持 BTC、ETH、USDT、XRP、DOGE、SOL，并展示费用拆解与预计到手。',
    cashCardTitle: '按汇率与参考距离比较门店',
    cashCardBody: '同时查看最佳汇率、参考距离排序、营业时间，以及地图或参考页跳转。',
    routeTitle: '热门路线',
    routeDescription: '常用路线直接进入比较，不用每次从空白页开始。',
    routeLabel: '热门路线',
    trustedTitle: '可信覆盖',
    trustedDescription: '来源可追溯，方法论透明，并明确展示数据状态。',
    exchangesTitle: '交易所',
    changersTitle: '换汇品牌',
    viewProfile: '查看详情',
    startTitle: '从最常见的需求开始',
    startDescription: '一键进入预填参数的比较页，后续再微调金额和方向。',
    sourceTitle: '你会看到的数据状态',
    sourceDescription: '页面会明确标注实时、混合、备用状态，而不是把备用数据伪装成实时。',
    sourceLiveTitle: '实时',
    sourceLiveBody: '来自最近一轮成功抓取的官方 API 或官网页面。',
    sourceHybridTitle: '混合',
    sourceHybridBody: '官方数据为主，配合审核后的补全信息。',
    sourceFallbackTitle: '备用',
    sourceFallbackBody: '仅在实时源不可用时启用，并在页面说明原因。',
    quickCryptoPill: '加密兑换 -> THB',
    quickCashPill: '现金 / 外汇 -> THB',
    startBuyBtc: '买入 0.01 BTC',
    startSellUsdt: '卖出 1000 USDT',
    startUsdCash: '兑换 1000 USD 现金',
    startCnyCash: '兑换 5000 CNY 现金',
    missionEyebrow: '这个页面存在的意义',
    missionTitle: '先把路线看明白，再跳到真实平台或门店',
    missionBody: '这里不是只摆数字，而是把总成本、手续费、流动性、数据状态和真实跳转入口放在同一个决策界面里。',
    proofOneTitle: '实时数据状态直接可见',
    proofOneBody: '每个页面都明确区分实时、混合、备用。',
    proofTwoTitle: '跳转入口直接可用',
    proofTwoBody: '可以直接跳交易所、地图或品牌参考页。',
    proofThreeTitle: '热门路线预填即用',
    proofThreeBody: '打开就是合理默认路线，不是空白起步。',
  },
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = copy[locale];
  const coverageValue = c.coverageValue
    .replace('{exchangeCount}', String(exchanges.length))
    .replace('{cashCount}', String(publicCashProviders.length));
  const webSiteLd = websiteJsonLd(locale, '', c.heroBody);
  const breadcrumbLd = breadcrumbJsonLd([{ name: 'ExchangeTHB', item: withLocalePath(locale) }]);
  return (
    <div className="space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="frontend-hero overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Pill>{c.heroKicker}</Pill>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">{c.heroTitle}</h1>
              <p className="max-w-2xl text-lg text-stone-300">{c.heroBody}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <TrackLink href={`/${locale}/crypto`} eventName="homepage_cta_click" eventParams={{ target: 'crypto' }} className="rounded-full bg-brand-500 px-6 py-3 font-medium text-surface-950 hover:bg-brand-400">{c.primary}</TrackLink>
              <TrackLink href={`/${locale}/cash`} eventName="homepage_cta_click" eventParams={{ target: 'cash' }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.secondary}</TrackLink>
            </div>
            <p className="max-w-2xl text-sm text-stone-500">{c.trust}</p>
          </div>
          <div className="grid gap-4">
            <div className="card-panel hero-orbit relative overflow-hidden p-5 float-slow">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{c.missionEyebrow}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{c.missionTitle}</p>
              <p className="mt-2 text-sm text-stone-400">{c.missionBody}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: c.proofOneTitle, body: c.proofOneBody },
                { title: c.proofTwoTitle, body: c.proofTwoBody },
                { title: c.proofThreeTitle, body: c.proofThreeBody },
              ].map((item) => (
                <div key={item.title} className="card-panel p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-stone-400">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard title={c.coverageTitle} value={coverageValue} hint={c.coverageHint} />
              <StatCard title={c.localeTitle} value={c.localeValue} hint={c.localeHint} />
              <StatCard title={c.mapsTitle} value={c.mapsValue} hint={c.mapsHint} />
              <StatCard title={c.complianceTitle} value={c.complianceValue} hint={c.complianceHint} />
            </div>
          </div>
        </div>
      </section>

      <Section title={c.quickTitle} description={c.quickDescription}>
        <div className="grid gap-6 md:grid-cols-2">
          <TrackLink href={`/${locale}/crypto`} eventName="homepage_route_click" eventParams={{ route: 'crypto' }} className="card card-interactive space-y-4 p-6">
            <Pill>{c.quickCryptoPill}</Pill>
            <h3 className="text-2xl font-semibold text-white">{c.cryptoCardTitle}</h3>
            <p className="text-stone-400">{c.cryptoCardBody}</p>
          </TrackLink>
          <TrackLink href={`/${locale}/cash`} eventName="homepage_route_click" eventParams={{ route: 'cash' }} className="card card-interactive space-y-4 p-6">
            <Pill>{c.quickCashPill}</Pill>
            <h3 className="text-2xl font-semibold text-white">{c.cashCardTitle}</h3>
            <p className="text-stone-400">{c.cashCardBody}</p>
          </TrackLink>
        </div>
      </Section>

      <Section title={c.startTitle} description={c.startDescription}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: c.startBuyBtc, href: `/${locale}/crypto?symbol=BTC&amount=0.01&side=buy` },
            { label: c.startSellUsdt, href: `/${locale}/crypto?symbol=USDT&amount=1000&side=sell` },
            { label: c.startUsdCash, href: `/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=10` },
            { label: c.startCnyCash, href: `/${locale}/cash?currency=CNY&amount=5000&maxDistanceKm=10` },
          ].map((item) => (
            <TrackLink key={item.label} href={item.href} eventName="homepage_prefilled_start_click" eventParams={{ label: item.label }} className="card card-interactive p-5">
              <p className="text-sm text-stone-400">{c.routeLabel}</p>
              <p className="mt-2 text-lg font-semibold text-white">{item.label}</p>
            </TrackLink>
          ))}
        </div>
      </Section>

      <Section title={c.routeTitle} description={c.routeDescription}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'BTC/THB', href: `/${locale}/crypto?symbol=BTC&amount=0.01&side=buy` },
            { label: 'USDT/THB', href: `/${locale}/crypto?symbol=USDT&amount=1000&side=buy` },
            { label: 'USD→THB', href: `/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=10` },
            { label: 'CNY→THB', href: `/${locale}/cash?currency=CNY&amount=5000&maxDistanceKm=10` },
          ].map((route) => (
            <TrackLink key={route.label} href={route.href} eventName="homepage_popular_route_click" eventParams={{ route: route.label }} className="card card-interactive p-5">
              <p className="text-sm text-stone-400">{c.routeLabel}</p>
              <p className="mt-2 text-xl font-semibold text-white">{route.label}</p>
            </TrackLink>
          ))}
        </div>
      </Section>

      <Section title={c.sourceTitle} description={c.sourceDescription}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: c.sourceLiveTitle, body: c.sourceLiveBody, tone: 'border border-emerald-500/25 bg-emerald-500/10 text-emerald-300' },
            { title: c.sourceHybridTitle, body: c.sourceHybridBody, tone: 'border border-amber-500/25 bg-amber-500/10 text-amber-300' },
            { title: c.sourceFallbackTitle, body: c.sourceFallbackBody, tone: 'border border-surface-600 bg-surface-800 text-stone-200' },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>{item.title}</span>
              <p className="mt-4 text-sm text-stone-400">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={c.trustedTitle} description={c.trustedDescription}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">{c.exchangesTitle}</h3>
            <div className="mt-4 grid gap-3">
              {exchanges.map((exchange) => (
                <TrackLink key={exchange.slug} href={`/${locale}/exchanges/${exchange.slug}`} eventName="homepage_exchange_profile_click" eventParams={{ exchange: exchange.slug }} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-surface-800/70 px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/40">
                  <div>
                    <p className="font-medium text-white">{exchange.name}</p>
                    <p className="mt-1 text-sm text-stone-400">{t(exchange.summary, locale)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-brand-300">{c.viewProfile}</span>
                </TrackLink>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white">{c.changersTitle}</h3>
            <div className="mt-4 grid gap-3">
              {publicCashProviders.map((provider) => (
                <TrackLink key={provider.slug} href={`/${locale}/money-changers/${provider.slug}`} eventName="homepage_money_changer_profile_click" eventParams={{ provider: provider.slug }} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-surface-800/70 px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/40">
                  <div>
                    <p className="font-medium text-white">{provider.name}</p>
                    <p className="mt-1 text-sm text-stone-400">{t(provider.summary, locale)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-brand-300">{c.viewProfile}</span>
                </TrackLink>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'th' ? 'หน้าแรก ExchangeTHB' : locale === 'zh' ? 'ExchangeTHB 首页' : 'Thailand Crypto and Cash Exchange Comparison';
  const description = copy[locale].heroBody;
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale),
      languages: localeAlternates(),
    },
    keywords: locale === 'en'
      ? ['Thailand crypto exchange comparison', 'THB conversion', 'Bangkok money changer', 'crypto to baht', 'cash exchange Thailand']
      : undefined,
    openGraph: {
      title,
      description,
      url: withLocalePath(locale),
    },
  };
}
