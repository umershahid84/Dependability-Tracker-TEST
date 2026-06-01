import {Request, Response} from 'express';
import {ApiData} from '../../index';
import {buildEmployeeCalendarProjection, EmployeeCalendarProjection} from '../../../db/controller';
import {logTemplate} from '../../../utils/server';

export default async function getEmployeeCalendarApiHandler(
  req: Request,
  res: Response<ApiData<EmployeeCalendarProjection>>
) {
  try {
    const {employeeId, startDate, endDate} = req.query as {
      employeeId?: string;
      startDate?: string;
      endDate?: string;
    };

    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'employeeId, startDate, and endDate are required query params'
      });
    }

    const data = await buildEmployeeCalendarProjection({employeeId, startDate, endDate});
    return res.status(200).json({data});
  } catch (error) {
    const errMessage = '❌ Error in getEmployeeCalendarApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({error: String(error)});
  }
}

export {getEmployeeCalendarApiHandler};
