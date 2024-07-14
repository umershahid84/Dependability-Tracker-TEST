import {
  createEmployeeInDB,
  createSupervisorInDB,
  EmployeeWithAssociations
} from '../../../db/controller';
import {Request} from 'express';
import {NextRequest} from 'next/server';
import type {ApiData} from '../../index';
import type {NextApiResponse} from 'next';
import {CreateEmployeeData} from '../../../../client-api/create-employee';
import {SupervisorWithAssociations} from '../../../db/models/Supervisor';

export default async function postEmployeesApiHandler(
  req: NextRequest & Request,
  res: NextApiResponse<ApiData<EmployeeWithAssociations>>
) {
  try {
    const {body} = req as {body: CreateEmployeeData};
    const newEmployee: EmployeeWithAssociations | null = await createEmployeeInDB({
      name: body.name,
      division_ids: body.division_ids
    });

    if (!newEmployee) {
      return res.status(500).json({error: 'Error creating employee'});
    }

    if (body.isSupervisor) {
      const supervisor: SupervisorWithAssociations | null = await createSupervisorInDB({
        employee_id: newEmployee.id,
        is_admin: body.isAdmin
      });

      if (!supervisor) {
        return res
          .status(500)
          .json({error: 'Error promoting employee to supervisor. Employee created.'});
      }
    }

    return res.status(200).json({data: newEmployee, message: 'Employee created successfully'});
  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({error: String(error)});
  }
}

export {postEmployeesApiHandler};
