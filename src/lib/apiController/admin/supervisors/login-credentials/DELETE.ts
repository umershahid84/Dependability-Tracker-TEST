import {Request, Response} from 'express';
import type {ApiData} from '../../../index';
import {JwtPayload} from '../../../../../auth';
import {
  getLoginCredentialFromDB,
  deleteLoginCredentialFromDB
} from '../../../../db/controller/LoginCredential';
import {getSupervisorFromDB} from '../../../../db/controller';
import {SupervisorWithAssociations} from '../../../../db/models/Supervisor';
import {LoginCredentialsWithAssociations} from '../../../../db/models/LoginCredential';

export default async function revokeSupervisorLoginCredentials(
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

    const updatedSupervisor: SupervisorWithAssociations | null = await getSupervisorFromDB.byId(
      forSupervisorId,
      {
        showCredentials: true,
        showCreateCredentialsInvite: true
      }
    );

    return res
      .status(200)
      .json({message: 'Credentials removed successfully', data: updatedSupervisor});
  } catch (error) {
    console.error('Error creating invite:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {revokeSupervisorLoginCredentials};
