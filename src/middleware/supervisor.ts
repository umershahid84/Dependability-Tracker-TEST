import {JwtPayload} from '../auth';
import {NextResponse, NextRequest} from 'next/server';

export const supervisorPaths: string[] = [
  '/dashboard',
  '/api/logout',
  '/api/employee-callout',
  '/divisions/public-parking',
  '/divisions/employee-parking',
  '/divisions/employee-parking',
  '/divisions/ground-transportation'
];

export const supervisorOnly = (authToken: JwtPayload | undefined, request: NextRequest) => {
  if (authToken === undefined) {
    console.log('SUPERVISOR_ONLY - authToken is undefined');
    return NextResponse.redirect(new URL('/login', request.url));
  }
};
