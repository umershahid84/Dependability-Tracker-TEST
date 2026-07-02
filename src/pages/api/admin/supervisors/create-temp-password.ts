import { Request, Response } from 'express';
import { enforceAdminOnly, JwtPayload } from '../../../../auth';
import { getSupervisorFromDB } from '../../../../lib/db/controller';
import { createPasswordResetCodeInDB } from '../../../../lib/db/controller/PasswordResetCode';
import { sendPasswordResetCode } from '../../../../lib/email/sendPasswordResetCode';
import { logTemplate } from '../../../../lib/utils/server';

const generateTempPassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
};

export default async function handler(req: Request, res: Response) {
  const token: JwtPayload | undefined | Response<any, Record<string, any>> | void =
    await enforceAdminOnly(req, res);

  if (!token || !('email' in token)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { body } = req as { body: { forSupervisor: string; email?: string } };
    const forSupervisorId = body.forSupervisor;
    const emailOverride = body.email?.trim()?.toLowerCase();

    const existingUser = await getSupervisorFromDB.byId(forSupervisorId);
    if (!existingUser) {
      return res.status(404).json({ error: 'Supervisor not found' });
    }

    const destEmail = emailOverride ?? existingUser.create_credentials_invite?.email ?? '';
    if (!destEmail) {
      return res.status(400).json({ error: 'No email available to send temporary password' });
    }

    // generate temp password
    const tempPassword = generateTempPassword(12);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // create password reset code record (used to carry temp password until consumed)
    await createPasswordResetCodeInDB({
      supervisor_id: forSupervisorId,
      email: destEmail,
      code: tempPassword,
      expires_at: expiresAt
    });

    const shouldSendEmails = process.env.SEND_EMAILS === 'true';
    if (shouldSendEmails) {
      const emailSent = await sendPasswordResetCode(destEmail, tempPassword, existingUser.supervisor_info.name);
      if (!emailSent) throw new Error('Error sending email');
    }

    // Return the temp password to admin in the response so it is visible in UI (per your choice)
    return res.status(200).json({ message: 'Temporary password created and sent', tempPassword: shouldSendEmails ? undefined : tempPassword, emailSent: shouldSendEmails });
  } catch (error) {
    console.error(logTemplate('❌ Error creating temporary password: ' + String(error), 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export const config = { api: { externalResolver: true, bodyParser: true } };
