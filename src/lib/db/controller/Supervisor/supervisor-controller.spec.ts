import Supervisor, {
  SupervisorWithAssociations,
  SupervisorCreationAttributes
} from '../../models/Supervisor';
import {Op} from 'sequelize';
import {Employee} from '../../models';
import {getEmployeeFromDB} from '../Employee';
import {supervisorModelController} from './index';

describe('Supervisor controller', () => {
  describe('createSupervisorInDB', () => {
    it('Should create a supervisor', async () => {
      // get a list of all current supervisors' employee IDs
      const currentSupervisors = await Supervisor.findAll().then(supervisors =>
        supervisors.map(supervisor => supervisor.employee_id)
      );

      // fetch a random employee who is not a supervisor
      const employee = await Employee.findOne({
        where: {id: {[Op.notIn]: currentSupervisors}}
      }).then(employee => employee);

      // create a supervisor data object
      const supervisor: SupervisorCreationAttributes = {
        employee_id: employee?.id as string,
        is_admin: false
      };

      // create the supervisor
      const result: SupervisorWithAssociations | null =
        await supervisorModelController.createSupervisorInDB(supervisor);

      expect(result).toBeDefined();
      expect(result?.id).toBeDefined();
      expect(result?.is_admin).toBe(false);
      expect(result?.createdAt).toBeDefined();
      expect(result?.updatedAt).toBeDefined();
      // @ts-expect-error - testing for return values
      expect(result?.employee_id).toBeUndefined();
      expect(result?.login_credentials).toBeUndefined();
      expect(result?.supervisor_info).toBeDefined();
      expect(result?.supervisor_info).toMatchObject(
        (await getEmployeeFromDB.byId(employee?.id as string)) ?? {}
      );

      expect.assertions(9);
    });

    it('Should throw an error if the employee is already a supervisor', async () => {
      // get a list of all current supervisors' employee IDs
      const currentSupervisors = await Supervisor.findAll().then(supervisors =>
        supervisors.map(supervisor => supervisor.employee_id)
      );

      // fetch a random employee who is a supervisor
      const employee = await Employee.findOne({
        where: {id: {[Op.in]: currentSupervisors}}
      }).then(employee => employee);

      // create a supervisor data object
      const supervisor: SupervisorCreationAttributes = {
        employee_id: employee?.id as string,
        is_admin: false
      };

      // create the supervisor
      await expect(supervisorModelController.createSupervisorInDB(supervisor)).rejects.toThrow();
    });

    it('Should throw an error if the employee does not exist', async () => {
      // create a supervisor data object
      const supervisor: SupervisorCreationAttributes = {
        employee_id: '123',
        is_admin: false
      };

      // create the supervisor
      await expect(supervisorModelController.createSupervisorInDB(supervisor)).rejects.toThrow();
    });

    it('Should throw an error if the employee ID is not provided', async () => {
      // create a supervisor data object
      // @ts-expect-error - testing for missing employee_id
      const supervisor: SupervisorCreationAttributes = {
        is_admin: false
      };

      // create the supervisor
      await expect(supervisorModelController.createSupervisorInDB(supervisor)).rejects.toThrow();
    });

    it('Should throw an error if the is_admin flag is not provided', async () => {
      // create a supervisor data object
      // @ts-expect-error - testing for missing is_admin
      const supervisor: SupervisorCreationAttributes = {
        employee_id: '123'
      };

      // create the supervisor
      await expect(supervisorModelController.createSupervisorInDB(supervisor)).rejects.toThrow();
    });

    it('Should throw an error if the employee ID is not a valid UUID', async () => {
      // create a supervisor data object
      const supervisor: SupervisorCreationAttributes = {
        employee_id: '123',
        is_admin: false
      };

      // create the supervisor
      await expect(supervisorModelController.createSupervisorInDB(supervisor)).rejects.toThrow();
    });

    it('Should throw an error if the is_admin flag is not a boolean', async () => {
      // create a supervisor data object
      const supervisor: SupervisorCreationAttributes = {
        employee_id: '123',
        is_admin: 'false' as unknown as boolean
      };

      // create the supervisor
      await expect(supervisorModelController.createSupervisorInDB(supervisor)).rejects.toThrow();
    });
  });

  describe('getSupervisorFromDB', () => {
    describe('byId', () => {
      it('Should get a supervisor by ID', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.getSupervisorFromDB.byId(
          existingId as string
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBeDefined();
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeUndefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
      });

      it('Should return the login_credentials if requested', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.getSupervisorFromDB.byId(
          existingId as string,
          {
            showCredentials: true
          }
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBeDefined();
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeDefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
      });

      it('Should return the create_credentials_invite if requested', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.getSupervisorFromDB.byId(
          existingId as string,
          {
            showCreateCredentialsInvite: true
          }
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBeDefined();
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeUndefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
        expect(result?.create_credentials_invite).toBeDefined();
      });

      it('Should return the login_credentials and create_credentials_invite if requested', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.getSupervisorFromDB.byId(
          existingId as string,
          {
            showCredentials: true,
            showCreateCredentialsInvite: true
          }
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBeDefined();
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeDefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
        expect(result?.create_credentials_invite).toBeDefined();
      });

      it('Should return null if the supervisor does not exist', async () => {
        const result = await supervisorModelController.getSupervisorFromDB.byId('123');

        expect(result).toBeNull();
      });
    });

    describe('all', () => {
      it('Should get all supervisors', async () => {
        const result =
          (await supervisorModelController.getSupervisorFromDB.all()) as SupervisorWithAssociations[];
        const supervisors = await Supervisor.findAll().then(supervisors => supervisors);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeUndefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );
        expect(result.length).toBe(supervisors.length);

        expect.assertions(11);
      });

      it('Should return the login_credentials if requested', async () => {
        const result = (await supervisorModelController.getSupervisorFromDB.all({
          showCredentials: true
        })) as SupervisorWithAssociations[];

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeDefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );

        expect.assertions(10);
      });

      it('Should return the create_credentials_invite if requested', async () => {
        const result = (await supervisorModelController.getSupervisorFromDB.all({
          showCreateCredentialsInvite: true
        })) as SupervisorWithAssociations[];

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeUndefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );
        expect(result[0].create_credentials_invite).toBeDefined();

        expect.assertions(11);
      });

      it('Should return the login_credentials and create_credentials_invite if requested', async () => {
        const result = (await supervisorModelController.getSupervisorFromDB.all({
          showCredentials: true,
          showCreateCredentialsInvite: true
        })) as SupervisorWithAssociations[];

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeDefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );
        expect(result[0].create_credentials_invite).toBeDefined();

        expect.assertions(11);
      });
    });

    describe('admins', () => {
      it('Should get all supervisors who are admins', async () => {
        const result =
          (await supervisorModelController.getSupervisorFromDB.admins()) as SupervisorWithAssociations[];
        const supervisors = await Supervisor.findAll({
          where: {is_admin: true}
        });

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeUndefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );
        expect(result.length).toBe(supervisors.length);

        for (const supervisor of result) {
          expect(supervisor.is_admin).toBe(true);
        }

        expect.assertions(result.length + 11);
      });

      it('Should return the login_credentials if requested', async () => {
        const result = (await supervisorModelController.getSupervisorFromDB.admins({
          showCredentials: true
        })) as SupervisorWithAssociations[];

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeDefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );

        for (const supervisor of result) {
          expect(supervisor.is_admin).toBe(true);
        }

        expect.assertions(result.length + 10);
      });

      it('Should return the create_credentials_invite if requested', async () => {
        const result = (await supervisorModelController.getSupervisorFromDB.admins({
          showCreateCredentialsInvite: true
        })) as SupervisorWithAssociations[];

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeUndefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );
        expect(result[0].create_credentials_invite).toBeDefined();

        for (const supervisor of result) {
          expect(supervisor.is_admin).toBe(true);
        }

        expect.assertions(result.length + 11);
      });

      it('Should return the login_credentials and create_credentials_invite if requested', async () => {
        const result = (await supervisorModelController.getSupervisorFromDB.admins({
          showCredentials: true,
          showCreateCredentialsInvite: true
        })) as SupervisorWithAssociations[];

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].id).toBeDefined();
        expect(result[0].is_admin).toBeDefined();
        expect(result[0].createdAt).toBeDefined();
        expect(result[0].updatedAt).toBeDefined();
        expect(result[0].login_credentials).toBeDefined();
        expect(result[0].supervisor_info).toBeDefined();
        expect(result[0].supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result[0].supervisor_info.id)) ?? {}
        );
        expect(result[0].create_credentials_invite).toBeDefined();

        for (const supervisor of result) {
          expect(supervisor.is_admin).toBe(true);
        }

        expect.assertions(result.length + 11);
      });
    });
  });

  describe('updateSupervisorInDB', () => {
    describe('setAdminStatus', () => {
      it('Should update the admin status of a supervisor', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.updateSupervisorInDB.setAdminStatus(
          existingId as string,
          true
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBe(true);
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeUndefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
      });

      it('Should return the login_credentials if requested', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.updateSupervisorInDB.setAdminStatus(
          existingId as string,
          true,
          {
            showCredentials: true
          }
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBe(true);
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeDefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
      });

      it('Should return the create_credentials_invite if requested', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.updateSupervisorInDB.setAdminStatus(
          existingId as string,
          true,
          {
            showCreateCredentialsInvite: true
          }
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBe(true);
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeUndefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
        expect(result?.create_credentials_invite).toBeDefined();
      });

      it('Should return the login_credentials and create_credentials_invite if requested', async () => {
        const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

        const result = await supervisorModelController.updateSupervisorInDB.setAdminStatus(
          existingId as string,
          true,
          {
            showCredentials: true,
            showCreateCredentialsInvite: true
          }
        );

        expect(result).toBeDefined();
        expect(result?.id).toBeDefined();
        expect(result?.is_admin).toBe(true);
        expect(result?.createdAt).toBeDefined();
        expect(result?.updatedAt).toBeDefined();
        expect(result?.login_credentials).toBeDefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
        expect(result?.create_credentials_invite).toBeDefined();
      });

      it('Should return null if the supervisor does not exist', async () => {
        try {
          await supervisorModelController.updateSupervisorInDB.setAdminStatus('123', true);
        } catch (error) {
          expect(error).toBeDefined();
        }

        expect.assertions(1);
      });

      it('Should throw an error if the supervisor ID is not provided', async () => {
        try {
          await supervisorModelController.updateSupervisorInDB.setAdminStatus(
            // @ts-expect-error - testing for missing id
            undefined,
            true
          );
        } catch (error) {
          expect(String(error)).toBeDefined();
        }

        expect.assertions(1);
      });

      it('Should throw an error if the is_admin flag is not provided', async () => {
        try {
          await supervisorModelController.updateSupervisorInDB.setAdminStatus(
            '123',
            // @ts-expect-error - testing for missing is_admin
            undefined
          );
        } catch (error) {
          expect(error).toBeDefined();
        }

        expect.assertions(1);
      });

      it('Should throw an error if the is_admin flag is not a boolean', async () => {
        try {
          await supervisorModelController.updateSupervisorInDB.setAdminStatus(
            '123',
            'true' as unknown as boolean
          );
        } catch (error) {
          expect(error).toBeDefined();
        }

        expect.assertions(1);
      });

      it('Should throw an error if the supervisor ID is not a valid UUID', async () => {
        try {
          await supervisorModelController.updateSupervisorInDB.setAdminStatus('123', true);
        } catch (error) {
          expect(error).toBeDefined();
        }

        expect.assertions(1);
      });
    });
  });

  describe('deleteSupervisorFromDB', () => {
    it('Should delete a supervisor', async () => {
      const existingId = await Supervisor.findAll().then(supervisors => supervisors[0].id);

      const result = await supervisorModelController.deleteSupervisorFromDB(existingId as string);

      expect(result).toBe(true);
    });

    it('Should return false if the supervisor does not exist', async () => {
      try {
        await supervisorModelController.deleteSupervisorFromDB('123');
      } catch (error) {
        expect(error).toBeDefined();
      }
      expect.assertions(1);
    });

    it('Should throw an error if the supervisor ID is not provided', async () => {
      try {
        await supervisorModelController.deleteSupervisorFromDB(
          // @ts-expect-error - testing for missing id
          undefined
        );
      } catch (error) {
        expect(String(error)).toBeDefined();
      }

      expect.assertions(1);
    });

    it('Should throw an error if the supervisor ID is not a valid UUID', async () => {
      try {
        await supervisorModelController.deleteSupervisorFromDB('123');
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect.assertions(1);
    });
  });
});
