// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Request, Response } from 'express';
import {
  getLoginCredentialFromDB,
  deleteLoginCredentialFromDB
} from '../../lib/db/controller/LoginCredential';
import { sendCredentialInvite } from '../../lib/email';
import { createCreateCredentialsInviteInDB } from '../../lib/db/controller';
import { logTemplate } from '../../lib/utils/server';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      const { body } = req as { body: { email: string; username: string } };

      const { email, username } = body;

      // look for admin credentials with the email
      const adminsCredentials = await getLoginCredentialFromDB.byEmail(email);

      if (!adminsCredentials) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // compare the names
      if (
        adminsCredentials?.supervisor_info?.supervisor_info?.name?.toLocaleLowerCase() !==
        username?.toLocaleLowerCase()
      ) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // remove their existing credentials
      await deleteLoginCredentialFromDB(adminsCredentials.id);

      // create a new create credential invite - assign the previous email
      const credentialInvite = await createCreateCredentialsInviteInDB({
        email: adminsCredentials.email,
        created_by: adminsCredentials.supervisor_info.id,
        supervisor_id: adminsCredentials.supervisor_info.id
      });

      if (!credentialInvite) {
        throw new Error('Error creating invite');
      }

      if (process.env.SEND_EMAILS === 'true') {
        const emailSent = await sendCredentialInvite(
          adminsCredentials.email,
          credentialInvite.invite_token,
          credentialInvite.id,
          adminsCredentials.supervisor_info.supervisor_info.name
        );

        if (!emailSent) {
          throw new Error('Error sending email');
        }
      }

      return res.status(200).json({ data: true });
    } catch (error) {
      console.error(logTemplate('❌ Error in handler: ' + (error as Error).message, 'error'));
      return res.status(500).json({ error: (error as Error).message });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true
  }
};
