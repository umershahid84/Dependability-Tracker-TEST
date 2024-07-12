// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {Request} from 'express';
import {
  getEmployeeFromDB,
  getSupervisorFromDB,
  EmployeeWithAssociations
} from '../../../lib/db/controller';
import type {ApiData} from '../sign-up';
import type {NextApiResponse} from 'next';
import {getJwtTokenForAPI, JwtPayload, Redirect} from '../../../auth';
import {SupervisorWithAssociations} from '../../../lib/db/models/Supervisor';
import {ModelWithPagination} from '../../../lib/db/controller/Employee/helpers';

export default async function adminEmployeesApiHandler(
  req: Request,
  res: NextApiResponse<ApiData<ModelWithPagination<EmployeeWithAssociations>>>
) {
  const token: JwtPayload | Redirect | undefined = getJwtTokenForAPI(req, res);

  if (!token || (token as Redirect)?.redirect) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  try {
    let {sortBy, limit, offset} = req.query as {
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
      case 'isSupervisor':
        const supervisorData: ModelWithPagination<SupervisorWithAssociations> =
          (await getSupervisorFromDB.all({
            limit,
            offset,
            sortBy
          })) as ModelWithPagination<SupervisorWithAssociations>;

        let matchingSupervisors: EmployeeWithAssociations[] = [];

        allEmployees.map(employee => {
          if (
            supervisorData?.data?.some(supervisor => supervisor.supervisor_info.id === employee.id)
          ) {
            matchingSupervisors.push(employee);
          }
        });

        employeesData.data = matchingSupervisors;
        employeesData.numRecords = supervisors.length;
        break;
      case 'isAdmin':
        const adminData: ModelWithPagination<SupervisorWithAssociations> =
          (await getSupervisorFromDB.admins({
            limit,
            offset,
            sortBy
          })) as ModelWithPagination<SupervisorWithAssociations>;

        let matchingAdmins: EmployeeWithAssociations[] = [];

        allEmployees.map(employee => {
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
      default:
        break;
    }

    employeesData.data.map(employee => {
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
      data: {...employeesData}
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({error: String(error)});
  }
}

export const config = {
  api: {
    externalResolver: true
  }
};
