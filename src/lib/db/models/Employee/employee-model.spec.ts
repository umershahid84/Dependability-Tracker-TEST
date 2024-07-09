import Division from '../Division';
import {uuidV4Regex} from '../../../utils';
import Employee, {EmployeeCreationAttributes} from './index';

describe('Employee model', () => {
  let employee: Employee;
  it('Should be defined', async () => {
    expect(Employee).toBeDefined();
    expect.assertions(1);
  });

  it('Should create an employee', async () => {
    const divisionIds = await Division.findAll().then(divisions =>
      divisions.map(division => division.id)
    );
    employee = await Employee.create({
      name: 'John Doe',
      division_ids: divisionIds
    } as EmployeeCreationAttributes);

    expect(employee).toBeDefined();
    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(employee.id).toBeDefined();
    expect(uuidV4Regex.test(employee.id)).toBe(true);
    expect.assertions(2);
  });

  it('Should have a name', () => {
    expect(employee.name).toBe('John Doe');
    expect.assertions(1);
  });

  it('Should have a createdAt date', () => {
    expect(employee.createdAt).toBeDefined();
    expect(employee.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have an updatedAt date', () => {
    expect(employee.updatedAt).toBeDefined();
    expect(employee.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have division_ids', async () => {
    const divisionIds = await Division.findAll().then(divisions =>
      divisions.map(division => division.id)
    );
    expect(employee.division_ids).toBeDefined();
    expect(employee.division_ids).toEqual(divisionIds);
    expect.assertions(2);
  });
});
