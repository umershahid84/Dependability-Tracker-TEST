// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Request, Response } from 'express';
import { JwtPayload } from '../../../auth';
import { LoginCredential } from '../../db';
import type { ApiData } from '../../../lib/apiController';
import { createCallOutInDB } from '../../../lib/db/controller';
import { sendCallOutDetails } from '../../email/sendCallOutDetails';
import { CallOutCreationAttributes, CallOutWithAssociations } from '../../../lib/db/models/Callout';
import { logTemplate } from '../../utils/server';

// inviteToken, password, email

export default async function createEmployeeCallout( //NOSONAR
  req: Request,
  res: Response<ApiData<CallOutWithAssociations>>,
  token?: JwtPayload | null
) {
  try {
    // check
    const {
      callDate,
      callTime,
      comment,
      shiftDate,
      shiftTime,
      leaveType,
      employeeName,
      leftEarlyMinutes,
      lateArrivalMinutes
    } = req.body;

    if (
      !callDate ||
      !callTime ||
      !shiftDate ||
      !shiftTime ||
      !leaveType ||
      !employeeName ||
      !comment
    ) {
      let missingFields = [];

      if (!callDate) missingFields.push('Call Date');
      if (!callTime) missingFields.push('Call Time');
      if (!shiftDate) missingFields.push('Shift Date');
      if (!shiftTime) missingFields.push('Shift Time');
      if (!leaveType) missingFields.push('Leave Type');
      if (!employeeName) missingFields.push('Employee Name');
      if (!comment) missingFields.push('Supervisor Comments');

      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // build the calTime and shiftTime into date objects, using the callDate and shiftDate as the base
    const callTimeParts = callTime.split(':');
    const shiftTimeParts = shiftTime.split(':');

    const callDateParts = callDate.split('-');
    const shiftDateParts = shiftDate.split('-');

    const callDateTime = new Date(
      parseInt(callDateParts[0]),
      parseInt(callDateParts[1]) - 1,
      parseInt(callDateParts[2]),
      parseInt(callTimeParts[0]),
      parseInt(callTimeParts[1])
    );

    const shiftDateTime = new Date(
      parseInt(shiftDateParts[0]),
      parseInt(shiftDateParts[1]) - 1,
      parseInt(shiftDateParts[2]),
      parseInt(shiftTimeParts[0]),
      parseInt(shiftTimeParts[1])
    );

    const supervisorId = (token as JwtPayload).supervisorId;

    const callOutData: CallOutCreationAttributes = {
      shift_date: shiftDate,
      callout_date: callDate,
      leave_type_id: leaveType,
      employee_id: employeeName,
      shift_time: shiftDateTime,
      callout_time: callDateTime,
      supervisor_id: supervisorId,
      supervisor_comments: comment,
      left_early_mins: leftEarlyMinutes ?? 0,
      arrived_late_mins: lateArrivalMinutes
    };

    const callOut: CallOutWithAssociations | null = await createCallOutInDB(callOutData);

    if (!callOut) {
      return res.status(500).json({ error: 'Failed to create callout' });
    }

    // email the callout details to all supervisors, only include email
    const supervisorEmails = (await LoginCredential.findAll())
      .map((credential: LoginCredential) => credential.email)
      .filter(email => email);

    if (process.env.SEND_EMAILS === 'true' && callOut) {
      try {
        sendCallOutDetails(supervisorEmails.join(', '), callOut);
      } catch (error) {
        const errMessage = '❌ Error sending email in createEmployeeCallout:' + ' ' + error;
        console.error(logTemplate(errMessage, 'error'));
      }
    }
    res.status(200).json({ message: 'Callout Created Successfully', data: callOut });
  } catch (error) {
    const errMessage = '❌ Error in createEmployeeCallout:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    res.status(500).json({ error: 'Error creating Callout' });
  }
}

export { createEmployeeCallout };
