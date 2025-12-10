// Edge middleware to enforce a single shared password (no username needed).
// Set PROTECT_PASSWORD in your Vercel project settings.
import { NextResponse } from 'next/server';

export const config = {
  matcher: '/:path*',
};

export function middleware(request) {
  try {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;
    const hasAuthCookie = request.cookies.get('al_guard')?.value === 'ok';

    // Allow framework/static assets and auth endpoints to pass
    const publicPrefixes = [
      '/_next',          // Next static assets
      '/api/login',
      '/api/logout',
      '/login',
      '/_vercel',        // Vercel internals
      '/favicon.ico',
      '/robots.txt',
      '/manifest.json',
      '/fonts',
      '/images',
      '/public',
      '/static',
    ];

    const isPublic = publicPrefixes.some(path =>
      pathname === path ||
      pathname.startsWith(`${path}/`) ||
      pathname.startsWith(`${path}.`)
    );

    if (hasAuthCookie || isPublic) {
      return NextResponse.next();
    }

    // Redirect unauthenticated requests to the login page
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  } catch (err) {
    return new NextResponse('Internal middleware error', {
      status: 500,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
}
