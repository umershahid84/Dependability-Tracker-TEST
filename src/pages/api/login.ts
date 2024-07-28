// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {JwtPayload, signJwtToken} from '../../auth';
import type {ApiData} from '../../lib/apiController';
import {getLoginCredentialFromDB} from '../../lib/db/controller/LoginCredential';
import {LoginCredentialsWithAssociations} from '../../lib/db/models/LoginCredential';

// inviteToken, password, email

export default async function supervisorLoginApiHandler(req: Request, res: Response<ApiData>) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {password, email} = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(400).json({error: 'Missing required fields'});
  }

  const existingUser: LoginCredentialsWithAssociations | null =
    await getLoginCredentialFromDB.byEmail(email);

  if (!existingUser) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  const isPasswordCorrect = existingUser.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  try {
    const authToken: JwtPayload = {
      email: existingUser.email,
      supervisorId: existingUser.supervisor_info.id,
      isAdmin: existingUser.supervisor_info?.is_admin,
      username: existingUser.supervisor_info?.supervisor_info.name
    };

    const signedToken = signJwtToken(authToken);

    res.setHeader(
      'Set-Cookie',
      `auth-token=${signedToken}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return res.status(200).json({message: 'Successfully logged in!'});
  } catch (error) {
    return res.status(500).json({error: 'Internal server error'});
  }
}
