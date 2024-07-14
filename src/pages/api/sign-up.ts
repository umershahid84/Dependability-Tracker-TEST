// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import type {NextApiResponse} from 'next';
import {JwtPayload, signJwtToken} from '../../auth';
import type {ApiData} from '../../lib/apiController';
import {getCreateCredentialsInviteFromDB} from '../../lib/db/controller';
import {createLoginCredentialInDB} from '../../lib/db/controller/LoginCredential';
import {LoginCredentialsWithAssociations} from '../../lib/db/models/LoginCredential';
import {CreateCredentialsInviteWithAssociations} from '../../lib/db/models/CreateCredentialsInvite';

// inviteToken, password, email

export default async function createLoginCredentialsApiHandler(
  req: Request,
  res: NextApiResponse<ApiData>
) {
  const {inviteToken, password, email, inviteId} = req.body as {
    email: string;
    inviteId: string;
    password: string;
    inviteToken: string;
  };

  if (!email || !password || !inviteToken || !inviteId) {
    return res.status(400).json({error: 'Missing required fields'});
  }

  const existingInvite: CreateCredentialsInviteWithAssociations | null =
    await getCreateCredentialsInviteFromDB({id: inviteId});

  if (!existingInvite) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  try {
    const createdLoginCredentials: LoginCredentialsWithAssociations | null =
      await createLoginCredentialInDB({
        email,
        password,
        invite_token: inviteToken,
        supervisor_id: existingInvite?.supervisor_info?.id as string
      });

    if (!createdLoginCredentials) {
      throw new Error('Failed to create login credentials');
    }

    const authToken: JwtPayload = {
      email,
      supervisorId: existingInvite?.supervisor_info?.id as string,
      isAdmin: existingInvite?.supervisor_info?.is_admin as boolean,
      username: existingInvite?.supervisor_info?.supervisor_info?.name as string
    };

    const signedToken = signJwtToken(authToken);

    res.setHeader(
      'Set-Cookie',
      `auth-token=${signedToken}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return res.status(200).json({message: 'Account created successfully'});
  } catch (error) {
    console.error('Error creating login credentials:', error);
    return res.status(500).json({error: 'Failed to create account'});
  }
}

export const config = {
  api: {
    bodyParser: true
  }
};
