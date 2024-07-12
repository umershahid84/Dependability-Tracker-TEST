// CRUD Controller for the Employee Table
// CRUD: Create, Read, Update, Delete
import {
  EmployeeAttributes,
  EmployeeWithAssociations,
  EmployeeCreationAttributes,
  SupervisorWithAssociations
} from '../../models/types';
import {
  convertOptions,
  ModelWithPagination,
  validateEmployeeName,
  PaginationQueryParams,
  validateEmployeeDivisionIds,
  populateEmployeeWithDivisions
} from './helpers';
import {Op} from 'sequelize';
import {Employee} from '../../models';
import {getSupervisorFromDB} from '../Supervisor';

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
    ): Promise<EmployeeWithAssociations[]> => {
      const paginationOptions = options ?? {};

      const supervisors: SupervisorWithAssociations[] =
        (await getSupervisorFromDB.all()) as SupervisorWithAssociations[];
      const supervisorIds = supervisors.map(supervisor => supervisor.supervisor_info.id);

      try {
        const employees = await Employee.findAll({
          where: {
            id: {
              [Op.notIn]: supervisorIds
            }
          }
        });

        return await Promise.all(
          employees.map(employee =>
            populateEmployeeWithDivisions(employee.get({plain: true}) as EmployeeAttributes)
          )
        );
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
  }
};

// (D)elete
export const deleteEmployeeFromDB = async (employeeId: string): Promise<number | null> => {
  try {
    const deletedEmployee = await Employee.destroy({where: {id: employeeId}});
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
