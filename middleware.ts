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
    const targetLocale = normalizeLocaleCode(segments[1]);
    nextUrl.pathname = targetLocale === 'en' ? '/' : `/${targetLocale}`;
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment === 'crypto.php' && segments.length === 1) {
    nextUrl.pathname = queryLocale === 'en' ? '/en/crypto' : `/${queryLocale}/crypto`;
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment === 'cash.php' && segments.length === 1) {
    nextUrl.pathname = queryLocale === 'en' ? '/en/cash' : `/${queryLocale}/cash`;
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment === 'index.php' && segments.length === 1) {
    nextUrl.pathname = '/';
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment === 'index.php' && segments[1] === 'get' && segments[2] === 'rate') {
    nextUrl.pathname = queryLocale === 'en' ? '/en/cash' : `/${queryLocale}/cash`;
    nextUrl.search = '';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment && segments[1] === 'index.php' && segments.length === 2 && isKnownLocaleCode(firstSegment)) {
    const targetLocale = normalizeLocaleCode(firstSegment);
    nextUrl.pathname = targetLocale === 'en' ? '/' : `/${targetLocale}`;
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

  if (firstSegment === 'en' && segments.length === 1) {
    nextUrl.pathname = '/';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment && isLegacyLocale(firstSegment)) {
    segments[0] = resolveContentLocale(firstSegment);
    nextUrl.pathname = segments.length === 1 && segments[0] === 'en' ? '/' : `/${segments.join('/')}`;
    return NextResponse.redirect(nextUrl, 308);
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
