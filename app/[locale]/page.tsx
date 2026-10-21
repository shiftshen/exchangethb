import { additionalCopy } from '@/lib/additional-copy';
import { locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExchangePicker } from '@/components/exchange-picker';
import { HomeSeoSections, homeFaqEntries, homeQuickAnswer } from '@/components/home-seo-sections';
import { HomeRatesStrip } from '@/components/home-rates-strip';
import { AdSlot } from '@/components/ad-slot';
import { isLocale } from '@/lib/i18n';
import { homeBrandIntro, homeMetadata } from '@/lib/brand-entity';
import { breadcrumbJsonLd, faqPageJsonLd, graphNode, homeGraphJsonLd, withLocalePath } from '@/lib/seo';
import type { ContentLocale, Locale } from '@/lib/types';

export const revalidate = 60;
export function generateStaticParams() { return locales.map(locale => ({locale})); }
const copy = {
  ru: additionalCopy.ru.pages.home,
  ko: additionalCopy.ko.pages.home,
  fr: additionalCopy.fr.pages.home,
  de: additionalCopy.de.pages.home,
  id: additionalCopy.id.pages.home,
  vi: additionalCopy.vi.pages.home,

  ja: {"title": "タイバーツ両替を、もっと選びやすく。", "body": "日本円・米ドルなどの現金と暗号資産をタイバーツへ。金額を入力し、バンコクの両替店やタイの取引所を比較できます。"},
  zh: { title: '换泰铢，选简单一点。', body: '选币种、填金额，比较哪家更合适。' },
  en: { title: 'Thai baht. An easier choice.', body: 'Choose your currency and amount. Compare your options.' },
  th: { title: 'แลกเป็นบาท เลือกให้ง่ายขึ้น', body: 'เลือกสกุลเงิน ใส่จำนวน แล้วเปรียบเทียบตัวเลือก' },
};
export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy[locale as ContentLocale];
  const breadcrumb = graphNode(breadcrumbJsonLd([{ name: 'ExchangeTHB', item: withLocalePath(locale) }]));
  const faq = graphNode(faqPageJsonLd(homeFaqEntries(locale)));
  // One @graph: WebSite + Organization (same @id the rest of the site references) + page nodes.
  const graph = homeGraphJsonLd(locale, [breadcrumb, faq]);
  return <div className="simple-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
    <header className="simple-intro"><h1>{c.title}</h1><p className="seo-answer">{homeBrandIntro[locale]} {homeQuickAnswer(locale)}</p></header>
    <ExchangePicker key={locale} locale={locale} /><HomeRatesStrip locale={locale} />
      <AdSlot network="coinzilla" slot="home" />
    <HomeSeoSections locale={locale} />
  </div>;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return homeMetadata(locale);
}
