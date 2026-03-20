import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TrackLink } from '@/components/track-link';
import { cashRates, exchanges, marketSnapshots, publicCashProviders } from '@/data/site';
import { Pill, Section } from '@/components/ui';
import { indexableLocales, t } from '@/lib/i18n';
import { breadcrumbJsonLd, itemListJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { getRouteGuide, routeGuides, routeGuideSlugs } from '@/lib/route-guides';
import { Locale } from '@/lib/types';

const uiCopy = {
  en: {
    routeGuide: 'Route guide',
    whyTitle: 'What this page helps you decide',
    checklistTitle: 'What to check before you click out',
    compareCta: 'Open the live comparison',
    methodologyCta: 'Read the methodology',
    noteTitle: 'Why this page matters for search',
    noteBody: 'This route page exists so users landing from search can go straight into a realistic THB comparison instead of starting from a blank compare screen.',
    supportTitleCash: 'Current live cash coverage',
    supportBodyCash: 'Live cash comparison currently covers USD, CNY, EUR, JPY, and GBP. Country-intent pages can still help with travel decisions even when that local currency is not part of the live compare set.',
    faqTitle: 'Common questions for this route',
    updatedLabel: 'Latest data reference',
    updatedCrypto: 'Based on the latest tracked exchange market snapshot for this route family.',
    updatedCash: 'Based on the latest tracked cash rate sample for this route family.',
  },
  zh: {
    routeGuide: '路线指南',
    whyTitle: '这个页面帮助你解决什么问题',
    checklistTitle: '跳转前先看这几件事',
    compareCta: '打开实时比较页',
    methodologyCta: '查看方法论',
    noteTitle: '为什么要单独做这类页面',
    noteBody: '这个页面是为了让从搜索结果进入的用户直接落到更贴近真实需求的 THB 比较入口，而不是从空白工具页开始。',
    supportTitleCash: '当前实时现金支持集',
    supportBodyCash: '当前实时现金比较只覆盖 USD、CNY、EUR、JPY 和 GBP。即使某个国家页不对应实时本币，它仍然可以作为旅行换汇决策页存在。',
    faqTitle: '这个路线最常见的问题',
    updatedLabel: '最近数据参考时间',
    updatedCrypto: '基于这类路线最近一次被记录的交易所市场快照。',
    updatedCash: '基于这类路线最近一次被记录的现金汇率样本。',
  },
  th: {
    routeGuide: 'คู่มือเส้นทาง',
    whyTitle: 'หน้านี้ช่วยตัดสินใจเรื่องอะไร',
    checklistTitle: 'สิ่งที่ควรเช็กก่อนกดออกไป',
    compareCta: 'เปิดหน้าคอมแพร์สด',
    methodologyCta: 'ดูวิธีการ',
    noteTitle: 'ทำไมหน้านี้จึงมีประโยชน์',
    noteBody: 'หน้านี้ช่วยให้ผู้ใช้ที่มาจากการค้นหาลงจอดบนเส้นทางเปรียบเทียบ THB ที่สมจริงทันที แทนการเริ่มจากหน้าคอมแพร์ว่างเปล่า',
    supportTitleCash: 'ขอบเขตเงินสดสดที่รองรับตอนนี้',
    supportBodyCash: 'ชุดเปรียบเทียบเงินสดสดตอนนี้ครอบคลุม USD, CNY, EUR, JPY และ GBP เท่านั้น ส่วนหน้าประเทศยังใช้เป็นหน้าช่วยตัดสินใจการเดินทางได้ แม้สกุลเงินท้องถิ่นนั้นจะยังไม่อยู่ในชุดสด',
    faqTitle: 'คำถามที่พบบ่อยของเส้นทางนี้',
    updatedLabel: 'อ้างอิงข้อมูลล่าสุด',
    updatedCrypto: 'อิงจาก market snapshot ล่าสุดที่ระบบติดตามได้ในกลุ่มเส้นทางนี้',
    updatedCash: 'อิงจากตัวอย่างเรตเงินสดล่าสุดที่ระบบติดตามได้ในกลุ่มเส้นทางนี้',
  },
  ja: {
    routeGuide: 'ルートガイド',
    whyTitle: 'このページで判断できること',
    checklistTitle: '外部へ進む前に確認すること',
    compareCta: '比較ページを開く',
    methodologyCta: '方法論を見る',
    noteTitle: 'このページの役割',
    noteBody: '検索から来たユーザーが空の比較ツールではなく、実際の THB 比較導線へ直接入れるようにするためのページです。',
    supportTitleCash: '現在のライブ現金対応',
    supportBodyCash: '現在ライブで比較できる現金通貨は USD、CNY、EUR、JPY、GBP です。国別ページは、その国の通貨がライブ比較に含まれない場合でも旅行時の判断ページとして機能します。',
    faqTitle: 'このルートでよくある質問',
    updatedLabel: '最新データ参照',
    updatedCrypto: 'この系統のルートで追跡している最新の取引所マーケットスナップショットに基づきます。',
    updatedCash: 'この系統のルートで追跡している最新の現金レートサンプルに基づきます。',
  },
  ko: {
    routeGuide: '경로 가이드',
    whyTitle: '이 페이지가 도와주는 결정',
    checklistTitle: '외부로 나가기 전 확인할 점',
    compareCta: '비교 페이지 열기',
    methodologyCta: '방법론 보기',
    noteTitle: '이 페이지의 역할',
    noteBody: '검색에서 들어온 사용자가 빈 비교 도구가 아니라 실제 THB 비교 흐름으로 바로 들어가도록 만드는 페이지입니다.',
    supportTitleCash: '현재 라이브 현금 지원 범위',
    supportBodyCash: '현재 라이브 현금 비교는 USD, CNY, EUR, JPY, GBP만 지원합니다. 국가 페이지는 해당 현지 통화가 라이브 세트에 없더라도 여행 환전 의사결정 페이지로 쓸 수 있습니다.',
    faqTitle: '이 경로의 자주 묻는 질문',
    updatedLabel: '최신 데이터 기준',
    updatedCrypto: '이 경로군에서 추적 중인 최신 거래소 마켓 스냅샷 기준입니다.',
    updatedCash: '이 경로군에서 추적 중인 최신 현금 환율 샘플 기준입니다.',
  },
  de: {
    routeGuide: 'Routenleitfaden',
    whyTitle: 'Wobei diese Seite hilft',
    checklistTitle: 'Vor dem Klick nach außen prüfen',
    compareCta: 'Live-Vergleich öffnen',
    methodologyCta: 'Methodik lesen',
    noteTitle: 'Warum diese Seite existiert',
    noteBody: 'Diese Seite hilft Suchenden dabei, direkt in einen realistischen THB-Vergleich einzusteigen statt auf einer leeren Vergleichsseite zu landen.',
    supportTitleCash: 'Aktuelle Live-Bargeldabdeckung',
    supportBodyCash: 'Der Live-Bargeldvergleich deckt aktuell USD, CNY, EUR, JPY und GBP ab. Länderseiten können trotzdem als Reise-Entscheidungsseiten dienen, auch wenn die jeweilige lokale Währung nicht im Live-Satz liegt.',
    faqTitle: 'Häufige Fragen zu dieser Route',
    updatedLabel: 'Letzte Datenreferenz',
    updatedCrypto: 'Basierend auf dem neuesten erfassten Markt-Snapshot in dieser Routenfamilie.',
    updatedCash: 'Basierend auf dem neuesten erfassten Bargeldkurs-Sample in dieser Routenfamilie.',
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

function latestRouteDataTimestamp(guideType: 'crypto' | 'cash') {
  if (guideType === 'crypto') {
    const latestMarket = marketSnapshots
      .map((snapshot) => new Date(snapshot.lastUpdated))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const latestExchange = exchanges
      .map((exchange) => new Date(exchange.lastUpdated))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return [latestMarket, latestExchange]
      .filter((value): value is Date => Boolean(value))
      .sort((a, b) => b.getTime() - a.getTime())[0];
  }

  return cashRates
    .map((rate) => new Date(rate.observedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];
}

function webPageJsonLd(locale: Locale, slug: string, name: string, description: string, dateModified?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: withLocalePath(locale, `/routes/${slug}`),
    inLanguage: locale,
    dateModified,
  };
}

function localizeList<T>(value: { th: T; en: T; zh: T; ja?: T; ko?: T; de?: T }, locale: Locale): T {
  return value[locale] ?? value.en ?? value.th ?? value.zh;
}

export function generateStaticParams() {
  return routeGuideSlugs.flatMap((slug) => indexableLocales.map((locale) => ({ locale, slug })));
}

export default async function RouteGuidePage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const guide = getRouteGuide(slug);
  if (!guide) notFound();

  const c = uiCopy[locale];
  const guideTitle = t(guide.title, locale);
  const guideSummary = t(guide.summary, locale);
  const guideIntro = t(guide.intro, locale);
  const guideAudience = t(guide.audience, locale);
  const guideChecks = localizeList(guide.checks, locale);
  const guideFaqs = guide.faqs ? localizeList(guide.faqs, locale) : [];
  const compareHref = `/${locale}${guide.compareHref}`;
  const entityHubHref = guide.type === 'cash' ? `/${locale}/money-changers` : `/${locale}/exchanges`;
  const entityHubLabel = guide.type === 'cash'
    ? locale === 'th'
      ? 'ดูหน้ารวมร้านแลกเงิน'
      : locale === 'zh'
        ? '查看换汇品牌总览'
        : 'Browse money changer hub'
    : locale === 'th'
      ? 'ดูหน้ารวมแพลตฟอร์ม'
      : locale === 'zh'
        ? '查看交易所总览'
        : 'Browse exchange hub';
  const latestDataTimestamp = latestRouteDataTimestamp(guide.type);
  const latestDataIso = latestDataTimestamp?.toISOString();
  const latestDataLabel = latestDataTimestamp ? new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : locale === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(latestDataTimestamp) : null;
  const relatedGuides = routeGuides
    .filter((item) => item.slug !== guide.slug && item.type === guide.type)
    .slice(0, 3);
  const relatedProfiles = guide.type === 'cash'
    ? ['sia', 'superrich-thailand', 'ratchada']
        .map((providerSlug) => publicCashProviders.find((provider) => provider.slug === providerSlug))
        .filter((provider): provider is typeof publicCashProviders[number] => Boolean(provider))
        .map((provider) => ({
          href: `/${locale}/money-changers/${provider.slug}`,
          title: provider.name,
          body: t(provider.summary, locale),
        }))
    : ['binance-th', 'bitkub', 'upbit-thailand']
        .map((exchangeSlug) => exchanges.find((exchange) => exchange.slug === exchangeSlug))
        .filter((exchange): exchange is typeof exchanges[number] => Boolean(exchange))
        .map((exchange) => ({
          href: `/${locale}/exchanges/${exchange.slug}`,
          title: exchange.name,
          body: t(exchange.summary, locale),
        }));
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: guideTitle, item: withLocalePath(locale, `/routes/${guide.slug}`) },
  ]);
  const faqLd = guideFaqs.length ? faqJsonLd(guideFaqs) : null;
  const pageLd = webPageJsonLd(locale, guide.slug, guideTitle, guideSummary, latestDataIso);
  const relatedProfilesLd = relatedProfiles.length
    ? itemListJsonLd(
        relatedProfiles.map((item) => ({
          name: item.title,
          url: withLocalePath(locale, item.href.replace(`/${locale}`, '')),
        })),
        guide.type === 'cash'
          ? locale === 'th'
            ? 'โปรไฟล์ร้านแลกเงินที่เกี่ยวข้อง'
            : locale === 'zh'
              ? '相关换汇品牌'
              : 'Related money changer profiles'
          : locale === 'th'
            ? 'โปรไฟล์แพลตฟอร์มที่เกี่ยวข้อง'
            : locale === 'zh'
              ? '相关交易所资料页'
              : 'Related exchange profiles',
      )
    : null;

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} /> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      {relatedProfilesLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedProfilesLd) }} /> : null}
      <section className="frontend-hero overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <Pill>{c.routeGuide}</Pill>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{guideTitle}</h1>
              <p className="max-w-3xl text-lg text-stone-300">{guideSummary}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TrackLink href={compareHref} eventName="route_guide_compare_click" eventParams={{ route: guide.slug }} className="rounded-full bg-brand-500 px-6 py-3 font-medium text-surface-950 hover:bg-brand-400">{c.compareCta}</TrackLink>
              <TrackLink href={entityHubHref} eventName="route_guide_entity_hub_click" eventParams={{ route: guide.slug, type: guide.type }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{entityHubLabel}</TrackLink>
              <TrackLink href={`/${locale}/legal/methodology`} eventName="route_guide_methodology_click" eventParams={{ route: guide.slug }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.methodologyCta}</TrackLink>
            </div>
          </div>
          <div className="card-panel p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-stone-500">{c.noteTitle}</p>
            <p className="mt-3 text-base text-stone-300">{c.noteBody}</p>
            {latestDataLabel ? (
              <div className="mt-4 rounded-2xl border border-white/8 bg-surface-900/70 px-4 py-4">
                <p className="text-sm font-semibold text-white">{c.updatedLabel}</p>
                <p className="mt-2 text-sm text-stone-300">{latestDataLabel}</p>
                <p className="mt-2 text-sm text-stone-400">{guide.type === 'cash' ? c.updatedCash : c.updatedCrypto}</p>
              </div>
            ) : null}
            {guide.type === 'cash' ? (
              <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/8 px-4 py-4">
                <p className="text-sm font-semibold text-brand-200">{c.supportTitleCash}</p>
                <p className="mt-2 text-sm text-stone-300">{c.supportBodyCash}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Section title={c.whyTitle} description={guideIntro}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card p-6">
            <p className="text-base text-stone-300">{guideAudience}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white">{c.checklistTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm text-stone-300">
              {guideChecks.map((item) => (
                <li key={item} className="rounded-2xl border border-white/8 bg-surface-800/70 px-4 py-3">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {guideFaqs.length ? (
        <Section title={c.faqTitle} description={guideSummary}>
          <div className="grid gap-4">
            {guideFaqs.map((item) => (
              <div key={item.question} className="card p-6">
                <h2 className="text-lg font-semibold text-white">{item.question}</h2>
                <p className="mt-3 text-sm text-stone-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {relatedProfiles.length ? (
        <Section
          title={guide.type === 'cash'
            ? locale === 'th'
              ? 'โปรไฟล์ร้านแลกเงินที่ควรดูต่อ'
              : locale === 'zh'
                ? '下一步最该看的换汇品牌页'
                : locale === 'ja'
                  ? '次に見るべき両替ブランド'
                  : locale === 'ko'
                    ? '다음에 볼 환전 브랜드'
                    : locale === 'de'
                      ? 'Nächste Wechselstuben-Profile'
                      : 'Money changer profiles to check next'
            : locale === 'th'
              ? 'โปรไฟล์แพลตฟอร์มที่ควรดูต่อ'
              : locale === 'zh'
                ? '下一步最该看的交易所资料页'
                : locale === 'ja'
                  ? '次に見るべき取引所プロフィール'
                  : locale === 'ko'
                    ? '다음에 볼 거래소 프로필'
                    : locale === 'de'
                      ? 'Nächste Börsenprofile'
                      : 'Exchange profiles to check next'}
          description={guide.type === 'cash'
            ? locale === 'th'
              ? 'ส่วนนี้ช่วยเชื่อมจาก route intent ไปยังโปรไฟล์ร้านจริง เช่น SIA Money Exchange และแบรนด์สำคัญอื่นในกรุงเทพ'
              : locale === 'zh'
                ? '这一组品牌页把路线意图继续推进到真实的曼谷换汇实体页。'
                : 'These profile pages help cash-route visitors move into real Bangkok money changer entity pages such as SIA Money Exchange.'
            : locale === 'th'
              ? 'ส่วนนี้ช่วยเชื่อมจาก route intent ไปยังหน้าโปรไฟล์แพลตฟอร์มจริง'
              : locale === 'zh'
                ? '这一组资料页把路线意图继续推进到真实的交易所实体页。'
                : 'These profile pages help crypto-route visitors move into real Thailand crypto exchange entity pages.'}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProfiles.map((item) => (
              <TrackLink
                key={item.href}
                href={item.href}
                eventName="route_guide_related_profile_click"
                eventParams={{ route: guide.slug, href: item.href, type: guide.type }}
                className="card card-interactive p-5"
              >
                <p className="text-sm text-stone-400">{guide.type === 'cash' ? 'Money changer profile' : 'Exchange profile'}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm text-stone-400">{item.body}</p>
              </TrackLink>
            ))}
          </div>
        </Section>
      ) : null}

      {relatedGuides.length ? (
        <Section
          title={locale === 'th' ? 'เส้นทางที่เกี่ยวข้อง' : locale === 'zh' ? '相关路线' : locale === 'ja' ? '関連ルート' : locale === 'ko' ? '관련 경로' : locale === 'de' ? 'Verwandte Routen' : 'Related routes'}
          description={locale === 'th' ? 'หน้าพวกนี้ช่วยให้ผู้ใช้ไหลต่อจากเจตนาใกล้เคียง ไปยังเส้นทาง THB ที่เกี่ยวข้องมากขึ้น' : locale === 'zh' ? '这些路线页可以把相邻搜索意图继续导向更贴近的 THB 比较页。' : locale === 'ja' ? '近い検索意図から、より適した THB 比較ルートへ進めるための関連ページです。' : locale === 'ko' ? '비슷한 검색 의도에서 더 적합한 THB 비교 경로로 이어지게 하는 관련 페이지입니다.' : locale === 'de' ? 'Diese Seiten leiten ähnliche Suchintentionen in passendere THB-Vergleichswege weiter.' : 'These pages help nearby search intents flow into the next most relevant THB comparison path.'}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {relatedGuides.map((item) => (
              <TrackLink
                key={item.slug}
                href={`/${locale}/routes/${item.slug}`}
                eventName="route_guide_related_click"
                eventParams={{ from: guide.slug, to: item.slug }}
                className="card card-interactive p-5"
              >
                <p className="text-sm text-stone-400">{item.type === 'crypto' ? 'Crypto -> THB' : 'Cash / FX -> THB'}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{t(item.title, locale)}</h2>
                <p className="mt-3 text-sm text-stone-400">{t(item.summary, locale)}</p>
              </TrackLink>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getRouteGuide(slug);
  if (!guide) return {};

  const title = t(guide.title, locale);
  const description = t(guide.summary, locale);
  const path = `/routes/${guide.slug}`;

  return {
    title,
    description,
    alternates: localeMetadataAlternates(locale, path),
    robots: localeRobots(locale),
    keywords: locale === 'en' ? guide.keywords : undefined,
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
