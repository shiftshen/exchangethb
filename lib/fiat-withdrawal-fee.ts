// Standard published fees; bank-specific Bitkub fees remain a range until
// the destination bank is selected. Amount is the withdrawal before its fee.
export function fiatWithdrawalFee(slug: string, amount: number, configured: number) {
  if (slug === 'binance-th') {
    const fee = amount > 2_000_000 ? 100 : 20;
    return { min: fee, max: fee };
  }
  if (slug === 'bitkub') {
    const max = amount > 500_000 ? 200 : amount > 100_000 ? 75 : 20;
    return { min: 20, max };
  }
  return { min: configured, max: configured };
}
