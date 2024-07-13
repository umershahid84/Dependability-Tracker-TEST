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

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins() as SupervisorWithAssociations[];
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

      const invite = await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id
      });

      const props: LoginCredentialsCreationAttributes = {
        password: 'password',
        email: 'createLoginTest@test.com',
        invite_token: invite?.invite_token as string,
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
        invite_token: '',
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

    it('should throw an error if the email is already in use', async () => {
      const existingCredentials: LoginCredential[] = await LoginCredential.findAll();
      const existingSupervisorsWithCredentials: LoginCredential[] = existingCredentials.map(
        credential => credential
      );

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins() as SupervisorWithAssociations[];
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

      const inv = await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id
      });

      try {
        await loginCredentialModelController.createLoginCredentialInDB({
          password: 'password',
          invite_token: inv?.id as string,
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

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins() as SupervisorWithAssociations[];

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

      const inv = await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id
      });

      try {
        await loginCredentialModelController.createLoginCredentialInDB({
          password: 'short',
          email: 'testtooshort@test.com',
          invite_token: inv?.invite_token as string,
          supervisor_id: supervisorWithoutCredentials?.id as string
        });
      } catch (error) {
        console.error(error);
        expect(String(error)).toContain(
          'Error creating createCredentialsInvite: SequelizeUniqueConstraintError: Validation error'
        );
      }
    });

    it('should throw an error if the supervisor does not exist', async () => {
      const existingCredentials: LoginCredential[] = await LoginCredential.findAll();
      const existingSupervisorsWithCredentials: LoginCredential[] = existingCredentials.map(
        credential => credential
      );

      const existingInviteSupers = (await CreateCredentialsInvite.findAll()).map(
        e => e.supervisor_id
      );

      const admins: SupervisorWithAssociations[] = await getSupervisorFromDB.admins() as SupervisorWithAssociations[];

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

      const inv = await createCreateCredentialsInviteInDB({
        supervisor_id: supervisorWithoutCredentials?.id as string,
        created_by: admins[0].id
      });

      const fakeId = uuid();
      try {
        await loginCredentialModelController.createLoginCredentialInDB({
          password: 'password',
          email: 'testingMisMatch@test.com',
          invite_token: inv?.invite_token as string,
          supervisor_id: fakeId
        });
      } catch (error) {
        expect(String(error)).toContain(
          `Supervisor ${fakeId} does not have permission to create login credentials`
        );
      }

      expect.assertions(1);
    });
  });
});
