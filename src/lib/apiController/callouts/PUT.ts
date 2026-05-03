// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {JwtPayload} from '../../../auth';
import {Request, Response} from 'express';
import type {ApiData} from '../../../lib/apiController';
import {DefaultCallOutFormData} from '../../../client-api/employees';
import {updateCallOutInDB} from '../../../lib/db/controller';
import {CallOutWithAssociations} from '../../../lib/db/models/Callout';
import {EditableCalloutProps} from '../../db/controller/Callout/helpers';
import {logTemplate} from '../../utils/server';
import {SUPERVISOR_COMMENTS_MAX_LENGTH} from '../../utils/shared/validators';

// inviteToken, password, email
export default async function editEmployeeCallOutApiHandler( //NOSONAR
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
    } = req.body.formData as DefaultCallOutFormData & {callDate: string; shiftDate: string};

    const id = req.body.id as string;

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

    if (comment.length > SUPERVISOR_COMMENTS_MAX_LENGTH) {
      return res.status(400).json({error: `Supervisor Comments must not exceed ${SUPERVISOR_COMMENTS_MAX_LENGTH} characters`});
    }

    const supervisorId = (token as JwtPayload).supervisorId;

    // Parse date strings as local dates, not UTC
    const parseLocalDate = (dateStr: string | Date): Date => {
      if (dateStr instanceof Date) return dateStr;
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const parseDateTime = (dateStr: string | Date, timeStr: string): Date => {
      // Accept ISO timestamps or time-only strings; prefer combining date+time for time-only.
      if (timeStr.includes('T')) {
        const isoDate = new Date(timeStr);
        if (!Number.isNaN(isoDate.getTime())) {
          return isoDate;
        }
      }

      const baseDate = parseLocalDate(dateStr);
      const [hh, mm, ss = '0'] = timeStr.split(':');
      const hours = Number(hh);
      const minutes = Number(mm);
      const seconds = Number(ss);
      return new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        hours,
        minutes,
        seconds
      );
    };

    const callDateTime = parseDateTime(callDate, callTime);
    const shiftDateTime = parseDateTime(shiftDate, shiftTime);

    if (Number.isNaN(callDateTime.getTime()) || Number.isNaN(shiftDateTime.getTime())) {
      return res.status(400).json({error: 'Invalid date or time values provided'});
    }

    const callOutData: EditableCalloutProps = {
      shift_date: parseLocalDate(shiftDate),
      callout_date: parseLocalDate(callDate),
      leave_type_id: leaveType,
      employee_id: employeeName,
      shift_time: shiftDateTime,
      callout_time: callDateTime,
      supervisor_id: supervisorId,
      supervisor_comments: comment,
      left_early_mins: Number(leftEarlyMinutes ?? 0),
      arrived_late_mins: Number(lateArrivalMinutes ?? 0)
    };

    const callOut: CallOutWithAssociations | null = await updateCallOutInDB(id, callOutData);

    if (!callOut) {
      return res.status(500).json({error: 'Failed to update callout'});
    }

    res.status(200).json({message: 'Callout Updated Successfully', data: callOut});
  } catch (error) {
    const errMessage = '❌ Error in editEmployeeCallOutApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return {
      error: String(error)
    };
  }
}

export {editEmployeeCallOutApiHandler};
