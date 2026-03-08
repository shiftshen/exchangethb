import Link from 'next/link';
import { compareCashLive } from '@/lib/cash-live';
import { CurrencyCode, Locale } from '@/lib/types';
import { Pill, Section } from '@/components/ui';

const currencies: CurrencyCode[] = ['USD', 'CNY', 'EUR', 'JPY', 'GBP'];

export default async function CashPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const { locale } = await params;
  const query = await searchParams;
  const currency = (query.currency as CurrencyCode) || 'USD';
  const amount = Number(query.amount || 1000);
  const results = await compareCashLive({ currency, amount, maxDistanceKm: Number(query.maxDistanceKm || 10) });

  return (
    <div className="space-y-12">
      <Section title="Cash / FX to THB" description="Compare Bangkok money changers by rate, distance, denomination, and branch availability.">
        <div className="card grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form className="grid gap-4">
            <div>
              <label className="text-sm text-stone-500">Currency</label>
              <select name="currency" defaultValue={currency} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3">
                {currencies.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-stone-500">Amount</label>
              <input type="number" name="amount" defaultValue={amount} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3" />
            </div>
            <div>
              <label className="text-sm text-stone-500">Max distance (km)</label>
              <input type="number" name="maxDistanceKm" defaultValue={10} className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3" />
            </div>
            <button className="rounded-full bg-brand-700 px-5 py-3 font-medium text-white">Compare cash routes</button>
          </form>
          <div className="grid gap-4">
            {results.bestRate ? <div className="card border-brand-100 bg-brand-50/60 p-6"><Pill>Best Rate</Pill><h2 className="mt-4 text-3xl font-semibold">{results.bestRate.provider}</h2><p className="mt-2 text-stone-600">{results.bestRate.branchName} · {results.bestRate.area}</p><p className="mt-2 text-sm text-stone-500">Denomination {results.bestRate.denomination}</p><p className="mt-4 text-2xl font-semibold">≈ {results.bestRate.estimatedThb.toLocaleString()} THB</p></div> : null}
            {results.nearestGood ? <div className="card p-6"><Pill>Nearest Good Option</Pill><h3 className="mt-4 text-2xl font-semibold">{results.nearestGood.provider}</h3><p className="mt-2 text-stone-600">{results.nearestGood.distanceKm} km · {results.nearestGood.hours}</p><p className="mt-2 text-sm text-stone-500">Source: {results.source}</p></div> : null}
          </div>
        </div>
      </Section>

      <Section title="Branch table" description={`Rates are estimated from official public pages and reviewed before publishing.${results.cacheGeneratedAt ? ` Cache updated ${new Date(results.cacheGeneratedAt).toLocaleString()}.` : ''}`}>
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>{['Provider', 'Branch', 'Denomination', 'Buy rate', 'Estimated THB', 'Distance', 'Action'].map((head) => <th key={head} className="px-5 py-4 font-medium">{head}</th>)}</tr>
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
                  <td className="px-5 py-4"><Link href={`/${locale}/money-changers/${row.providerSlug}`} className="font-medium text-brand-700">View detail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
