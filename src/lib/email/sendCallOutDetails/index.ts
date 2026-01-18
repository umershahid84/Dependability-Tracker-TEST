import {Email} from '../types';
import {sendEmail} from '../sendEmail';
import {CallOutWithAssociations} from '../../db/models/Callout';
import {callOutDetailsTemplate} from '../email-templates/callout';
import {formatDate_YYYY_MM_DD_TZ, formatTime_hh_mm_ss_TZ} from '../../utils';

export const sendCallOutDetails = async (
  email: string,
  callOutDetails: CallOutWithAssociations
): Promise<boolean> => {
  const emailData: Email = {
    from: process.env.EMAIL_SENDER as string,
    to: email,
    subject: `Call Out Details for ${
      callOutDetails.employee.name
    } on ${formatDate_YYYY_MM_DD_TZ(callOutDetails.callout_date)} at ${formatTime_hh_mm_ss_TZ(callOutDetails.callout_time)}`,
    html: callOutDetailsTemplate(callOutDetails)
  };

  return await sendEmail(emailData);
};
