import {Request, Response} from 'express';
import {getEmployeeCalendarApiHandler} from '../../../lib/apiController';
import {getJwtTokenForAPI} from '../../../auth';

export default async function handler(req: Request, res: Response) {
  await getJwtTokenForAPI(req, res);

  if (req.method === 'GET') {
    return getEmployeeCalendarApiHandler(req, res);
  }

  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};
