import { cashCurrencyPath, formatObserved, formatRate, loadCurrencyRates, type CashCurrencyCode } from '@/lib/cash-currency-pages';
import { withLocalePath } from '@/lib/seo';
import type { Locale } from '@/lib/types';

const CODES: CashCurrencyCode[] = ['USD', 'EUR', 'JPY'];

const copy = {
  en: { label: 'Cash rates observed today', more: 'All currencies', best: 'best', updated: 'Observed' },
  th: { label: 'เรทเงินสดที่เก็บได้วันนี้', more: 'ทุกสกุลเงิน', best: 'ดีที่สุด', updated: 'เก็บข้อมูล' },
  zh: { label: '今日采集到的现金汇率', more: '全部币种', best: '最优', updated: '采集时间' },
} as const;

export async function HomeRatesStrip({ locale }: { locale: Locale }) {
  if (!['en', 'th', 'zh'].includes(locale)) return null;
  const text = copy[locale as 'en' | 'th' | 'zh'];
  const rows = await Promise.all(CODES.map(async (code) => ({ code, data: await loadCurrencyRates(code) })));
  const usable = rows.filter((row) => row.data.rows.length > 0);
  if (!usable.length) return null;
  return (
    <section className="mb-8" data-home-rates>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-white">{text.label}</h2>
        <a className="text-sm text-brand-300 hover:text-brand-200" href={withLocalePath(locale, '/rates')}>{text.more} →</a>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {usable.map(({ code, data }) => {
          const best = data.rows[0];
          return (
            <a key={code} className="card block p-4 hover:border-brand-500/40" href={withLocalePath(locale, cashCurrencyPath(code))} data-home-rate={code}>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-semibold text-white">{code}</span>
                <span className="text-xl font-semibold text-brand-300">{formatRate(best.buyRate)}</span>
              </div>
              <div className="mt-1 text-xs text-stone-400">
                {best.name} · {text.best} · {formatObserved(best.observedAt, locale)}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
