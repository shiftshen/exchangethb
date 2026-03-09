import Link from 'next/link';
import type { Metadata } from 'next';
import { cashProviders, exchanges } from '@/data/site';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { localeAlternates, withLocalePath } from '@/lib/seo';
import { Pill, Section, StatCard } from '@/components/ui';

const copy = {
  th: {
    heroKicker: 'ตัวช่วยเลือกทางแลกเงินบาทที่ดีกว่า',
    heroTitle: 'เปรียบเทียบคริปโตและร้านแลกเงิน เพื่อหาเส้นทางที่เหมาะกับคุณ',
    heroBody: 'ExchangeTHB เปรียบเทียบ estimated receive, fees, depth, branch distance และเวลาเปิดทำการในที่เดียว',
    primary: 'เปรียบเทียบคริปโต',
    secondary: 'เปรียบเทียบเงินสด',
    trust: 'ใช้ข้อมูลจาก official APIs, official websites และ rule engine ที่มีการตรวจทาน',
    coverageTitle: 'ความครอบคลุม',
    coverageValue: '4 แพลตฟอร์ม / 5 แบรนด์เงินสด',
    coverageHint: 'ขอบเขตเปิดตัวถูกล็อกเพื่อเน้นความแม่นยำ',
    localeTitle: 'ภาษาเริ่มต้น',
    localeValue: 'TH',
    localeHint: 'สลับ EN / 中文 ได้ในคลิกเดียว',
    mapsTitle: 'แผนที่',
    mapsValue: 'Google Maps',
    mapsHint: 'ดูระยะทางสาขาและกดนำทางได้ทันที',
    complianceTitle: 'Compliance',
    complianceValue: 'Estimated only',
    complianceHint: 'ไม่แสดงเป็นราคาการทำรายการที่การันตี',
    quickTitle: 'เริ่มเปรียบเทียบทันที',
    quickDescription: 'เลือกเส้นทางที่เหมาะกับการตัดสินใจครั้งถัดไปของคุณ',
    cryptoCardTitle: 'เปรียบเทียบคริปโตแบบดูสภาพคล่อง',
    cryptoCardBody: 'รองรับ BTC, ETH, USDT, XRP, DOGE, SOL พร้อมแสดงค่าธรรมเนียมและผลลัพธ์ประมาณการ',
    cashCardTitle: 'เปรียบเทียบเงินสดตามเรตและระยะทาง',
    cashCardBody: 'ดู Best Rate, ตัวเลือกใกล้ที่สุด, เวลาเปิดทำการ และลิงก์ Google Maps',
    routeTitle: 'เส้นทางยอดนิยม',
    routeDescription: 'หน้าที่มีความต้องการสูงสำหรับการเข้าถึงเร็วและ SEO',
    routeLabel: 'เส้นทางยอดนิยม',
    trustedTitle: 'แหล่งข้อมูลที่ตรวจสอบได้',
    trustedDescription: 'คัดเลือกโดยทีมบรรณาธิการ พร้อมคำอธิบายวิธีการอย่างโปร่งใส',
    exchangesTitle: 'แพลตฟอร์มคริปโต',
    changersTitle: 'ร้านแลกเงิน',
  },
  en: {
    heroKicker: 'Find a better path into Thai baht',
    heroTitle: 'Compare crypto and money changers in one decision-friendly flow',
    heroBody: 'ExchangeTHB compares estimated receive, fees, depth, branch distance, and opening hours in one place.',
    primary: 'Compare crypto',
    secondary: 'Compare cash / FX',
    trust: 'Built on official APIs, official websites, and a reviewed rules engine.',
    coverageTitle: 'Coverage',
    coverageValue: '4 Exchanges / 5 Cash Brands',
    coverageHint: 'Launch scope is frozen for quality',
    localeTitle: 'Default Locale',
    localeValue: 'TH',
    localeHint: 'One-tap switch to EN / 中文',
    mapsTitle: 'Maps',
    mapsValue: 'Google Maps',
    mapsHint: 'Branch distance and quick navigation',
    complianceTitle: 'Compliance',
    complianceValue: 'Estimated only',
    complianceHint: 'Never presented as guaranteed execution',
    quickTitle: 'Quick compare',
    quickDescription: 'Choose the path that fits your next conversion decision.',
    cryptoCardTitle: 'Depth-aware exchange comparison',
    cryptoCardBody: 'BTC, ETH, USDT, XRP, DOGE, SOL with fee breakdowns and estimated receive.',
    cashCardTitle: 'Bangkok branch and rate comparison',
    cashCardBody: 'Best rate, nearest good option, branch hours, and Google Maps jump-outs.',
    routeTitle: 'Popular routes',
    routeDescription: 'High-intent pages built for SEO and quick access.',
    routeLabel: 'Popular route',
    trustedTitle: 'Trusted coverage',
    trustedDescription: 'Editorially curated sources with transparent methodology.',
    exchangesTitle: 'Exchanges',
    changersTitle: 'Money changers',
  },
  zh: {
    heroKicker: '找到更适合你的换入泰铢路径',
    heroTitle: '把加密兑换与线下换汇放进同一个决策界面',
    heroBody: 'ExchangeTHB 统一比较预计到手、手续费、深度、门店距离与营业时间。',
    primary: '比较加密兑换',
    secondary: '比较现金换汇',
    trust: '基于官方 API、官网页面与人工复核规则库。',
    coverageTitle: '覆盖范围',
    coverageValue: '4 家交易所 / 5 家现金品牌',
    coverageHint: '首发范围已锁定以保证质量',
    localeTitle: '默认语言',
    localeValue: 'TH',
    localeHint: '一键切换 EN / 中文',
    mapsTitle: '地图',
    mapsValue: 'Google Maps',
    mapsHint: '展示门店距离并支持快速跳转',
    complianceTitle: '合规说明',
    complianceValue: '仅为估算',
    complianceHint: '不承诺最终成交价格',
    quickTitle: '快速开始比较',
    quickDescription: '选择更符合你当前换汇决策的路径。',
    cryptoCardTitle: '深度感知的交易所比较',
    cryptoCardBody: '支持 BTC、ETH、USDT、XRP、DOGE、SOL，并展示费用拆解与预计到手。',
    cashCardTitle: '按汇率与距离比较门店',
    cashCardBody: '同时查看最佳汇率、最近可接受选项、营业时间和 Google Maps 跳转。',
    routeTitle: '热门路线',
    routeDescription: '面向高意图搜索与快速访问的入口页。',
    routeLabel: '热门路线',
    trustedTitle: '可信覆盖',
    trustedDescription: '编辑审核的数据源与透明方法论。',
    exchangesTitle: '交易所',
    changersTitle: '换汇品牌',
  },
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = copy[locale];
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ExchangeTHB',
    url: withLocalePath(locale),
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${withLocalePath(locale)}/crypto?symbol={symbol}&amount={amount}`,
      'query-input': ['required name=symbol', 'required name=amount'],
    },
  };
  return (
    <div className="space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <Pill>{c.heroKicker}</Pill>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-6xl">{c.heroTitle}</h1>
            <p className="max-w-2xl text-lg text-stone-600">{c.heroBody}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/crypto`} className="rounded-full bg-brand-700 px-6 py-3 font-medium text-white hover:bg-brand-800">{c.primary}</Link>
            <Link href={`/${locale}/cash`} className="rounded-full border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:border-brand-200 hover:text-brand-700">{c.secondary}</Link>
          </div>
          <p className="text-sm text-stone-500">{c.trust}</p>
        </div>
        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <StatCard title={c.coverageTitle} value={c.coverageValue} hint={c.coverageHint} />
          <StatCard title={c.localeTitle} value={c.localeValue} hint={c.localeHint} />
          <StatCard title={c.mapsTitle} value={c.mapsValue} hint={c.mapsHint} />
          <StatCard title={c.complianceTitle} value={c.complianceValue} hint={c.complianceHint} />
        </div>
      </section>

      <Section title={c.quickTitle} description={c.quickDescription}>
        <div className="grid gap-6 md:grid-cols-2">
          <Link href={`/${locale}/crypto`} className="card space-y-4 p-6 hover:border-brand-300">
            <Pill>Crypto → THB</Pill>
            <h3 className="text-2xl font-semibold">{c.cryptoCardTitle}</h3>
            <p className="text-stone-600">{c.cryptoCardBody}</p>
          </Link>
          <Link href={`/${locale}/cash`} className="card space-y-4 p-6 hover:border-brand-300">
            <Pill>Cash / FX → THB</Pill>
            <h3 className="text-2xl font-semibold">{c.cashCardTitle}</h3>
            <p className="text-stone-600">{c.cashCardBody}</p>
          </Link>
        </div>
      </Section>

      <Section title={c.routeTitle} description={c.routeDescription}>
        <div className="grid gap-4 md:grid-cols-4">
          {['BTC/THB', 'USDT/THB', 'USD→THB', 'CNY→THB'].map((route) => (
            <div key={route} className="card p-5">
              <p className="text-sm text-stone-500">{c.routeLabel}</p>
              <p className="mt-2 text-xl font-semibold">{route}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={c.trustedTitle} description={c.trustedDescription}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl font-semibold">{c.exchangesTitle}</h3>
            <div className="mt-4 grid gap-3">
              {exchanges.map((exchange) => <div key={exchange.slug} className="flex items-center justify-between border-b border-stone-100 pb-3"><span>{exchange.name}</span><span className="text-sm text-stone-500">{t(exchange.summary, locale)}</span></div>)}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold">{c.changersTitle}</h3>
            <div className="mt-4 grid gap-3">
              {cashProviders.map((provider) => <div key={provider.slug} className="flex items-center justify-between border-b border-stone-100 pb-3"><span>{provider.name}</span><span className="text-sm text-stone-500">{t(provider.summary, locale)}</span></div>)}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'th' ? 'หน้าแรก ExchangeTHB' : locale === 'zh' ? 'ExchangeTHB 首页' : 'ExchangeTHB Home';
  const description = copy[locale].heroBody;
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale),
      languages: localeAlternates(),
    },
    openGraph: {
      title,
      description,
      url: withLocalePath(locale),
    },
  };
}
