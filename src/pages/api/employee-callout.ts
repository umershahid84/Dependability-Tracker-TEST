// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {Request, Response} from 'express';
import {getJwtTokenForAPI} from '../../auth';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {createEmployeeCallout, type ApiData} from '../../lib/apiController';

// inviteToken, password, email

export default async function employeeCalloutSupervisorsApiHandler( //NOSONAR
  req: Request,
  res: Response<ApiData<CallOutWithAssociations>>
) {
  const token = await getJwtTokenForAPI(req, res);

  if (!token) {
    return;
  }

  if (req.method === 'POST') {
    return createEmployeeCallout(req, res, token);
  }

  return res.status(405).json({error: 'Method not allowed'});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
