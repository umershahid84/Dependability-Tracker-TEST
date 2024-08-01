import type { ApiData } from '../../index';
import { Request, Response } from 'express';
import { getLeaveTypeFromDB } from '../../../db/controller';
import { LeaveTypeAttributes } from '../../../db/models/types';
import { logTemplate } from '../../../utils/server';

export default async function getLeaveTypesApiHandler(
  req: Request,
  res: Response<ApiData<LeaveTypeAttributes[]>>
) {
  try {
    const leaveTypes = await getLeaveTypeFromDB.all();
    return res.status(200).json({ data: leaveTypes });
  } catch (error) {
    const errMessage = '❌ Error in getLeaveTypesApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: 'Error getting Leave Types' });
  }
}

export { getLeaveTypesApiHandler };
