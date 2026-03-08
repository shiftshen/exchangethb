import Link from 'next/link';
import { navigation, t } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur">
      <div className="container-shell flex items-center justify-between gap-6 py-4">
        <Link href={`/${locale}`}><Logo /></Link>
        <nav className="hidden gap-6 text-sm font-medium text-stone-600 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`} className="hover:text-brand-700">
              {t(item.label, locale)}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
