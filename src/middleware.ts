import {getJwtTokenInEdgeEnvironments} from './auth';
import {NextResponse, NextRequest} from 'next/server';
import {adminPaths, adminOnly} from './middleware/admins';
import {supervisorOnly, supervisorPaths} from './middleware/supervisor';

export async function middleware(request: NextRequest) {
  const authToken = await getJwtTokenInEdgeEnvironments(request);

  // handle redirects for base paths
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // handle redirects for remaining supervisor and admin paths
  for (const path of adminPaths) {
    if (request.nextUrl.pathname.startsWith(path)) {
      return adminOnly(authToken, request);
    }
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
    {source: '/admin'},
    {source: '/dashboard'},
    {source: '/admin/callouts'},
    {source: '/admin/dashboard'},
    {source: '/admin/employees'},
    {source: '/api/admin/employees'},
    {source: '/ground-transportation'},
    {source: '/divisions/public-parking'},
    {source: '/divisions/employee-parking'},
    {source: '/divisions/employee-parking'}
  ]
};
