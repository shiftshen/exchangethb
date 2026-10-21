import { currencyNames, formatBangkokStamp, type RateLocale } from '@/lib/rate-format';
import type { RateTable } from '@/lib/rate-table';

const copy = {
  en: {
    currency: 'Currency',
    note: 'Banknote',
    buy: 'Buy',
    sell: 'Sell',
    none: 'N/A',
    legend: 'Buy = baht the shop pays per 1 unit of your foreign cash. Sell = baht you pay per 1 unit. Counter rates can change during the day.',
    asOf: 'Rates as of',
    tz: 'ICT',
    published: 'published by the store',
    collected: 'collected from the store',
    checked: 'Last checked',
    stale: 'This quote is more than 48 hours old. Confirm the rate with the store before you go.',
    empty: 'No collected quotes are available right now, so no rate is shown.',
  },
  th: {
    currency: 'สกุลเงิน',
    note: 'ชนิดธนบัตร',
    buy: 'รับซื้อ',
    sell: 'ขายออก',
    none: 'ไม่มีข้อมูล',
    legend: 'รับซื้อ = บาทที่ร้านจ่ายต่อเงินต่างประเทศ 1 หน่วย ขายออก = บาทที่คุณจ่ายต่อ 1 หน่วย เรทหน้าร้านเปลี่ยนได้ตลอดวัน',
    asOf: 'เรท ณ',
    tz: 'น. (เวลาไทย)',
    published: 'ประกาศโดยร้าน',
    collected: 'เก็บจากร้าน',
    checked: 'ตรวจล่าสุด',
    stale: 'เรทนี้เก่ากว่า 48 ชั่วโมง ควรยืนยันกับร้านก่อนเดินทาง',
    empty: 'ตอนนี้ยังไม่มีเรทที่เก็บได้ จึงไม่แสดงตัวเลข',
  },
  zh: {
    currency: '币种',
    note: '面额',
    buy: '买入',
    sell: '卖出',
    none: '暂无',
    legend: '买入 = 店家收你 1 单位外币付的泰铢；卖出 = 你向店家买 1 单位外币付的泰铢。柜台汇率当天会变动。',
    asOf: '汇率时间',
    tz: '（曼谷时间）',
    published: '店家官网公布',
    collected: '从店家采集',
    checked: '最近核对',
    stale: '这条报价已超过 48 小时，出发前请向店家确认汇率。',
    empty: '目前没有可用的采集报价，因此不显示数字。',
  },
} as const;

function num(value: number | null) {
  return value === null ? null : new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value);
}

export function ProfileRateTable({ table, locale, heading, slug }: { table: RateTable; locale: RateLocale; heading: string; slug?: string }) {
  const c = copy[locale];
  const latest = table.latestObservedAt;
  const latestStamp = formatBangkokStamp(latest, locale);
  const checkedStamp = formatBangkokStamp(table.checkedAt, locale);
  const kind = table.rows.find((row) => row.observedAt === latest)?.timestampKind;
  const stale = latest ? Date.now() - Date.parse(latest) > 48 * 3600_000 : false;
  const tz = locale === 'th' ? ` ${c.tz}` : locale === 'zh' ? c.tz : ` ${c.tz}`;

  return (
    <section id="rate-table" className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151a18]" aria-labelledby="rate-table-heading">
      <div className="p-5 sm:p-6">
        <h2 id="rate-table-heading" className="text-xl font-semibold text-white">{heading}</h2>
        {latestStamp ? (
          <p className="mt-2 text-sm text-stone-300">
            {c.asOf} <time dateTime={latest ?? undefined} data-rate-observed={latest ?? ''} className="font-semibold text-white">{latestStamp}{tz}</time>
            {kind === 'published' ? ` · ${c.published}` : kind ? ` · ${c.collected}` : ''}
            {checkedStamp ? <span className="text-stone-500"> · {c.checked} <time dateTime={table.checkedAt ?? undefined}>{checkedStamp}{tz}</time></span> : null}
          </p>
        ) : <p className="mt-2 text-sm text-stone-400">{c.empty}</p>}
        {stale ? <p className="mt-2 text-sm text-amber-300">{c.stale}</p> : null}
      </div>
      <div className="overflow-x-auto border-t border-white/10">
        <table className="w-full border-collapse text-left text-sm" data-rate-table={slug ?? 'ratchada'}>
          <thead>
            <tr className="text-xs uppercase tracking-[0.08em] text-stone-500">
              <th scope="col" className="px-4 py-2 font-medium sm:px-6">{c.currency}</th>
              <th scope="col" className="px-2 py-2 font-medium">{c.note}</th>
              <th scope="col" className="px-2 py-2 text-right font-medium">{c.buy}</th>
              <th scope="col" className="px-4 py-2 text-right font-medium sm:px-6">{c.sell}</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => {
              const own = row.observedAt && row.observedAt !== latest ? formatBangkokStamp(row.observedAt, locale) : null;
              return (
                <tr
                  key={row.currency}
                  data-rate-row={row.currency}
                  data-buy={row.buyRate ?? ''}
                  data-sell={row.sellRate ?? ''}
                  data-observed={row.observedAt ?? ''}
                  className="border-t border-white/5 text-stone-200"
                >
                  <th scope="row" className="px-4 py-2 font-semibold text-white sm:px-6">
                    {row.currency}
                    <span className="block text-[11px] font-normal text-stone-500">{currencyNames[locale][row.currency]}</span>
                    {own ? <span className="block text-[11px] font-normal text-amber-300">{own}{tz}</span> : null}
                  </th>
                  <td className="px-2 py-2 text-xs text-stone-400">{row.denomination ?? '–'}</td>
                  <td className="px-2 py-2 text-right font-semibold tabular-nums text-white">{num(row.buyRate) ?? c.none}</td>
                  <td className="px-4 py-2 text-right tabular-nums sm:px-6">{num(row.sellRate) ?? c.none}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-white/10 px-5 py-4 text-xs leading-5 text-stone-500 sm:px-6">{c.legend}</p>
    </section>
  );
}
