import { expect, it } from 'vitest';
import { fiatWithdrawalFee } from '@/lib/fiat-withdrawal-fee';
it('uses Binance TH withdrawal tiers at the exact boundary',()=>{
 expect(fiatWithdrawalFee('binance-th',2_000_000,20)).toEqual({min:20,max:20});
 expect(fiatWithdrawalFee('binance-th',2_000_000.01,20)).toEqual({min:100,max:100});
});
it('keeps Bitkub bank uncertainty instead of assuming a 20 baht fee',()=>{
 expect(fiatWithdrawalFee('bitkub',100_000,20)).toEqual({min:20,max:20});
 expect(fiatWithdrawalFee('bitkub',100_000.01,20)).toEqual({min:20,max:75});
 expect(fiatWithdrawalFee('bitkub',500_000.01,20)).toEqual({min:20,max:200});
});
