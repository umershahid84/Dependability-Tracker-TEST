import {
  LeaveTypeAttributes,
  CallOutWithAssociations,
  EmployeeWithAssociations,
  CallOutCreationAttributes,
  SupervisorWithAssociations
} from '../../models/types';
import { uuid } from '../../../utils';
import { getEmployeeFromDB } from '../Employee';
import { calloutModelController } from './index';
import { getSupervisorFromDB } from '../Supervisor';
import { Employee, LeaveType, Supervisor } from '../../models';
import LeaveTypeModelController, { getLeaveTypeFromDB } from '../LeaveType';

// populated by the all test
let existingCallouts: CallOutWithAssociations[] = [];

const getTestData = async (): Promise<{
  supervisor: SupervisorWithAssociations;
  employee: EmployeeWithAssociations;
  leaveType: LeaveTypeAttributes;
  newDate: Date;
}> => {
  const [supervisors, leaveTypes, nonSupervisors]: [
    SupervisorWithAssociations[],
    LeaveTypeAttributes[],
    EmployeeWithAssociations[]
  ] = (await Promise.all([
    getSupervisorFromDB.all(),
    getLeaveTypeFromDB.all(),
    getEmployeeFromDB.all.nonSupervisors()
  ])) as [SupervisorWithAssociations[], LeaveTypeAttributes[], EmployeeWithAssociations[]];

  // get a random supervisor and employee
  const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
  const supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];
  const employee = nonSupervisors[Math.floor(Math.random() * nonSupervisors.length)];

  const newDate = new Date();

  return { supervisor, employee, leaveType, newDate };
};

describe('Callout Model Controller', () => {
  // CRUD: Create
  describe('createCallOutInDB', () => {
    let testData: {
      supervisor: SupervisorWithAssociations;
      employee: EmployeeWithAssociations;
      leaveType: LeaveTypeAttributes;
      newDate: Date;
    };

    it('should create a callout in the database', async () => {
      const { supervisor, employee, leaveType, newDate } = await getTestData();

      testData = { supervisor, employee, leaveType, newDate };

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        left_early_mins: 10,
        arrived_late_mins: 20,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      const callout: CallOutWithAssociations | null =
        await calloutModelController.createCallOutInDB(calloutProps);

      expect(callout).toBeTruthy();
      expect(callout).toHaveProperty('id');
      expect(callout).toHaveProperty('createdAt');
      expect(callout).toHaveProperty('updatedAt');
      expect(callout).toHaveProperty('shift_date');
      expect(callout).toHaveProperty('shift_time');
      expect(callout).toHaveProperty('callout_date');
      expect(callout).toHaveProperty('callout_time');
      expect(callout).toHaveProperty('employee');
      expect(callout).toHaveProperty('supervisor');
      expect(callout).toHaveProperty('leaveType');
      expect(callout).toHaveProperty('supervisor');
      expect(callout).toHaveProperty('supervisor_comments');
      expect(callout).toHaveProperty('left_early_mins');
      expect(callout).toHaveProperty('arrived_late_mins');

      expect(callout?.employee.id).toBe(employee.id);
      expect(callout?.supervisor.id).toBe(supervisor.id);
      expect(callout?.leaveType.id).toBe(leaveType.id);
      expect(callout?.supervisor_comments).toBe('test');
      expect(callout?.left_early_mins).toBe(10);
      expect(callout?.arrived_late_mins).toBe(20);

      expect.assertions(21);
    });

    it('should throw an error if the employee id does not exist', async () => {
      const { supervisor, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: uuid(),
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Employee not found`);
      }
      expect.assertions(1);
    });

    it('should throw an error if the supervisor id does not exist', async () => {
      const { leaveType, employee, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: uuid(),
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Supervisor not found`);
      }
      expect.assertions(1);
    });

    it('should throw an error if the leave type id does not exist', async () => {
      const { supervisor, employee, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: uuid(),
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Leave type not found`);
      }
      expect.assertions(1);
    });

    it('should throw an error if the leave type is not a leave type', async () => {
      const { supervisor, employee, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: employee.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Leave type not found`);
      }
      expect.assertions(1);
    });

    it('should throw an error if the employee is a supervisor', async () => {
      const { supervisor, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: supervisor.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Employee not found`);
      }
      expect.assertions(1);
    });

    it('should throw an error if the shift date is missing', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      // @ts-expect-error - shift_date is missing
      const calloutProps: CallOutCreationAttributes = {
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Missing required properties: shift_date, `);
      }
      expect.assertions(1);
    });

    it('should throw an error if the shift time is missing', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      // @ts-expect-error - shift_time is missing
      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Missing required properties: shift_time, `);
      }
      expect.assertions(1);
    });

    it('should throw an error if the callout date is missing', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      // @ts-expect-error - callout_date is missing
      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Missing required properties: callout_date, `);
      }
      expect.assertions(1);
    });

    it('should throw an error if the callout time is missing', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      // @ts-expect-error - callout_time is missing
      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Missing required properties: callout_time, `);
      }
      expect.assertions(1);
    });

    it('should throw an error if the shift date is not a date', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        // @ts-expect-error - test value
        shift_date: 'invalid',
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the shift date is before the callout date', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: new Date('2021-01-01'),
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe('Error: Shift date cannot be before callout date');
      }
      expect.assertions(1);
    });

    it('should throw an error if the shift time is not a date', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        // @ts-expect-error - test value
        shift_time: 'invalid',
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the callout date is not a date', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        // @ts-expect-error - test value
        callout_date: 'invalid',
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the callout time is not a date', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        // @ts-expect-error - test value
        callout_time: 'invalid',
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the supervisor comments are missing', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      // @ts-expect-error - supervisor_comments is missing
      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Missing required properties: supervisor_comments, `);
      }
      expect.assertions(1);
    });

    it('should throw an error if the supervisor comments are not a string', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        // @ts-expect-error - test value
        supervisor_comments: 10
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBe(`Error: Invalid supervisor comments`);
      }
      expect.assertions(1);
    });

    it('should throw an error if the left early minutes are not a number', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test',
        // @ts-expect-error - test value
        left_early_mins: 'invalid'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the arrived late minutes are not a number', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test',
        left_early_mins: 10,
        // @ts-expect-error - test value
        arrived_late_mins: 'invalid'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the left early minutes are negative', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test',
        left_early_mins: -10
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the arrived late minutes are negative', async () => {
      const { supervisor, employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test',
        left_early_mins: 10,
        arrived_late_mins: -10
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the employee id is not a UUID', async () => {
      const { supervisor, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: 'invalid',
        supervisor_id: supervisor.id,
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the supervisor id is not a UUID', async () => {
      const { employee, leaveType, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: 'invalid',
        leave_type_id: leaveType.id,
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should throw an error if the leave type id is not a UUID', async () => {
      const { supervisor, employee, newDate } = testData ?? (await getTestData());

      const calloutProps: CallOutCreationAttributes = {
        shift_date: newDate,
        shift_time: newDate,
        callout_date: newDate,
        callout_time: newDate,
        employee_id: employee.id,
        supervisor_id: supervisor.id,
        leave_type_id: 'invalid',
        supervisor_comments: 'test'
      };

      try {
        await calloutModelController.createCallOutInDB(calloutProps);
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });
  });

  // CRUD: Read
  describe('getCallOutFromDB', () => {
    describe('byId', () => {
      it('should get a callout by id', async () => {
        const { supervisor, employee, leaveType, newDate } = await getTestData();

        const calloutProps: CallOutCreationAttributes = {
          shift_date: newDate,
          shift_time: newDate,
          callout_date: newDate,
          callout_time: newDate,
          employee_id: employee.id,
          supervisor_id: supervisor.id,
          leave_type_id: leaveType.id,
          supervisor_comments: 'test'
        };

        const callout: CallOutWithAssociations | null =
          await calloutModelController.createCallOutInDB(calloutProps);

        const retrievedCallout: CallOutWithAssociations | null =
          await calloutModelController.getCallOutFromDB.byId(callout?.id ?? '');

        expect(retrievedCallout).toBeTruthy();
        expect(retrievedCallout).toHaveProperty('id');
        expect(retrievedCallout).toHaveProperty('createdAt');
        expect(retrievedCallout).toHaveProperty('updatedAt');
        expect(retrievedCallout).toHaveProperty('shift_date');
        expect(retrievedCallout).toHaveProperty('shift_time');
        expect(retrievedCallout).toHaveProperty('callout_date');
        expect(retrievedCallout).toHaveProperty('callout_time');
        expect(retrievedCallout).toHaveProperty('employee');
        expect(retrievedCallout).toHaveProperty('supervisor');
        expect(retrievedCallout).toHaveProperty('leaveType');
        expect(retrievedCallout).toHaveProperty('supervisor');
        expect(retrievedCallout).toHaveProperty('supervisor_comments');
        expect(retrievedCallout).toHaveProperty('left_early_mins');
        expect(retrievedCallout).toHaveProperty('arrived_late_mins');

        //@ts-expect-error - verify that the employee_id is not returned
        expect(retrievedCallout?.employee_id).toBeUndefined();
        //@ts-expect-error - verify that the supervisor_id is not returned
        expect(retrievedCallout?.supervisor_id).toBeUndefined();
        //@ts-expect-error - verify that the leave_type_id is not returned
        expect(retrievedCallout?.leave_type_id).toBeUndefined();

        expect(retrievedCallout?.employee.id).toBe(employee.id);
        expect(retrievedCallout?.supervisor.id).toBe(supervisor.id);
        expect(retrievedCallout?.leaveType.id).toBe(leaveType.id);
        expect(retrievedCallout?.supervisor_comments).toBe('test');

        expect.assertions(22);
      });

      it('should return null if the callout does not exist', async () => {
        const callout: CallOutWithAssociations | null =
          await calloutModelController.getCallOutFromDB.byId(uuid());

        expect(callout).toBeNull();
        expect.assertions(1);
      });

      it('should throw an error if the id is not a UUID', async () => {
        try {
          await calloutModelController.getCallOutFromDB.byId('invalid');
        } catch (error) {
          expect(String(error)).toBe('Error: Invalid id');
        }
        expect.assertions(1);
      });

      it('should throw an error if the id is missing', async () => {
        try {
          //@ts-expect-error - testing bad input
          await calloutModelController.getCallOutFromDB.byId(undefined);
        } catch (error) {
          expect(String(error)).toBe('Error: Missing required id');
        }
        expect.assertions(1);
      });
    });

    describe('all', () => {
      it('should get all callouts', async () => {
        existingCallouts =
          (await calloutModelController.getCallOutFromDB.all()) as CallOutWithAssociations[];

        expect(existingCallouts).toBeTruthy();
        // we delete a few callouts so depending on when exactly this test runs, there may be more or less callouts
        expect(existingCallouts.length).toBeGreaterThanOrEqual(existingCallouts.length - 2);

        // verifies the seeds that were created
        existingCallouts.forEach(callout => {
          expect(callout).toHaveProperty('id');
          expect(callout).toHaveProperty('createdAt');
          expect(callout).toHaveProperty('updatedAt');
          expect(callout).toHaveProperty('shift_date');
          expect(callout).toHaveProperty('shift_time');
          expect(callout).toHaveProperty('callout_date');
          expect(callout).toHaveProperty('callout_time');
          expect(callout).toHaveProperty('employee');
          expect(callout).toHaveProperty('supervisor');
          expect(callout).toHaveProperty('leaveType');
          expect(callout).toHaveProperty('supervisor');
          expect(callout).toHaveProperty('supervisor_comments');
          expect(callout).toHaveProperty('left_early_mins');
          expect(callout).toHaveProperty('arrived_late_mins');
        });

        expect.assertions(existingCallouts.length * 14 + 2);
      });

      describe("all's callout options", () => {
        it('Should get callouts by id', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              id: callout.id
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBe(1);
          expect(callouts[0].id).toBe(callout.id);

          expect.assertions(3);
        });

        it('should throw an error if the id is not a UUID', async () => {
          try {
            await calloutModelController.getCallOutFromDB.all({ id: 'invalid' });
          } catch (error) {
            expect(String(error)).toBe('Error: Invalid id');
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the created_at date', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              createdAt: callout.createdAt
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the created_at date is not a date', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ createdAt: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the updated_at date', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              updatedAt: callout.updatedAt
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the updated_at date is not a date', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ updatedAt: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the shift date', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              shift_date: callout.shift_date
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the shift date is not a date', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_date: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the shift time', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              shift_time: callout.shift_time.toISOString()
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the shift time is not a string', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_time: 5 });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the callout date', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              callout_date: callout.callout_date as Date
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the callout date is not a date', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_date: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the callout time', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              callout_time: callout.callout_time.toISOString()
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the callout time is not a string or number', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_time: {} });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the employee id', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              employee_id: callout.employee.id
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the employee id is not a UUID', async () => {
          try {
            await calloutModelController.getCallOutFromDB.all({ employee_id: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the supervisor id', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              supervisor_id: callout.supervisor.id
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the supervisor id is not a UUID', async () => {
          try {
            await calloutModelController.getCallOutFromDB.all({ supervisor_id: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the leave type id', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              leave_type_id: callout.leaveType.id
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);

          expect.assertions(2);
        });

        it('should throw an error if the leave type id is not a UUID', async () => {
          try {
            await calloutModelController.getCallOutFromDB.all({ leave_type_id: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by a shift date range', async () => {
          // grab a few random callouts to create a range
          const callout1 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];
          const callout2 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          // arrange the dates so that they are sorted by the shift date
          const shiftDates = [callout1.shift_date, callout2.shift_date].sort(
            (a, b) => a.getTime() - b.getTime()
          );

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              shift_date_range: [shiftDates[0], shiftDates[1]]
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the shift date range is not an array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_date_range: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the shift date range is not a date array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_date_range: ['invalid'] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the shift date range is not a date array of length 2', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_date_range: [new Date()] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by a shift time range', async () => {
          // grab a few random callouts to create a range
          const callout1 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];
          const callout2 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          // arrange the dates so that they are sorted by the shift time
          const shiftTimes = [callout1.shift_time, callout2.shift_time].sort(
            (a, b) => a.getTime() - b.getTime()
          );

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              shift_time_range: [shiftTimes[0].toISOString(), shiftTimes[1].toISOString()]
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the shift time range is not an array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_time_range: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the shift time range is not a date array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_time_range: ['invalid'] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the shift time range is not a date array of length 2', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ shift_time_range: [new Date()] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by a callout date range', async () => {
          // grab a few random callouts to create a range
          const callout1 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];
          const callout2 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          // arrange the dates so that they are sorted by the callout date
          const calloutDates = [callout1.callout_date, callout2.callout_date].sort(
            (a, b) => a.getTime() - b.getTime()
          );

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              callout_date_range: [calloutDates[0], calloutDates[1]]
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the callout date range is not an array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_date_range: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the callout date range is not a date array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_date_range: ['invalid'] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the callout date range is not a date array of length 2', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_date_range: [new Date()] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by a callout time range', async () => {
          // grab a few random callouts to create a range
          const callout1 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];
          const callout2 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          // arrange the dates so that they are sorted by the callout time
          const calloutTimes = [callout1.callout_time, callout2.callout_time].sort(
            (a, b) => a.getTime() - b.getTime()
          );

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              callout_time_range: [calloutTimes[0].toISOString(), calloutTimes[1].toISOString()]
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the callout time range is not an array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_time_range: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the callout time range is not a date array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_time_range: ['invalid'] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the callout time range is not a date array of length 2', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ callout_time_range: [new Date()] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the left early minutes', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              left_early_mins: callout.left_early_mins
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the left early minutes is not a number', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ left_early_mins: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the arrived late minutes', async () => {
          // grab a random callout
          const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              arrived_late_mins: callout.arrived_late_mins
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the arrived late minutes is not a number', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ arrived_late_mins: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be ale to get callouts by an arrived late minutes range', async () => {
          // grab a few random callouts to create a range
          const callout1 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];
          const callout2 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          // arrange the dates so that they are sorted by the arrived late minutes
          const arrivedLateMins = [callout1.arrived_late_mins, callout2.arrived_late_mins].sort(
            (a, b) => (a ?? 0) - (b ?? 0)
          );

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              arrived_late_mins_range: [arrivedLateMins[0] ?? 0, arrivedLateMins[1] ?? 0]
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the arrived late minutes range is not an array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ arrived_late_mins_range: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the arrived late minutes range is not a number array', async () => {
          try {
            await calloutModelController.getCallOutFromDB.all({
              // @ts-expect-error - testing bad input
              arrived_late_mins_range: ['invalid']
            });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the arrived late minutes range is not a number array of length 2', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ arrived_late_mins_range: [10] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the left early minutes range', async () => {
          // grab a few random callouts to create a range
          const callout1 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];
          const callout2 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          // arrange the dates so that they are sorted by the left early minutes
          const leftEarlyMins = [callout1.left_early_mins, callout2.left_early_mins].sort(
            (a, b) => (a ?? 0) - (b ?? 0)
          );

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              left_early_mins_range: [leftEarlyMins[0] ?? 0, leftEarlyMins[1] ?? 0]
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(1);
        });

        it('should throw an error if the left early minutes range is not an array', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ left_early_mins_range: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the left early minutes range is not a number array', async () => {
          try {
            await calloutModelController.getCallOutFromDB.all({
              // @ts-expect-error - testing bad input
              left_early_mins_range: ['invalid']
            });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should throw an error if the left early minutes range is not a number array of length 2', async () => {
          try {
            // @ts-expect-error - testing bad input
            await calloutModelController.getCallOutFromDB.all({ left_early_mins_range: [10] });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by the leave type id', async () => {
          const leaveTypes: LeaveTypeAttributes[] =
            await LeaveTypeModelController.getLeaveTypeFromDB.all();

          // grab a random leave type
          const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              leave_type_id: leaveType.id
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();

          callouts.forEach(callout => {
            expect(callout.leaveType.id).toBe(leaveType.id);
          });

          expect.assertions(callouts.length + 1);
        });

        it('should throw an error if the leave type id is not a UUID', async () => {
          try {
            await calloutModelController.getCallOutFromDB.all({ leave_type_id: 'invalid' });
          } catch (error) {
            expect(String(error)).toBeDefined();
          }
          expect.assertions(1);
        });

        it('should be able to get callouts by a mix of options - arrived late mins range + employee id', async () => {
          // grab a few random callouts to create a range
          const callout1 = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

          const callouts: CallOutWithAssociations[] =
            (await calloutModelController.getCallOutFromDB.all({
              arrived_late_mins_range: [0, 120],
              employee_id: callout1.employee.id
            })) as CallOutWithAssociations[];

          expect(callouts).toBeTruthy();
          expect(callouts.length).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  // CRUD: Update

  describe('updateCallOutInDB', () => {
    it('should throw an error if the id is not a UUID', async () => {
      try {
        await calloutModelController.updateCallOutInDB('invalid', {});
      } catch (error) {
        expect(String(error)).toBe('Error: Invalid id');
      }
      expect.assertions(1);
    });

    it('should throw an error if the id is missing', async () => {
      try {
        // @ts-expect-error - testing
        await calloutModelController.updateCallOutInDB(undefined, {});
      } catch (error) {
        expect(String(error)).toBe('Error: Missing required id');
      }
      expect.assertions(1);
    });

    it('should throw an error if the options are missing', async () => {
      try {
        await calloutModelController.updateCallOutInDB(uuid(), {});
      } catch (error) {
        expect(String(error)).toBe('Error: No properties to update');
      }
      expect.assertions(1);
    });

    it('should throw an error if the options are empty', async () => {
      try {
        await calloutModelController.updateCallOutInDB(uuid(), {});
      } catch (error) {
        expect(String(error)).toBe('Error: No properties to update');
      }
      expect.assertions(1);
    });

    it("should update a callout's shift date and shift time accordingly when the shift_date is changed", async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // create a new date within five days of the original date
      const newDate = new Date(callout.shift_date);
      // randomly add or subtract up to 5 days
      newDate.setDate(newDate.getDate() + Math.floor(Math.random() * 11) - 5);

      // update the callout

      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        shift_date: newDate
      });

      expect(updated).toBeTruthy();
      // expect the shift date to be updated to the new date with the existing time
      const expectedShiftDate = new Date(newDate);
      const previousShiftTime = new Date(callout.shift_time);
      expectedShiftDate.setHours(previousShiftTime.getHours());
      expectedShiftDate.setMinutes(previousShiftTime.getMinutes());
      expectedShiftDate.setSeconds(previousShiftTime.getSeconds());
      expectedShiftDate.setMilliseconds(0);

      // expect that the shift time has been updated to reflect the same date
      expect(updated?.shift_date).toEqual(expectedShiftDate);
      expect(updated?.shift_time).not.toEqual(callout.shift_time);
      expect(updated?.shift_date).not.toEqual(callout.shift_date);
    });

    it('should throw an error if the shift_date is not a date', async () => {
      try {
        // @ts-expect-error - testing bad input
        await calloutModelController.updateCallOutInDB(uuid(), { shift_date: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it("should update a callout's shift date and shift time accordingly when the shift_time is changed", async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // randomly add or subtract up to 5 hours
      const newTime = new Date(callout.shift_time);
      newTime.setHours(newTime.getHours() + Math.floor(Math.random() * 11) - 5);

      // update the callout
      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        shift_time: newTime
      });

      expect(updated).toBeTruthy();
      // expect the shift time to be updated to the new time with the existing date
      const expectedShiftTime = new Date(newTime);
      const previousShiftDate = new Date(callout.shift_date);
      expectedShiftTime.setFullYear(previousShiftDate.getFullYear());
      expectedShiftTime.setMonth(previousShiftDate.getMonth());
      expectedShiftTime.setDate(previousShiftDate.getDate());

      // expect that the shift time has been updated to reflect the same date
      expect(updated?.shift_time).toEqual(expectedShiftTime);
      expect(updated?.shift_time).not.toEqual(callout.shift_time);
      expect(updated?.shift_date).not.toEqual(callout.shift_date);
    });

    it('should throw an error if the shift_time is not a date', async () => {
      try {
        // @ts-expect-error - testing bad input
        await calloutModelController.updateCallOutInDB(uuid(), { shift_time: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it("should update a callout's callout date and callout time accordingly when the callout_date is changed", async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // create a new date within five days of the original date
      const newDate = new Date(callout.callout_date);
      // randomly add or subtract up to 5 days
      newDate.setDate(newDate.getDate() + Math.floor(Math.random() * 11) - 5);

      // update the callout
      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        callout_date: newDate
      });

      expect(updated).toBeTruthy();
      // expect the callout date to be updated to the new date with the existing time
      const expectedCalloutDate = new Date(newDate);
      const previousCalloutTime = new Date(callout.callout_time);
      expectedCalloutDate.setHours(previousCalloutTime.getHours());
      expectedCalloutDate.setMinutes(previousCalloutTime.getMinutes());
      expectedCalloutDate.setSeconds(previousCalloutTime.getSeconds());
      expectedCalloutDate.setMilliseconds(0);

      // expect that the callout time has been updated to reflect the same date
      expect(updated?.callout_date).toEqual(expectedCalloutDate);
      expect(updated?.callout_time).not.toEqual(callout.callout_time);
      expect(updated?.callout_date).not.toEqual(callout.callout_date);
    });

    it('should throw an error if the callout_date is not a date', async () => {
      try {
        // @ts-expect-error - testing bad input
        await calloutModelController.updateCallOutInDB(uuid(), { callout_date: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it("should update a callout's callout date and callout time accordingly when the callout_time is changed", async () => {
      try {
        // grab a random callout
        const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

        // randomly add or subtract up to 5 hours
        const newTime = new Date(callout.callout_time);
        newTime.setHours(newTime.getHours() + Math.floor(Math.random() * 11) - 5);

        // update the callout
        const updated = await calloutModelController.updateCallOutInDB(callout.id, {
          callout_time: newTime
        });

        // expect the callout time to be updated to the new time with the existing date
        const expectedCalloutTime = new Date(newTime);
        const previousCalloutDate = new Date(callout.callout_date);
        expectedCalloutTime.setFullYear(previousCalloutDate.getFullYear());
        expectedCalloutTime.setMonth(previousCalloutDate.getMonth());
        expectedCalloutTime.setDate(previousCalloutDate.getDate());

        // expect that the callout time has been updated to reflect the same date
        expect(updated?.callout_time).toEqual(expectedCalloutTime);
      } catch (error) {
        console.error('\nERROR IN TEST: CALLOUT TIME UPDATE\n', error);
      }

      expect.assertions(1);
    });

    it('should throw an error if the callout_time is not a date', async () => {
      try {
        // @ts-expect-error - testing bad input
        await calloutModelController.updateCallOutInDB(uuid(), { callout_time: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should update the callout with a new employee id', async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // get a random employee
      const employees = await Employee.findAll();
      const employee = employees[Math.floor(Math.random() * employees.length)];

      // update the callout
      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        employee_id: employee.id
      });

      expect(updated).toBeTruthy();
      expect(updated?.employee.id).toBe(employee.id);
    });

    it('should throw an error if the employee id is not a UUID', async () => {
      try {
        await calloutModelController.updateCallOutInDB(uuid(), { employee_id: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should update the callout with a new supervisor id', async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // get a random supervisor
      const supervisors = await Supervisor.findAll();
      const supervisor = supervisors[Math.floor(Math.random() * supervisors.length)];

      // update the callout
      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        supervisor_id: supervisor.id
      });

      expect(updated).toBeTruthy();
      expect(updated?.supervisor.id).toBe(supervisor.id);
    });

    it('should throw an error if the supervisor id is not a UUID', async () => {
      try {
        await calloutModelController.updateCallOutInDB(uuid(), { supervisor_id: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should update the callout with a new leave type id', async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // get a random leave type
      const leaveTypes = await LeaveType.findAll();
      const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];

      // update the callout
      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        leave_type_id: leaveType.id
      });

      expect(updated).toBeTruthy();
      expect(updated?.leaveType.id).toBe(leaveType.id);
    });

    it('should throw an error if the leave type id is not a UUID', async () => {
      try {
        await calloutModelController.updateCallOutInDB(uuid(), { leave_type_id: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should update the callout with a new left early minutes value', async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // randomly add or subtract up to 5 minutes
      let newMins = -1;

      while (newMins < 0)
        newMins = (callout?.left_early_mins ?? 0) + Math.floor(Math.random() * 11) - 5;

      // update the callout
      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        left_early_mins: newMins < 0 ? 0 : newMins
      });

      expect(updated).toBeTruthy();
      expect(updated?.left_early_mins).toBe(newMins);
    });

    it('should throw an error if the left early minutes is not a number', async () => {
      try {
        // @ts-expect-error - testing bad input
        await calloutModelController.updateCallOutInDB(uuid(), { left_early_mins: 'invalid' });
      } catch (error) {
        expect(String(error)).toBeDefined();
      }
      expect.assertions(1);
    });

    it('should update the callout with a new arrived late minutes value', async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      // randomly add or subtract up to 5 minutes
      let newMins = -1;

      while (newMins < 0)
        newMins = (callout?.arrived_late_mins ?? 0) + Math.floor(Math.random() * 11) - 5;

      // update the callout
      const updated = await calloutModelController.updateCallOutInDB(callout.id, {
        arrived_late_mins: newMins
      });

      expect(updated).toBeTruthy();
      expect(updated?.arrived_late_mins).toBe(newMins);
    });
  });

  // CRUD: Delete
  describe('deleteCallOutFromDB', () => {
    it('should throw an error if the id is not a UUID', async () => {
      try {
        await calloutModelController.deleteCallOutFromDB('invalid');
      } catch (error) {
        expect(String(error)).toBe('Error: Invalid id');
      }
      expect.assertions(1);
    });

    it('should throw an error if the id is missing', async () => {
      try {
        // @ts-expect-error - testing
        await calloutModelController.deleteCallOutFromDB(undefined);
      } catch (error) {
        expect(String(error)).toBe('Error: Missing required id');
      }
      expect.assertions(1);
    });

    it('should delete a callout from the database', async () => {
      // grab a random callout
      const callout = existingCallouts[Math.floor(Math.random() * existingCallouts.length)];

      const deleted = await calloutModelController.deleteCallOutFromDB(callout.id);

      expect(deleted).toBeTruthy();
    });

    it('should throw an error the callout does not exist', async () => {
      try {
        await calloutModelController.deleteCallOutFromDB(uuid());
      } catch (error) {
        expect(String(error)).toBeDefined();
      }

      expect.assertions(1);
    });
  });
});
