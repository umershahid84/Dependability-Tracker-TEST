import {
  SupervisorWithAssociations,
  LoginCredentialsWithAssociations,
  LoginCredentialsCreationAttributes
} from '../../models/types';
import {Op} from 'sequelize';
import {uuid} from '../../../utils';
import {getSupervisorFromDB} from '../Supervisor';
import {loginCredentialModelController} from './index';
import {createCreateCredentialsInviteInDB} from '../CreateCredentialsInvite';
import {CreateCredentialsInvite, LoginCredential, Supervisor} from '../../models';

describe('Login Credential Model Controller', () => {
  describe('createLoginCredentialInDB', () => {
    it('should create a login credential in the database', async () => {
      const existingCredentials: LoginCredential[] = await LoginCredential.findAll();
      const existingSupervisorsWithCredentials: string[] = existingCredentials.map(
        credential => credential.supervisor_id
      );

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins();
      const existingInviteSupers = (await CreateCredentialsInvite.findAll()).map(
        e => e.supervisor_id
      );

      const supervisorWithoutCredentials: Supervisor | null = await Supervisor.findOne({
        where: {
          id: {
            [Op.notIn]: [...existingSupervisorsWithCredentials, ...existingInviteSupers]
          },
          is_admin: false
        }
      });

      await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id,
        default_email: 'createdLoginCredModel@test.com',
        default_password: 'password'
      });

      const props: LoginCredentialsCreationAttributes = {
        password: 'password',
        default_password: 'password',
        email: 'createLoginTest@test.com',
        default_email: 'createdLoginCredModel@test.com',
        supervisor_id: supervisorWithoutCredentials?.id as string
      };

      const createdCredentials: LoginCredentialsWithAssociations | null =
        await loginCredentialModelController.createLoginCredentialInDB(props);

      expect(createdCredentials).not.toBeNull();
      expect(createdCredentials?.email).toBe(props.email);
      expect(createdCredentials?.password).not.toBe(props.password);
      expect(createdCredentials?.supervisor_info).not.toBeNull();
      expect(createdCredentials?.supervisor_info.id).toBe(props.supervisor_id);
    });

    it('should throw an error if the supervisor does not have permission to create login credentials', async () => {
      const existingInvites = await CreateCredentialsInvite.findAll();
      const existingSupervisorsWithInvites = existingInvites.map(invite => invite.supervisor_id);

      const supervisorWithoutInvite: Supervisor | null = await Supervisor.findOne({
        where: {
          id: {
            [Op.notIn]: existingSupervisorsWithInvites
          }
        }
      });

      const props: LoginCredentialsCreationAttributes = {
        default_email: '',
        default_password: '',
        password: 'password',
        email: 'shouldError@test.com',
        supervisor_id: supervisorWithoutInvite?.id as string
      };

      try {
        await loginCredentialModelController.createLoginCredentialInDB(props);
      } catch (error) {
        expect(String(error)).toContain(
          `Supervisor ${props.supervisor_id} does not have permission to create login credentials`
        );
      }

      expect.assertions(1);
    });

    it('should throw an error if the supervisor does not exist', async () => {
      const props: LoginCredentialsCreationAttributes = {
        default_email: '',
        default_password: '',
        password: 'password',
        supervisor_id: uuid(),
        email: 'non-existant@test.com'
      };

      try {
        await loginCredentialModelController.createLoginCredentialInDB(props);
      } catch (error) {
        expect(String(error)).toContain(
          `Supervisor ${props.supervisor_id} does not have permission to create login credentials`
        );
      }

      expect.assertions(1);
    });

    it('should throw an error if the email is already in use', async () => {
      const existingCredentials: LoginCredential[] = await LoginCredential.findAll();
      const existingSupervisorsWithCredentials: LoginCredential[] = existingCredentials.map(
        credential => credential
      );

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins();
      const existingInviteSupers = (await CreateCredentialsInvite.findAll()).map(
        e => e.supervisor_id
      );
      const supervisorWithoutCredentials: Supervisor | null = await Supervisor.findOne({
        where: {
          id: {
            [Op.notIn]: [
              ...existingSupervisorsWithCredentials.map(credential => credential.supervisor_id),
              ...existingInviteSupers
            ]
          },
          is_admin: false
        }
      });

      await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id,
        default_email: 'testingDuplicates@test.com',
        default_password: 'password'
      });

      try {
        await loginCredentialModelController.createLoginCredentialInDB({
          default_email: '',
          default_password: '',
          password: 'password',
          email: existingCredentials[0].email,
          supervisor_id: supervisorWithoutCredentials?.id as string
        });
      } catch (error) {
        expect(String(error)).toContain(
          `Supervisor ${
            supervisorWithoutCredentials?.id as string
          } does not have permission to create login credentials`
        );
      }
    });

    it('should throw an error if the password is too short', async () => {
      const existingCredentials: LoginCredential[] = await LoginCredential.findAll();
      const existingSupervisorsWithCredentials: LoginCredential[] = existingCredentials.map(
        credential => credential
      );

      const existingInviteSupers = (await CreateCredentialsInvite.findAll()).map(
        e => e.supervisor_id
      );

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins();

      const supervisorWithoutCredentials: Supervisor | null = await Supervisor.findOne({
        where: {
          id: {
            [Op.notIn]: [
              ...existingSupervisorsWithCredentials.map(credential => credential.supervisor_id),
              ...existingInviteSupers
            ]
          },
          is_admin: false
        }
      });

      await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id,
        default_email: 'tooShort@test.com',
        default_password: 'password'
      });

      try {
        await loginCredentialModelController.createLoginCredentialInDB({
          password: 'short',
          default_password: 'password',
          email: 'testtooshort@test.com',
          default_email: 'tooShort@test.com',
          supervisor_id: supervisorWithoutCredentials?.id as string
        });
      } catch (error) {
        console.error(error);
        expect(String(error)).toContain(
          'Error creating createCredentialsInvite: SequelizeUniqueConstraintError: Validation error'
        );
      }
    });

    it('should throw an error if the default passwords do not match', async () => {
      const existingCredentials: LoginCredential[] = await LoginCredential.findAll();
      const existingSupervisorsWithCredentials: LoginCredential[] = existingCredentials.map(
        credential => credential
      );

      const existingInviteSupers = (await CreateCredentialsInvite.findAll()).map(
        e => e.supervisor_id
      );

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins();

      const supervisorWithoutCredentials: Supervisor | null = await Supervisor.findOne({
        where: {
          id: {
            [Op.notIn]: [
              ...existingSupervisorsWithCredentials.map(credential => credential.supervisor_id),
              ...existingInviteSupers
            ]
          }
        }
      });

      await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id,
        default_email: 'testingMisMatch@test.com',
        default_password: 'password'
      });

      try {
        await loginCredentialModelController.createLoginCredentialInDB({
          password: 'password',
          default_password: 'passwordMismatch',
          email: 'testingMisMatch@test.com',
          default_email: 'testingMisMatch@test.com',
          supervisor_id: supervisorWithoutCredentials?.id as string
        });
      } catch (error) {
        expect(String(error)).toContain(
          `Supervisor ${supervisorWithoutCredentials?.id} does not have permission to create login credentials`
        );
      }

      expect.assertions(1);
    });
  });
});
