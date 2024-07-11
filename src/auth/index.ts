import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {NextApiResponse} from 'next';
import jwt, {Algorithm} from 'jsonwebtoken';
import type {ApiData} from '../pages/api/sign-up';
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies';

const EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';
const SECRET: string = process.env.JWT_SECRET || '3+@71]i-nk6Al4kZ7666kM?ka8+G&mms';
const ALGORITHM: Algorithm = (process.env.JWT_ALGORITHM as Algorithm) || ('HS256' as Algorithm);

// TODO: Encrypt the JWT so it is unreadable by the client

// the payload of the jwt token
export type IJwtPayload = {
  email: string;
  username: string;
  isAdmin: boolean;
  supervisorId: string;
};

// details from the IJwtPayload that are exposed to the client
export type ClientSidePayload = {
  username: string;
  isAdmin: boolean;
};

// not to be used outside of the node environment uses the crypto module from node
export const verifyJwtToken_RequiresNode = (token: string): IJwtPayload | undefined => {
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

// To be used in getServerSideProps to get the token and forward the user to the login page if the token is invalid
export const getTokenForServerSideProps = (request: {
  req: Request;
}): IJwtPayload | Redirect | undefined => {
  const {req} = request;
  const cookie = req.cookies['auth-token'];
  const token = verifyJwtToken_RequiresNode(cookie ?? '');

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

// Can be used to validate the token in API calls
export const getJwtTokenForAPI = (
  req: Request,
  res: NextApiResponse<ApiData>
): undefined | IJwtPayload | Redirect => {
  const token = getTokenForServerSideProps({req});

  const hasRedirect = (token as Redirect)?.redirect;

  if (!token || hasRedirect) {
    res.status(401).json({error: 'Unauthorized request'});
    return;
  }

  return token;
};

// To be used in the NextEdge Environment aka NextMiddleware
export const getJwtTokenInEdgeEnvironments = async (
  req: NextRequest
): Promise<IJwtPayload | undefined> => {
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
