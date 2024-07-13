import {uuidV4Regex} from '../../../utils';
import {getSupervisorFromDB} from '../Supervisor';
import {CreateCredentialsInviteModelController} from './index';
import {CreateCredentialsInvite, LoginCredential} from '../../models';
import {
  SupervisorWithAssociations,
  CreateCredentialsInviteWithAssociations,
  CreateCredentialsInviteCreationAttributes
} from '../../models/types';

describe('CreateCredentialsInviteModelController', () => {
  let createdCredentialsInvite: CreateCredentialsInviteWithAssociations | null = null;
  describe('createCreateCredentialsInviteInDB', () => {
    it('should create a new CreateCredentialsInvite in the database', async () => {
      const [existingInvites, admins, supervisors] = await Promise.all([
        CreateCredentialsInvite.findAll(),
        getSupervisorFromDB.admins() as Promise<SupervisorWithAssociations[]>,
        getSupervisorFromDB.all() as Promise<SupervisorWithAssociations[]>
      ]);

      const existingSupervisorsWithInvites = existingInvites.map(invite => invite.supervisor_id);

      // get a radom admin and supervisor (supervisor cant be an admin)
      const admin = admins[Math.floor(Math.random() * admins.length)];
      let supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
      while (supervisor.is_admin && existingSupervisorsWithInvites.includes(supervisor.id)) {
        supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
      }

      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: admin.id,
        supervisor_id: supervisor.id
      };

      createdCredentialsInvite =
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);

      expect(createdCredentialsInvite).toHaveProperty('id');
      expect(createdCredentialsInvite).toHaveProperty('created_by');
      expect(createdCredentialsInvite).toHaveProperty('supervisor_info');
      expect(createdCredentialsInvite).toHaveProperty('createdAt');
      expect(createdCredentialsInvite).toHaveProperty('updatedAt');
      expect(createdCredentialsInvite).toHaveProperty('expires_at');
      expect(createdCredentialsInvite).toHaveProperty('invite_token');
      expect(createdCredentialsInvite?.supervisor_info).toHaveProperty('id');
      expect(createdCredentialsInvite?.supervisor_info).toMatchObject(supervisor);
      expect(createdCredentialsInvite?.created_by).toHaveProperty('id');
      expect(createdCredentialsInvite?.created_by).toMatchObject(admin);

      // expect the expired_at property to be 24 hours from the current time
      const currentDate = new Date();
      const _24hoursFromNow = new Date(currentDate);
      _24hoursFromNow.setDate(_24hoursFromNow.getDate() + 1);
      const expiresAt = new Date(createdCredentialsInvite?.expires_at as Date);
      const diff = Math.abs(expiresAt.getDate() - _24hoursFromNow.getDate());

      expect(diff).toBeLessThanOrEqual(1000);

      // drop the milliseconds from the dates createdAt
      createdCredentialsInvite?.createdAt.setMilliseconds(0);
      createdCredentialsInvite?.updatedAt.setMilliseconds(0);
      createdCredentialsInvite?.expires_at?.setMilliseconds(0);
    });

    it('should throw an error if the created_by property is not a valid UUID', async () => {
      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: 'notAValidUUID',
        supervisor_id: createdCredentialsInvite?.supervisor_info.id ?? ''
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);

        expect(
          String(error).includes(
            '❌ Error creating createCredentialsInvite: Error: Invalid created_by'
          )
        ).toBe(true);
      }

      expect.assertions(2);
    });

    it('should throw an error if the supervisor_id property is not a valid UUID', async () => {
      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: createdCredentialsInvite?.created_by.id ?? '',
        supervisor_id: 'notAValidUUID'
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(
          String(error).includes(
            '❌ Error creating createCredentialsInvite: Error: Invalid supervisor_id'
          )
        ).toBe(true);
      }

      expect.assertions(2);
    });

    it('should throw an error if the admin supervisor does not exist', async () => {
      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: '00000000-0000-0000-0000-000000000000',
        supervisor_id: createdCredentialsInvite?.supervisor_info.id ?? ''
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(
          String(error).includes(
            '❌ Error creating createCredentialsInvite: Error: Invalid created_by'
          )
        ).toBe(true);
      }

      expect.assertions(2);
    });

    it('should throw an error if the supervisor does not exist', async () => {
      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: createdCredentialsInvite?.created_by.id ?? '',
        supervisor_id: '00000000-0000-0000-0000-000000000000'
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(
          String(error).includes(
            '❌ Error creating createCredentialsInvite: Error: Invalid supervisor_id'
          )
        ).toBe(true);
      }

      expect.assertions(2);
    });

    it('should throw an error if the supervisor already has a credentials invite', async () => {
      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: createdCredentialsInvite?.created_by.id ?? '',
        supervisor_id: createdCredentialsInvite?.supervisor_info.id ?? ''
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(
          String(error).includes(
            '❌ Error creating createCredentialsInvite: SequelizeUniqueConstraintError: Validation error'
          )
        ).toBe(true);
      }

      expect.assertions(2);
    });

    it('should throw an error if the created_by is not an admin', async () => {
      const supervisors = (
        (await getSupervisorFromDB.all()) as SupervisorWithAssociations[]
      ).filter(s => !s.is_admin);
      const supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];

      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: supervisor.id,
        supervisor_id: supervisor.id
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(
          String(error).includes(
            '❌ Error creating createCredentialsInvite: Error: Supervisor is not an admin'
          )
        ).toBe(true);
      }

      expect.assertions(2);
    });

    it('should throw an error if the supervisor already has login credentials', async () => {
      // find a non-admin supervisor
      const non_admin_supervisors = (
        (await getSupervisorFromDB.all()) as SupervisorWithAssociations[]
      ).filter(s => !s.is_admin);
      const existingAdmin = createdCredentialsInvite?.created_by.id ?? '';
      const supervisor = non_admin_supervisors.find(s => s.id !== existingAdmin);

      try {
        // create login credentials for the supervisor
        await LoginCredential.create({
          supervisor_id: supervisor?.id as string,
          email: 'testSuper@test.com',
          password: 'testSuperPassword'
        });

        // try to create a new credentials invite for the supervisor
        const props: CreateCredentialsInviteCreationAttributes = {
          created_by: existingAdmin,
          supervisor_id: supervisor?.id as string
        };

        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect.assertions(1);
    });

    it('should throw an error if the email is an empty string', async () => {
      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: createdCredentialsInvite?.created_by.id ?? '',
        supervisor_id: createdCredentialsInvite?.supervisor_info.id ?? ''
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect.assertions(1);
    });

    it('should throw an error if the password is less than 8 characters', async () => {
      const props: CreateCredentialsInviteCreationAttributes = {
        created_by: createdCredentialsInvite?.created_by.id ?? '',
        supervisor_id: createdCredentialsInvite?.supervisor_info.id ?? ''
      };

      try {
        await CreateCredentialsInviteModelController.createCreateCredentialsInviteInDB(props);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect.assertions(1);
    });
  });

  describe('getCreateCredentialsInviteFromDB', () => {
    it('should get a CreateCredentialsInvite from the database by id', async () => {
      if (!createdCredentialsInvite) {
        throw new Error('CreateCredentialsInvite not created');
      }

      const createCredentialsInvite =
        await CreateCredentialsInviteModelController.getCreateCredentialsInviteFromDB({
          id: createdCredentialsInvite.id
        });

      expect(createCredentialsInvite).toMatchObject(createdCredentialsInvite);
    });

    it('should get a CreateCredentialsInvite from the database by supervisor_id', async () => {
      if (!createdCredentialsInvite) {
        throw new Error('CreateCredentialsInvite not created');
      }

      const createCredentialsInvite =
        await CreateCredentialsInviteModelController.getCreateCredentialsInviteFromDB({
          supervisor_id: createdCredentialsInvite.supervisor_info.id
        });

      expect(createCredentialsInvite).toMatchObject(createdCredentialsInvite);
    });

    it('should get a CreateCredentialsInvite from the database by admin_id', async () => {
      if (!createdCredentialsInvite) {
        throw new Error('CreateCredentialsInvite not created');
      }

      const createCredentialsInvite =
        await CreateCredentialsInviteModelController.getCreateCredentialsInviteFromDB({
          admin_id: createdCredentialsInvite.created_by.id
        });

      expect(uuidV4Regex.test(createCredentialsInvite?.id as string)).toBe(true);
    });

    it('should return null if the CreateCredentialsInvite does not exist', async () => {
      const createCredentialsInvite =
        await CreateCredentialsInviteModelController.getCreateCredentialsInviteFromDB({
          id: '00000000-0000-0000-0000-000000000000'
        });

      expect(createCredentialsInvite).toBeNull();
    });

    it('should return null if the id is not a valid UUID', async () => {
      const created = await CreateCredentialsInviteModelController.getCreateCredentialsInviteFromDB(
        {
          id: 'notAValidUUID'
        }
      );

      expect(created).toBeNull();
      expect.assertions(1);
    });

    it('should return null if the supervisor_id is not a valid UUID', async () => {
      const created = await CreateCredentialsInviteModelController.getCreateCredentialsInviteFromDB(
        {
          supervisor_id: 'notAValidUUID'
        }
      );

      expect(created).toBeNull();
      expect.assertions(1);
    });

    it('should return null if the admin_id is not a valid UUID', async () => {
      const created = await CreateCredentialsInviteModelController.getCreateCredentialsInviteFromDB(
        {
          admin_id: 'notAValidUUID'
        }
      );

      expect(created).toBeNull();

      expect.assertions(1);
    });
  });
});
