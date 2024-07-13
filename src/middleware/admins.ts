import {JwtPayload} from '../auth';
import {NextResponse, NextRequest} from 'next/server';

export const adminPaths: string[] = [
  '/admin/dashboard',
  '/admin/employees',
  '/admin/callouts',
  '/api/admin/employees'
];

export const adminOnly = (authToken: JwtPayload | undefined, request: NextRequest) => {
  if (!authToken?.isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
};
