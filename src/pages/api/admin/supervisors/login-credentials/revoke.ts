// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {enforceAdminOnly, JwtPayload} from '../../../../../auth';
import {revokeSupervisorLoginCredentials} from '../../../../../lib/apiController';

export default async function handler(req: Request, res: Response) {
  const token: JwtPayload | undefined | Response<any, Record<string, any>> | void =
    await enforceAdminOnly(req, res);

  if (req.method === 'POST') {
    return revokeSupervisorLoginCredentials(req, res, token as JwtPayload);
  }
  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
