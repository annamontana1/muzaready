import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling 301 redirects from old product URLs (with length) to new URLs (without length)
 * 
 * Old format: /produkt/nebarvene-standard-odstin-1-45cm
 * New format: /produkt/nebarvene-standard-odstin-1?len=45
 * 
 * Platinum Edition keeps length in URL (no redirect needed)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process /produkt/* paths
  if (pathname.startsWith('/produkt/')) {
    // Pattern: /produkt/{category}-{tier}-odstin-{shade}-{length}cm
    // Examples:
    // - /produkt/nebarvene-standard-odstin-1-45cm
    // - /produkt/nebarvene-luxe-odstin-2-60cm
    // - /produkt/barvene-luxe-odstin-6-65cm
    
    // Match Standard or LUXE products with length suffix
    const standardLuxePattern = /^\/produkt\/(nebarvene|barvene)-(standard|luxe)-odstin-(\d+)-(\d+)cm$/;
    const match = pathname.match(standardLuxePattern);

    if (match) {
      const [, category, tier, shade, length] = match;
      
      // Build new URL without length in slug, but with length as query param
      const newSlug = `${category}-${tier}-odstin-${shade}`;
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/produkt/${newSlug}`;
      newUrl.searchParams.set('len', length);

      // 301 Permanent Redirect
      return NextResponse.redirect(newUrl, { status: 301 });
    }

    // Platinum Edition URLs remain unchanged (they keep length in slug)
    // e.g., /produkt/nebarvene-platinum-edition-odstin-1-60cm
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/produkt/:path*',
  ],
};
