import type { Metadata } from 'next';
import { TrackLink } from '@/components/track-link';
import { Pill, Section } from '@/components/ui';
import { locales, t } from '@/lib/i18n';
import { RouteGuide, routeGuides } from '@/lib/route-guides';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import { Locale } from '@/lib/types';

const copy = {
  th: {
    kicker: 'Route index',
    title: 'รวมหน้าเส้นทาง THB ทั้งหมดในที่เดียว',
    description: 'หน้านี้รวบรวม route guides สำหรับคริปโต เงินสด คำค้นตามประเทศ และคำค้นแบบสนามบินหรือย่าน เพื่อให้ทั้งผู้ใช้และ search engine เข้าใจโครงสร้างของเว็บไซต์ได้ง่ายขึ้น',
    supportTitle: 'ขอบเขตที่รองรับตอนนี้',
    supportBody: 'ชุดเปรียบเทียบเงินสดแบบสดตอนนี้ครอบคลุม USD, CNY, EUR, JPY และ GBP ส่วนหน้าประเทศและหน้าท่องเที่ยวใช้เพื่อช่วยตัดสินใจเส้นทาง ไม่ได้แปลว่าทุกสกุลเงินมีข้อมูลสดแล้ว',
    compareCrypto: 'เปิดหน้าเปรียบเทียบคริปโต',
    compareCash: 'เปิดหน้าเปรียบเทียบเงินสด',
    cryptoTitle: 'เส้นทางคริปโต -> THB',
    cryptoDescription: 'หน้าสำหรับคำค้นเฉพาะเหรียญ เช่น BTC to THB หรือ ETH to THB แล้วพากลับเข้าสู่ flow เปรียบเทียบจริง',
    cashTitle: 'เส้นทางเงินสด -> THB',
    cashDescription: 'หน้าสำหรับคำค้นสกุลเงินสด เช่น USD cash to THB หรือ EUR cash to THB',
    countryTitle: 'หน้าคำค้นตามประเทศ',
    countryDescription: 'หน้ากลุ่มนี้เหมาะกับผู้ใช้จากญี่ปุ่น เกาหลี เยอรมนี และยุโรปที่กำลังหาเส้นทางแลกเป็น THB',
    travelTitle: 'หน้าสนามบินและย่านในกรุงเทพ',
    travelDescription: 'หน้าพวกนี้ช่วยรองรับคำค้นเกี่ยวกับสนามบิน ย่านท่องเที่ยว และ near me ก่อนย้อนกลับไปหน้าเปรียบเทียบหลัก',
    routeTypeCrypto: 'คริปโต -> THB',
    routeTypeCash: 'เงินสด / FX -> THB',
    viewAllTitle: 'หน้ารวมนี้ใช้ทำอะไร',
    viewAllBody: 'ใช้เป็นหน้าโครงสร้างกลางเพื่อให้ search engine, LLM และผู้ใช้ใหม่เห็นว่าคุณมีหน้าอะไรบ้าง แล้วเลือกเข้าหน้าย่อยที่ตรงเจตนาที่สุด',
  },
  en: {
    kicker: 'Route index',
    title: 'All THB route guides in one crawlable index',
    description: 'This page groups crypto, cash, country-intent, and airport or area route guides so users, search engines, and LLMs can understand the full THB conversion structure faster.',
    supportTitle: 'Current support scope',
    supportBody: 'Live cash comparison currently covers USD, CNY, EUR, JPY, and GBP. Country and travel pages still help with THB decision-making even when that local currency is not part of the live compare set.',
    compareCrypto: 'Open crypto comparison',
    compareCash: 'Open cash comparison',
    cryptoTitle: 'Crypto -> THB routes',
    cryptoDescription: 'Landing pages for coin-specific search intent such as BTC to THB or ETH to THB, feeding users back into the live comparison flow.',
    cashTitle: 'Cash -> THB routes',
    cashDescription: 'Landing pages for live-supported cash currencies such as USD cash to THB or EUR cash to THB.',
    countryTitle: 'Country-intent pages',
    countryDescription: 'Pages for users searching from Japan, Korea, Germany, or Europe who need the best path into Thai baht.',
    travelTitle: 'Bangkok airport and district pages',
    travelDescription: 'Pages for airport, district, and near-me intent before users move back into the main comparison flow.',
    routeTypeCrypto: 'Crypto -> THB',
    routeTypeCash: 'Cash / FX -> THB',
    viewAllTitle: 'Why this index exists',
    viewAllBody: 'This overview page gives search engines, LLMs, and new visitors a clean topic map of every THB conversion route currently covered on the site.',
  },
  zh: {
    kicker: '路线索引',
    title: '把所有 THB 路线页集中在一个可抓取入口',
    description: '这个页面把加密、现金、国家意图、机场与区域意图的路线页集中起来，方便用户、搜索引擎和大模型快速理解站内主题结构。',
    supportTitle: '当前支持范围',
    supportBody: '当前实时现金比较覆盖 USD、CNY、EUR、JPY、GBP。国家页和旅行页仍然可以帮助用户做 THB 换汇决策，但不代表该本币已经有实时比较行。',
    compareCrypto: '打开加密比较页',
    compareCash: '打开现金比较页',
    cryptoTitle: '加密 -> THB 路线页',
    cryptoDescription: '承接 BTC to THB、ETH to THB 这类具体币种搜索，再把用户带回真实比较流程。',
    cashTitle: '现金 -> THB 路线页',
    cashDescription: '承接 USD cash to THB、EUR cash to THB 这类实时支持币种搜索。',
    countryTitle: '国家意图页',
    countryDescription: '面向 Japan、Korea、Germany、Europe 这类国家或区域搜索意图的页面。',
    travelTitle: '曼谷机场与区域页',
    travelDescription: '承接机场、区域、near me 这类旅行换汇搜索，再把用户带回主比较页。',
    routeTypeCrypto: '加密 -> THB',
    routeTypeCash: '现金 / 外汇 -> THB',
    viewAllTitle: '为什么需要这个总览页',
    viewAllBody: '它是站内主题结构页，方便搜索引擎、大模型和新用户一次看清所有已覆盖的 THB 换汇路径。',
  },
  ja: {
    kicker: 'ルート索引',
    title: 'THB ルートをまとめた案内ページ',
    description: '暗号資産、現金、国別意図、空港やエリア意図のルートをまとめ、検索エンジンや LLM がサイト構造を理解しやすくします。',
    supportTitle: '現在の対応範囲',
    supportBody: 'ライブ現金比較は USD、CNY、EUR、JPY、GBP に対応しています。国別ページや旅行ページは、対象通貨がライブ比較にない場合でも判断材料として使えます。',
    compareCrypto: '暗号資産比較を開く',
    compareCash: '現金比較を開く',
    cryptoTitle: '暗号資産 -> THB ルート',
    cryptoDescription: 'BTC to THB や ETH to THB のような検索意図を受け止めるページです。',
    cashTitle: '現金 -> THB ルート',
    cashDescription: 'USD cash to THB や EUR cash to THB のような現金両替意図に対応します。',
    countryTitle: '国別意図ページ',
    countryDescription: 'Japan、Korea、Germany、Europe からの検索意図を THB 比較へつなぎます。',
    travelTitle: '空港・エリアページ',
    travelDescription: '空港、地区、near me 意図を受け止めて主比較へ戻します。',
    routeTypeCrypto: 'Crypto -> THB',
    routeTypeCash: 'Cash / FX -> THB',
    viewAllTitle: 'この索引ページの役割',
    viewAllBody: '検索エンジン、LLM、新規訪問者に対して、現在カバーしている THB ルート全体を整理して見せるためのページです。',
  },
  ko: {
    kicker: '경로 색인',
    title: '모든 THB 경로를 한곳에 모은 색인 페이지',
    description: '가상자산, 현금, 국가 의도, 공항과 지역 의도 페이지를 한곳에 모아 검색엔진과 LLM 이 사이트 구조를 더 쉽게 이해하도록 돕습니다.',
    supportTitle: '현재 지원 범위',
    supportBody: '라이브 현금 비교는 USD, CNY, EUR, JPY, GBP 를 지원합니다. 국가 페이지와 여행 페이지는 해당 통화가 라이브 세트에 없더라도 THB 환전 판단 페이지로 사용할 수 있습니다.',
    compareCrypto: '가상자산 비교 열기',
    compareCash: '현금 비교 열기',
    cryptoTitle: '가상자산 -> THB 경로',
    cryptoDescription: 'BTC to THB, ETH to THB 같은 검색 의도를 실제 비교 흐름으로 연결합니다.',
    cashTitle: '현금 -> THB 경로',
    cashDescription: 'USD cash to THB, EUR cash to THB 같은 실시간 지원 현금 경로를 모읍니다.',
    countryTitle: '국가 의도 페이지',
    countryDescription: 'Japan, Korea, Germany, Europe 관련 검색을 THB 비교 흐름으로 연결합니다.',
    travelTitle: '공항 및 지역 페이지',
    travelDescription: '공항, 지역, near me 의도를 메인 비교 페이지로 연결합니다.',
    routeTypeCrypto: 'Crypto -> THB',
    routeTypeCash: 'Cash / FX -> THB',
    viewAllTitle: '이 색인 페이지의 역할',
    viewAllBody: '검색엔진, LLM, 신규 방문자에게 현재 사이트가 다루는 THB 환전 주제를 구조적으로 보여주는 페이지입니다.',
  },
  de: {
    kicker: 'Routenindex',
    title: 'Alle THB-Routen in einem indexierbaren Überblick',
    description: 'Diese Seite bündelt Krypto-, Bargeld-, Länder- sowie Flughafen- und Bezirksrouten, damit Suchmaschinen und LLMs die Themenstruktur der Website schneller verstehen.',
    supportTitle: 'Aktueller Umfang',
    supportBody: 'Der Live-Bargeldvergleich deckt USD, CNY, EUR, JPY und GBP ab. Länder- und Reiseseiten helfen trotzdem bei THB-Entscheidungen, auch wenn die lokale Währung nicht im Live-Satz liegt.',
    compareCrypto: 'Krypto-Vergleich öffnen',
    compareCash: 'Bargeldvergleich öffnen',
    cryptoTitle: 'Krypto -> THB Routen',
    cryptoDescription: 'Landingpages für Suchen wie BTC to THB oder ETH to THB mit direktem Rückweg in den Live-Vergleich.',
    cashTitle: 'Bargeld -> THB Routen',
    cashDescription: 'Landingpages für live unterstützte Bargeldsuchen wie USD cash to THB oder EUR cash to THB.',
    countryTitle: 'Länder-Intent-Seiten',
    countryDescription: 'Seiten für Suchintentionen aus Japan, Korea, Deutschland oder Europa mit Bezug zu THB.',
    travelTitle: 'Bangkok-Flughafen- und Bezirksseiten',
    travelDescription: 'Seiten für Flughafen-, Bezirks- und Near-me-Suchen vor dem Wechsel zurück in den Hauptvergleich.',
    routeTypeCrypto: 'Krypto -> THB',
    routeTypeCash: 'Bargeld / FX -> THB',
    viewAllTitle: 'Warum dieser Überblick existiert',
    viewAllBody: 'Diese Seite zeigt Suchmaschinen, LLMs und neuen Besuchern alle derzeit abgedeckten THB-Konversionspfade in einer klaren Themenstruktur.',
  },
} as const;

function groupRoutes() {
  const crypto = routeGuides.filter((guide) => guide.type === 'crypto');
  const cash = routeGuides.filter((guide) => guide.type === 'cash' && guide.currency);
  const country = routeGuides.filter((guide) => /thailand-money-exchange$/.test(guide.slug));
  const travel = routeGuides.filter((guide) => guide.type === 'cash' && !guide.currency && !/thailand-money-exchange$/.test(guide.slug));
  return { crypto, cash, country, travel };
}

function itemListJsonLd(locale: Locale, guides: RouteGuide[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: guides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: withLocalePath(locale, `/routes/${guide.slug}`),
      name: t(guide.title, locale),
    })),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RoutesIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = copy[locale];
  const groups = groupRoutes();
  const allGuides = [...groups.crypto, ...groups.cash, ...groups.country, ...groups.travel];
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: c.title, item: withLocalePath(locale, '/routes') },
  ]);
  const itemListLd = itemListJsonLd(locale, allGuides);

  const sections = [
    { key: 'crypto', title: c.cryptoTitle, description: c.cryptoDescription, guides: groups.crypto },
    { key: 'cash', title: c.cashTitle, description: c.cashDescription, guides: groups.cash },
    { key: 'country', title: c.countryTitle, description: c.countryDescription, guides: groups.country },
    { key: 'travel', title: c.travelTitle, description: c.travelDescription, guides: groups.travel },
  ] as const;

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <section className="frontend-hero overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <Pill>{c.kicker}</Pill>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">{c.title}</h1>
              <p className="max-w-3xl text-lg text-stone-300">{c.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TrackLink href={`/${locale}/crypto`} eventName="routes_index_compare_click" eventParams={{ target: 'crypto' }} className="rounded-full bg-brand-500 px-6 py-3 font-medium text-surface-950 hover:bg-brand-400">{c.compareCrypto}</TrackLink>
              <TrackLink href={`/${locale}/cash`} eventName="routes_index_compare_click" eventParams={{ target: 'cash' }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.compareCash}</TrackLink>
            </div>
          </div>
          <div className="card-panel p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-stone-500">{c.viewAllTitle}</p>
            <p className="mt-3 text-base text-stone-300">{c.viewAllBody}</p>
            <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/8 px-4 py-4">
              <p className="text-sm font-semibold text-brand-200">{c.supportTitle}</p>
              <p className="mt-2 text-sm text-stone-300">{c.supportBody}</p>
            </div>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <Section key={section.key} title={section.title} description={section.description}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.guides.map((guide) => (
              <TrackLink
                key={guide.slug}
                href={`/${locale}/routes/${guide.slug}`}
                eventName="routes_index_guide_click"
                eventParams={{ section: section.key, route: guide.slug }}
                className="card card-interactive p-5"
              >
                <p className="text-sm text-stone-400">{guide.type === 'crypto' ? c.routeTypeCrypto : c.routeTypeCash}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{t(guide.title, locale)}</h2>
                <p className="mt-3 text-sm text-stone-400">{t(guide.summary, locale)}</p>
              </TrackLink>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = copy[locale];
  const path = '/routes';

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
