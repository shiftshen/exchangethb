import Link from 'next/link';
import { navigation, resolveContentLocale, t } from '@/lib/i18n';
import { localeRoutePath } from '@/lib/seo';
import { Locale } from '@/lib/types';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';

export function SiteHeader({ locale }: { locale: Locale }) {
  const hrefLocale = resolveContentLocale(locale);
  const homeHref = localeRoutePath(hrefLocale);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-surface-950/88 backdrop-blur-xl">
      <div className="container-shell flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href={homeHref}><Logo /></Link>
          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-brand-500/20 bg-surface-900 px-4 py-2 text-xs font-medium text-stone-300 shadow-soft">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              {t({ th: 'เส้นทางคริปโตสด + ร้านแลกเงินที่ผ่านการคัดแล้ว', en: 'Live crypto + verified cash routes', zh: '实时加密 + 已筛选现金换汇路线' }, locale)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
        <div className="hidden items-center justify-between gap-4 lg:flex">
          <nav className="flex gap-2 overflow-x-auto pb-1 text-sm font-medium text-stone-300">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href.startsWith('/admin') ? item.href : localeRoutePath(hrefLocale, item.href)}
                className="whitespace-nowrap rounded-full border border-white/8 bg-surface-900 px-4 py-2 hover:border-brand-500/40 hover:text-brand-300"
              >
                {t(item.label, locale)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 rounded-full border border-white/8 bg-surface-900/80 px-4 py-2 text-xs text-stone-400">
            <span className="text-brand-300">{t({ th: '用途', en: 'Use case', zh: '用途' }, locale)}</span>
            <span>{t({ th: '先比较，再跳转', en: 'Compare first, click out second', zh: '先比较，再跳转' }, locale)}</span>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 text-sm font-medium text-stone-300 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href.startsWith('/admin') ? item.href : localeRoutePath(hrefLocale, item.href)}
              className="whitespace-nowrap rounded-full border border-white/8 bg-surface-900 px-3 py-1.5 hover:border-brand-500/40 hover:text-brand-300"
            >
              {t(item.label, locale)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
