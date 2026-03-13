import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TrackLink } from '@/components/track-link';
import { Pill, Section } from '@/components/ui';
import { locales, resolveContentLocale } from '@/lib/i18n';
import { breadcrumbJsonLd, localeAlternates, withLocalePath } from '@/lib/seo';
import { getRouteGuide, routeGuideSlugs } from '@/lib/route-guides';
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
    faqTitle: 'Common questions for this route',
  },
  zh: {
    routeGuide: '路线指南',
    whyTitle: '这个页面帮助你解决什么问题',
    checklistTitle: '跳转前先看这几件事',
    compareCta: '打开实时比较页',
    methodologyCta: '查看方法论',
    noteTitle: '为什么要单独做这类页面',
    noteBody: '这个页面是为了让从搜索结果进入的用户直接落到更贴近真实需求的 THB 比较入口，而不是从空白工具页开始。',
    faqTitle: '这个路线最常见的问题',
  },
  th: {
    routeGuide: 'คู่มือเส้นทาง',
    whyTitle: 'หน้านี้ช่วยตัดสินใจเรื่องอะไร',
    checklistTitle: 'สิ่งที่ควรเช็กก่อนกดออกไป',
    compareCta: 'เปิดหน้าคอมแพร์สด',
    methodologyCta: 'ดูวิธีการ',
    noteTitle: 'ทำไมหน้านี้จึงมีประโยชน์',
    noteBody: 'หน้านี้ช่วยให้ผู้ใช้ที่มาจากการค้นหาลงจอดบนเส้นทางเปรียบเทียบ THB ที่สมจริงทันที แทนการเริ่มจากหน้าคอมแพร์ว่างเปล่า',
    faqTitle: 'คำถามที่พบบ่อยของเส้นทางนี้',
  },
  ja: {
    routeGuide: 'ルートガイド',
    whyTitle: 'このページで判断できること',
    checklistTitle: '外部へ進む前に確認すること',
    compareCta: '比較ページを開く',
    methodologyCta: '方法論を見る',
    noteTitle: 'このページの役割',
    noteBody: '検索から来たユーザーが空の比較ツールではなく、実際の THB 比較導線へ直接入れるようにするためのページです。',
    faqTitle: 'このルートでよくある質問',
  },
  ko: {
    routeGuide: '경로 가이드',
    whyTitle: '이 페이지가 도와주는 결정',
    checklistTitle: '외부로 나가기 전 확인할 점',
    compareCta: '비교 페이지 열기',
    methodologyCta: '방법론 보기',
    noteTitle: '이 페이지의 역할',
    noteBody: '검색에서 들어온 사용자가 빈 비교 도구가 아니라 실제 THB 비교 흐름으로 바로 들어가도록 만드는 페이지입니다.',
    faqTitle: '이 경로의 자주 묻는 질문',
  },
  de: {
    routeGuide: 'Routenleitfaden',
    whyTitle: 'Wobei diese Seite hilft',
    checklistTitle: 'Vor dem Klick nach außen prüfen',
    compareCta: 'Live-Vergleich öffnen',
    methodologyCta: 'Methodik lesen',
    noteTitle: 'Warum diese Seite existiert',
    noteBody: 'Diese Seite hilft Suchenden dabei, direkt in einen realistischen THB-Vergleich einzusteigen statt auf einer leeren Vergleichsseite zu landen.',
    faqTitle: 'Häufige Fragen zu dieser Route',
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

export function generateStaticParams() {
  return routeGuideSlugs.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export default async function RouteGuidePage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const guide = getRouteGuide(slug);
  if (!guide) notFound();

  const contentLocale = resolveContentLocale(locale);
  const c = uiCopy[locale];
  const guideTitle = guide.title[contentLocale];
  const guideSummary = guide.summary[contentLocale];
  const guideIntro = guide.intro[contentLocale];
  const guideAudience = guide.audience[contentLocale];
  const guideFaqs = guide.faqs?.[contentLocale] || [];
  const compareHref = `/${locale}${guide.compareHref}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'ExchangeTHB', item: withLocalePath(locale) },
    { name: guideTitle, item: withLocalePath(locale, `/routes/${guide.slug}`) },
  ]);
  const faqLd = guideFaqs.length ? faqJsonLd(guideFaqs) : null;

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} /> : null}
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
              <TrackLink href={`/${locale}/legal/methodology`} eventName="route_guide_methodology_click" eventParams={{ route: guide.slug }} className="rounded-full border border-white/10 bg-surface-800 px-6 py-3 font-medium text-stone-100 hover:border-brand-500/40 hover:text-brand-300">{c.methodologyCta}</TrackLink>
            </div>
          </div>
          <div className="card-panel p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-stone-500">{c.noteTitle}</p>
            <p className="mt-3 text-base text-stone-300">{c.noteBody}</p>
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
              {guide.checks[contentLocale].map((item) => (
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
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getRouteGuide(slug);
  if (!guide) return {};

  const contentLocale = resolveContentLocale(locale);
  const title = guide.title[contentLocale];
  const description = guide.summary[contentLocale];
  const path = `/routes/${guide.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale, path),
      languages: localeAlternates(path),
    },
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
