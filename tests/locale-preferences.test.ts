import { describe, expect, it } from 'vitest';
import { defaultCashCurrency, languageSwitchParams, languageOptions } from '@/lib/locale-preferences';

describe('language selection and comparison continuity', () => {
 it('uses supported native cash currency or USD', () => {
  expect(defaultCashCurrency('ko')).toBe('KRW');
  expect(defaultCashCurrency('fr')).toBe('EUR');
  expect(defaultCashCurrency('de')).toBe('EUR');
  expect(defaultCashCurrency('zh')).toBe('CNY');
  expect(defaultCashCurrency('ja')).toBe('JPY');
  for (const locale of ['ru','id','vi','th'] as const) expect(defaultCashCurrency(locale)).toBe('USD');
 });
 it('switches cash currency while preserving amount and direction and clearing denomination and location', () => {
  const params=languageSwitchParams('ko','/cash','currency=JPY&amount=5000&side=buy&banknote=10000&userLat=13&userLng=100&utm_source=test');
  expect(params.get('currency')).toBe('KRW');
  expect(params.get('amount')).toBe('5000');
  expect(params.get('side')).toBe('buy');
  expect(params.get('utm_source')).toBe('test');
  expect(params.has('banknote')).toBe(false);
  expect(params.has('userLat')).toBe(false);
  expect(params.has('userLng')).toBe(false);
 });
 it('preserves selected crypto asset, amount and buy direction on both comparison routes', () => {
  for (const suffix of ['/crypto','']) {
   const params=languageSwitchParams('ja',suffix,'mode=crypto&symbol=SOL&amount=2.5&side=buy&userLat=13');
   expect(params.get('symbol')).toBe('SOL');
   expect(params.get('amount')).toBe('2.5');
   expect(params.get('side')).toBe('buy');
   expect(params.has('currency')).toBe(false);
   expect(params.has('userLat')).toBe(false);
  }
 });
 it('uses cash preference for the home cash selector without changing informational routes', () => {
  expect(languageSwitchParams('fr','','mode=cash&currency=USD').get('currency')).toBe('EUR');
  expect(languageSwitchParams('fr','/legal/disclaimer','').toString()).toBe('');
 });
 it('places the host language after descending official visitor totals', () => {
  expect(languageOptions.at(-1)?.locale).toBe('th');
  const counts=languageOptions.slice(0,-1).map(option=>option.arrivals as number);
  expect(counts).toEqual([...counts].sort((a,b)=>b-a));
 });
});
