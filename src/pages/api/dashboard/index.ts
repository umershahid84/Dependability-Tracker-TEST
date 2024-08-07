// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Request, Response } from 'express';
import { getJwtTokenForAPI } from '../../../auth';
import {
  getDashboardDataApiHandler,
  getDashboardDataUpdateStatusApiHandler
} from '../../../lib/apiController/dashboard';

export default async function handler(req: Request, res: Response) {
  await getJwtTokenForAPI(req, res);

  if (req.method === 'GET') {
    return getDashboardDataApiHandler(req, res);
  }

  if (req.method === 'POST') {
    return getDashboardDataUpdateStatusApiHandler(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
