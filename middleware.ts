/* eslint-disable @typescript-eslint/no-explicit-any */
// middleware.ts

import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';
import NextAuth from 'next-auth';
import { LOGIN, PUBLIC_ROUTES } from './lib/routes';

const { auth } = NextAuth(authConfig);

export async function middleware(request: any) {
  const { nextUrl: { pathname } } = request;
  let session;

  try {
    session = await auth(); 
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(new URL(LOGIN, request.url));
  }

  const isAuthenticated = !!session?.user;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  
  if (pathname === LOGIN && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next(); 
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN, request.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next(); 
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets/).*)'],
};
