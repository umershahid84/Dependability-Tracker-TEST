// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {enforceAdminOnly} from '../../../../auth';
import {getAdminDashboardDataUpdateApiHandler} from '../../../../lib/apiController/admin/dashboard';

export default async function handler(req: Request, res: Response) {
  await enforceAdminOnly(req, res);

  if (req.method === 'GET') {
    return getAdminDashboardDataUpdateApiHandler(req, res);
  }

  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
