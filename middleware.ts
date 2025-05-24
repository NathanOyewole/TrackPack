import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');
    const isStatic = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/favicon.ico') || request.nextUrl.pathname.startsWith('/public');

    if (!isLoggedIn && !isAuthPage && !isStatic) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico|public).*)'],
}; 
