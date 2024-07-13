import {
  getDivisionFromDB,
  createEmployeeInDB,
  getSupervisorFromDB,
  createSupervisorInDB
} from '../../controller';
import {uuidV4Regex} from '../../../utils';
import {SupervisorWithAssociations} from '../Supervisor';
import CreateCredentialsInvite, {CreateCredentialsInviteCreationAttributes} from './';

describe('CreateCredentialsInvite', () => {
  let createCredentialsInvite: CreateCredentialsInvite;
  it('should be defined', () => {
    expect(CreateCredentialsInvite).toBeDefined();
  });

  it('should create a create credentials invite', async () => {
    const supervisors = (await getSupervisorFromDB.all()) as SupervisorWithAssociations[];
    let admin = supervisors.find(supervisor => supervisor.is_admin === true);

    // if there are no admins, create a new one
    if (!admin) {
      const newEmployee = await createEmployeeInDB({
        name: 'Test Admin',
        division_ids: await getDivisionFromDB
          .all()
          .then(divisions => divisions.map(division => division.id))
      });
      const newAdmin = await createSupervisorInDB({
        employee_id: newEmployee?.id as string,
        is_admin: true
      });

      admin = newAdmin as SupervisorWithAssociations;
    }

    const existingInvites = await CreateCredentialsInvite.findAll();
    const existingSupervisorsWithInvites = existingInvites.map(invite => invite.supervisor_id);

    const supervisor = supervisors.find(
      supervisor =>
        supervisor.is_admin === false && !existingSupervisorsWithInvites.includes(supervisor.id)
    );

    createCredentialsInvite = await CreateCredentialsInvite.create({
      created_by: admin?.id,
      supervisor_id: supervisor?.id
    } as CreateCredentialsInviteCreationAttributes);

    expect(createCredentialsInvite).toBeDefined();
    expect.assertions(1);
  });

  it('should have an id', () => {
    expect(createCredentialsInvite.id).toBeDefined();
    expect(uuidV4Regex.test(createCredentialsInvite.id)).toBe(true);
    expect.assertions(2);
  });

  it('should have a created_by', () => {
    expect(createCredentialsInvite.created_by).toBeDefined();
    expect(uuidV4Regex.test(createCredentialsInvite.created_by)).toBe(true);
    expect.assertions(2);
  });

  it('should have a supervisor_id', () => {
    expect(createCredentialsInvite.supervisor_id).toBeDefined();
    expect(uuidV4Regex.test(createCredentialsInvite.supervisor_id)).toBe(true);
    expect.assertions(2);
  });

  it('should have an invite_token', () => {
    expect(createCredentialsInvite.invite_token).toBeDefined();
    expect(typeof createCredentialsInvite.invite_token).toBe('string');
    expect(createCredentialsInvite.invite_token.length).toBe(32);
    expect.assertions(3);
  });

  it('should have an expires_at date', () => {
    expect(createCredentialsInvite.expires_at).toBeDefined();
    expect(createCredentialsInvite.expires_at).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('should have a createdAt date', () => {
    expect(createCredentialsInvite.createdAt).toBeDefined();
    expect(createCredentialsInvite.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('should have an updatedAt date', () => {
    expect(createCredentialsInvite.updatedAt).toBeDefined();
    expect(createCredentialsInvite.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('should have a default expires_at date of 24 hours', () => {
    const expiresAt = new Date(createCredentialsInvite.createdAt.getTime() + 96 * 60 * 60 * 1000);
    const diff = expiresAt.getTime() - createCredentialsInvite.expires_at.getTime();

    // expect a max diff of 30 seconds - to account for lagging tests
    expect(Math.abs(diff)).toBeLessThanOrEqual(30000);
    expect.assertions(1);
  });
});
