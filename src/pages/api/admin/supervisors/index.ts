// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {NextApiResponse} from 'next';
import {enforceAdminOnly} from '../../../../auth';
import {getSupervisorsApiHandler} from '../../../../lib/apiController';

export default async function handler(req: NextRequest & Request, res: NextApiResponse) {
  await enforceAdminOnly(req, res);

  if (req.method === 'GET') {
    return getSupervisorsApiHandler(req, res);
  }
  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
