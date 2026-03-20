import { NextRequest, NextResponse } from 'next/server';
import { isLegacyLocale, isLocale, resolveContentLocale } from '@/lib/i18n';

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

  if (firstSegment === 'en' && segments.length === 1) {
    nextUrl.pathname = '/';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (firstSegment && isLegacyLocale(firstSegment)) {
    segments[0] = resolveContentLocale(firstSegment);
    nextUrl.pathname = segments.length === 1 && segments[0] === 'en' ? '/' : `/${segments.join('/')}`;
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
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|google27d67ef3554303ff.html).*)',
  ],
};
