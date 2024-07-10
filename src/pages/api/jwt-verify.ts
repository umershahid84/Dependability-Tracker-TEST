// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import type {ApiData} from './sign-up';
import type {NextApiResponse} from 'next';
import {IJwtPayload, verifyJwtToken} from '@/auth';

// inviteToken, password, email

export default async function supervisorLoginApiHandler(
  req: Request,
  res: NextApiResponse<{token: IJwtPayload} | ApiData>
) {
  const {token} = req.body as {
    token: string;
  };

  if (!token) {
    return res.status(400).json({error: 'Missing required fields'});
  }

  //@ts-ignore

  const verifiedToken: IJwtPayload | undefined = verifyJwtToken(token);

  console.log('Verified Token:', verifiedToken);

  if (!verifiedToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  return res.status(200).json({token: verifiedToken});
}

export const config = {
  api: {
    externalResolver: true
  }
};
