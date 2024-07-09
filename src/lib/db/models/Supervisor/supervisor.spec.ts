import {Op} from 'sequelize';
import Employee from '../Employee';
import {uuidV4Regex} from '../../../utils';
import Supervisor, {SupervisorCreationAttributes} from '.';

describe('Supervisor model', () => {
  let supervisor: Supervisor;
  it('Should be defined', async () => {
    expect(Supervisor).toBeDefined();
  });

  it('Should create a supervisor', async () => {
    const existingSupervisors = await Supervisor.findAll().then(supervisors =>
      supervisors.map(supervisor => supervisor.employee_id)
    );
    const employeeId = await Employee.findOne({
      where: {id: {[Op.notIn]: existingSupervisors}}
    }).then(employee => employee?.id);

    supervisor = await Supervisor.create({
      employee_id: employeeId,
      is_admin: false
    } as SupervisorCreationAttributes);

    expect(supervisor).toBeDefined();
    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(supervisor.id).toBeDefined();
    expect(uuidV4Regex.test(supervisor.id)).toBe(true);
    expect.assertions(2);
  });

  it('Should have an employee_id', () => {
    expect(supervisor.employee_id).toBeDefined();
    expect(uuidV4Regex.test(supervisor.employee_id)).toBe(true);
    expect.assertions(2);
  });

  it('Should have an is_admin', () => {
    expect(supervisor.is_admin).toBeDefined();
    expect(supervisor.is_admin).toBe(false);
    expect.assertions(2);
  });

  it('Should have a createdAt date', () => {
    expect(supervisor.createdAt).toBeDefined();
    expect(supervisor.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have an updatedAt date', () => {
    expect(supervisor.updatedAt).toBeDefined();
    expect(supervisor.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });
});
