import type {NextRequest} from 'next/server';
import type {JwtPayload} from '../../auth';
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies';

// To be used in the NextEdge Environment aka NextMiddleware
export const getJwtTokenInEdgeEnvironments = async (
  req: NextRequest
): Promise<JwtPayload | undefined> => {
  try {
    let cookies: RequestCookies = req.cookies ?? '';

    let _token: string | undefined = cookies.get('auth-token')?.value ?? '';

    if (!_token || _token === '') {
      return undefined;
    }

    const apiResponse = await fetch(
      new URL(
        `http://localhost:${process?.env?.PORT ?? '3000'}/api/jwt-verify`,
        req.url
      ).toString(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: _token})
      }
    );

    const {token} = (await apiResponse.json()) ?? {};

    return token;
  } catch (error) {
    console.error('Error in jwtMiddleware', error);
    return undefined;
  }
};
