import {Email} from '../types';
import {sendEmail} from '../sendEmail';
import {CallOutWithAssociations} from '../../db/models/Callout';
import {callOutDetailsTemplate} from '../email-templates/callout';

export const sendCallOutDetails = async (
  email: string,
  callOutDetails: CallOutWithAssociations
): Promise<boolean> => {
  const emailData: Email = {
    from: process.env.EMAIL_SENDER as string,
    to: email,
    subject: 'Dependability Tracker - Create Credential Invite',
    html: callOutDetailsTemplate(callOutDetails)
  };

  return await sendEmail(emailData);
};
