import {getJwtToken, IJwtPayload} from './auth';
import {NextResponse, NextRequest} from 'next/server';

const supervisorOnly = (authToken: IJwtPayload | undefined, request: NextRequest) => {
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
};

const adminOnly = (authToken: IJwtPayload | undefined, request: NextRequest) => {};

export async function middleware(request: NextRequest) {
  const authToken = await getJwtToken(request);

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return supervisorOnly(authToken, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
};
