import { NextRequest, NextResponse } from 'next/server';
import { isLegacyLocale, isLocale, resolveContentLocale } from '@/lib/i18n';

const localizedPublicPrefixes = new Set([
  'crypto',
  'cash',
  'exchanges',
  'money-changers',
  'routes',
  'legal',
]);

const routeRedirects: Record<string, { target: 'cash' | 'crypto'; params?: Record<string, string> }> = {
  'eth-to-thb': { target: 'crypto', params: { symbol: 'ETH', side: 'sell' } },
  'xrp-to-thb': { target: 'crypto', params: { symbol: 'XRP', side: 'sell' } },
  'doge-to-thb': { target: 'crypto', params: { symbol: 'DOGE', side: 'sell' } },
  'sol-to-thb': { target: 'crypto', params: { symbol: 'SOL', side: 'sell' } },
  'eur-cash-to-thb': { target: 'cash', params: { currency: 'EUR' } },
  'jpy-cash-to-thb': { target: 'cash', params: { currency: 'JPY' } },
  'cny-cash-to-thb': { target: 'cash', params: { currency: 'CNY' } },
  'gbp-cash-to-thb': { target: 'cash', params: { currency: 'GBP' } },
  'us-to-thailand-money-exchange': { target: 'cash', params: { currency: 'USD' } },
  'uk-to-thailand-money-exchange': { target: 'cash', params: { currency: 'GBP' } },
  'japan-to-thailand-money-exchange': { target: 'cash', params: { currency: 'JPY' } },
  'korea-to-thailand-money-exchange': { target: 'cash' },
  'germany-to-thailand-money-exchange': { target: 'cash', params: { currency: 'EUR' } },
  'europe-to-thailand-money-exchange': { target: 'cash', params: { currency: 'EUR' } },
  'pratunam-money-exchange-guide': { target: 'cash' },
  'central-bangkok-money-exchange-guide': { target: 'cash' },
  'bangkok-money-changer-near-me-guide': { target: 'cash' },
  'suvarnabhumi-money-exchange-guide': { target: 'cash' },
  'don-mueang-money-exchange-guide': { target: 'cash' },
  'nana-money-exchange-guide': { target: 'cash' },
  'asok-money-exchange-guide': { target: 'cash' },
  'silom-money-exchange-guide': { target: 'cash' },
  'sukhumvit-money-exchange-guide': { target: 'cash' },
};

function normalizeLocaleCode(value: string) {
  const lower = value.toLowerCase();
  if (lower.startsWith('th')) return 'th';
  if (lower.startsWith('zh') || lower.startsWith('cn')) return 'zh';
  if (lower.startsWith('en')) return 'en';
  if (isLegacyLocale(lower)) return resolveContentLocale(lower);
  return 'en';
}

function isKnownLocaleCode(value: string) {
  const lower = value.toLowerCase();
  return ['th', 'en', 'zh', 'ja', 'ko', 'de'].includes(lower);
}

function resolveLocale(pathname: string) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (!firstSegment) return 'en';
  if (isLocale(firstSegment)) return firstSegment;
  if (isLegacyLocale(firstSegment)) return resolveContentLocale(firstSegment);
  return 'en';
}

export function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  const segments = nextUrl.pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const queryLocale = normalizeLocaleCode(nextUrl.searchParams.get('lang') || 'en');

  if (firstSegment === 'change-lang' && segments[1]) {
    nextUrl.pathname = `/${normalizeLocaleCode(segments[1])}`;
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if ((firstSegment === 'crypto.php' || firstSegment === 'cash.php') && segments.length === 1) {
    nextUrl.pathname = `/${queryLocale}/${firstSegment === 'crypto.php' ? 'crypto' : 'cash'}`;
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment === 'index.php' && segments.length === 1) {
    nextUrl.pathname = '/en';
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment === 'index.php' && segments[1] === 'get' && segments[2] === 'rate') {
    nextUrl.pathname = `/${queryLocale}/cash`;
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment && segments[1] === 'index.php' && segments.length === 2 && isKnownLocaleCode(firstSegment)) {
    nextUrl.pathname = `/${normalizeLocaleCode(firstSegment)}`;
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment === 'password' && segments[1] === 'reset') {
    nextUrl.pathname = '/admin/login';
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment && isLocale(firstSegment) && segments[1] === 'password' && segments[2] === 'reset') {
    nextUrl.pathname = '/admin/login';
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment && isLegacyLocale(firstSegment)) {
    segments[0] = resolveContentLocale(firstSegment);
    nextUrl.pathname = `/${segments.join('/')}`;
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment && isLocale(firstSegment) && segments[1] === 'routes' && segments[2]) {
    const redirect = routeRedirects[segments[2]];
    if (redirect) {
      nextUrl.pathname = `/${firstSegment}/${redirect.target}`;
      nextUrl.search = '';
      for (const [key, value] of Object.entries(redirect.params || {})) {
        nextUrl.searchParams.set(key, value);
      }
      return NextResponse.redirect(nextUrl, 301);
    }
  }

  if (firstSegment && !isLocale(firstSegment) && !isLegacyLocale(firstSegment) && localizedPublicPrefixes.has(firstSegment)) {
    nextUrl.pathname = `/en${nextUrl.pathname}`;
    return NextResponse.redirect(nextUrl, 308);
  }

  const locale = resolveLocale(nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-resolved-locale', locale);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: [
    '/crypto.php',
    '/cash.php',
    '/index.php',
    '/index.php/:path*',
    '/:locale/index.php',
    '/password/:path*',
    '/:locale/password/:path*',
    '/change-lang/:path*',
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
};
