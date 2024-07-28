// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {
  postSupervisorCredentialInviteApiHandler,
  deleteSupervisorCredentialInviteApiHandler
} from '../../../../../lib/apiController';
import {enforceAdminOnly, JwtPayload} from '../../../../../auth';

export default async function handler(req: Request, res: Response) {
  const token: JwtPayload | undefined | Response<any, Record<string, any>> | void =
    await enforceAdminOnly(req, res);

  if (req.method === 'POST') {
    return postSupervisorCredentialInviteApiHandler(req, res, token as JwtPayload);
  }

  if (req.method === 'DELETE') {
    return deleteSupervisorCredentialInviteApiHandler(req, res);
  }
  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
