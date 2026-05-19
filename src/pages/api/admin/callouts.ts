// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {enforceAdminOnly, getJwtTokenForAPI, JwtPayload} from '../../../auth';
import deleteEmployeeCallOutApiHandler from '../../../lib/apiController/callouts/DELETE';
import {editEmployeeCallOutApiHandler, getCallOutsApiHandler} from '../../../lib/apiController';

export default async function handler(req: Request, res: Response) {
  // allow admins and supervisors to access this route
  if (req.method === 'GET') {
    return getCallOutsApiHandler(req, res);
  }

  if (req.method === 'PUT') {
    const token = await getJwtTokenForAPI(req, res);
    if (!token) {
      return;
    }
    return editEmployeeCallOutApiHandler(req, res, token as JwtPayload);
  }

  if (req.method === 'DELETE') {
    // Deletion remains admin-only.
    const token = await enforceAdminOnly(req, res);
    if (!token || !('supervisorId' in (token as JwtPayload))) {
      return;
    }
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
