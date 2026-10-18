import { additionalCopy } from '@/lib/additional-copy';
import { locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExchangeGuide } from '@/components/exchange-guide';
import { ExchangePicker } from '@/components/exchange-picker';
import { isLocale } from '@/lib/i18n';
import { breadcrumbJsonLd, localeMetadataAlternates, localeRobots, withLocalePath } from '@/lib/seo';
import type { Locale } from '@/lib/types';
export const revalidate = 60;
export function generateStaticParams() { return locales.map(locale => ({locale})); }
const copy = {
  ru: additionalCopy.ru.pages.crypto,
  ko: additionalCopy.ko.pages.crypto,
  fr: additionalCopy.fr.pages.crypto,
  de: additionalCopy.de.pages.crypto,
  id: additionalCopy.id.pages.crypto,
  vi: additionalCopy.vi.pages.crypto,

  ja: {"title": "USDT・BTCをタイバーツへ：タイの取引所を比較", "body": "暗号資産の売買に必要なタイバーツの概算額と手数料を比較。表示価格は保証された約定価格ではありません。"},
  zh: { title: '买入或卖出，看清最终金额。', body: '比较泰国交易所的预计金额与费用。' },
  en: { title: 'Buy or sell. See the final amount.', body: 'Compare estimated amounts and fees across Thai exchanges.' },
  th: { title: 'ซื้อหรือขาย ดูยอดให้ชัด', body: 'เทียบยอดประมาณการและค่าธรรมเนียมของแพลตฟอร์มไทย' },
};
const seoTitles = {ru: additionalCopy.ru.pages.crypto.title,ko: additionalCopy.ko.pages.crypto.title,fr: additionalCopy.fr.pages.crypto.title,de: additionalCopy.de.pages.crypto.title,id: additionalCopy.id.pages.crypto.title,vi: additionalCopy.vi.pages.crypto.title,"en": "USDT & BTC to THB: Thai crypto exchange comparison", "th": "เปรียบเทียบ USDT และ BTC เป็นบาท — ค่าธรรมเนียมและยอดประมาณการ", "zh": "USDT、BTC换泰铢：泰国交易所费用与金额比较", "ja": "USDT・BTCからタイバーツへ：タイの暗号資産取引所比較"};
export default async function CryptoPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <div className="simple-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'ExchangeTHB', item: withLocalePath(locale) }, { name: copy[locale].title, item: withLocalePath(locale, '/crypto') }])) }} />
    <header className="simple-intro"><h1>{copy[locale].title}</h1><p>{copy[locale].body}</p></header><ExchangePicker key={locale} locale={locale} initialMode="crypto" showModeSwitch={false} /><ExchangeGuide locale={locale} /></div>;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: seoTitles[locale], description: copy[locale].body, openGraph: { title: seoTitles[locale], description: copy[locale].body, url: withLocalePath(locale, '/crypto'), locale: locale === 'ja' ? 'ja_JP' : locale === 'zh' ? 'zh_CN' : locale === 'th' ? 'th_TH' : 'en_GB', type: 'website' }, alternates: localeMetadataAlternates(locale, '/crypto'), robots: localeRobots(locale) };
}
