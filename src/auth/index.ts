import {Request} from 'express';
import {NextRequest} from 'next/server';
import jwt, {Algorithm} from 'jsonwebtoken';
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies';

const EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';
const SECRET: string = process.env.JWT_SECRET || '3+@71]i-nk6Al4kZ7666kM?ka8+G&mms';
const ALGORITHM: Algorithm = (process.env.JWT_ALGORITHM as Algorithm) || ('HS256' as Algorithm);

export type IJwtPayload = {
  email: string;
  username: string;
  isAdmin: boolean;
  supervisorId: string;
};

export type ClientSidePayload = {
  username: string;
  isAdmin: boolean;
};

export const verifyJwtToken = (token: string): IJwtPayload | undefined => {
  try {
    // we decode the token and return it if it is valid
    const decoded: IJwtPayload = jwt.verify(token, SECRET, {
      maxAge: EXPIRES_IN,
      algorithms: [ALGORITHM]
    }) as IJwtPayload;

    return decoded;
  } catch (error) {
    // if the token is invalid, we return undefined
    return undefined;
  }
};

export type Redirect = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export const getTokenForServerSideProps = (request: {
  req: Request;
}): IJwtPayload | Redirect | undefined => {
  const {req} = request;
  const cookie = req.cookies['auth-token'];
  const token = verifyJwtToken(cookie ?? '');

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return token;
};

export const getJwtToken = async (req: NextRequest): Promise<IJwtPayload | undefined> => {
  try {
    let cookies: RequestCookies = req.cookies ?? '';

    let _token: string | undefined = cookies.get('auth-token')?.value ?? '';

    if (!_token || _token === '') {
      return undefined;
    }

    const apiResponse = await fetch(new URL('/api/jwt-verify', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token: _token})
    });

    const {token} = (await apiResponse.json()) ?? {};

    return token;
  } catch (error) {
    console.error('Error in jwtMiddleware', error);
    return undefined;
  }
};

export const signJwtToken = (payload: IJwtPayload): string => {
  return jwt.sign({...payload}, SECRET, {algorithm: ALGORITHM, expiresIn: EXPIRES_IN});
};
