import {
  getSupervisorFromDB,
  getCreateCredentialsInviteFromDB,
  updateCreateCredentialsInviteInDB
} from '../../../../../db/controller';
import { Request, Response } from 'express';
import type { ApiData } from '../../../../index';
import { LoginCredential } from '../../../../../db';
import { sendCredentialInvite } from '../../../../../email';
import { logTemplate } from '../../../../../utils/server';

export default async function postSupervisorEmailCredentialInviteApiHandler(
  req: Request,
  res: Response<ApiData<{ email: string }>>
) {
  try {
    const { body } = req as { body: { supervisorsEmail: string; forSupervisor: string } };

    const forSupervisorId = body.forSupervisor;
    const supervisorEmail = body.supervisorsEmail;

    // find the invite
    const credentialInvite = await getCreateCredentialsInviteFromDB({
      supervisor_id: forSupervisorId
    });

    const existingUser = await getSupervisorFromDB.byId(forSupervisorId);

    if (!existingUser) {
      throw new Error('Supervisor does not exist');
    }

    if (!credentialInvite) {
      throw new Error('Invite does not exist');
    }

    // ensure the email is not already in use
    const [loginCredentialWithExistingEmail] = await Promise.all([
      LoginCredential.findOne({ where: { email: supervisorEmail } })
    ]);

    if (loginCredentialWithExistingEmail) {
      throw new Error('Email already exists');
    }

    // check the invite for the supervisor's email, if the email is different, update it
    if (credentialInvite.email !== supervisorEmail) {
      await updateCreateCredentialsInviteInDB({
        id: credentialInvite.id,
        updateData: { email: supervisorEmail }
      });
    }

    if (process.env.SEND_EMAILS === 'true') {
      const emailSent = await sendCredentialInvite(
        supervisorEmail,
        credentialInvite.invite_token,
        credentialInvite.id,
        existingUser.supervisor_info.name
      );

      if (!emailSent) {
        throw new Error('Error sending email. Invite exists');
      }
    }

    return res
      .status(200)
      .json({ message: 'Email sent successfully', data: { email: supervisorEmail } });
  } catch (error) {
    const errMessage = '❌ Error in postSupervisorEmailCredentialInviteApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { postSupervisorEmailCredentialInviteApiHandler };
