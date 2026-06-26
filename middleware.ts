import { NextRequest, NextResponse } from 'next/server';

import { getSiteAccessRedirectUrl } from './src/utils/routing/siteAccessGate';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function middleware(req: NextRequest) {
  const siteAccessRedirectUrl = getSiteAccessRedirectUrl(
    req.nextUrl,
    process.env,
    req.headers,
  );

  if (siteAccessRedirectUrl) {
    return NextResponse.redirect(siteAccessRedirectUrl);
  }

  if (!basePath) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith(basePath)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `${basePath}${pathname}`;
  return NextResponse.rewrite(url);
}
