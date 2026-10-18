import { cashCurrencies, type ContentLocale, type CurrencyCode } from '@/lib/types';

// 2025 full-year arrivals by nationality, not a count of language speakers.
// English uses the UK as its representative market; Thai is the host language.
export const languageOptions: { locale: ContentLocale; label: string; arrivals: number | null }[] = [
  {locale:'zh',label:'中文',arrivals:4473992},
  {locale:'ru',label:'Русский',arrivals:1898837},
  {locale:'ko',label:'한국어',arrivals:1555227},
  {locale:'ja',label:'日本語',arrivals:1091227},
  {locale:'en',label:'English',arrivals:1083162},
  {locale:'de',label:'Deutsch',arrivals:965898},
  {locale:'fr',label:'Français',arrivals:816935},
  {locale:'id',label:'Bahasa Indonesia',arrivals:787524},
  {locale:'vi',label:'Tiếng Việt',arrivals:660386},
  {locale:'th',label:'ไทย',arrivals:null},
];
export const tourismOrderSources = [
 'https://www.nso.go.th/public/e-book/Bulletin-of-Statistics/bulletin-4-68/23/',
 'https://www.nso.go.th/public/e-book/Bulletin-of-Statistics/bulletin-4-68/149/',
 'https://thailand.prd.go.th/en/content/category/detail/id/2078/iid/466167',
];
const nativeCurrencies: Record<ContentLocale,string> = {zh:'CNY',ja:'JPY',ko:'KRW',fr:'EUR',de:'EUR',ru:'RUB',id:'IDR',vi:'VND',en:'USD',th:'THB'};
export function defaultCashCurrency(locale: ContentLocale): CurrencyCode {
 const currency = nativeCurrencies[locale];
 return cashCurrencies.includes(currency as CurrencyCode) ? currency as CurrencyCode : 'USD';
}
export function languageSwitchParams(locale: ContentLocale, suffix: string, query: string): URLSearchParams {
 const params = new URLSearchParams(query);
 params.delete('userLat'); params.delete('userLng');
 const crypto = suffix === '/crypto' || ((suffix === '' || suffix === '/') && params.get('mode') === 'crypto');
 const cash = suffix === '/cash' || ((suffix === '' || suffix === '/') && !crypto);
 if (cash) { params.set('currency',defaultCashCurrency(locale)); params.delete('banknote'); params.delete('symbol'); }
 return params;
}
