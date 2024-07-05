import Supervisor, {SupervisorCreationAttributes} from '.';

describe('Supervisor model', () => {
  let supervisor: Supervisor;
  it('Should be defined', async () => {
    expect(Supervisor).toBeDefined();
  });

  it('Should create a supervisor', async () => {
    supervisor = await Supervisor.create({
      employee_id: 17,
      is_admin: false
    } as SupervisorCreationAttributes);

    expect(supervisor).toBeDefined();
    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(supervisor.id).toBeDefined();
    expect(supervisor.id).toBe(17);
    expect.assertions(2);
  });

  it('Should have an employee_id', () => {
    expect(supervisor.employee_id).toBeDefined();
    expect(supervisor.employee_id).toBeGreaterThan(0);
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
