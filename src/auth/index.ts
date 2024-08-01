import { Request, Response } from 'express';
import jwt, { Algorithm } from 'jsonwebtoken';
import type { ApiData } from '../lib/apiController';
import { getLoginCredentialFromDB } from '../lib/db/controller/LoginCredential';
import { logTemplate } from '../lib/utils/server';

const EXPIRES_IN: string = process.env.JWT_EXPIRES_IN ?? '24h';
const SECRET: string = process.env.JWT_SECRET ?? '3+@71]i-nk6Al4kZ7666kM?ka8+G&mms';
const ALGORITHM: Algorithm = (process.env.JWT_ALGORITHM as Algorithm) ?? ('HS256' as Algorithm);

// TODO: Encrypt the JWT so it is unreadable by the client

// the payload of the jwt token
export type JwtPayload = {
  email: string;
  username: string;
  isAdmin: boolean;
  supervisorId: string;
};

// details from the JwtPayload that are exposed to the client
export type ClientSidePayload = {
  username: string;
  isAdmin: boolean;
};

// not to be used outside of the node environment uses the crypto module from node
export const verifyJwtToken_RequiresNode = async (
  token: string
): Promise<JwtPayload | undefined> => {
  try {
    // we decode the token and return it if it is valid
    const decoded: JwtPayload = jwt.verify(token, SECRET, {
      maxAge: EXPIRES_IN,
      algorithms: [ALGORITHM]
    }) as JwtPayload;

    // ensure that there are login credentials for the supposed supervisor
    const hasCredentials = await getLoginCredentialFromDB.byEmail(decoded.email);

    if (!hasCredentials) {
      throw new Error('Unauthorized');
    }

    return decoded;
  } catch (error) {
    if (!String(error).includes('Unauthorized')) {
      const errMessage = '❌ Error in verifyJwtToken_RequiresNode' + ' ' + error;
      console.error(logTemplate(errMessage, 'error'));
    }
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
export const getTokenForServerSideProps = async (request: {
  req: Request;
}): Promise<JwtPayload | Redirect | undefined> => {
  const { req } = request;
  const cookie = req.cookies['auth-token'];
  const token = await verifyJwtToken_RequiresNode(cookie ?? '');

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
export const getJwtTokenForAPI = async (
  req: Request,
  res: Response<ApiData>
): Promise<undefined | JwtPayload> => {
  const token = await getTokenForServerSideProps({ req });

  const hasRedirect = (token as Redirect)?.redirect;

  if (!token || hasRedirect) {
    res.status(401).json({ error: 'Unauthorized request' });
    return;
  }

  return token as JwtPayload;
};

export const enforceAdminOnly = async (
  req: Request,
  res: Response
): Promise<undefined | JwtPayload | void | Response<any, Record<string, any>>> => {
  const token = await getJwtTokenForAPI(req, res);
  if (!token?.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized request' });
  } else {
    return token;
  }
};

export const signJwtToken = (payload: JwtPayload): string => {
  return jwt.sign({ ...payload }, SECRET, { algorithm: ALGORITHM, expiresIn: EXPIRES_IN });
};
