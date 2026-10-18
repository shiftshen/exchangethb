import { additionalCopy } from '@/lib/additional-copy';
import { locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExchangePicker } from '@/components/exchange-picker';
import { HomeSeoSections, homeFaqEntries, homeQuickAnswer } from '@/components/home-seo-sections';
import { isLocale } from '@/lib/i18n';
import { breadcrumbJsonLd, faqPageJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
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
const seoTitles = {ru: additionalCopy.ru.pages.home.title,ko: additionalCopy.ko.pages.home.title,fr: additionalCopy.fr.pages.home.title,de: additionalCopy.de.pages.home.title,id: additionalCopy.id.pages.home.title,vi: additionalCopy.vi.pages.home.title,"en": "Thai baht exchange comparison: cash & crypto in Thailand", "th": "เปรียบเทียบแลกเงินเป็นบาท — เงินสดและคริปโตในไทย", "zh": "泰铢兑换比较：曼谷换汇店与泰国交易所", "ja": "タイバーツ両替レート比較：日本円・現金・暗号資産"};
export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy[locale as ContentLocale];
  const breadcrumb = breadcrumbJsonLd([{ name: 'ExchangeTHB', item: withLocalePath(locale) }]);
  const faq = faqPageJsonLd(homeFaqEntries(locale));
  return <div className="simple-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    <header className="simple-intro"><h1>{c.title}</h1><p className="seo-answer">{homeQuickAnswer(locale)}</p></header>
    <ExchangePicker key={locale} locale={locale} />
    <HomeSeoSections locale={locale} />
  </div>;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: seoTitles[locale], description: copy[locale].body, alternates: localeMetadataAlternates(locale), robots: localeRobots(locale), openGraph: { title: seoTitles[locale], description: copy[locale].body, url: withLocalePath(locale) } };
}
