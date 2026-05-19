// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request, Response} from 'express';
import {JwtPayload} from '../../../auth';
// import {LoginCredential} from '../../db';
import type {ApiData} from '../../../lib/apiController';
import {createCallOutInDB, getEmployeeScheduleFromDB} from '../../../lib/db/controller';
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
      shiftDateTo,
      shiftTime,
      leaveType,
      employeeName: selectedEmployeeId,
      leftEarlyMinutes,
      lateArrivalMinutes
    } = req.body;

    if (
      !callDate ||
      !callTime ||
      !shiftDate ||
      !shiftTime ||
      !leaveType ||
      !selectedEmployeeId ||
      !comment
    ) {
      let missingFields = [];

      if (!callDate) missingFields.push('Call Date');
      if (!callTime) missingFields.push('Call Time');
      if (!shiftDate) missingFields.push('Shift Date');
      if (!shiftTime) missingFields.push('Shift Time');
      if (!leaveType) missingFields.push('Leave Type');
      if (!selectedEmployeeId) missingFields.push('Employee Name');
      if (!comment) missingFields.push('Supervisor Comments');

      return res.status(400).json({error: `Missing required fields: ${missingFields.join(', ')}`});
    }

    const shiftDateTime = new Date(shiftTime);
    const callDateTime = new Date(callTime);

    const supervisorId = (token as JwtPayload).supervisorId;

    // Parse date strings as local dates, not UTC
    const parseLocalDate = (dateStr: string | Date): Date | null => {
      if (dateStr instanceof Date) {
        return Number.isNaN(dateStr.getTime()) ? null : dateStr;
      }
      const normalized = dateStr.trim();
      if (!normalized || normalized.toLowerCase() === 'invalid date') return null;
      const [year, month, day] = normalized.split('-').map(Number);
      if ([year, month, day].some(Number.isNaN)) return null;
      const parsed = new Date(year, month - 1, day);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const parsedCallDate = parseLocalDate(callDate);
    const parsedShiftDate = parseLocalDate(shiftDate);
    const normalizedShiftDateTo = typeof shiftDateTo === 'string' ? shiftDateTo.trim() : undefined;
    const parsedShiftDateTo = normalizedShiftDateTo ? parseLocalDate(normalizedShiftDateTo) : null;

    if (
      !parsedCallDate ||
      !parsedShiftDate ||
      (normalizedShiftDateTo && !parsedShiftDateTo) ||
      Number.isNaN(shiftDateTime.getTime()) ||
      Number.isNaN(callDateTime.getTime())
    ) {
      return res.status(400).json({error: 'Invalid date or time values provided'});
    }

    const callOutData: CallOutCreationAttributes = {
      shift_date: parsedShiftDate,
      shift_date_to: parsedShiftDateTo,
      callout_date: parsedCallDate,
      leave_type_id: leaveType,
      employee_id: selectedEmployeeId,
      shift_time: shiftDateTime,
      shift_type: null,
      callout_time: callDateTime,
      supervisor_id: supervisorId,
      supervisor_comments: comment,
      left_early_mins: leftEarlyMinutes ?? 0,
      arrived_late_mins: lateArrivalMinutes
    };

    const activeSchedule = await getEmployeeScheduleFromDB.activeByEmployeeId(selectedEmployeeId);
    if (!activeSchedule) {
      return res.status(400).json({
        error:
          'Selected employee does not have an active schedule. Add or update employee schedule first.'
      });
    }

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
      'brester.r@portseattle.org',
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
