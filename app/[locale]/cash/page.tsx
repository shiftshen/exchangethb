import { additionalCopy } from '@/lib/additional-copy';
import { locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CashFeaturedChangers } from '@/components/cash-featured-changers';
import { CashHubAnswer, CashHubCurrencies, CashHubFaq } from '@/components/cash-hub';
import { buildCashPageLive } from '@/lib/ai-answers';
import { buildCashHubContent, cashHubFaqJsonLd, isCashHubLocale } from '@/lib/cash-hub-seo';
import { ExchangeGuide } from '@/components/exchange-guide';
import { ExchangePicker } from '@/components/exchange-picker';
import { isLocale } from '@/lib/i18n';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import type { Locale } from '@/lib/types';
export const revalidate = 60;
export function generateStaticParams() { return locales.map(locale => ({locale})); }
const copy = {
  ru: additionalCopy.ru.pages.cash,
  ko: additionalCopy.ko.pages.cash,
  fr: additionalCopy.fr.pages.cash,
  de: additionalCopy.de.pages.cash,
  id: additionalCopy.id.pages.cash,
  vi: additionalCopy.vi.pages.cash,

  ja: {"title": "日本円からタイバーツへ、両替レートを比較", "body": "JPY・USD・EURなど15通貨に対応。バンコクの両替店の概算受取額、営業時間、紙幣条件を確認して選びましょう。"},
  zh: { title: '现金换泰铢，哪家合适？', body: '比较预计到手，再决定去哪家换汇店。' },
  en: { title: 'Where to exchange your cash?', body: 'Compare estimated baht before choosing a money changer.' },
  th: { title: 'แลกเงินสดเป็นบาท ที่ไหนดี?', body: 'เทียบยอดรับโดยประมาณ ก่อนเลือกร้านแลกเงิน' },
};
const seoTitles = {ru: additionalCopy.ru.pages.cash.title,ko: additionalCopy.ko.pages.cash.title,fr: additionalCopy.fr.pages.cash.title,de: additionalCopy.de.pages.cash.title,id: additionalCopy.id.pages.cash.title,vi: additionalCopy.vi.pages.cash.title,"en": "USD, JPY & EUR to Thai baht: Bangkok money changer comparison", "th": "เปรียบเทียบเรทแลกเงิน USD JPY EUR เป็นบาท — ร้านแลกเงินกรุงเทพ", "zh": "美元、日元、欧元换泰铢：曼谷换汇店比较", "ja": "日本円からタイバーツへ：バンコクの両替レート比較"};
export default async function CashPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const hub = isCashHubLocale(locale) ? buildCashHubContent(locale) : null;
  const live = await buildCashPageLive(locale);
  return <div className="simple-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'ExchangeTHB', item: withLocalePath(locale) }, { name: copy[locale].title, item: withLocalePath(locale, '/cash') }])) }} />
    {hub ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cashHubFaqJsonLd(locale, live?.faq ? [...hub.faqs, live.faq] : hub.faqs)) }} /> : null}
    <header className="simple-intro"><h1>{copy[locale].title}</h1><p>{copy[locale].body}</p></header><CashHubAnswer locale={locale} live={live} /><ExchangePicker key={locale} locale={locale} initialMode="cash" showModeSwitch={false} /><CashFeaturedChangers locale={locale} /><CashHubCurrencies locale={locale} live={live} /><CashHubFaq locale={locale} live={live} /><ExchangeGuide locale={locale} /></div>;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hub = isCashHubLocale(locale) ? buildCashHubContent(locale) : null;
  const title = hub?.metaTitle ?? seoTitles[locale];
  const description = hub?.metaDescription ?? copy[locale].body;
  return { title, description, openGraph: { title, description, url: withLocalePath(locale, '/cash'), locale: locale === 'ja' ? 'ja_JP' : locale === 'zh' ? 'zh_CN' : locale === 'th' ? 'th_TH' : 'en_GB', type: 'website' }, alternates: localeMetadataAlternates(locale, '/cash'), robots: localeRobots(locale) };
}
