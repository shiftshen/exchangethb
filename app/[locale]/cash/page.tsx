import Link from 'next/link';
import type { Metadata } from 'next';
import { TrackButton } from '@/components/track-button';
import { TrackLink } from '@/components/track-link';
import { compareCashLive } from '@/lib/cash-live';
import { CurrencyCode, Locale } from '@/lib/types';
import { localeAlternates, withLocalePath } from '@/lib/seo';
import { Pill, Section } from '@/components/ui';

const currencies: CurrencyCode[] = ['USD', 'CNY', 'EUR', 'JPY', 'GBP'];

const copy = {
  th: {
    title: 'เงินสด/ฟอเร็กซ์เป็นบาท',
    description: 'เปรียบเทียบร้านแลกเงินในกรุงเทพจากเรต ระยะทาง สภาพสาขา และเงื่อนไขธนบัตร',
    currency: 'สกุลเงิน',
    amount: 'จำนวนเงิน',
    distance: 'ระยะทางสูงสุด (กม.)',
    submit: 'เปรียบเทียบเส้นทางเงินสด',
    bestRate: 'เรตดีที่สุด',
    nearest: 'ตัวเลือกใกล้และยอมรับได้',
    denomination: 'ชนิดธนบัตร',
    source: 'แหล่งข้อมูล',
    table: 'ตารางสาขา',
    tableDescription: 'เรตทั้งหมดเป็นค่าประมาณจากหน้า official และผ่านการตรวจทานก่อนแสดงผล',
    provider: 'แบรนด์',
    branch: 'สาขา',
    buyRate: 'เรตรับซื้อ',
    estimated: 'ประมาณการ THB',
    action: 'การดำเนินการ',
    detail: 'ดูรายละเอียด',
  },
  en: {
    title: 'Cash / FX to THB',
    description: 'Compare Bangkok money changers by rate, distance, denomination, and branch availability.',
    currency: 'Currency',
    amount: 'Amount',
    distance: 'Max distance (km)',
    submit: 'Compare cash routes',
    bestRate: 'Best Rate',
    nearest: 'Nearest Good Option',
    denomination: 'Denomination',
    source: 'Source',
    table: 'Branch table',
    tableDescription: 'Rates are estimated from official public pages and reviewed before publishing.',
    provider: 'Provider',
    branch: 'Branch',
    buyRate: 'Buy rate',
    estimated: 'Estimated THB',
    action: 'Action',
    detail: 'View detail',
  },
  zh: {
    title: '现金 / 外汇换泰铢',
    description: '按汇率、距离、面额条件与门店状态比较曼谷换汇渠道。',
    currency: '币种',
    amount: '金额',
    distance: '最大距离（公里）',
    submit: '比较现金路线',
    bestRate: '最佳汇率',
    nearest: '最近可接受选项',
    denomination: '面额',
    source: '来源',
    table: '门店列表',
    tableDescription: '汇率为基于官方公开页面的估算值，并在发布前经过审核。',
    provider: '品牌',
    branch: '门店',
    buyRate: '买入价',
    estimated: '预计 THB',
    action: '操作',
    detail: '查看详情',
  },
} as const;

export default async function CashPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const { locale } = await params;
  const query = await searchParams;
  const currency = (query.currency as CurrencyCode) || 'USD';
  const amount = Number(query.amount || 1000);
  const results = await compareCashLive({ currency, amount, maxDistanceKm: Number(query.maxDistanceKm || 10) });
  const c = copy[locale];

  return (
    <div className="space-y-12">
      <Section title={c.title} description={c.description}>
        <div className="card grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form className="grid gap-4">
            <div>
              <label className="text-sm text-stone-500">{c.currency}</label>
              <select name="currency" defaultValue={currency} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3">
                {currencies.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-stone-500">{c.amount}</label>
              <input type="number" name="amount" defaultValue={amount} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3" />
            </div>
            <div>
              <label className="text-sm text-stone-500">{c.distance}</label>
              <input type="number" name="maxDistanceKm" defaultValue={10} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3" />
            </div>
            <TrackButton type="submit" eventName="cash_compare_submit" eventParams={{ currency, amount }} className="rounded-full bg-brand-700 px-5 py-3 font-medium text-white">{c.submit}</TrackButton>
          </form>
          <div className="grid gap-4">
            {results.bestRate ? <div className="card border-brand-100 bg-brand-50/60 p-6"><Pill>{c.bestRate}</Pill><h2 className="mt-4 text-3xl font-semibold">{results.bestRate.provider}</h2><p className="mt-2 text-stone-600">{results.bestRate.branchName} · {results.bestRate.area}</p><p className="mt-2 text-sm text-stone-500">{c.denomination} {results.bestRate.denomination}</p><p className="mt-4 text-2xl font-semibold">≈ {results.bestRate.estimatedThb.toLocaleString()} THB</p></div> : null}
            {results.nearestGood ? <div className="card p-6"><Pill>{c.nearest}</Pill><h3 className="mt-4 text-2xl font-semibold">{results.nearestGood.provider}</h3><p className="mt-2 text-stone-600">{results.nearestGood.distanceKm} km · {results.nearestGood.hours}</p><p className="mt-2 text-sm text-stone-500">{c.source}: {results.source}</p></div> : null}
          </div>
        </div>
      </Section>

      <Section title={c.table} description={`${c.tableDescription}${results.cacheGeneratedAt ? ` Cache updated ${new Date(results.cacheGeneratedAt).toLocaleString()}.` : ''}`}>
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>{[c.provider, c.branch, c.denomination, c.buyRate, c.estimated, c.distance, c.action].map((head) => <th key={head} className="px-5 py-4 font-medium">{head}</th>)}</tr>
            </thead>
            <tbody>
              {results.all.map((row) => (
                <tr key={`${row.providerSlug}-${row.branchName}-${row.denomination}`} className="border-t border-stone-100">
                  <td className="px-5 py-4 font-semibold">{row.provider}</td>
                  <td className="px-5 py-4">{row.branchName}</td>
                  <td className="px-5 py-4">{row.denomination}</td>
                  <td className="px-5 py-4">{row.buyRate}</td>
                  <td className="px-5 py-4">{row.estimatedThb.toLocaleString()}</td>
                  <td className="px-5 py-4">{row.distanceKm} km</td>
                  <td className="px-5 py-4"><TrackLink href={`/${locale}/money-changers/${row.providerSlug}`} eventName="cash_result_click" eventParams={{ provider: row.providerSlug }} className="font-medium text-brand-700">{c.detail}</TrackLink></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'th' ? 'เปรียบเทียบเงินสด/ฟอเร็กซ์เป็นบาท' : locale === 'zh' ? '现金外汇换泰铢比较' : 'Cash / FX to THB Comparison';
  const description = copy[locale].description;
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale, '/cash'),
      languages: localeAlternates('/cash'),
    },
    openGraph: {
      title,
      description,
      url: withLocalePath(locale, '/cash'),
    },
  };
}
