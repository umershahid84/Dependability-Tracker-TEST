import {NextResponse, NextRequest} from 'next/server';
import {adminPaths, adminOnly} from './middleware/admins';
import {supervisorOnly, supervisorPaths} from './middleware/supervisor';
import {getJwtTokenInEdgeEnvironments} from './client-api/supervisors/auth';

// works on client-side only, does not work for the api routes
export async function middleware(request: NextRequest) {
  const authToken = await getJwtTokenInEdgeEnvironments(request);

  // handle redirects for base paths
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

  // handle redirects for remaining supervisor and admin paths
  for (const path of adminPaths) {
    if (request.nextUrl.pathname.startsWith(path)) {
      return adminOnly(authToken, request);
    }
  }
}

export const config = {
  matcher: [
    {source: '/'},
    {source: '/admin'},
    {source: '/dashboard'},
    {source: '/admin/callouts'},
    {source: '/admin/dashboard'},
    {source: '/admin/employees'},
    {source: '/admin/supervisors'},
    {source: '/divisions/public-parking'},
    {source: '/divisions/employee-parking'},
    {source: '/divisions/ground-transportation'},
    {source: '/divisions/public-parking/reports'},
    {source: '/divisions/employee-parking/reports'},
    {source: '/divisions/ground-transportation/reports'}
  ],
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
