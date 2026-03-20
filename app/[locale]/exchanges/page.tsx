import type { Metadata } from 'next';
import { TrackLink } from '@/components/track-link';
import { Pill, Section } from '@/components/ui';
import { exchanges, marketSnapshots } from '@/data/site';
import { indexableLocales, t } from '@/lib/i18n';
import { breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { ContentLocale } from '@/lib/types';

const copy = {
  th: {
    kicker: 'Exchange index',
    title: 'รวมแพลตฟอร์มคริปโตที่ใช้เปรียบเทียบ THB',
    description: 'หน้านี้เป็นศูนย์รวมของแพลตฟอร์มคริปโตที่ ExchangeTHB ใช้ทำเส้นทางเปรียบเทียบเข้าเงินบาท พร้อมลิงก์ไปยังโปรไฟล์ รายละเอียดค่าธรรมเนียม และหน้าคอมแพร์จริง',
    compareCta: 'เปิดหน้าคอมแพร์คริปโต',
    routesCta: 'ดู route guides',
    countLabel: 'แพลตฟอร์มที่ติดตาม',
    pairsLabel: 'คู่ที่รองรับ',
    updatedLabel: 'อัปเดตตลาดล่าสุด',
    whyTitle: 'ทำไมต้องมีหน้ารวมนี้',
    whyBody: 'หน้า hub นี้ช่วยให้ search engine และผู้ใช้เข้าใจว่าหน้า exchange ไหนคือหน้าหลักของเว็บไซต์ ก่อนค่อยไหลต่อไปยังหน้ารายตัวและหน้าเปรียบเทียบ',
    listTitle: 'แพลตฟอร์มทั้งหมด',
    listDescription: 'แต่ละหน้าโปรไฟล์จะสรุปค่าธรรมเนียม สถานะข้อมูล ตลาดที่รองรับ และลิงก์ออกไปยังเว็บทางการ',
    feeLabel: 'ค่าธรรมเนียมเทรด',
    pairsCardLabel: 'คู่ที่กำลังเปรียบเทียบ',
    reviewedLabel: 'รีวิวล่าสุด',
    detailCta: 'ดูโปรไฟล์แพลตฟอร์ม',
    compareOneCta: 'กลับไปคอมแพร์คริปโต',
    reasonOneTitle: 'รวม authority ไปที่หน้าหลัก',
    reasonOneBody: 'แทนที่จะให้ search engine เจอแต่หน้ารายตัวกระจัดกระจาย หน้า hub นี้จะรวมโครงสร้างของหมวด exchange ไว้ใน URL เดียว',
    reasonTwoTitle: 'พาคนจากข้อมูลไปสู่การตัดสินใจ',
    reasonTwoBody: 'ผู้ใช้สามารถเริ่มจากหน้ารวม แล้วค่อยลงลึกไปยังรายละเอียดค่าธรรมเนียม ความเสี่ยง และลิงก์ทางการของแต่ละแพลตฟอร์ม',
    reasonThreeTitle: 'เชื่อมกับ route intent ได้ง่ายกว่า',
    reasonThreeBody: 'หน้ารวมนี้รับลิงก์จากหน้า route และหน้าแรก เพื่อกระจาย internal link ไปยัง exchange profile ที่สำคัญกว่าเดิม',
    faqTitle: 'คำถามที่พบบ่อย',
  },
  en: {
    kicker: 'Exchange index',
    title: 'All Thai exchanges tracked for THB comparison',
    description: 'This hub groups every crypto exchange profile used in ExchangeTHB so search engines and users can discover the main entity pages before moving into live THB comparison flows.',
    compareCta: 'Open crypto comparison',
    routesCta: 'Browse route guides',
    countLabel: 'Tracked exchanges',
    pairsLabel: 'Supported pairs',
    updatedLabel: 'Latest market update',
    whyTitle: 'Why this hub exists',
    whyBody: 'This index tells crawlers and users which exchange pages are the primary authority pages on the site, then routes them into the right THB comparison or profile detail next.',
    listTitle: 'All exchange profiles',
    listDescription: 'Each profile explains fees, supported THB pairs, source state, and the official outbound link before a user clicks through.',
    feeLabel: 'Trading fee',
    pairsCardLabel: 'Pairs compared now',
    reviewedLabel: 'Last reviewed',
    detailCta: 'View exchange profile',
    compareOneCta: 'Back to crypto compare',
    reasonOneTitle: 'Concentrate authority on primary pages',
    reasonOneBody: 'Instead of letting individual exchange URLs stand alone, this hub gives Google one clear crawlable parent page for the entire exchange topic.',
    reasonTwoTitle: 'Move from research into action',
    reasonTwoBody: 'Users can start on the index, understand who is covered, then drop into the exact exchange profile or comparison flow that matches their route.',
    reasonThreeTitle: 'Support route-intent pages better',
    reasonThreeBody: 'Route guides and the homepage can point here first, which helps redistribute internal link equity into the exchange profiles that need trust.',
    faqTitle: 'Common questions',
  },
  zh: {
    kicker: '交易所索引',
    title: '集中展示用于 THB 比较的泰国交易所',
    description: '这个 hub 汇总了 ExchangeTHB 当前追踪的交易所详情页，让搜索引擎和用户先理解站内主要实体页，再进入具体的 THB 比较流程。',
    compareCta: '打开加密比较页',
    routesCta: '查看路线页',
    countLabel: '已追踪交易所',
    pairsLabel: '支持交易对',
    updatedLabel: '最近市场更新时间',
    whyTitle: '为什么需要这个 hub',
    whyBody: '它让搜索引擎先识别哪些交易所详情页是站内主页面，再把流量导向更合适的比较页或详情页。',
    listTitle: '全部交易所详情',
    listDescription: '每个详情页都会说明费用、支持的 THB 交易对、数据状态以及跳转到官网前值得先看的信息。',
    feeLabel: '交易费',
    pairsCardLabel: '当前比较交易对',
    reviewedLabel: '最近审核',
    detailCta: '查看交易所详情',
    compareOneCta: '返回加密比较',
    reasonOneTitle: '把权重集中到主页面',
    reasonOneBody: '与其让搜索引擎只看到分散的交易所详情页，这个 hub 先提供一个清晰的上层入口页。',
    reasonTwoTitle: '从研究走到决策',
    reasonTwoBody: '用户可以先在索引页判断范围，再进入最适合自己的交易所详情页或实际比较流程。',
    reasonThreeTitle: '更好承接路线页意图',
    reasonThreeBody: '首页和路线页可以优先链接到这个 hub，再把内部链接权重分发到更重要的交易所实体页。',
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

export default async function ExchangesIndexPage({ params }: { params: Promise<{ locale: ContentLocale }> }) {
  const { locale } = await params;
  const c = copy[locale];
  const uniquePairs = [...new Set(exchanges.flatMap((exchange) => exchange.pairs))];
  const latestExchangeUpdate = [...new Set(marketSnapshots.map((snapshot) => snapshot.lastUpdated))]
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] || exchanges
      .map((exchange) => exchange.lastUpdated)
      .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

  const faqEntries = locale === 'th'
    ? [
        { question: 'หน้านี้ต่างจากหน้าคอมแพร์คริปโตอย่างไร', answer: 'หน้ารวมนี้ใช้เพื่อทำความเข้าใจว่าเว็บไซต์ติดตาม exchange อะไรบ้าง ส่วนหน้าคอมแพร์ใช้สำหรับคำนวณผลลัพธ์เส้นทางเป็น THB แบบสดมากกว่า' },
        { question: 'ควรเริ่มจากหน้ารวมหรือหน้ารายตัว', answer: 'ถ้าคุณยังไม่แน่ใจว่าจะดูแพลตฟอร์มไหน ให้เริ่มจากหน้ารวมนี้ก่อน แล้วค่อยคลิกเข้าโปรไฟล์แพลตฟอร์มที่ตรงกับสิ่งที่คุณสนใจ' },
        { question: 'หน้านี้ช่วย SEO อย่างไร', answer: 'มันเป็นหน้า hub ที่รวม internal links ไปยัง exchange profile หลัก ทำให้ search engine เห็นโครงสร้างหมวด exchange ได้ชัดขึ้น' },
      ]
    : locale === 'zh'
      ? [
          { question: '这个页面和加密比较页有什么不同', answer: '这个索引页主要负责说明站内追踪了哪些交易所；真正的实时路线估算和排序仍在加密比较页完成。' },
          { question: '应该先看索引页还是交易所详情页', answer: '如果你还不确定先研究哪家交易所，先从索引页进入会更高效，然后再进入具体详情页。' },
          { question: '这个 hub 对 SEO 有什么帮助', answer: '它把交易所主题集中在一个可抓取入口上，再把内部链接分发到更重要的实体详情页。' },
        ]
      : [
          { question: 'How is this page different from the crypto compare page?', answer: 'This index exists to organize which exchanges are covered. The live comparison page is where users estimate route outcomes into THB.' },
          { question: 'Should I start here or on an exchange profile?', answer: 'Start here if you need a quick map of the category, then move into the exact profile page that matches your route or concerns.' },
          { question: 'Why does this help SEO?', answer: 'It gives search engines one crawlable exchange hub, then passes internal links into the entity pages that should rank for brand and review intent.' },
        ];

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: c.title, item: withLocalePath(locale, '/exchanges') },
  ]);
  const collectionLd = collectionPageJsonLd(locale, '/exchanges', c.title, c.description);
  const itemListLd = itemListJsonLd(
    exchanges.map((exchange) => ({
      name: exchange.name,
      url: withLocalePath(locale, `/exchanges/${exchange.slug}`),
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
              <TrackLink href={`/${locale}/crypto`} eventName="exchanges_index_compare_click" eventParams={{ locale }} className="rounded-full bg-brand-500 px-6 py-3 font-medium text-surface-950 hover:bg-brand-400">{c.compareCta}</TrackLink>
              <TrackLink href={`/${locale}/routes`} eventName="exchanges_index_routes_click" eventParams={{ locale }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.routesCta}</TrackLink>
            </div>
          </div>
          <div className="card-panel grid gap-3 p-6 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/8 bg-surface-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.countLabel}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{exchanges.length}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-surface-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.pairsLabel}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{uniquePairs.length}</p>
              <p className="mt-2 text-sm text-stone-400">{uniquePairs.join(', ')}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-surface-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.updatedLabel}</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatLocaleDate(locale, latestExchangeUpdate)}</p>
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
          {exchanges.map((exchange) => {
            const latestSnapshot = marketSnapshots
              .filter((snapshot) => snapshot.exchange === exchange.slug)
              .sort((left, right) => new Date(right.lastUpdated).getTime() - new Date(left.lastUpdated).getTime())[0];

            return (
              <div key={exchange.slug} className="card space-y-5 p-6">
                <div className="space-y-2">
                  <Pill>{exchange.license}</Pill>
                  <h2 className="text-2xl font-semibold text-white">{exchange.name}</h2>
                  <p className="text-sm text-stone-300">{t(exchange.summary, locale)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-surface-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.feeLabel}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{exchange.fee.tradingFeePct}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-surface-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.pairsCardLabel}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{exchange.pairs.join(', ')}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-surface-800/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{c.reviewedLabel}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{formatLocaleDate(locale, latestSnapshot?.lastUpdated || exchange.lastUpdated)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <TrackLink href={`/${locale}/exchanges/${exchange.slug}`} eventName="exchanges_index_detail_click" eventParams={{ exchange: exchange.slug }} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-medium text-surface-950 hover:bg-brand-400">{c.detailCta}</TrackLink>
                  <TrackLink href={`/${locale}/crypto?symbol=${exchange.pairs[0]}&amount=${exchange.pairs[0] === 'BTC' ? '0.01' : exchange.pairs[0] === 'ETH' ? '0.1' : exchange.pairs[0] === 'USDT' ? '1000' : exchange.pairs[0] === 'XRP' ? '500' : exchange.pairs[0] === 'DOGE' ? '1000' : '10'}&side=buy`} eventName="exchanges_index_compare_one_click" eventParams={{ exchange: exchange.slug }} className="rounded-full border border-white/10 bg-surface-800 px-5 py-3 text-sm font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.compareOneCta}</TrackLink>
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
  const path = '/exchanges';

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
