import { NextRequest, NextResponse } from 'next/server';
import { isLocale } from '@/lib/i18n';

function resolveLocale(pathname: string) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment && isLocale(firstSegment) ? firstSegment : 'en';
}

export function middleware(request: NextRequest) {
  const locale = resolveLocale(request.nextUrl.pathname);
  const response = NextResponse.next();
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|google27d67ef3554303ff.html).*)',
  ],
};
