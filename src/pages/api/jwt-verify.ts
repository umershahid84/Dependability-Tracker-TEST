// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import type {ApiData} from '../../lib/apiController';
import {getSupervisorFromDB} from '../../lib/db/controller';
import {JwtPayload, verifyJwtToken_RequiresNode} from '../../auth';
import {SupervisorWithAssociations} from '../../lib/db/models/Supervisor';

// inviteToken, password, email
export default async function jwtVerificationApiHandler(
  req: Request,
  res: Response<{token: JwtPayload} | ApiData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {token} = req.body as {
    token: string;
  };

  if (!token) {
    return res.status(400).json({error: 'Missing required fields'});
  }

  const verifiedToken: JwtPayload | undefined = await verifyJwtToken_RequiresNode(token);

  if (!verifiedToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  // see if the user exists in the database
  const existingUser: SupervisorWithAssociations | null = await getSupervisorFromDB.byId(
    verifiedToken.supervisorId,
    {
      showCredentials: true
    }
  );

  if (!existingUser) {
    return res.redirect('/api/logout');
  }

  // see if the user has login credentials
  if (!existingUser.login_credentials) {
    return res.redirect('/api/logout');
  }

  return res.status(200).json({token: verifiedToken});
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
