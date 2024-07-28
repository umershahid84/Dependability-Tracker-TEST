import {
  putEmployeesApiHandler,
  getEmployeesApiHandler,
  postEmployeesApiHandler,
  deleteEmployeesApiHandler
} from '../../../lib/apiController';
import {Request, Response} from 'express';
import {enforceAdminOnly} from '../../../auth';

export default async function handler(req: Request, res: Response) {
  const authToken = await enforceAdminOnly(req, res);

  if (!authToken) {
    return;
  }

  if (req.method === 'GET') {
    return getEmployeesApiHandler(req, res);
  }

  if (req.method === 'POST') {
    return postEmployeesApiHandler(req, res);
  }

  if (req.method === 'PUT') {
    return putEmployeesApiHandler(req, res);
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
