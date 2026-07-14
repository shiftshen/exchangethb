import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CashDecisionResult, CashDecisionTool } from '@/components/cash-decision-tool';
import { compareCashLive } from '@/lib/cash-live';
import { isLocale } from '@/lib/i18n';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { ContentLocale, CurrencyCode, Locale } from '@/lib/types';

export const revalidate = 60;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'th' }, { locale: 'zh' }];
}

const copy = {
  en: {
    eyebrow: 'Bangkok cash exchange',
    title: 'Compare the rate and the trip.',
    body: 'Enter your cash amount, use your location if you want, and compare estimated THB with opening hours, distance, banknote conditions, and source freshness.',
    note: 'The highest counter rate is not always the best practical route. Travel time, opening status, and data quality matter.',
  },
  th: {
    eyebrow: 'เปรียบเทียบร้านแลกเงินกรุงเทพ',
    title: 'เทียบทั้งเรทและระยะทาง',
    body: 'กรอกจำนวนเงิน เปิดตำแหน่งหากต้องการ แล้วเทียบยอด THB เวลาเปิด ระยะทาง เงื่อนไขธนบัตร และความสดของข้อมูล',
    note: 'เรทสูงสุดไม่ใช่เส้นทางที่ดีที่สุดเสมอ เวลาเดินทาง สถานะเปิดร้าน และคุณภาพข้อมูลก็สำคัญ',
  },
  zh: {
    eyebrow: '曼谷现金换汇',
    title: '同时比较汇率和路程。',
    body: '输入现金金额，可选择使用当前位置，再比较预计 THB、营业时间、距离、纸币条件和数据新鲜度。',
    note: '最高柜台汇率不一定是最实际的选择，路程、营业状态和数据质量同样重要。',
  },
} as const;

const supportedCurrencies: CurrencyCode[] = ['USD', 'EUR', 'JPY', 'CNY', 'GBP'];

function readCurrency(value: string | string[] | undefined): CurrencyCode {
  const candidate = Array.isArray(value) ? value[0] : value;
  return supportedCurrencies.includes(candidate as CurrencyCode) ? candidate as CurrencyCode : 'USD';
}

function readPositive(value: string | string[] | undefined, fallback: number) {
  const candidate = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(candidate) && candidate > 0 ? candidate : fallback;
}

export default async function CashPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const contentLocale = locale as ContentLocale;
  const c = copy[contentLocale];
  const currency = readCurrency(undefined);
  const amount = readPositive(undefined, 1000);
  const maxDistanceKm = readPositive(undefined, 20);

  const initialResult = await compareCashLive({
    currency,
    amount,
    maxDistanceKm,
    locale: contentLocale,
  }).catch(() => ({
    all: [],
    cacheGeneratedAt: null,
    cacheStale: true,
    distanceOrigin: 'reference',
    quality: {
      liveRows: 0,
      hybridRows: 0,
      fallbackRows: 0,
      missingProviders: [],
      anomalyCount: 0,
    },
  })) as CashDecisionResult;

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(contentLocale) },
    { name: c.eyebrow, item: withLocalePath(contentLocale, '/cash') },
  ]);

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <header className="grid gap-6 rounded-[32px] bg-[#0f2e22] p-6 text-white sm:p-9 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fd0b1]">{c.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{c.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#d7e4dc]">{c.body}</p>
        </div>
        <p className="border-l border-[#74a989] pl-4 text-sm leading-6 text-[#9fb7aa]">{c.note}</p>
      </header>
      <CashDecisionTool
        locale={contentLocale}
        initialResult={initialResult}
        initialCurrency={currency}
        initialAmount={amount}
        initialMaxDistance={maxDistanceKm}
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const contentLocale = locale as ContentLocale;
  const c = copy[contentLocale];
  const title = contentLocale === 'en'
    ? 'Bangkok Cash Exchange Comparison | Rates, Distance, Open Now'
    : contentLocale === 'th'
      ? 'เปรียบเทียบร้านแลกเงินกรุงเทพ | เรท ระยะทาง เวลาเปิด'
      : '曼谷现金换汇比较｜汇率、距离与营业状态';
  return {
    title,
    description: c.body,
    alternates: localeMetadataAlternates(contentLocale, '/cash'),
    robots: localeRobots(contentLocale),
    openGraph: {
      title,
      description: c.body,
      url: withLocalePath(contentLocale, '/cash'),
    },
  };
}
