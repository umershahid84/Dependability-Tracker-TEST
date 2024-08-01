import { Request, Response } from 'express';
import type { ApiData } from '../../../index';
import { JwtPayload } from '../../../../../auth';
import { sendCredentialInvite } from '../../../../email';
import { CreateCredentialsInvite, LoginCredential } from '../../../../db';
import { SupervisorWithAssociations } from '../../../../db/models/Supervisor';
import { getSupervisorFromDB, createCreateCredentialsInviteInDB } from '../../../../db/controller';
import { logTemplate } from '../../../../utils/server';

export default async function postSupervisorCredentialInviteApiHandler(
  req: Request,
  res: Response<ApiData<SupervisorWithAssociations | null>>,
  token: JwtPayload
) {
  try {
    const { body } = req as { body: { supervisorsEmail: string; forSupervisor: string } };

    const forSupervisorId = body.forSupervisor;
    const supervisorEmail = body.supervisorsEmail;

    // create the invite  // ensure the email is not already in use
    const [loginCredentialWithExistingEmail, inviteWithExistingEmail] = await Promise.all([
      LoginCredential.findOne({ where: { email: supervisorEmail } }),
      CreateCredentialsInvite.findOne({ where: { email: supervisorEmail } })
    ]);

    if (loginCredentialWithExistingEmail || inviteWithExistingEmail) {
      throw new Error('Email already exists');
    }

    const existingUser = await getSupervisorFromDB.byId(forSupervisorId);

    if (!existingUser) {
      throw new Error('Supervisor does not exist');
    }

    const credentialInvite = await createCreateCredentialsInviteInDB({
      email: supervisorEmail,
      created_by: token.supervisorId,
      supervisor_id: forSupervisorId
    });

    if (!credentialInvite) {
      throw new Error('Error creating invite');
    }

    if (process.env.SEND_EMAILS === 'true') {
      const emailSent = await sendCredentialInvite(
        supervisorEmail,
        credentialInvite.invite_token,
        credentialInvite.id,
        existingUser.supervisor_info.name
      );

      if (!emailSent) {
        throw new Error('Error sending email. Invite created');
      }
    }

    // get updated supervisor data
    const updatedData: SupervisorWithAssociations | null = await getSupervisorFromDB.byId(
      forSupervisorId,
      {
        showCredentials: true,
        showCreateCredentialsInvite: true
      }
    );

    return res.status(200).json({ message: 'Invite created successfully', data: updatedData });
  } catch (error) {
    const errMessage = '❌ Error in postSupervisorCredentialInviteApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { postSupervisorCredentialInviteApiHandler };
