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
    subject: `Call Out Details for ${
      callOutDetails.employee.name
    } on ${callOutDetails.callout_date.toLocaleDateString()} at ${callOutDetails.callout_time.toLocaleTimeString()}`,
    html: callOutDetailsTemplate(callOutDetails)
  };

  return await sendEmail(emailData);
};
