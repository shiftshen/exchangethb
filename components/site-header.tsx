import { additionalCopy, isAdditionalLocale } from '@/lib/additional-copy';
import Link from 'next/link';
import { resolveContentLocale } from '@/lib/i18n';
import { localeRoutePath } from '@/lib/seo';
import type { ContentLocale, Locale } from '@/lib/types';
import { LanguageSwitcher } from '@/components/language-switcher';
const labels = {ru: {cash:additionalCopy.ru.words.cash,crypto:additionalCopy.ru.words.crypto,skip:additionalCopy.ru.ui.skip},ko: {cash:additionalCopy.ko.words.cash,crypto:additionalCopy.ko.words.crypto,skip:additionalCopy.ko.ui.skip},fr: {cash:additionalCopy.fr.words.cash,crypto:additionalCopy.fr.words.crypto,skip:additionalCopy.fr.ui.skip},de: {cash:additionalCopy.de.words.cash,crypto:additionalCopy.de.words.crypto,skip:additionalCopy.de.ui.skip},id: {cash:additionalCopy.id.words.cash,crypto:additionalCopy.id.words.crypto,skip:additionalCopy.id.ui.skip},vi: {cash:additionalCopy.vi.words.cash,crypto:additionalCopy.vi.words.crypto,skip:additionalCopy.vi.ui.skip}, ja: {cash:'現金両替',crypto:'暗号資産',skip:'本文へ移動'}, zh: { cash: '现金换汇', crypto: '加密资产', skip: '跳到主要内容' }, en: { cash: 'Cash exchange', crypto: 'Crypto', skip: 'Skip to content' }, th: { cash: 'แลกเงินสด', crypto: 'คริปโต', skip: 'ไปที่เนื้อหา' } };
export function SiteHeader({ locale }: { locale: ContentLocale | Locale }) {
  const language = resolveContentLocale(locale);
  return <header className="simple-header"><a className="skip-link" href="#main-content">{labels[language].skip}</a><div className="simple-header-inner">
    <Link className="simple-brand" href={localeRoutePath(language)} aria-label="ExchangeTHB"><span className="brand-mark" aria-hidden="true">฿</span><span>Exchange<span>THB</span></span></Link>
    <nav aria-label={isAdditionalLocale(language) ? additionalCopy[language].ui.nav : language === 'ja' ? 'メインメニュー' : language === 'zh' ? '主要导航' : language === 'th' ? 'เมนูหลัก' : 'Main navigation'}><Link href={localeRoutePath(language, '/cash')}>{labels[language].cash}</Link><Link href={localeRoutePath(language, '/crypto')}>{labels[language].crypto}</Link></nav>
    <LanguageSwitcher locale={language} />
  </div></header>;
}
