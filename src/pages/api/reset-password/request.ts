import { Request, Response } from 'express';
import { createPasswordResetCodeInDB } from '../../../lib/db/controller/PasswordResetCode';
import { sendPasswordResetCode } from '../../../lib/email/sendPasswordResetCode';
import { getLoginCredentialFromDB, deleteLoginCredentialFromDB } from '../../../lib/db/controller/LoginCredential';
import { createCreateCredentialsInviteInDB } from '../../../lib/db/controller';
import { logTemplate } from '../../../lib/utils/server';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { body } = req as { body: { email: string; username: string } };
    const email = body?.email?.trim().toLowerCase();
    const username = body?.username?.trim() ?? '';

    if (!email || !username) {
      return res.status(400).json({ error: 'Email and username are required' });
    }

    // verify the requested email exists in login credentials and names match
    const existing = await getLoginCredentialFromDB.byEmail(email);
    if (!existing) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expectedName = (existing.supervisor_info?.supervisor_info?.name ?? '').trim().toLowerCase();
    if (expectedName !== username.toLowerCase()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // generate 6-digit code
    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await createPasswordResetCodeInDB({
      supervisor_id: existing.supervisor_info.id,
      email: existing.email,
      code,
      expires_at: expiresAt
    });

    // create a new invite (for the "Create Credentials" email link)
    const credentialInvite = await createCreateCredentialsInviteInDB({
      email: existing.email,
      created_by: existing.supervisor_info.id,
      supervisor_id: existing.supervisor_info.id
    });

    const shouldSendEmails = process.env.SEND_EMAILS === 'true';

    if (shouldSendEmails) {
      const emailSent = await sendPasswordResetCode(
        existing.email,
        code,
        existing.supervisor_info.supervisor_info.name,
        credentialInvite?.id,
        credentialInvite?.invite_token
      );
      if (!emailSent) {
        throw new Error('Error sending email');
      }
    }

    // delete existing credentials only after email is sent successfully
    await deleteLoginCredentialFromDB(existing.id);

    const message = shouldSendEmails
      ? 'Password reset code sent successfully'
      : 'Reset code created, but email sending is disabled (SEND_EMAILS is not true)';

    return res.status(200).json({ data: true, message, emailSent: shouldSendEmails });
  } catch (error) {
    console.error(logTemplate('❌ Error in reset-password request: ' + String(error), 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export const config = { api: { externalResolver: true, bodyParser: true } };
