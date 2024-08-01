// CRUD Controller for the Employee Table
// CRUD: Create, Read, Update, Delete

import { uuidV4Regex } from '../../../utils';
import { logTemplate } from '../../../utils/server';
import { Employee, Division } from '../../models';
import { EmployeeAttributes, DivisionAttributes, EmployeeWithAssociations } from '../../models/types';

/**
 * This is a hack really. There is a way to properly associate the Employee and Division models
 * through * another table, hence a relational database. However, for the sake of simplicity, we are
 * just going to store the division IDs in an array in the Employee model. This function will fetch
 * the divisions associated with an employee and the front-end is none the wiser.
 * @param employeeId - The ID of the employee whose divisions we want to fetch
 * @returns
 */
export const getEmployeeDivisions = async (employeeId: string): Promise<DivisionAttributes[]> => {
  try {
    const employee = (await Employee.findByPk(employeeId))?.get({ plain: true });
    // istanbul ignore next
    if (!employee) {
      throw new Error(`\n❌ Employee with ID ${employeeId} not found`);
    }
    let divisionIds = employee.division_ids;
    const divisions = [];

    if (!Array.isArray(divisionIds) && typeof divisionIds === 'string') {
      divisionIds = JSON.parse(divisionIds);
    }

    for (const divisionId of divisionIds) {
      const division = await Division.findByPk(divisionId);
      // istanbul ignore next
      if (!division) {
        console.error(logTemplate(`\n❌ Division with ID ${divisionId} not found`, 'error'));
      }
      divisions.push(division);
    }
    const _divisions = divisions?.map(division => division?.get({ plain: true })) ?? [];

    return _divisions as DivisionAttributes[];
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error fetching employee divisions: ${error}`);
  }
};

/**
 * Fetch the divisions associated with an employee and populate the employee object with the data
 * @param employee - The employee object to populate with divisions
 * @returns
 */
export const populateEmployeeWithDivisions = async (
  employee: EmployeeAttributes
): Promise<EmployeeWithAssociations> => {
  // populate the employee object with the division data
  const divisions = await getEmployeeDivisions(employee.id);

  // istanbul ignore next
  if (divisions.length === 0) {
    console.error(logTemplate(`\n❌ Error creating employee: Employee must belong to at least one division`, 'error'));
  }

  return {
    id: employee.id,
    name: employee.name,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
    divisions
  };
};

/**
 * Ensures that the division IDs are valid UUIDs and that at least one division ID is provided
 * @param divisionIds - The division IDs to validate
 */
export const validateEmployeeDivisionIds = (divisionIds: string[]): void => {
  if (divisionIds.length === 0) {
    throw new Error(`\n❌ Error creating employee: division_ids cannot be empty`);
  }

  for (const divisionId of divisionIds) {
    if (typeof divisionId !== 'string') {
      throw new Error(`\n❌ Error creating employee: division_ids must be an array of strings`);
    }

    if (!uuidV4Regex.test(divisionId)) {
      throw new Error(
        `\n❌ Error creating employee: division_ids must be an array of valid MongoDB ObjectID strings`
      );
    }
  }
};

/**
 * Ensures that the name of the employee is a non-empty string
 * @param name - The name of the employee to validate
 */
export const validateEmployeeName = (name: string): void => {
  if (typeof name !== 'string') {
    throw new Error(`\n❌ Error creating employee: name must be a string`);
  }

  if (name.length === 0) {
    throw new Error(`\n❌ Error creating employee: name cannot be empty`);
  }
};
