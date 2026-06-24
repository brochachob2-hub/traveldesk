import { NextRequest, NextResponse } from 'next/server';

const reservedSubdomains = new Set(['www', 'app', 'admin']);

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.toLowerCase();
  if (!host || !rootDomain || host === rootDomain || !host.endsWith(`.${rootDomain}`)) {
    return NextResponse.next();
  }

  const subdomain = host.slice(0, -1 * (`.${rootDomain}`).length);
  if (!subdomain || reservedSubdomains.has(subdomain)) return NextResponse.next();

  const url = request.nextUrl.clone();
  if (url.pathname === '/') url.pathname = `/${subdomain}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|icon.svg|manifest.webmanifest|sw.js).*)'],
};
