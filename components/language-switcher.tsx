'use client';
import { languageOptions, languageSwitchParams } from '@/lib/locale-preferences';
import { additionalCopy, isAdditionalLocale } from '@/lib/additional-copy';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics-client';
import { localeRoutePath } from '@/lib/seo';
import type { ContentLocale } from '@/lib/types';
export function LanguageSwitcher({ locale }: { locale: ContentLocale }) {
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  const pathname = usePathname();
  const router = useRouter();
  const suffix = pathname.replace(/^\/(th|en|zh|ja|ko|de|ru|fr|id|vi)/, '');
  return <label className="simple-language"><span className="sr-only">{isAdditionalLocale(locale) ? additionalCopy[locale].ui.language : locale === 'ja' ? '言語' : locale === 'zh' ? '语言' : locale === 'th' ? 'ภาษา' : 'Language'}</span><select value={locale} onChange={event => {
    const next = event.target.value as ContentLocale;
    const params = languageSwitchParams(next, suffix, window.location.search);
    const query = params.toString();
    trackEvent('language_switch', { from_locale: locale, to_locale: next });
    router.push(`${localeRoutePath(next, suffix)}${query ? `?${query}` : ''}`);
  }}>{languageOptions.map(option => <option key={option.locale} value={option.locale}>{option.label}</option>)}</select></label>;
}
