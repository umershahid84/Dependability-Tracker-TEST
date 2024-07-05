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
      expect(result?.login_credentials).toBeNull();
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
        expect(result?.login_credentials).toBeDefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
      });

      it('Should return null if the supervisor does not exist', async () => {
        const result = await supervisorModelController.getSupervisorFromDB.byId('123');

        expect(result).toBeNull();
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
        expect(result?.login_credentials).toBeDefined();
        expect(result?.supervisor_info).toBeDefined();
        expect(result?.supervisor_info).toMatchObject(
          (await getEmployeeFromDB.byId(result?.supervisor_info.id as string)) ?? {}
        );
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
      const existingId = await Supervisor.findOne().then(supervisor => supervisor?.id);

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
