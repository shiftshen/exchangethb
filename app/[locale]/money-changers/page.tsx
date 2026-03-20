import type { Metadata } from 'next';
import { TrackLink } from '@/components/track-link';
import { Pill, Section } from '@/components/ui';
import { cashBranches, cashRates, publicCashProviders } from '@/data/site';
import { indexableLocales, t } from '@/lib/i18n';
import { breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { ContentLocale } from '@/lib/types';

const copy = {
  th: {
    kicker: 'Money changer index',
    title: 'รวมร้านแลกเงินกรุงเทพที่ใช้เปรียบเทียบ THB',
    description: 'หน้านี้เป็นหน้า hub สำหรับร้านแลกเงินที่เว็บไซต์ใช้เป็นจุดอ้างอิง ทั้งเพื่อให้ผู้ใช้เห็นขอบเขตแบรนด์ที่ติดตาม และเพื่อให้ search engine เข้าใจหมวด money changer ของเว็บไซต์',
    compareCta: 'เปิดหน้าคอมแพร์เงินสด',
    routesCta: 'ดู route guides',
    providersLabel: 'แบรนด์ที่เปิดเผยต่อสาธารณะ',
    branchesLabel: 'จุดอ้างอิงสาขา',
    updatedLabel: 'เรตตัวอย่างล่าสุด',
    listTitle: 'แบรนด์ร้านแลกเงินทั้งหมด',
    listDescription: 'แต่ละหน้าโปรไฟล์จะรวมเรตตัวอย่าง เวลาเปิดทำการ จุดอ้างอิงสาขา และลิงก์ไปยังหน้าอ้างอิงหรือเว็บไซต์ทางการ',
    branchCountLabel: 'จุดอ้างอิง',
    rateSamplesLabel: 'ตัวอย่างเรต',
    areaLabel: 'พื้นที่หลัก',
    detailCta: 'ดูโปรไฟล์ร้าน',
    compareOneCta: 'กลับไปคอมแพร์เงินสด',
    whyTitle: 'ทำไมต้องมีหน้ารวมนี้',
    whyBody: 'หน้า hub นี้ช่วยรวบหมวด money changer ไว้เป็นโครงสร้างหลัก ทำให้ Google และผู้ใช้ใหม่เข้าใจได้เร็วขึ้นว่ามีแบรนด์ไหนบ้าง และควรเริ่มจากหน้าใด',
    reasonOneTitle: 'รวมลิงก์ไปยังแบรนด์สำคัญ',
    reasonOneBody: 'หน้าเดียวนี้จะส่ง internal link ไปยังหน้า SIA, SuperRich Thailand, และผู้ให้บริการอื่นที่ควรสะสม authority มากขึ้น',
    reasonTwoTitle: 'ลดภาระการเริ่มจากหน้าคอมแพร์เปล่า',
    reasonTwoBody: 'คนที่ยังไม่รู้จักร้านไหนมาก่อนสามารถเริ่มจาก index นี้ แล้วค่อยเลือกหน้ารายตัวหรือ route guide ที่เกี่ยวข้อง',
    reasonThreeTitle: 'ช่วย Google เข้าใจหมวดเงินสด',
    reasonThreeBody: 'แทนที่จะมีแต่หน้ารายตัวและหน้าคอมแพร์ หน้า hub นี้ทำหน้าที่เป็น parent page ของหัวข้อ Bangkok money changer',
    faqTitle: 'คำถามที่พบบ่อย',
  },
  en: {
    kicker: 'Money changer index',
    title: 'Bangkok money changers tracked for THB decisions',
    description: 'This hub gathers the Bangkok money changer brands used in ExchangeTHB so crawlers and users can discover the core entity pages before moving into cash comparison or route-specific pages.',
    compareCta: 'Open cash comparison',
    routesCta: 'Browse route guides',
    providersLabel: 'Public brands tracked',
    branchesLabel: 'Reference locations',
    updatedLabel: 'Latest rate sample',
    listTitle: 'All money changer profiles',
    listDescription: 'Each profile summarizes rate samples, opening hours, branch references, and the official or reference links that matter before changing cash into THB.',
    branchCountLabel: 'Reference points',
    rateSamplesLabel: 'Rate samples',
    areaLabel: 'Core area',
    detailCta: 'View money changer profile',
    compareOneCta: 'Back to cash compare',
    whyTitle: 'Why this hub exists',
    whyBody: 'This page acts as the parent topic page for Bangkok money changers, making the category easier to crawl, understand, and rank as a coherent group.',
    reasonOneTitle: 'Send stronger links into the key brands',
    reasonOneBody: 'One hub page can route internal link equity into SIA, SuperRich Thailand, and the other provider profiles that matter for brand-intent searches.',
    reasonTwoTitle: 'Give users a better start than a blank compare tool',
    reasonTwoBody: 'Visitors who do not know which brand to trust can start here, then move into the exact provider page or route guide that fits their trip.',
    reasonThreeTitle: 'Clarify the cash-exchange topic for Google',
    reasonThreeBody: 'Instead of only exposing isolated provider pages, this hub gives Google one clean parent page for the Bangkok money changer category.',
    faqTitle: 'Common questions',
  },
  zh: {
    kicker: '换汇品牌索引',
    title: '集中展示用于 THB 决策的曼谷换汇品牌',
    description: '这个 hub 汇总了 ExchangeTHB 当前公开展示的曼谷换汇品牌，让搜索引擎和用户先理解站内的核心实体页，再进入现金比较或路线页。',
    compareCta: '打开现金比较页',
    routesCta: '查看路线页',
    providersLabel: '公开展示品牌',
    branchesLabel: '参考点位',
    updatedLabel: '最近汇率样本',
    listTitle: '全部换汇品牌详情',
    listDescription: '每个详情页会说明汇率样本、营业时间、参考位置，以及前往官网或参考页前值得先看的信息。',
    branchCountLabel: '参考点',
    rateSamplesLabel: '汇率样本',
    areaLabel: '核心区域',
    detailCta: '查看品牌详情',
    compareOneCta: '返回现金比较',
    whyTitle: '为什么需要这个 hub',
    whyBody: '它作为 Bangkok money changer 主题的上层入口页，让搜索引擎更容易理解这一类页面之间的关系。',
    reasonOneTitle: '把链接权重导向关键品牌',
    reasonOneBody: '这个 hub 可以把内部链接更集中地导向 SIA、SuperRich Thailand 等更值得积累品牌权重的页面。',
    reasonTwoTitle: '给用户更好的起点',
    reasonTwoBody: '如果用户还不知道先看哪一家换汇店，可以先从索引页进入，再进入更具体的品牌页或路线页。',
    reasonThreeTitle: '让 Google 更清楚现金换汇主题',
    reasonThreeBody: '相比只暴露分散的品牌详情页，这个 hub 提供了一个更清晰的上层主题入口。',
    faqTitle: '常见问题',
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

function formatLocaleDate(locale: ContentLocale, value?: string) {
  if (!value) return '-';
  return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : locale === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function generateStaticParams() {
  return indexableLocales.map((locale) => ({ locale }));
}

export default async function MoneyChangersIndexPage({ params }: { params: Promise<{ locale: ContentLocale }> }) {
  const { locale } = await params;
  const c = copy[locale];
  const latestRateUpdate = cashRates
    .map((rate) => rate.observedAt)
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

  const faqEntries = locale === 'th'
    ? [
        { question: 'หน้านี้ต่างจากหน้าคอมแพร์เงินสดอย่างไร', answer: 'หน้ารวมนี้ใช้เพื่อดูว่ามีแบรนด์ไหนอยู่ในระบบ ส่วนหน้าคอมแพร์เงินสดใช้เพื่อคำนวณและจัดอันดับเส้นทางตามสกุลเงิน จำนวนเงิน และระยะอ้างอิง' },
        { question: 'ถ้าจะหาร้านในประตูน้ำ ควรเริ่มจากไหน', answer: 'เริ่มจากหน้าแบรนด์อย่าง SIA หรือ SuperRich Thailand ได้เลย แล้วค่อยกดกลับไปหน้าเปรียบเทียบเงินสดเมื่อคุณอยากเทียบกับร้านอื่น' },
        { question: 'หน้านี้ช่วย SEO อย่างไร', answer: 'มันทำหน้าที่เป็น parent page ของหมวด Bangkok money changer และรวมลิงก์ไปยัง brand pages หลักที่ต้องการสะสมความน่าเชื่อถือ' },
      ]
    : locale === 'zh'
      ? [
          { question: '这个页面和现金比较页有什么不同', answer: '索引页主要负责展示站内有哪些换汇品牌；真正的路线估算、距离排序和金额比较仍在现金比较页完成。' },
          { question: '如果我想找水门一带的换汇店，该从哪里开始', answer: '可以先进入 SIA 或 SuperRich Thailand 这类品牌页，再决定是否回到现金比较页和其他品牌一起比较。' },
          { question: '这个 hub 对 SEO 有什么帮助', answer: '它把 Bangkok money changer 主题集中到一个可抓取入口，再把内部链接分发到更重要的品牌详情页。' },
        ]
      : [
          { question: 'How is this different from the cash compare page?', answer: 'This hub organizes which money changer brands are covered. The cash compare page is where users estimate routes by currency, amount, and reference distance.' },
          { question: 'Where should I start if I need Pratunam exchange options?', answer: 'Start with a provider page like SIA or SuperRich Thailand, then move back into the live cash comparison once you want to compare brands side by side.' },
          { question: 'Why does this help SEO?', answer: 'It gives Google one clean parent page for the Bangkok money changer topic and routes stronger internal links into the provider pages that should rank for brand intent.' },
        ];

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: c.title, item: withLocalePath(locale, '/money-changers') },
  ]);
  const collectionLd = collectionPageJsonLd(locale, '/money-changers', c.title, c.description);
  const itemListLd = itemListJsonLd(
    publicCashProviders.map((provider) => ({
      name: provider.name,
      url: withLocalePath(locale, `/money-changers/${provider.slug}`),
    })),
    c.title,
  );
  const faqLd = faqJsonLd(faqEntries);

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="frontend-hero overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <Pill>{c.kicker}</Pill>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{c.title}</h1>
              <p className="max-w-3xl text-lg text-stone-300">{c.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TrackLink href={`/${locale}/cash`} eventName="money_changers_index_compare_click" eventParams={{ locale }} className="rounded-full bg-brand-500 px-6 py-3 font-medium text-surface-950 hover:bg-brand-400">{c.compareCta}</TrackLink>
              <TrackLink href={`/${locale}/routes`} eventName="money_changers_index_routes_click" eventParams={{ locale }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.routesCta}</TrackLink>
            </div>
          </div>
          <div className="card-panel grid gap-3 p-6 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/8 bg-surface-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.providersLabel}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{publicCashProviders.length}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-surface-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.branchesLabel}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{cashBranches.filter((branch) => publicCashProviders.some((provider) => provider.slug === branch.providerSlug)).length}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-surface-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.updatedLabel}</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatLocaleDate(locale, latestRateUpdate)}</p>
            </div>
          </div>
        </div>
      </section>

      <Section title={c.whyTitle} description={c.whyBody}>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { title: c.reasonOneTitle, body: c.reasonOneBody },
            { title: c.reasonTwoTitle, body: c.reasonTwoBody },
            { title: c.reasonThreeTitle, body: c.reasonThreeBody },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-stone-400">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={c.listTitle} description={c.listDescription}>
        <div className="grid gap-4 lg:grid-cols-2">
          {publicCashProviders.map((provider) => {
            const branches = cashBranches.filter((branch) => branch.providerSlug === provider.slug);
            const branchIds = new Set(branches.map((branch) => branch.id));
            const rates = cashRates.filter((rate) => branchIds.has(rate.branchId));
            const areas = [...new Set(branches.map((branch) => branch.area))];
            const latestObserved = rates
              .map((rate) => rate.observedAt)
              .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

            return (
              <div key={provider.slug} className="card space-y-5 p-6">
                <div className="space-y-2">
                  <Pill>{provider.name}</Pill>
                  <h2 className="text-2xl font-semibold text-white">{provider.name}</h2>
                  <p className="text-sm text-stone-300">{t(provider.summary, locale)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-surface-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.branchCountLabel}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{branches.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-surface-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.rateSamplesLabel}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{rates.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-surface-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.areaLabel}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{areas.join(', ') || '-'}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-surface-800/70 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.updatedLabel}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{formatLocaleDate(locale, latestObserved)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <TrackLink href={`/${locale}/money-changers/${provider.slug}`} eventName="money_changers_index_detail_click" eventParams={{ provider: provider.slug }} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-surface-950 hover:bg-brand-400">{c.detailCta}</TrackLink>
                  <TrackLink href={`/${locale}/cash?currency=USD&amount=1000&maxDistanceKm=10`} eventName="money_changers_index_compare_one_click" eventParams={{ provider: provider.slug }} className="rounded-full border border-white/10 bg-surface-800 px-5 py-3 text-sm font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.compareOneCta}</TrackLink>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={c.faqTitle} description={c.description}>
        <div className="grid gap-4 lg:grid-cols-3">
          {faqEntries.map((item) => (
            <div key={item.question} className="card p-6">
              <h2 className="text-lg font-semibold text-white">{item.question}</h2>
              <p className="mt-3 text-sm text-stone-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: ContentLocale }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = copy[locale];
  const path = '/money-changers';

  return {
    title: c.title,
    description: c.description,
    alternates: localeMetadataAlternates(locale, path),
    robots: localeRobots(locale),
    openGraph: {
      title: c.title,
      description: c.description,
      url: withLocalePath(locale, path),
    },
    twitter: {
      title: c.title,
      description: c.description,
    },
  };
}
