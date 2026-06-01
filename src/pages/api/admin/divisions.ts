// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {getJwtTokenForAPI} from '../../../auth';
import {getDivisionsApiHandler} from '../../../lib/apiController';

export default async function handler(req: Request, res: Response) {
  const authToken = await getJwtTokenForAPI(req, res);

  if (!authToken) {
    return;
  }

  if (req.method === 'GET') {
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
