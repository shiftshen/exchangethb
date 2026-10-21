import { additionalCopy } from '@/lib/additional-copy';
import { locales } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CashFeaturedChangers } from '@/components/cash-featured-changers';
import { CashHubAnswer, CashHubCurrencies, CashHubFaq } from '@/components/cash-hub';
import { buildCashPageLive } from '@/lib/ai-answers';
import { buildCashHubContent, cashHubFaqJsonLd, isCashHubLocale } from '@/lib/cash-hub-seo';
import { ExchangeGuide } from '@/components/exchange-guide';
import { AdSlot } from '@/components/ad-slot';
import { Section } from '@/components/ui';
import { indexedRouteSlugs } from '@/lib/indexing-policy';
import { getRouteGuide } from '@/lib/route-guides';
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
    <header className="simple-intro"><h1>{copy[locale].title}</h1><p>{copy[locale].body}</p></header>
    {['en', 'th', 'zh'].includes(locale) ? <nav className="mb-6 flex flex-wrap gap-3 text-sm" data-currency-nav>{[
      { code: 'USD', label: { en: 'US dollar', th: 'ดอลลาร์สหรัฐ', zh: '美元' } },
      { code: 'EUR', label: { en: 'euro', th: 'ยูโร', zh: '欧元' } },
      { code: 'GBP', label: { en: 'British pound', th: 'ปอนด์อังกฤษ', zh: '英镑' } },
      { code: 'JPY', label: { en: 'Japanese yen', th: 'เยนญี่ปุ่น', zh: '日元' } },
      { code: 'CNY', label: { en: 'Chinese yuan', th: 'หยวนจีน', zh: '人民币' } },
    ].map((item) => <a key={item.code} className="rounded-full border border-white/10 px-4 py-2 text-stone-200 hover:border-brand-500/40 hover:text-brand-300" href={`/${locale}/cash/${item.code.toLowerCase()}`}>{item.label[locale as 'en' | 'th' | 'zh']} ({item.code})</a>)}
      <a className="rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 font-medium text-brand-300 hover:text-brand-200" href={`/${locale}/rates`}>{locale === 'th' ? 'ตารางเรททุกสกุล' : locale === 'zh' ? '全部币种总表' : 'All currencies'}</a>
    </nav> : null}
    <CashHubAnswer locale={locale} live={live} /><ExchangePicker key={locale} locale={locale} initialMode="cash" showModeSwitch={false} /><CashFeaturedChangers locale={locale} /><CashHubCurrencies locale={locale} live={live} /><CashHubFaq locale={locale} live={live} /><ExchangeGuide locale={locale} />
    {['en', 'th', 'zh'].includes(locale) ? (
      <Section title={locale === 'th' ? 'คู่มือเส้นทางที่เกี่ยวข้อง' : locale === 'zh' ? '相关换汇指南' : 'Related money-exchange guides'}>
        <div className="flex flex-wrap gap-3 text-sm" data-guide-links>
          {indexedRouteSlugs.map((slug) => {
            const guide = getRouteGuide(slug);
            if (!guide) return null;
            const label = (guide.title as unknown as Record<string, string>)[locale] ?? (guide.title as unknown as Record<string, string>).en;
            return <a key={slug} className="rounded-full border border-white/10 px-4 py-2 text-stone-200 hover:border-brand-500/40 hover:text-brand-300" href={withLocalePath(locale, `/routes/${slug}`)}>{label}</a>;
          })}
        </div>
      </Section>
    ) : null}
    <AdSlot network="coinzilla" slot="cash" /></div>;
}
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const hub = isCashHubLocale(locale) ? buildCashHubContent(locale) : null;
  const title = hub?.metaTitle ?? seoTitles[locale];
  const description = hub?.metaDescription ?? copy[locale].body;
  return { title, description, openGraph: { title, description, url: withLocalePath(locale, '/cash'), locale: locale === 'ja' ? 'ja_JP' : locale === 'zh' ? 'zh_CN' : locale === 'th' ? 'th_TH' : 'en_GB', type: 'website' }, alternates: localeMetadataAlternates(locale, '/cash'), robots: localeRobots(locale) };
}
