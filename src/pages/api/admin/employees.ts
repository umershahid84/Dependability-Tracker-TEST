import {
  putEmployeesApiHandler,
  getEmployeesApiHandler,
  postEmployeesApiHandler,
  deleteEmployeesApiHandler,
  patchEmployeesApiHandler
} from '../../../lib/apiController';
import {Request, Response} from 'express';
import {enforceAdminOnly, getJwtTokenForAPI} from '../../../auth';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    const authToken = await getJwtTokenForAPI(req, res);

    if (!authToken) {
      return;
    }

    return getEmployeesApiHandler(req, res);
  }

  const authToken = await enforceAdminOnly(req, res);

  if (!authToken) {
    return;
  }

  if (req.method === 'POST') {
    return postEmployeesApiHandler(req, res);
  }

  if (req.method === 'PUT') {
    return putEmployeesApiHandler(req, res);
  }

  if (req.method === 'PATCH') {
    return patchEmployeesApiHandler(req, res);
  }

  if (req.method === 'DELETE') {
    return deleteEmployeesApiHandler(req, res);
  }

  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
