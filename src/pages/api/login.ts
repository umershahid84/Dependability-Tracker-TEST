// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import type {ApiData} from './sign-up';
import type {NextApiResponse} from 'next';
import {getLoginCredentialFromDB} from '@/lib/db/controller/LoginCredential';
import {LoginCredentialsWithAssociations} from '@/lib/db/models/LoginCredential';
import {IJwtPayload, signJwtToken} from '@/auth';

// inviteToken, password, email

export default async function supervisorLoginApiHandler(
  req: Request,
  res: NextApiResponse<ApiData>
) {
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
    const authToken: IJwtPayload = {
      email: existingUser.email,
      supervisorId: existingUser.supervisor_info.id,
      isAdmin: existingUser.supervisor_info?.is_admin as boolean,
      username: existingUser.supervisor_info?.supervisor_info.name as string
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

export const config = {
  api: {
    externalResolver: true
  }
};
