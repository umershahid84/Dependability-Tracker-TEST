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

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('\n\nRedirecting to login page...');

    return supervisorOnly(authToken, request);
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
