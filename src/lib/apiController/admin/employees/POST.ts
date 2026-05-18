import {
  createEmployeeInDB,
  createSupervisorInDB,
  EmployeeWithAssociations,
  getEmployeeFromDB,
  upsertEmployeeScheduleVersionInDB
} from '../../../db/controller';
import type { ApiData } from '../../index';
import { Request, Response } from 'express';
import { logTemplate } from '../../../utils/server';
import { validateAddEmployeeForm } from './helpers';
import { SupervisorWithAssociations } from '../../../db/models/Supervisor';


export default async function postEmployeesApiHandler(
  req: Request,
  res: Response<ApiData<EmployeeWithAssociations>>
) {
  try {
    const { body } = req as {
      body: any;
    };

    await validateAddEmployeeForm(body);

    const isAdmin = body.isAdmin === true || body.isAdmin === '1';
    const isSupervisor = body.isSupervisor === true || body.isSupervisor === '1';

    const newEmployee: EmployeeWithAssociations | null = await createEmployeeInDB({
      name: body.name,
      division_ids: body.division.split(',')
    });

    if (!newEmployee) {
      return res.status(500).json({ error: 'Error creating employee' });
    }

    if (isAdmin && !isSupervisor) {
      return res
        .status(400)
        .json({ error: 'Cannot create an admin employee without being a supervisor' });
    }

    if (isSupervisor) {
      const supervisor: SupervisorWithAssociations | null = await createSupervisorInDB({
        employee_id: newEmployee.id,
        is_admin: isAdmin
      });

      if (!supervisor) {
        return res
          .status(500)
          .json({ error: 'Error promoting employee to supervisor. Employee created.' });
      }
    }

    await upsertEmployeeScheduleVersionInDB(newEmployee.id, {
      shiftStartTime: body.shiftStartTime,
      shiftEndTime: body.shiftEndTime,
      daysOffType: body.daysOffType,
      employeeStatus: body.employeeStatus
    });

    const createdEmployeeWithSchedule = await getEmployeeFromDB.byId(newEmployee.id);
    if (!createdEmployeeWithSchedule) {
      return res
        .status(500)
        .json({ error: 'Failed to retrieve newly created employee after creation' });
    }

    return res
      .status(200)
      .json({ data: createdEmployeeWithSchedule, message: 'Employee created successfully' });
  } catch (error) {
    const errMessage = '❌ Error in postEmployeesApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { postEmployeesApiHandler };
