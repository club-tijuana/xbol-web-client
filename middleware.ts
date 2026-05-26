import { NextRequest, NextResponse } from 'next/server';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function middleware(req: NextRequest) {
  if (!basePath) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith(basePath)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `${basePath}${pathname}`;
  return NextResponse.rewrite(url);
}
