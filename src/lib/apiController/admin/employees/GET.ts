import {
  getEmployeeFromDB,
  ModelWithPagination,
  getSupervisorFromDB,
  EmployeeWithAssociations
} from '../../../db/controller';
import type { ApiData } from '../../index';
import { Request, Response } from 'express';
import { SupervisorWithAssociations } from '../../../db/models/Supervisor';
import { logTemplate } from '../../../utils/server';

export default async function getEmployeesApiHandler(
  req: Request,
  res: Response<ApiData<ModelWithPagination<EmployeeWithAssociations>>>
) {
  try {
    let { sortBy, limit, offset } = req.query as {
      sortBy: string | undefined;
      limit: string | undefined;
      offset: string | undefined;
    };

    if (limit === '-1') {
      limit = undefined;
    }

    const [allEmployees, supervisors]: [EmployeeWithAssociations[], SupervisorWithAssociations[]] =
      (await Promise.all([getEmployeeFromDB.all(), getSupervisorFromDB.all()])) as [
        EmployeeWithAssociations[],
        SupervisorWithAssociations[]
      ];

    if (sortBy === 'isNonSupervisor') {
      const employeesData: ModelWithPagination<EmployeeWithAssociations> =
        (await getEmployeeFromDB.all.nonSupervisors({
          limit,
          offset
        })) as ModelWithPagination<EmployeeWithAssociations>;

      employeesData.data.map(employee => {
        employee.role = 'Employee';
      });

      return res.status(200).json({
        message: 'Employees',
        data: { ...employeesData }
      });
    } else {
      // if there are no query parameters, default to returning all employees
      if (!sortBy) {
        res.status(200).json({
          message: 'Employees',
          data: {
            offset: 0,
            data: allEmployees,
            limit: allEmployees.length,
            numRecords: allEmployees.length
          }
        });
        return;
      }

      const admins = supervisors.filter(supervisor => supervisor.is_admin);

      let employeesData: ModelWithPagination<EmployeeWithAssociations> | null =
        (await getEmployeeFromDB.all({
          limit,
          offset,
          sortBy
        })) as ModelWithPagination<EmployeeWithAssociations>;

      switch (sortBy) {
        case 'name':
          // sort the employees alphabetically by name
          employeesData.data.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          break;
        case 'isSupervisor': {
          const supervisorData = (await getSupervisorFromDB.all({
            limit,
            offset,
            sortBy
          })) as ModelWithPagination<SupervisorWithAssociations>;

          const matchingSupervisors: EmployeeWithAssociations[] = [];

          allEmployees?.map(employee => {
            if (
              supervisorData?.data?.some(
                supervisor => supervisor.supervisor_info.id === employee.id
              )
            ) {
              matchingSupervisors.push(employee);
            }
          });

          employeesData.data = matchingSupervisors;
          employeesData.numRecords = supervisors.length;
          break;
        }
        case 'isAdmin': {
          const adminData = (await getSupervisorFromDB.admins({
            limit,
            offset,
            sortBy
          })) as ModelWithPagination<SupervisorWithAssociations>;

          const matchingAdmins: EmployeeWithAssociations[] = [];

          allEmployees?.map(employee => {
            if (
              adminData?.data?.some(
                supervisor => supervisor.supervisor_info.id === employee.id && supervisor.is_admin
              )
            ) {
              matchingAdmins.push(employee);
            }
          });

          employeesData.data = matchingAdmins;
          employeesData.numRecords = admins.length;
          break;
        }
        default:
          break;
      }

      employeesData?.data?.map(employee => {
        let roles: string[] = [];
        // determine employee roles

        if (
          supervisors?.some(
            supervisor => supervisor.supervisor_info.id === employee.id && supervisor.is_admin
          )
        ) {
          roles.push('Admin');
          roles.push('Supervisor');
        } else if (
          supervisors?.some(
            supervisor => supervisor.supervisor_info.id === employee.id && !supervisor.is_admin
          )
        ) {
          roles.push('Supervisor');
        } else {
          roles.push('Employee');
        }

        employee.role = roles.join(', ');
      });

      res.status(200).json({
        message: 'Employees',
        data: { ...employeesData }
      });
    }
  } catch (error) {
    const errMessage = '❌ Error in getEmployeesApiHandler:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    res.status(500).json({ error: String(error) });
  }
}

export { getEmployeesApiHandler };
