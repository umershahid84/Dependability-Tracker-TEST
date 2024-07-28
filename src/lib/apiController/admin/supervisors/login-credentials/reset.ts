import {Request, Response} from 'express';
import type {ApiData} from '../../../index';
import {JwtPayload} from '../../../../../auth';
import {
  getLoginCredentialFromDB,
  deleteLoginCredentialFromDB
} from '../../../../db/controller/LoginCredential';
import {sendCredentialInvite} from '../../../../email';
import {SupervisorWithAssociations} from '../../../../db/models/Supervisor';
import {LoginCredentialsWithAssociations} from '../../../../db/models/LoginCredential';
import {getSupervisorFromDB, createCreateCredentialsInviteInDB} from '../../../../db/controller';

export default async function resetSupervisorLoginCredentials(
  req: Request,
  res: Response<ApiData<SupervisorWithAssociations | null>>,
  token: JwtPayload
) {
  try {
    const {body} = req as {body: {password: string; forSupervisor: string}};

    const password = body.password;
    const adminEmail = token.email;
    const forSupervisorId = body.forSupervisor;

    const adminsCredentials: LoginCredentialsWithAssociations | null =
      await getLoginCredentialFromDB.byEmail(adminEmail);

    if (!adminsCredentials) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const passwordsMatch = adminsCredentials.comparePassword(password);

    if (!passwordsMatch) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    // find the existing credentials for the supervisor
    const supervisorCredentials = await getLoginCredentialFromDB.bySupervisorId(forSupervisorId);

    if (!supervisorCredentials) {
      throw new Error("Could not find supervisor's credentials");
    }

    // remove their existing credentials
    await deleteLoginCredentialFromDB(supervisorCredentials.id);

    // create a new create credential invite - assign the previous email
    const credentialInvite = await createCreateCredentialsInviteInDB({
      email: supervisorCredentials.email,
      created_by: token.supervisorId,
      supervisor_id: forSupervisorId
    });

    if (!credentialInvite) {
      throw new Error('Error creating invite');
    }

    const existingUser = await getSupervisorFromDB.byId(forSupervisorId);

    if (!existingUser) {
      throw new Error('Error creating invite');
    }

    if (process.env.SEND_EMAILS === 'true') {
      const emailSent = await sendCredentialInvite(
        supervisorCredentials.email,
        credentialInvite.invite_token,
        credentialInvite.id,
        existingUser.supervisor_info.name
      );

      if (!emailSent) {
        throw new Error('Error sending email. Invite created');
      }
    }

    const updatedSupervisor: SupervisorWithAssociations | null = await getSupervisorFromDB.byId(
      forSupervisorId,
      {
        showCredentials: true,
        showCreateCredentialsInvite: true
      }
    );

    return res.status(200).json({message: 'Invite created successfully', data: updatedSupervisor});
  } catch (error) {
    console.error('Error creating invite:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {resetSupervisorLoginCredentials};
