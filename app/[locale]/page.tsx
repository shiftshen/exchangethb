import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HomeComparison } from '@/components/home-comparison';
import { compareCashLive } from '@/lib/cash-live';
import { compareCrypto } from '@/lib/compare';
import { isLocale } from '@/lib/i18n';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { ContentLocale, Locale } from '@/lib/types';

export const revalidate = 60;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'th' }, { locale: 'zh' }];
}

const copy = {
  en: {
    eyebrow: 'Live Thai baht decisions',
    title: 'See what you actually get in THB.',
    body: 'Compare real exchange paths, fees, market depth, opening hours, and distance before you choose a crypto exchange or Bangkok money changer.',
    trust: 'Official APIs and provider pages · Source status shown · Final rates must be verified',
    usefulTitle: 'Useful answers, not a directory of SEO pages.',
    usefulBody: 'Every result should help you decide what to do next: how much THB you may receive, why one option ranks higher, whether the data is live, and where to verify it.',
    cashTitle: 'Nearby cash exchange',
    cashBody: 'Compare estimated THB, observed rates, opening hours, and reference distance. Open the map only after the numbers make sense.',
    cryptoTitle: 'Net crypto outcome',
    cryptoBody: 'Compare Thai exchanges using order-book depth, trading fees, and THB withdrawal costs instead of a headline price alone.',
    sourceTitle: 'Freshness is part of the result',
    sourceBody: 'Live, hybrid, and reviewed fallback data are clearly separated. A stale source never gets presented as a guaranteed counter rate.',
    primaryCash: 'Explore cash comparison',
    primaryCrypto: 'Explore crypto comparison',
    providers: 'Current coverage',
    providersValue: '4 Thai exchanges · 3 public money changers',
    method: 'How ranking works',
    methodBody: 'Results favor complete fills, stronger net THB, transparent fees, current source status, and practical branch information.',
    methodology: 'Read the methodology',
  },
  th: {
    eyebrow: 'ตัดสินใจเรื่องเงินบาทด้วยข้อมูลจริง',
    title: 'ดูให้ชัดว่าคุณจะได้รับ THB เท่าไร',
    body: 'เปรียบเทียบเส้นทางแลกเงินจริง ค่าธรรมเนียม ความลึกตลาด เวลาเปิดทำการ และระยะทาง ก่อนเลือกแพลตฟอร์มหรือร้านแลกเงินในกรุงเทพ',
    trust: 'API และหน้าเว็บทางการ · แสดงสถานะแหล่งข้อมูล · ควรยืนยันเรทสุดท้าย',
    usefulTitle: 'คำตอบที่ใช้ตัดสินใจได้ ไม่ใช่ไดเรกทอรี SEO',
    usefulBody: 'ทุกผลลัพธ์ต้องบอกได้ว่าคุณอาจได้รับ THB เท่าไร ทำไมตัวเลือกหนึ่งดีกว่า ข้อมูลสดหรือไม่ และควรไปยืนยันที่ไหน',
    cashTitle: 'ร้านแลกเงินที่เหมาะกับเส้นทาง',
    cashBody: 'เทียบยอด THB เรทที่สังเกต เวลาเปิด และระยะอ้างอิง แล้วค่อยเปิดแผนที่เมื่อข้อมูลเหมาะกับคุณ',
    cryptoTitle: 'ผลลัพธ์สุทธิจากคริปโต',
    cryptoBody: 'เทียบแพลตฟอร์มไทยจาก depth ค่าธรรมเนียม และค่าถอน THB ไม่ใช่ดูแค่ราคาหน้าตลาด',
    sourceTitle: 'ความสดคือส่วนหนึ่งของผลลัพธ์',
    sourceBody: 'แยกข้อมูลสด ผสม และสำรองอย่างชัดเจน ข้อมูลเก่าจะไม่ถูกนำเสนอเป็นเรทที่รับประกัน',
    primaryCash: 'ดูการเปรียบเทียบเงินสด',
    primaryCrypto: 'ดูการเปรียบเทียบคริปโต',
    providers: 'ขอบเขตปัจจุบัน',
    providersValue: '4 แพลตฟอร์มไทย · 3 ร้านแลกเงินสาธารณะ',
    method: 'วิธีจัดอันดับ',
    methodBody: 'ระบบดูยอดรับสุทธิ ค่าธรรมเนียม สถานะแหล่งข้อมูล ความครบของ order book และข้อมูลสาขาที่ใช้งานได้จริง',
    methodology: 'อ่านวิธีการ',
  },
  zh: {
    eyebrow: '用真实数据决定如何换入泰铢',
    title: '直接看你最终能拿到多少 THB。',
    body: '在选择泰国交易所或曼谷换汇店前，比较真实兑换路径、费用、市场深度、营业时间和距离。',
    trust: '官方 API 与官网来源 · 明确展示数据状态 · 最终汇率请再次确认',
    usefulTitle: '提供真正有用的结果，而不是 SEO 页面目录。',
    usefulBody: '每个结果都应该帮助用户做下一步决定：预计到手多少 THB、为什么排名更高、数据是否实时，以及去哪里确认。',
    cashTitle: '附近现金换汇',
    cashBody: '比较预计到手、观测汇率、营业时间和参考距离。先看数字是否值得，再打开地图。',
    cryptoTitle: '加密资产净到手',
    cryptoBody: '根据订单簿深度、交易费和 THB 提现费用比较泰国交易所，不只看表面价格。',
    sourceTitle: '数据新鲜度也是结果的一部分',
    sourceBody: '实时、混合和审核备用数据明确区分。过期来源不会被包装成保证成交汇率。',
    primaryCash: '查看现金比较',
    primaryCrypto: '查看加密比较',
    providers: '当前覆盖',
    providersValue: '4 家泰国交易所 · 3 家公开换汇商',
    method: '排名方法',
    methodBody: '优先考虑完整成交、净到手、透明费用、当前来源状态和真实可用的门店信息。',
    methodology: '阅读方法论',
  },
} as const;

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const contentLocale = locale as ContentLocale;
  const c = copy[contentLocale];

  const [initialCrypto, initialCash] = await Promise.all([
    compareCrypto({
      symbol: 'USDT',
      side: 'sell',
      amount: 1000,
      quoteMode: 'coin',
      includeWithdrawal: true,
      withdrawThb: true,
    }).catch(() => []),
    compareCashLive({
      currency: 'USD',
      amount: 1000,
      maxDistanceKm: 20,
      locale: contentLocale,
    }).catch(() => ({
      all: [],
      cacheGeneratedAt: null,
      cacheStale: true,
      distanceOrigin: 'reference' as const,
    })),
  ]);

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(contentLocale) },
  ]);

  return (
    <div className="space-y-8 pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="overflow-hidden rounded-[36px] bg-[#0f2e22] text-white shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
        <div className="grid min-w-0 gap-8 px-6 pb-7 pt-8 sm:px-9 sm:pt-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:px-12 lg:pb-12 lg:pt-14">
          <div className="min-w-0 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9fd0b1]">{c.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {c.title}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#d7e4dc] sm:text-lg">{c.body}</p>
            <p className="mt-6 border-l border-[#74a989] pl-4 text-xs leading-5 text-[#9fb7aa]">{c.trust}</p>
          </div>
          <div className="min-w-0 lg:-mb-24">
            <HomeComparison locale={contentLocale} initialCrypto={initialCrypto} initialCash={initialCash} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 pt-2 lg:grid-cols-[1.2fr_0.8fr] lg:pt-24">
        <div className="rounded-[30px] border border-white/10 bg-[#151a18] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#76aa8b]">{c.usefulTitle}</p>
          <p className="mt-4 max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
            {c.usefulBody}
          </p>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-[#ece8dc] p-6 text-[#11271e] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#657169]">{c.providers}</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{c.providersValue}</p>
          <p className="mt-8 text-sm leading-6 text-[#657169]">{c.sourceBody}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link href={`/${contentLocale}/cash`} className="group rounded-[30px] border border-white/10 bg-surface-900 p-6 transition hover:border-[#76aa8b]/50 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#76aa8b]">01 · Cash</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white">{c.cashTitle}</h2>
          <p className="mt-4 max-w-xl leading-7 text-stone-400">{c.cashBody}</p>
          <span className="mt-8 inline-flex text-sm font-semibold text-[#9fd0b1] group-hover:text-white">{c.primaryCash} →</span>
        </Link>
        <Link href={`/${contentLocale}/crypto`} className="group rounded-[30px] border border-white/10 bg-surface-900 p-6 transition hover:border-[#76aa8b]/50 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#76aa8b]">02 · Crypto</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white">{c.cryptoTitle}</h2>
          <p className="mt-4 max-w-xl leading-7 text-stone-400">{c.cryptoBody}</p>
          <span className="mt-8 inline-flex text-sm font-semibold text-[#9fd0b1] group-hover:text-white">{c.primaryCrypto} →</span>
        </Link>
      </section>

      <section className="grid gap-4 rounded-[30px] border border-white/10 bg-[#111614] p-6 sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#76aa8b]">{c.method}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">{c.sourceTitle}</h2>
        </div>
        <div>
          <p className="leading-7 text-stone-400">{c.methodBody}</p>
          <Link href={`/${contentLocale}/legal/methodology`} className="mt-5 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:border-[#76aa8b]/60">
            {c.methodology}
          </Link>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const contentLocale = locale as ContentLocale;
  const title = contentLocale === 'en'
    ? 'Compare Real Crypto and Cash Routes to THB'
    : contentLocale === 'th'
      ? 'เปรียบเทียบเส้นทางคริปโตและเงินสดเป็น THB'
      : '真实比较加密与现金换入 THB';
  const description = contentLocale === 'en'
    ? 'Compare estimated net THB, exchange fees, market depth, Bangkok money changer rates, opening hours, and map links using transparent source states.'
    : copy[contentLocale].body;

  return {
    title,
    description,
    alternates: localeMetadataAlternates(contentLocale),
    robots: localeRobots(contentLocale),
    openGraph: {
      title,
      description,
      url: withLocalePath(contentLocale),
    },
  };
}
