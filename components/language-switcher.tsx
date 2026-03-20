'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics-client';
import { indexableLocales } from '@/lib/i18n';
import { localeRoutePath } from '@/lib/seo';
import { ContentLocale } from '@/lib/types';

export function LanguageSwitcher({ locale }: { locale: ContentLocale }) {
  const pathname = usePathname();
  const options = indexableLocales;
  const currentPath = pathname || '/';
  const suffix = currentPath === '/' ? '' : (currentPath.replace(/^\/(th|en|zh|ja|ko|de)/, '') || '');
  const labels: Record<ContentLocale, string> = { th: 'TH', en: 'EN', zh: 'ZH' };

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-700 bg-surface-900/90 p-1 text-sm shadow-soft">
      {options.map((option) => (
        <Link
          key={option}
          href={localeRoutePath(option, suffix)}
          onClick={() => trackEvent('language_switch', { from: locale, to: option, path: suffix || '/' })}
          className={`rounded-full px-3 py-1.5 transition ${option === locale ? 'bg-brand-500 text-surface-950' : 'text-stone-300 hover:bg-surface-800 hover:text-white'}`}
        >
          {labels[option]}
        </Link>
      ))}
    </div>
  );
}
