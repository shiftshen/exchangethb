import { TrackLink } from '@/components/track-link';
import { exchanges } from '@/data/site';
import type { Locale } from '@/lib/types';

const copy = {
  en: {
    title: 'Thai exchange profiles: fees, THB withdrawal and coverage',
    body: 'Before you compare, read what each exchange charges and what its record says about THB withdrawals.',
    link: (name: string) => `${name} fees`,
    meta: (pct: number) => `${pct}% trading fee`,
  },
  th: {
    title: 'โปรไฟล์แพลตฟอร์มไทย: ค่าธรรมเนียม การถอนเงินบาท และสินทรัพย์ที่ครอบคลุม',
    body: 'ก่อนเทียบ ดูว่าแต่ละแพลตฟอร์มคิดค่าธรรมเนียมเท่าไร และข้อมูลของเราระบุเรื่องการถอนเงินบาทไว้อย่างไร',
    link: (name: string) => `ค่าธรรมเนียม ${name}`,
    meta: (pct: number) => `ค่าธรรมเนียมเทรด ${pct}%`,
  },
  zh: {
    title: '泰国交易所实体页：手续费、泰铢提现与覆盖资产',
    body: '比较之前，先看每家交易所收多少费用，以及记录里关于泰铢提现的说明。',
    link: (name: string) => `${name} 手续费`,
    meta: (pct: number) => `交易费 ${pct}%`,
  },
} as const;

// Internal links from /crypto (indexed in every locale) to the four exchange profile pages.
// Profile pages exist in en/th/zh only, so this strip renders in those three locales.
export function CryptoFeaturedExchanges({ locale }: { locale: Locale }) {
  if (locale !== 'en' && locale !== 'th' && locale !== 'zh') return null;
  const c = copy[locale];
  return (
    <section className="seo-changers" aria-labelledby="featured-exchanges-heading">
      <h2 id="featured-exchanges-heading">{c.title}</h2>
      <p className="seo-changers-body">{c.body}</p>
      <ul className="seo-changers-list">
        {exchanges.map((exchange) => (
          <li key={exchange.slug}>
            <TrackLink
              href={`/${locale}/exchanges/${exchange.slug}`}
              eventName="crypto_featured_exchange_click"
              eventParams={{ locale, exchange: exchange.slug }}
              className="seo-changers-link"
            >
              <span className="seo-changers-name">{c.link(exchange.name)}</span>
              <span className="seo-changers-meta">{c.meta(exchange.fee.tradingFeePct)}</span>
            </TrackLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
