// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {JwtPayload, signJwtToken} from '../../auth';
import type {ApiData} from '../../lib/apiController';
import {getCreateCredentialsInviteFromDB} from '../../lib/db/controller';
import {createLoginCredentialInDB} from '../../lib/db/controller/LoginCredential';
import {LoginCredentialsWithAssociations} from '../../lib/db/models/LoginCredential';
import {CreateCredentialsInviteWithAssociations} from '../../lib/db/models/CreateCredentialsInvite';

// inviteToken, password, email

export default async function createLoginCredentialsApiHandler(
  req: Request,
  res: Response<ApiData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

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

  // check if the creds have an assigned email
  const assignedEmail: string | undefined = existingInvite?.email;

  if (assignedEmail && assignedEmail !== email) {
    return res.status(401).json({error: 'Unauthorized request, must use assigned email address'});
  }

  try {
    const createdLoginCredentials: LoginCredentialsWithAssociations | null =
      await createLoginCredentialInDB({
        email,
        password,
        invite_token: inviteToken,
        supervisor_id: existingInvite?.supervisor_info?.id
      });

    if (!createdLoginCredentials) {
      throw new Error('Failed to create login credentials');
    }

    const authToken: JwtPayload = {
      email,
      supervisorId: existingInvite?.supervisor_info?.id,
      isAdmin: existingInvite?.supervisor_info?.is_admin,
      username: existingInvite?.supervisor_info?.supervisor_info?.name
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
