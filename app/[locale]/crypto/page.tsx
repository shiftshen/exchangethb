import Link from 'next/link';
import type { Metadata } from 'next';
import { TrackButton } from '@/components/track-button';
import { TrackLink } from '@/components/track-link';
import { compareCrypto } from '@/lib/compare';
import { CryptoSymbol, Locale } from '@/lib/types';
import { localeAlternates, withLocalePath } from '@/lib/seo';
import { Pill, Section } from '@/components/ui';

const symbols: CryptoSymbol[] = ['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL'];

const copy = {
  th: {
    title: 'คริปโตเป็นบาท',
    description: 'เปรียบเทียบแบบดู depth พร้อมผลลัพธ์ประมาณการ ค่าธรรมเนียม และบริบทความน่าเชื่อถือ',
    symbol: 'เหรียญ',
    side: 'ทิศทาง',
    amount: 'จำนวน',
    compare: 'เปรียบเทียบผลลัพธ์โดยประมาณ',
    best: 'ตัวเลือกที่ดีที่สุดตอนนี้',
    liveOfficial: 'แหล่งข้อมูลทางการแบบสด',
    fallback: 'แหล่งข้อมูลสำรองที่ตรวจทานแล้ว',
    receive: 'ประมาณการที่ได้รับ',
    totalCost: 'ต้นทุนรวมโดยประมาณ',
    avgPrice: 'ราคาเฉลี่ย',
    freshness: 'ความสดของข้อมูล',
    source: 'ชั้นข้อมูล',
    updated: 'อัปเดตล่าสุด',
    fallbackReason: 'เหตุผลที่ใช้ fallback',
    noData: 'ยังไม่มีข้อมูลเพียงพอสำหรับคู่ที่เลือก',
    table: 'ตารางเปรียบเทียบ',
    tableDescription: 'ผลลัพธ์ทั้งหมดเป็นค่าประมาณและสามารถกดดูรายละเอียดแพลตฟอร์มได้',
    platform: 'แพลตฟอร์ม',
    fees: 'ค่าธรรมเนียม',
    fill: 'อัตราการ成交',
    gap: 'ช่องว่างสภาพคล่อง',
    action: 'การดำเนินการ',
    detail: 'ดูรายละเอียด',
    live: 'สด',
  },
  en: {
    title: 'Crypto to THB',
    description: 'Depth-aware comparison with estimated receive, fees, and compliance context.',
    symbol: 'Symbol',
    side: 'Side',
    amount: 'Amount',
    compare: 'Compare estimated outcomes',
    best: 'Best current option',
    liveOfficial: 'Live official source',
    fallback: 'Reviewed fallback source',
    receive: 'Estimated receive',
    totalCost: 'Estimated total cost',
    avgPrice: 'Average price',
    freshness: 'Freshness',
    source: 'Source',
    updated: 'Updated',
    fallbackReason: 'Fallback reason',
    noData: 'No comparison data available for this symbol yet.',
    table: 'Comparison table',
    tableDescription: 'Every result is labeled as estimated and linked to the official platform page.',
    platform: 'Platform',
    fees: 'Fees',
    fill: 'Fill ratio',
    gap: 'Liquidity gap',
    action: 'Action',
    detail: 'View detail',
    live: 'Live',
  },
  zh: {
    title: '加密换泰铢',
    description: '结合订单簿深度、费用与数据可靠性上下文进行估算比较。',
    symbol: '币种',
    side: '方向',
    amount: '数量',
    compare: '比较预计结果',
    best: '当前最优选项',
    liveOfficial: '官方实时来源',
    fallback: '审核后备用来源',
    receive: '预计到手',
    totalCost: '预计总成本',
    avgPrice: '平均价格',
    freshness: '新鲜度',
    source: '来源层',
    updated: '更新时间',
    fallbackReason: '回退原因',
    noData: '该币种暂时没有可用比较数据。',
    table: '比较表',
    tableDescription: '所有结果均标注为估算值，并可进入平台详情页。',
    platform: '平台',
    fees: '费用',
    fill: '成交率',
    gap: '流动性缺口',
    action: '操作',
    detail: '查看详情',
    live: '实时',
  },
} as const;

export default async function CryptoPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const { locale } = await params;
  const query = await searchParams;
  const symbol = (query.symbol as CryptoSymbol) || 'BTC';
  const amount = Number(query.amount || 1);
  const side = query.side === 'sell' ? 'sell' : 'buy';
  const results = await compareCrypto({ symbol, amount, side, quoteMode: 'coin', includeWithdrawal: true, withdrawThb: side === 'sell' });
  const best = results[0];
  const c = copy[locale];

  return (
    <div className="space-y-12">
      <Section title={c.title} description={c.description}>
        <div className="card grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form className="grid gap-4">
            <div>
              <label className="text-sm text-stone-500">{c.symbol}</label>
              <select name="symbol" defaultValue={symbol} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3">
                {symbols.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-stone-500">{c.side}</label>
              <select name="side" defaultValue={side} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3">
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-stone-500">{c.amount} ({symbol})</label>
              <input type="number" name="amount" defaultValue={amount} step="0.01" className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3" />
            </div>
            <TrackButton type="submit" eventName="crypto_compare_submit" eventParams={{ symbol, side }} className="rounded-full bg-brand-700 px-5 py-3 font-medium text-white">{c.compare}</TrackButton>
          </form>
          {best ? (
            <div className="card border-brand-100 bg-brand-50/60 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Pill>{c.best}</Pill>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${best.live ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {best.live ? c.liveOfficial : c.fallback}
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold">{best.exchange}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><p className="text-sm text-stone-500">{c.receive}</p><p className="mt-1 text-2xl font-semibold">{best.estimatedReceive.toFixed(6)} {side === 'buy' ? symbol : 'THB'}</p></div>
                <div><p className="text-sm text-stone-500">{c.totalCost}</p><p className="mt-1 text-2xl font-semibold">{best.estimatedTotalCost.toLocaleString()}</p></div>
                <div><p className="text-sm text-stone-500">{c.avgPrice}</p><p className="mt-1 text-lg font-semibold">{best.averagePrice.toLocaleString()}</p></div>
                <div><p className="text-sm text-stone-500">{c.fill}</p><p className="mt-1 text-lg font-semibold">{(best.fillRatio * 100).toFixed(2)}%</p></div>
                <div><p className="text-sm text-stone-500">{c.freshness}</p><p className="mt-1 text-lg font-semibold">{best.freshness}</p></div>
                <div><p className="text-sm text-stone-500">{c.source}</p><p className="mt-1 text-lg font-semibold">{best.source}</p></div>
                <div><p className="text-sm text-stone-500">{c.updated}</p><p className="mt-1 text-lg font-semibold">{new Date(best.updatedAt).toLocaleString()}</p></div>
                {best.fallbackReason ? <div className="sm:col-span-2"><p className="text-sm text-stone-500">{c.fallbackReason}</p><p className="mt-1 text-sm font-medium text-amber-800">{best.fallbackReason}</p></div> : null}
              </div>
            </div>
          ) : <div className="card p-6 text-stone-600">{c.noData}</div>}
        </div>
      </Section>

      <Section title={c.table} description={c.tableDescription}>
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                {[c.platform, c.receive, c.fees, c.fill, c.gap, c.freshness, c.updated, c.action].map((head) => <th key={head} className="px-5 py-4 font-medium">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.slug} className="border-t border-stone-100">
                  <td className="px-5 py-4">
                    <div className="font-semibold">{row.exchange}</div>
                    <div className="text-xs text-stone-500">{row.license}</div>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.live ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {row.live ? c.live : c.fallback}
                    </span>
                  </td>
                  <td className="px-5 py-4">{row.estimatedReceive.toFixed(6)} {side === 'buy' ? symbol : 'THB'}</td>
                  <td className="px-5 py-4">Trade {row.tradingFee.toFixed(2)} / Network {row.networkFee}</td>
                  <td className="px-5 py-4">{(row.fillRatio * 100).toFixed(2)}%</td>
                  <td className="px-5 py-4">{row.liquidityGap.toFixed(6)}</td>
                  <td className="px-5 py-4"><div>{row.freshness}</div>{row.fallbackReason ? <div className="mt-1 text-xs text-amber-700">{row.fallbackReason}</div> : null}</td>
                  <td className="px-5 py-4">{new Date(row.updatedAt).toLocaleString()}</td>
                  <td className="px-5 py-4"><TrackLink href={`/${locale}/exchanges/${row.slug}`} eventName="crypto_result_click" eventParams={{ exchange: row.slug }} className="font-medium text-brand-700">{c.detail}</TrackLink></td>
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
  const title = locale === 'th' ? 'เปรียบเทียบคริปโตเป็นบาท' : locale === 'zh' ? '加密换泰铢比较' : 'Crypto to THB Comparison';
  const description = copy[locale].description;
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale, '/crypto'),
      languages: localeAlternates('/crypto'),
    },
    openGraph: {
      title,
      description,
      url: withLocalePath(locale, '/crypto'),
    },
  };
}
