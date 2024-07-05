// CRUD Controller for the Employee Table
// CRUD: Create, Read, Update, Delete
import {
  EmployeeAttributes,
  EmployeeWithAssociations,
  EmployeeCreationAttributes
} from '../../models/types';
import {Employee} from '../../models';
import {
  populateEmployeeWithDivisions,
  validateEmployeeDivisionIds,
  validateEmployeeName
} from './helpers';

// (C)reate
export const createEmployeeInDB = async (
  withEmployeeData: EmployeeCreationAttributes
): Promise<EmployeeWithAssociations | null> => {
  // validate the division ids

  validateEmployeeDivisionIds(withEmployeeData.division_ids);
  validateEmployeeName(withEmployeeData.name);

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
  all: async (): Promise<EmployeeWithAssociations[]> => {
    try {
      const employees = await Employee.findAll();
      return await Promise.all(
        employees.map(employee =>
          populateEmployeeWithDivisions(employee.get({plain: true}) as EmployeeAttributes)
        )
      );
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching employees: ${error}`);
    }
  }
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
