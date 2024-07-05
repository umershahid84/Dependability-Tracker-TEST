import Employee, {EmployeeCreationAttributes} from './index';

describe('Employee model', () => {
  let employee: Employee;
  it('Should be defined', async () => {
    expect(Employee).toBeDefined();
    expect.assertions(1);
  });

  it('Should create an employee', async () => {
    employee = await Employee.create({
      name: 'John Doe',
      division_ids: [1, 2]
    } as EmployeeCreationAttributes);

    expect(employee).toBeDefined();
    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(employee.id).toBeDefined();
    expect(employee.id).toBeGreaterThan(0);
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

  it('Should have division_ids', () => {
    expect(employee.division_ids).toBeDefined();
    expect(employee.division_ids).toEqual([1, 2]);
    expect.assertions(2);
  });
});
