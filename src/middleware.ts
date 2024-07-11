import {getJwtTokenInEdgeEnvironments, JwtPayload} from './auth';
import {NextResponse, NextRequest} from 'next/server';

const supervisorPaths: string[] = [
  '/dashboard',
  '/api/logout',
  '/api/employee-callout',
  '/divisions/public-parking',
  '/divisions/employee-parking',
  '/divisions/employee-parking',
  '/divisions/ground-transportation'
];

const supervisorOnly = (authToken: JwtPayload | undefined, request: NextRequest) => {
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
};

const adminOnly = (authToken: JwtPayload | undefined, request: NextRequest) => {};

export async function middleware(request: NextRequest) {
  const authToken = await getJwtTokenInEdgeEnvironments(request);

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  for (const path of supervisorPaths) {
    if (request.nextUrl.pathname.startsWith(path)) {
      return supervisorOnly(authToken, request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {source: '/'},
    {source: '/dashboard'},
    {
      source: '/divisions/employee-parking'
    },
    {source: '/divisions/public-parking'},
    {source: '/divisions/employee-parking'},
    {source: '/ground-transportation'}
  ]
};
