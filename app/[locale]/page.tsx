import Link from 'next/link';
import { cashProviders, exchanges } from '@/data/site';
import { t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { Pill, Section, StatCard } from '@/components/ui';

const copy = {
  th: {
    heroKicker: 'ตัวช่วยเลือกทางแลกเงินบาทที่ดีกว่า',
    heroTitle: 'เปรียบเทียบคริปโตและร้านแลกเงิน เพื่อหาเส้นทางที่เหมาะกับคุณ',
    heroBody: 'ExchangeTHB เปรียบเทียบ estimated receive, fees, depth, branch distance และเวลาเปิดทำการในที่เดียว',
    primary: 'เปรียบเทียบคริปโต',
    secondary: 'เปรียบเทียบเงินสด',
    trust: 'ใช้ข้อมูลจาก official APIs, official websites และ rule engine ที่มีการตรวจทาน',
  },
  en: {
    heroKicker: 'Find a better path into Thai baht',
    heroTitle: 'Compare crypto and money changers in one decision-friendly flow',
    heroBody: 'ExchangeTHB compares estimated receive, fees, depth, branch distance, and opening hours in one place.',
    primary: 'Compare crypto',
    secondary: 'Compare cash / FX',
    trust: 'Built on official APIs, official websites, and a reviewed rules engine.',
  },
  zh: {
    heroKicker: '找到更适合你的换入泰铢路径',
    heroTitle: '把加密兑换与线下换汇放进同一个决策界面',
    heroBody: 'ExchangeTHB 统一比较预计到手、手续费、深度、门店距离与营业时间。',
    primary: '比较加密兑换',
    secondary: '比较现金换汇',
    trust: '基于官方 API、官网页面与人工复核规则库。',
  },
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = copy[locale];
  return (
    <div className="space-y-16">
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
          <StatCard title="Coverage" value="4 Exchanges / 5 Cash Brands" hint="Launch scope is frozen for quality" />
          <StatCard title="Default Locale" value="TH" hint="One-tap switch to EN / 中文" />
          <StatCard title="Maps" value="Google Maps" hint="Branch distance and quick navigation" />
          <StatCard title="Compliance" value="Estimated only" hint="Never presented as guaranteed execution" />
        </div>
      </section>

      <Section title="Quick compare" description="Choose the path that fits your next conversion decision.">
        <div className="grid gap-6 md:grid-cols-2">
          <Link href={`/${locale}/crypto`} className="card space-y-4 p-6 hover:border-brand-300">
            <Pill>Crypto → THB</Pill>
            <h3 className="text-2xl font-semibold">Depth-aware exchange comparison</h3>
            <p className="text-stone-600">BTC, ETH, USDT, XRP, DOGE, SOL with fee breakdowns and estimated receive.</p>
          </Link>
          <Link href={`/${locale}/cash`} className="card space-y-4 p-6 hover:border-brand-300">
            <Pill>Cash / FX → THB</Pill>
            <h3 className="text-2xl font-semibold">Bangkok branch and rate comparison</h3>
            <p className="text-stone-600">Best rate, nearest good option, branch hours, and Google Maps jump-outs.</p>
          </Link>
        </div>
      </Section>

      <Section title="Popular routes" description="High-intent pages built for SEO and quick access.">
        <div className="grid gap-4 md:grid-cols-4">
          {['BTC/THB', 'USDT/THB', 'USD→THB', 'CNY→THB'].map((route) => (
            <div key={route} className="card p-5">
              <p className="text-sm text-stone-500">Popular route</p>
              <p className="mt-2 text-xl font-semibold">{route}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Trusted coverage" description="Editorially curated sources with transparent methodology.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl font-semibold">Exchanges</h3>
            <div className="mt-4 grid gap-3">
              {exchanges.map((exchange) => <div key={exchange.slug} className="flex items-center justify-between border-b border-stone-100 pb-3"><span>{exchange.name}</span><span className="text-sm text-stone-500">{t(exchange.summary, locale)}</span></div>)}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold">Money changers</h3>
            <div className="mt-4 grid gap-3">
              {cashProviders.map((provider) => <div key={provider.slug} className="flex items-center justify-between border-b border-stone-100 pb-3"><span>{provider.name}</span><span className="text-sm text-stone-500">{t(provider.summary, locale)}</span></div>)}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
