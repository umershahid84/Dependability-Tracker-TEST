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

const adminOnly = (authToken: JwtPayload | undefined, request: NextRequest) => {
  if (!authToken || !authToken.isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
};

export async function middleware(request: NextRequest) {
  const authToken = await getJwtTokenInEdgeEnvironments(request);

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  for (const path of supervisorPaths) {
    if (request.nextUrl.pathname.startsWith(path)) {
      return supervisorOnly(authToken, request);
    }
  }

  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api/admin')
  ) {
    return adminOnly(authToken, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {source: '/'},
    {source: '/admin'},
    {source: '/dashboard'},
    {source: '/admin/dashboard'},
    {source: '/admin/employees'},
    {source: '/admin/callouts'},
    {
      source: '/divisions/employee-parking'
    },
    {source: '/divisions/public-parking'},
    {source: '/divisions/employee-parking'},
    {source: '/ground-transportation'},
    {
      source: '/api/admin/employees'
    }
  ]
};
