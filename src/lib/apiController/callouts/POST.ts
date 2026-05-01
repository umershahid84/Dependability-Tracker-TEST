// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {JwtPayload} from '../../../auth';
// import {LoginCredential} from '../../db';
import type {ApiData} from '../../../lib/apiController';
import {createCallOutInDB} from '../../../lib/db/controller';
import {sendCallOutDetails} from '../../email/sendCallOutDetails';
import {CallOutCreationAttributes, CallOutWithAssociations} from '../../../lib/db/models/Callout';
import {logTemplate} from '../../utils/server';

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

      return res.status(400).json({error: `Missing required fields: ${missingFields.join(', ')}`});
    }

    const shiftDateTime = new Date(shiftTime);
    const callDateTime = new Date(callTime);

    const supervisorId = (token as JwtPayload).supervisorId;

    // Parse date strings as local dates, not UTC
    const parseLocalDate = (dateStr: string | Date): Date => {
      if (dateStr instanceof Date) return dateStr;
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const callOutData: CallOutCreationAttributes = {
      shift_date: parseLocalDate(shiftDate),
      callout_date: parseLocalDate(callDate),
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
      return res.status(500).json({error: 'Failed to create callout'});
    }

    // email the callout details to all supervisors, only include email
    // const supervisorEmails = (await LoginCredential.findAll())
    //   .map((credential: LoginCredential) => credential.email)
    //   .filter(email => email);

    const supervisorEmails = [
      'z-AV-OPS-L-Supvs-Minus-Mgrs@portseattle.org',
      'tesfaye.s@portseattle.org',
      'fletcher.t@portseattle.org',
      'ausbun.v@portseattle.org',
      'hipol.n@portseattle.org'
    ];

    if (process.env.SEND_EMAILS === 'true' && callOut) {
      try {
        sendCallOutDetails(supervisorEmails.join(', '), callOut);
      } catch (error) {
        const errMessage = '❌ Error sending email in createEmployeeCallout:' + ' ' + error;
        console.error(logTemplate(errMessage, 'error'));
      }
    }
    res.status(200).json({message: 'Callout Created Successfully', data: callOut});
  } catch (error) {
    const errMessage = '❌ Error in createEmployeeCallout:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    res.status(500).json({error: 'Error creating Callout'});
  }
}

export {createEmployeeCallout};
