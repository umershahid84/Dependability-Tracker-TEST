import { Email } from '../types';
import { ip } from '../../../server/ip';
import { sendEmail } from '../sendEmail';
import { credentialInviteTemplate } from '../email-templates';
import { checkForTLS, PORT, TLS_PORT } from '../../../server';

export const sendPasswordResetCode = async (
  email: string,
  code: string,
  username: string,
  inviteId?: string,
  inviteToken?: string
): Promise<boolean> => {
  const { hasSupportForTLS } = checkForTLS();

  const port = hasSupportForTLS ? TLS_PORT : PORT;
  const host = hasSupportForTLS ? ip : 'localhost';
  const protocol = hasSupportForTLS ? 'https' : 'http';
  const URL = `${protocol}://${host}:${port}/reset-password/`;

  const emailData: Email = {
    from: process.env.EMAIL_SENDER as string,
    to: email,
    subject: 'Dependability Tracker - Password Reset Code',
    html: credentialInviteTemplate(inviteId ?? '', username, inviteToken ?? '', URL, code)
  };

  return await sendEmail(emailData);
};
