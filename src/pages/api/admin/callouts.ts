// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {enforceAdminOnly, JwtPayload} from '../../../auth';
import deleteEmployeeCallOutApiHandler from '../../../lib/apiController/callouts/DELETE';
import {editEmployeeCallOutApiHandler, getCallOutsApiHandler} from '../../../lib/apiController';

export default async function handler(req: Request, res: Response) {
  // allow admins and supervisors to access this route
  if (req.method === 'GET') {
    return getCallOutsApiHandler(req, res);
  }

  // If not a GET request, then the user must be an admin
  const token: JwtPayload | undefined | Response<any, Record<string, any>> | void =
    await enforceAdminOnly(req, res);

  if (req.method === 'PUT') {
    return editEmployeeCallOutApiHandler(req, res, token as JwtPayload);
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
