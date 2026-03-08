'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/types';

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const options: Locale[] = ['th', 'en', 'zh'];
  const currentPath = pathname || '/th';
  const suffix = currentPath.replace(/^\/(th|en|zh)/, '') || '';

  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1 text-sm">
      {options.map((option) => (
        <Link
          key={option}
          href={`/${option}${suffix}`}
          className={`rounded-full px-3 py-1.5 ${option === locale ? 'bg-brand-700 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
        >
          {option.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
