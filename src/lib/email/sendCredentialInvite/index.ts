import {Email} from '../types';
import {sendEmail} from '../sendEmail';
import {credentialInviteTemplate} from '../email-templates';

export const sendCredentialInvite = async (
  email: string,
  token: string,
  inviteId: string,
  username: string
): Promise<boolean> => {
  const emailData: Email = {
    from: process.env.EMAIL_SENDER as string,
    to: email,
    subject: 'Dependability Tracker - Create Credential Invite',
    html: credentialInviteTemplate(inviteId, username, token, 'http://localhost:3001/sign-up/')
  };

  return await sendEmail(emailData);
};
