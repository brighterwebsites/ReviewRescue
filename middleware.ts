import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get the base domain from env or default to localhost
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000';

  // Check if this is a subdomain request
  // For production: johns-cafe.brighterwebsites.com.au
  // For development: johns-cafe.localhost:3000 (requires /etc/hosts configuration)
  const isSubdomain = hostname !== baseDomain && hostname.endsWith(baseDomain);

  if (isSubdomain) {
    // Extract subdomain (everything before the base domain)
    const subdomain = hostname.replace(`.${baseDomain}`, '');

    // Skip certain subdomains
    if (subdomain === 'www' || subdomain === 'review') {
      return NextResponse.next();
    }

    // Rewrite subdomain to /review/[slug] path
    // johns-cafe.brighterwebsites.com.au → /review/johns-cafe
    url.pathname = `/review/${subdomain}${url.pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
