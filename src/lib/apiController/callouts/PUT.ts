// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {JwtPayload} from '../../../auth';
import {Request, Response} from 'express';
import type {ApiData} from '../../../lib/apiController';
import {DefaultCallOutFormData} from '../../../client-api/employees';
import {updateCallOutInDB} from '../../../lib/db/controller';
import {getLoginCredentialFromDB} from '../../../lib/db/controller/LoginCredential';
import {CallOutWithAssociations} from '../../../lib/db/models/Callout';
import {EditableCalloutProps} from '../../db/controller/Callout/helpers';
import {logTemplate} from '../../utils/server';

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
      shiftDateTo,
      shiftTime,
      leaveType,
      employeeName,
      leftEarlyMinutes,
      lateArrivalMinutes
    } = req.body.formData as DefaultCallOutFormData & {callDate: string; shiftDate: string; shiftDateTo?: string};

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

    const tokenPayload = token as JwtPayload;
    let supervisorId: string | undefined = tokenPayload.supervisorId;
    if (!supervisorId) {
      if (!tokenPayload.email) {
        return res
          .status(401)
          .json({error: 'Unable to determine supervisor ID from authentication token'});
      }
      const loginCredential = await getLoginCredentialFromDB.byEmail(tokenPayload.email);
      supervisorId = loginCredential?.supervisor_info?.id;
    }
    if (!supervisorId) {
      return res
        .status(401)
        .json({error: 'Unable to determine supervisor ID from authentication token'});
    }

    // Parse date strings as local dates, not UTC
    const parseLocalDate = (dateStr: string | Date): Date | null => {
      if (dateStr instanceof Date) {
        return Number.isNaN(dateStr.getTime()) ? null : dateStr;
      }
      const normalized = dateStr.trim();
      if (!normalized || normalized.toLowerCase() === 'invalid date') return null;
      const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!match) return null;
      const [, yearStr, monthStr, dayStr] = match;
      const year = Number(yearStr);
      const month = Number(monthStr);
      const day = Number(dayStr);
      if ([year, month, day].some(Number.isNaN)) return null;
      const parsed = new Date(year, month - 1, day);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const parseDateTime = (dateStr: string | Date, timeStr: string): Date | null => {
      // Accept ISO timestamps or time-only strings; prefer combining date+time for time-only.
      if (timeStr.includes('T')) {
        const isoDate = new Date(timeStr);
        if (!Number.isNaN(isoDate.getTime())) {
          return isoDate;
        }
      }

      const baseDate = parseLocalDate(dateStr);
      if (!baseDate) {
        return null;
      }
      const [hh, mm, ss = '0'] = timeStr.split(':');
      const hours = Number(hh);
      const minutes = Number(mm);
      const seconds = Number(ss);
      if ([hours, minutes, seconds].some(Number.isNaN)) {
        return null;
      }
      return new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        hours,
        minutes,
        seconds
      );
    };

    const parsedCallDate = parseLocalDate(callDate);
    const parsedShiftDate = parseLocalDate(shiftDate);
    const normalizedShiftDateTo = typeof shiftDateTo === 'string' ? shiftDateTo.trim() : undefined;
    const parsedShiftDateTo = normalizedShiftDateTo ? parseLocalDate(normalizedShiftDateTo) : null;
    const callDateTime = parseDateTime(callDate, callTime);
    const shiftDateTime = parseDateTime(shiftDate, shiftTime);

    if (
      !parsedCallDate ||
      !parsedShiftDate ||
      (normalizedShiftDateTo && !parsedShiftDateTo) ||
      !callDateTime ||
      !shiftDateTime ||
      Number.isNaN(callDateTime.getTime()) ||
      Number.isNaN(shiftDateTime.getTime())
    ) {
      return res.status(400).json({error: 'Invalid date or time values provided'});
    }

    const callOutData: EditableCalloutProps = {
      shift_date: parsedShiftDate,
      shift_date_to: parsedShiftDateTo,
      callout_date: parsedCallDate,
      leave_type_id: leaveType,
      employee_id: employeeName,
      shift_time: shiftDateTime,
      shift_type: null,
      callout_time: callDateTime,
      edited_by_supervisor_id: supervisorId,
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
    return res.status(500).json({error: String(error)});
  }
}

export {editEmployeeCallOutApiHandler};
