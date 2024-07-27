import {JwtPayload} from '../auth';
import {NextResponse, NextRequest} from 'next/server';

export const supervisorPaths: string[] = [
  '/dashboard',
  '/divisions/public-parking',
  '/divisions/employee-parking',
  '/divisions/ground-transportation',
  '/divisions/public-parking/reports',
  '/divisions/employee-parking/reports',
  '/divisions/ground-transportation/reports'
];

export const supervisorOnly = (authToken: JwtPayload | undefined, request: NextRequest) => {
  if (authToken === undefined) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
};
