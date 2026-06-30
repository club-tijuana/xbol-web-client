import { NextRequest, NextResponse } from 'next/server';

import {
  getSiteAccessDiagnosticHeaders,
  getSiteAccessRedirectUrl,
} from './src/utils/routing/siteAccessGate';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function middleware(req: NextRequest) {
  const siteAccessRedirectUrl = getSiteAccessRedirectUrl(
    req.nextUrl,
    process.env,
    req.headers,
  );

  if (siteAccessRedirectUrl) {
    const response = NextResponse.redirect(siteAccessRedirectUrl);
    const diagnosticHeaders = getSiteAccessDiagnosticHeaders(
      process.env,
      req.headers,
    );

    for (const [name, value] of Object.entries(diagnosticHeaders)) {
      response.headers.set(name, value);
    }

    return response;
  }

  if (!basePath) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith(basePath)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `${basePath}${pathname}`;
  return NextResponse.rewrite(url);
}
