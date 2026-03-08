import Link from 'next/link';
import { compareCrypto } from '@/lib/compare';
import { CryptoSymbol, Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

const symbols: CryptoSymbol[] = ['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL'];

export default async function CryptoPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const { locale } = await params;
  const query = await searchParams;
  const symbol = (query.symbol as CryptoSymbol) || 'BTC';
  const amount = Number(query.amount || 1);
  const side = query.side === 'sell' ? 'sell' : 'buy';
  const results = await compareCrypto({ symbol, amount, side, quoteMode: 'coin', includeWithdrawal: true, withdrawThb: side === 'sell' });
  const best = results[0];

  return (
    <div className="space-y-12">
      <Section title="Crypto to THB" description="Depth-aware comparison with estimated receive, fees, and compliance context.">
        <div className="card grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form className="grid gap-4">
            <div>
              <label className="text-sm text-stone-500">Symbol</label>
              <select name="symbol" defaultValue={symbol} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3">
                {symbols.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-stone-500">Side</label>
              <select name="side" defaultValue={side} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3">
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-stone-500">Amount ({symbol})</label>
              <input type="number" name="amount" defaultValue={amount} step="0.01" className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3" />
            </div>
            <button className="rounded-full bg-brand-700 px-5 py-3 font-medium text-white">Compare estimated outcomes</button>
          </form>
          {best ? (
            <div className="card border-brand-100 bg-brand-50/60 p-6">
              <Pill>Best current option</Pill>
              <h2 className="mt-4 text-3xl font-semibold">{best.exchange}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><p className="text-sm text-stone-500">Estimated receive</p><p className="mt-1 text-2xl font-semibold">{best.estimatedReceive.toFixed(6)} {side === 'buy' ? symbol : 'THB'}</p></div>
                <div><p className="text-sm text-stone-500">Estimated total cost</p><p className="mt-1 text-2xl font-semibold">{best.estimatedTotalCost.toLocaleString()}</p></div>
                <div><p className="text-sm text-stone-500">Average price</p><p className="mt-1 text-lg font-semibold">{best.averagePrice.toLocaleString()}</p></div>
                <div><p className="text-sm text-stone-500">Source</p><p className="mt-1 text-lg font-semibold">{best.source}</p></div>
              </div>
            </div>
          ) : <div className="card p-6 text-stone-600">No comparison data available for this symbol yet.</div>}
        </div>
      </Section>

      <Section title="Comparison table" description="Every result is labeled as estimated and linked to the official platform page.">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                {['Platform', 'Estimated receive', 'Fees', 'Liquidity gap', 'Updated', 'Action'].map((head) => <th key={head} className="px-5 py-4 font-medium">{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.slug} className="border-t border-stone-100">
                  <td className="px-5 py-4"><div className="font-semibold">{row.exchange}</div><div className="text-xs text-stone-500">{row.license}</div></td>
                  <td className="px-5 py-4">{row.estimatedReceive.toFixed(6)} {side === 'buy' ? symbol : 'THB'}</td>
                  <td className="px-5 py-4">Trade {row.tradingFee.toFixed(2)} / Network {row.networkFee}</td>
                  <td className="px-5 py-4">{row.liquidityGap.toFixed(6)}</td>
                  <td className="px-5 py-4">{new Date(row.updatedAt).toLocaleString()}</td>
                  <td className="px-5 py-4"><Link href={`/${locale}/exchanges/${row.slug}`} className="font-medium text-brand-700">View detail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
