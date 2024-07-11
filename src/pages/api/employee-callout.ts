// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import type {ApiData} from './sign-up';
import {getJwtTokenForAPI} from '@/auth';
import type {NextApiResponse} from 'next';

// inviteToken, password, email

export default async function employeeCalloutApiHandler(
  req: Request,
  res: NextApiResponse<ApiData>
) {
  const token = getJwtTokenForAPI(req, res);

  if (!token) {
    return;
  }

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
  console.log('\n\nCALLOUT REQUEST:', req.body, '\n\n');

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

  res.status(200).json({message: 'Callout Created Successfully'});
}

export const config = {
  api: {
    externalResolver: true
  }
};
