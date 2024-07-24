// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {NextApiResponse} from 'next';
import {enforceAdminOnly, JwtPayload} from '../../../../../auth';
import {postSupervisorCredentialInviteApiHandler} from '../../../../../lib/apiController';

export default async function handler(req: NextRequest & Request, res: NextApiResponse) {
  const token: JwtPayload | undefined | void = await enforceAdminOnly(req, res);

  if (req.method === 'POST') {
    return postSupervisorCredentialInviteApiHandler(req, res, token as JwtPayload);
  }
  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
