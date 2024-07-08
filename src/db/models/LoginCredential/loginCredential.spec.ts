import {Op} from 'sequelize';
import Supervisor from '../Supervisor';
import {uuidV4Regex} from '../../../utils/uuid';
import LoginCredential, {LoginCredentialsCreationAttributes} from './';

describe('LoginCredential', () => {
  let loginCredential: LoginCredential;
  it('should be defined', () => {
    expect(LoginCredential).toBeDefined();
  });

  it('should create a login credential', async () => {
    try {
      // tests run in parallel, so we need to make sure we don't create a login credential for the same supervisor
      const existingLogins = await LoginCredential.findAll();
      const existingLoginSupervisorIds = existingLogins.map(login => login.supervisor_id);
      const supervisorId = await Supervisor.findOne({
        where: {
          id: {
            [Op.notIn]: existingLoginSupervisorIds
          }
        }
      }).then(supervisor => supervisor?.id);
      loginCredential = await LoginCredential.create({
        supervisor_id: supervisorId,
        email: 'testlogincreds@test.com',
        password: 'testpassword'
      } as LoginCredentialsCreationAttributes);

      expect(loginCredential).toBeDefined();
    } catch (error) {
      console.error(error);
    }

    expect.assertions(1);
  });

  it('should have an id', () => {
    expect(loginCredential.id).toBeDefined();
    expect(uuidV4Regex.test(loginCredential.id)).toBe(true);
    expect.assertions(2);
  });

  it('should have a supervisor_id', () => {
    expect(loginCredential.supervisor_id).toBeDefined();
    expect(uuidV4Regex.test(loginCredential.supervisor_id)).toBe(true);
    expect.assertions(2);
  });

  it('should have an email', () => {
    expect(loginCredential.email).toBeDefined();
    expect(loginCredential.email).toBe('testlogincreds@test.com');
    expect.assertions(2);
  });

  it('should have a password', () => {
    expect(loginCredential.password).toBeDefined();
    expect.assertions(1);
  });

  it('should have a hashed password', () => {
    expect(loginCredential.password).not.toBe('testpassword');
    expect(loginCredential.password.includes('$2b$')).toBe(true);
    expect.assertions(2);
  });

  it('should have a createdAt date', () => {
    expect(loginCredential.createdAt).toBeDefined();
    expect(loginCredential.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('should have an updatedAt date', () => {
    expect(loginCredential.updatedAt).toBeDefined();
    expect(loginCredential.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('should have a is_default value of false', () => {
    expect(loginCredential.is_default).toBeDefined();
    expect(loginCredential.is_default).toBe(false);
    expect.assertions(2);
  });
});
