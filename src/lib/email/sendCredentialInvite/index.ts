import {Email} from '../types';
import {ip} from '../../../server/ip';
import {sendEmail} from '../sendEmail';
import {credentialInviteTemplate} from '../email-templates';
import {checkForTLS, PORT, TLS_PORT} from '../../../server';

export const sendCredentialInvite = async (
  email: string,
  token: string,
  inviteId: string,
  username: string
): Promise<boolean> => {
  const {hasSupportForTLS} = checkForTLS();

  const port = hasSupportForTLS ? TLS_PORT : PORT;
  const host = hasSupportForTLS ? ip : 'localhost';
  const protocol = hasSupportForTLS ? 'https' : 'http';
  const URL = `${protocol}://${host}:${port}/sign-up/`;

  const emailData: Email = {
    from: process.env.EMAIL_SENDER as string,
    to: email,
    subject: 'Dependability Tracker - Create Credential Invite',
    html: credentialInviteTemplate(inviteId, username, token, URL)
  };

  return await sendEmail(emailData);
};
