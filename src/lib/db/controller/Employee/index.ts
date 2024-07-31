// CRUD Controller for the Employee Table
// CRUD: Create, Read, Update, Delete
import {
  EmployeeAttributes,
  EmployeeWithAssociations,
  EmployeeCreationAttributes,
  SupervisorWithAssociations
} from '../../models/types';
import {
  validateEmployeeName,
  validateEmployeeDivisionIds,
  populateEmployeeWithDivisions
} from './helpers';
import {
  getSupervisorFromDB,
  updateSupervisorInDB,
  createSupervisorInDB,
  deleteSupervisorFromDB
} from '../Supervisor';
import {Op} from 'sequelize';
import {Employee} from '../../models';
import {getDivisionFromDB} from '../Division';
import {EmployeeFormData} from '../../../../client-api';
import {ModelWithPagination, PaginationQueryParams, convertOptions} from '..';

// (C)reate
export const createEmployeeInDB = async (
  withEmployeeData: EmployeeCreationAttributes
): Promise<EmployeeWithAssociations | null> => {
  validateEmployeeName(withEmployeeData.name);
  validateEmployeeDivisionIds(withEmployeeData.division_ids);

  try {
    const createdEmployee = (await Employee.create(withEmployeeData)).get({
      // istanbul ignore next
      plain: true
    }) as EmployeeAttributes;

    return populateEmployeeWithDivisions(createdEmployee);
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error creating employee: ${error}`);
  }
};

// (R)ead
export const getEmployeeFromDB = {
  byId: async (employeeId: string): Promise<EmployeeWithAssociations | null> => {
    try {
      const employee: EmployeeAttributes | null | undefined = (
        await Employee.findByPk(employeeId)
      )?.get({
        plain: true
      });
      return employee ? populateEmployeeWithDivisions(employee) : null;
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching employee: ${error}`);
    }
  },
  byName: async (employeeName: string): Promise<EmployeeWithAssociations | null> => {
    try {
      const employee: EmployeeAttributes | null | undefined = (
        await Employee.findOne({
          where: {name: employeeName}
        })
      )?.get({plain: true});

      return employee ? populateEmployeeWithDivisions(employee) : null;
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching employee: ${error}`);
    }
  },
  all: (() => {
    const _ = async (
      options?: PaginationQueryParams
    ): Promise<EmployeeWithAssociations[] | ModelWithPagination<EmployeeWithAssociations>> => {
      const paginationOptions = options ?? {};

      const convertedOptions = convertOptions(paginationOptions);

      try {
        const employees = await Employee.findAll(convertedOptions);

        if (!paginationOptions || Object.keys(convertedOptions).length === 1) {
          return await Promise.all(
            employees.map(employee =>
              populateEmployeeWithDivisions(employee.get({plain: true}) as EmployeeAttributes)
            )
          );
        } else {
          return {
            data: await Promise.all(
              employees.map(employee =>
                populateEmployeeWithDivisions(employee.get({plain: true}) as EmployeeAttributes)
              )
            ),

            limit: paginationOptions.limit ? Number(paginationOptions.limit) : 0,
            offset: paginationOptions.offset ? Number(paginationOptions.offset) : 0,
            numRecords: (await Employee.count()) ?? 0
          };
        }
      } catch (error) {
        // istanbul ignore next
        throw new Error(`\n❌ Error fetching employees: ${error}`);
      }
    };

    const byDivision = async (divisionId: string): Promise<EmployeeWithAssociations[]> => {
      try {
        const _employees: EmployeeWithAssociations[] = (
          (await employeeModelController.getEmployeeFromDB.all()) as EmployeeWithAssociations[]
        ).reduce((acc: EmployeeWithAssociations[], employee: EmployeeWithAssociations) => {
          if (employee.divisions.map(division => division.id).includes(divisionId)) {
            acc.push(employee);
          }
          return acc;
        }, [] as EmployeeWithAssociations[]);
        // istanbul ignore next
        return _employees ?? [];
      } catch (error) {
        // istanbul ignore next
        throw new Error(`\n❌ Error fetching employees: ${error}`);
      }
    };

    const nonSupervisors = async (
      options?: PaginationQueryParams
    ): Promise<EmployeeWithAssociations[] | ModelWithPagination<EmployeeWithAssociations>> => {
      const paginationOptions = options ?? {};

      const convertedOptions = convertOptions(paginationOptions);

      const supervisors: SupervisorWithAssociations[] =
        (await getSupervisorFromDB.all()) as SupervisorWithAssociations[];
      const supervisorIds = supervisors.map(supervisor => supervisor.supervisor_info.id);

      try {
        const employees = await Employee.findAll({
          where: {
            id: {
              [Op.notIn]: supervisorIds
            }
          },
          ...convertedOptions
        });

        const employeesToReturn = await Promise.all(
          employees.map(employee =>
            populateEmployeeWithDivisions(employee.get({plain: true}) as EmployeeAttributes)
          )
        );
        if (!paginationOptions || Object.keys(convertedOptions).length === 1) {
          return employeesToReturn;
        } else {
          return {
            data: employeesToReturn,
            limit: paginationOptions.limit ? Number(paginationOptions.limit) : 0,
            offset: paginationOptions.offset ? Number(paginationOptions.offset) : 0,
            numRecords:
              (
                (await getEmployeeFromDB.all.nonSupervisors()) as unknown as SupervisorWithAssociations[]
              ).length ?? 0
          };
        }
      } catch (error) {
        // istanbul ignore next
        throw new Error(`\n❌ Error fetching employees: ${error}`);
      }
    };

    return Object.assign(_, {
      byDivision,
      nonSupervisors
    });
  })()
};

// (U)pdate
export const updateEmployeeInDB = {
  employeeName: async (employeeId: string, name: string): Promise<number | null> => {
    try {
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        throw new Error(`\n❌ Employee with ID ${employeeId} not found`);
      }

      // Update the employee here
      const updatedEmployee = await Employee.update({name}, {where: {id: employeeId}});

      // istanbul ignore next
      if (updatedEmployee[0] === 0) {
        throw new Error(`\n❌ Error updating employee: ${employeeId}, check the name provided`);
      }

      return updatedEmployee[0];
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error updating employee: ${error}`);
    }
  },
  addDivisionToEmployee: async (employeeId: string, divisionId: string): Promise<number | null> => {
    try {
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        throw new Error(`\n❌ Employee with ID ${employeeId} not found`);
      }

      // Update the employee here
      const updatedEmployee = await Employee.update(
        {division_ids: [...employee.division_ids, divisionId]},
        {where: {id: employeeId}}
      );

      // istanbul ignore next
      if (updatedEmployee[0] === 0) {
        throw new Error(
          `\n❌ Error updating employee: ${employeeId}, check the division ID provided`
        );
      }

      return updatedEmployee[0];
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error updating employee: ${error}`);
    }
  },
  removeDivisionFromEmployee: async (
    employeeId: string,
    divisionId: string
  ): Promise<number | null> => {
    try {
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        throw new Error(`\n❌ Employee with ID ${employeeId} not found`);
      }

      // Update the employee here
      const updatedEmployee = await Employee.update(
        {
          division_ids: employee.division_ids.filter(id => id !== divisionId)
        },
        {where: {id: employeeId}}
      );

      // istanbul ignore next
      if (updatedEmployee[0] === 0) {
        throw new Error(
          `\n❌ Error updating employee: ${employeeId}, check the division ID provided`
        );
      }

      return updatedEmployee[0];
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error updating employee: ${error}`);
    }
  },
  withEmployeeData: async (
    employeeId: string,
    withEmployeeData: EmployeeFormData
  ): Promise<number | null> => {
    validateEmployeeName(withEmployeeData.name);
    validateEmployeeDivisionIds(withEmployeeData.division.split(','));

    try {
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        throw new Error(`\n❌ Employee with ID ${employeeId} not found`);
      }

      if (withEmployeeData.isAdmin || withEmployeeData.isSupervisor) {
        const divisionIds = (await getDivisionFromDB.all()).map(division => division.id);

        // if the division ids do not equal all the division ids in the database then throw an error
        if (!withEmployeeData.division.split(',').every(id => divisionIds.includes(id.trim()))) {
          throw new Error(
            `\n❌ Invalid division ID provided. Supervisors and Admins must belong to all divisions.`
          );
        }
      }

      // Update the employee here
      const updatedEmployee = await Employee.update(
        {
          name: withEmployeeData.name,
          division_ids: withEmployeeData.division.split(',').map(id => id.trim())
        },
        {where: {id: employeeId}}
      );

      //if the admin is set to zero ensure that if a supervisor exists, they are not an admin
      if (withEmployeeData.isAdmin === '0') {
        const supervisor = await getSupervisorFromDB.byEmployeeId(employeeId);
        if (supervisor && supervisor.is_admin) {
          await updateSupervisorInDB.setAdminStatus(supervisor.id, false);
        }
      }

      //if the admin is set to one ensure that if a supervisor exists, they are an admin
      // creates a supervisor if one does not exist and sets them as an admin
      if (withEmployeeData.isAdmin === '1') {
        let supervisor = await getSupervisorFromDB.byEmployeeId(employeeId);

        if (!supervisor) {
          supervisor = await createSupervisorInDB({
            employee_id: employeeId,
            is_admin: true
          });
        }

        if (supervisor && !supervisor.is_admin) {
          await updateSupervisorInDB.setAdminStatus(supervisor.id, true);
        }
      }

      //if the supervisor is set to zero ensure that if a supervisor exists, they are deleted
      if (withEmployeeData.isSupervisor === '0') {
        const supervisor = await getSupervisorFromDB.byEmployeeId(employeeId);
        if (supervisor) {
          await deleteSupervisorFromDB(supervisor.id);
        }
      }

      //if the supervisor is set to one ensure that if a supervisor exists, they are created
      if (withEmployeeData.isSupervisor === '1') {
        const supervisor = await getSupervisorFromDB.byEmployeeId(employeeId);
        if (!supervisor) {
          await createSupervisorInDB({
            employee_id: employeeId,
            is_admin: withEmployeeData.isAdmin === '1'
          });
        }
      }

      // istanbul ignore next
      if (updatedEmployee[0] === 0) {
        throw new Error(`\n❌ Error updating employee: ${employeeId}`);
      }

      return updatedEmployee[0];
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error updating employee: ${error}`);
    }
  }
};

// (D)elete
export const deleteEmployeeFromDB = async (employeeId: string): Promise<number | null> => {
  try {
    // look for a supervisor and delete them if they exist
    const supervisor = await getSupervisorFromDB.byEmployeeId(employeeId);
    const deletedEmployee = await Employee.destroy({where: {id: employeeId}});

    if (supervisor) {
      await deleteSupervisorFromDB(supervisor.id);
    }
    return deletedEmployee;
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error deleting employee: ${error}`);
  }
};

export const employeeModelController = {
  getEmployeeFromDB,
  createEmployeeInDB,
  updateEmployeeInDB,
  deleteEmployeeFromDB
};

export default employeeModelController;

export type {EmployeeWithAssociations, EmployeeAttributes, EmployeeCreationAttributes};
