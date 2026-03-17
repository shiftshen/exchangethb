import { NextRequest, NextResponse } from 'next/server';
import { isIndexableLocale, isLocale, resolveContentLocale } from '@/lib/i18n';

function resolveLocale(pathname: string) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment && isLocale(firstSegment) ? resolveContentLocale(firstSegment) : 'en';
}

export function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  const segments = nextUrl.pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isLocale(firstSegment) && !isIndexableLocale(firstSegment)) {
    segments[0] = resolveContentLocale(firstSegment);
    nextUrl.pathname = `/${segments.join('/')}`;
    return NextResponse.redirect(nextUrl, 308);
  }

  const locale = resolveLocale(nextUrl.pathname);
  const response = NextResponse.next();
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|google27d67ef3554303ff.html).*)',
  ],
};
