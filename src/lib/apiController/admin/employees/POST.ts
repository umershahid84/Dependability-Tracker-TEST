import {
  createEmployeeInDB,
  createSupervisorInDB,
  EmployeeWithAssociations
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

    body.isAdmin = body.isAdmin === '1';
    body.isSupervisor = body.isSupervisor === '1';

    const newEmployee: EmployeeWithAssociations | null = await createEmployeeInDB({
      name: body.name,
      division_ids: body.division.split(',')
    });

    if (!newEmployee) {
      return res.status(500).json({ error: 'Error creating employee' });
    }

    if (body.isAdmin && !body.isSupervisor) {
      return res
        .status(400)
        .json({ error: 'Cannot create an admin employee without being a supervisor' });
    }

    if (body.isSupervisor) {
      const supervisor: SupervisorWithAssociations | null = await createSupervisorInDB({
        employee_id: newEmployee.id,
        is_admin: body.isAdmin === '1'
      });

      if (!supervisor) {
        return res
          .status(500)
          .json({ error: 'Error promoting employee to supervisor. Employee created.' });
      }
    }

    return res.status(200).json({ data: newEmployee, message: 'Employee created successfully' });
  } catch (error) {
    const errMessage = '❌ Error in postEmployeesApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    return res.status(500).json({ error: String(error) });
  }
}

export { postEmployeesApiHandler };
