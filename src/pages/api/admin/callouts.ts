// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {NextApiResponse} from 'next';
import {getJwtTokenForAPI, JwtPayload} from '../../../auth';
import {editEmployeeCallOutApiHandler, getCallOutsApiHandler} from '../../../lib/apiController';
import deleteEmployeeCallOutApiHandler from '../../../lib/apiController/callouts/DELETE';

export default async function handler(req: NextRequest & Request, res: NextApiResponse) {
  const token: JwtPayload | undefined = getJwtTokenForAPI(req, res);

  if (req.method === 'GET') {
    return getCallOutsApiHandler(req, res);
  }

  if (req.method === 'PUT') {
    return editEmployeeCallOutApiHandler(req, res, token);
  }

  if (req.method === 'DELETE') {
    return deleteEmployeeCallOutApiHandler(req, res);
  }
  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};
