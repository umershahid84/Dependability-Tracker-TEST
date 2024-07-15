// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {NextApiResponse} from 'next';
import {getJwtTokenForAPI} from '../../../auth';
import {getDivisionsApiHandler} from '../../../lib/apiController';

export default async function handler(req: NextRequest & Request, res: NextApiResponse) {
  getJwtTokenForAPI(req, res);

  if (req.method === 'GET') {
    console.log('\n\nGET request to /api/admin/divisions');
    return getDivisionsApiHandler(req, res);
  }
  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
