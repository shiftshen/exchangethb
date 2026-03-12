'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics-client';
import { Locale } from '@/lib/types';

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const options: Locale[] = ['th', 'en', 'zh'];
  const currentPath = pathname || '/th';
  const suffix = currentPath.replace(/^\/(th|en|zh)/, '') || '';

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-700 bg-surface-900/90 p-1 text-sm shadow-soft">
      {options.map((option) => (
        <Link
          key={option}
          href={`/${option}${suffix}`}
          onClick={() => trackEvent('language_switch', { from: locale, to: option, path: suffix || '/' })}
          className={`rounded-full px-3 py-1.5 transition ${option === locale ? 'bg-brand-500 text-surface-950' : 'text-stone-300 hover:bg-surface-800 hover:text-white'}`}
        >
          {option.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
