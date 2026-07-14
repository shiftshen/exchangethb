import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CryptoDecisionResult, CryptoDecisionTool } from '@/components/crypto-decision-tool';
import { compareCrypto } from '@/lib/compare';
import { isLocale } from '@/lib/i18n';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { ContentLocale, CryptoSymbol, Locale } from '@/lib/types';

export const revalidate = 60;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'th' }, { locale: 'zh' }];
}

const copy = {
  en: {
    eyebrow: 'Thai exchange execution',
    title: 'Compare the outcome, not the headline price.',
    body: 'Estimate what you pay or receive after order-book depth, trading fees, network fees, and THB withdrawal costs across Thai exchanges.',
    note: 'A quoted price can look better while producing a worse final result. Complete fills and net THB come first.',
  },
  th: {
    eyebrow: 'การดำเนินการบนแพลตฟอร์มไทย',
    title: 'เทียบผลลัพธ์จริง ไม่ใช่แค่ราคาหน้าตลาด',
    body: 'ประเมินยอดจ่ายหรือยอดรับหลังดู order book ค่าธรรมเนียมเทรด ค่าธรรมเนียมเครือข่าย และค่าถอน THB ของแต่ละแพลตฟอร์มไทย',
    note: 'ราคาที่ดูดีกว่าอาจให้ผลลัพธ์สุดท้ายแย่กว่า ระบบจึงให้ความสำคัญกับการเติมเต็มและ THB สุทธิ',
  },
  zh: {
    eyebrow: '泰国交易所真实成交路径',
    title: '比较最终结果，而不是表面价格。',
    body: '综合订单簿深度、交易费、网络费和 THB 提现费，估算在不同泰国交易所的实际支付或净到手。',
    note: '报价更好不代表最终结果更好，完整成交和净 THB 才是优先指标。',
  },
} as const;

const symbols: CryptoSymbol[] = ['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL'];

function readSymbol(value: string | string[] | undefined): CryptoSymbol {
  const candidate = Array.isArray(value) ? value[0] : value;
  return symbols.includes(candidate as CryptoSymbol) ? candidate as CryptoSymbol : 'USDT';
}

function readAmount(value: string | string[] | undefined) {
  const candidate = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(candidate) && candidate > 0 ? candidate : 1000;
}

export default async function CryptoPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const contentLocale = locale as ContentLocale;
  const c = copy[contentLocale];
  const symbol = readSymbol(undefined);
  const side = 'sell';
  const amount = readAmount(undefined);

  const initialResult = await compareCrypto({
    symbol,
    side,
    amount,
    quoteMode: 'coin',
    includeWithdrawal: true,
    withdrawThb: side === 'sell',
  }).catch(() => []) as CryptoDecisionResult;

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(contentLocale) },
    { name: c.eyebrow, item: withLocalePath(contentLocale, '/crypto') },
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
      <CryptoDecisionTool
        locale={contentLocale}
        initialResult={initialResult}
        initialSymbol={symbol}
        initialSide={side}
        initialAmount={amount}
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
    ? 'Crypto to THB Comparison | Net Receive, Fees, Market Depth'
    : contentLocale === 'th'
      ? 'เปรียบเทียบคริปโตเป็น THB | ยอดสุทธิ ค่าธรรมเนียม Depth'
      : '加密资产换 THB 比较｜净到手、费用与市场深度';
  return {
    title,
    description: c.body,
    alternates: localeMetadataAlternates(contentLocale, '/crypto'),
    robots: localeRobots(contentLocale),
    openGraph: {
      title,
      description: c.body,
      url: withLocalePath(contentLocale, '/crypto'),
    },
  };
}
