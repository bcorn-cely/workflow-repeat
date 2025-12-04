import { NextRequest, NextResponse } from 'next/server';
 
export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
 
export default async function proxy(request: NextRequest) {
  const url = request.nextUrl;
 
  if (url.pathname === '/') {
    return NextResponse.rewrite('https://imax.com/')
  }
 
  return NextResponse.next();
}