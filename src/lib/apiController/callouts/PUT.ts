// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { JwtPayload } from '../../../auth';
import { Request, Response } from 'express';
import type { ApiData } from '../../../lib/apiController';
import { DefaultCallOutFormData } from '../../../client-api';
import { updateCallOutInDB } from '../../../lib/db/controller';
import { CallOutWithAssociations } from '../../../lib/db/models/Callout';
import { EditableCalloutProps } from '../../db/controller/Callout/helpers';
import { logTemplate } from '../../utils/server';

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
    } = req.body.formData as DefaultCallOutFormData & { callDate: string; shiftDate: string };

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

    const callOutData: EditableCalloutProps = {
      shift_date: shiftDate,
      callout_date: callDate,
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
      return res.status(500).json({ error: 'Failed to update callout' });
    }

    res.status(200).json({ message: 'Callout Updated Successfully', data: callOut });
  } catch (error) {
    const errMessage = '❌ Error in editEmployeeCallOutApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return {
      error: String(error)
    };
  }
}

export { editEmployeeCallOutApiHandler };
