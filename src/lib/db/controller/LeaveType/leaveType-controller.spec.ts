import {uuidV4Regex} from '../../../utils';
import {LeaveTypeModelController} from './index';
import LeaveType, {LeaveTypeAttributes} from '../../models/LeaveType';

describe('LeaveTypeModelController', () => {
  describe('createLeaveTypeInDB', () => {
    it('should create a new LeaveType in the database', async () => {
      const leaveType = {
        reason: 'Test Reason'
      };

      const result: LeaveTypeAttributes | null = await LeaveTypeModelController.createLeaveTypeInDB(
        leaveType
      );

      expect(result).toHaveProperty('id');
      expect(result?.reason).toBe(leaveType.reason);
      expect(uuidV4Regex.test(result?.id as string)).toBe(true);

      expect.assertions(3);
    });

    it('should throw an error if reason is empty', async () => {
      const leaveType = {
        reason: ''
      };

      try {
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason is required');
      }

      expect.assertions(2);
    });

    it('should throw an error if reason is not a string', async () => {
      const leaveType = {
        reason: 123
      };

      try {
        // @ts-expect-error - Testing for non-string reason
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason must be a string');
      }

      expect.assertions(2);
    });

    it('should throw an error if reason is less than 5 characters', async () => {
      const leaveType = {
        reason: 'Test'
      };

      try {
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason must be between 5 and 100 characters');
      }

      expect.assertions(2);
    });

    it('should throw an error if reason is more than 100 characters', async () => {
      const leaveType = {
        reason: 'T'.repeat(101)
      };

      try {
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason must be between 5 and 100 characters');
      }

      expect.assertions(2);
    });

    it('should throw an error if the reason is undefined', async () => {
      const leaveType = {
        reason: undefined
      };

      try {
        // @ts-expect-error - Testing for undefined reason
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason is required');
      }

      expect.assertions(2);
    });

    it('should throw an error if the reason is not unique', async () => {
      const leaveType = {
        reason: 'Test Reason'
      };

      try {
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect.assertions(1);
    });
  });

  describe('getLeaveTypeFromDB', () => {
    describe('all', () => {
      it('should get all LeaveTypes from the database', async () => {
        const result: LeaveTypeAttributes[] =
          await LeaveTypeModelController.getLeaveTypeFromDB.all();
        const leaveTypes = (await LeaveType.findAll()).map(leaveType =>
          leaveType.get({plain: true})
        );

        expect(result.length).toBe(leaveTypes.length);
        expect(result).toEqual(leaveTypes);
      });
    });

    describe('byId', () => {
      it('should get a LeaveType from the database', async () => {
        const leaveType = {
          reason: 'Test Reason 0'
        };

        const createdLeaveType: LeaveTypeAttributes | null =
          await LeaveTypeModelController.createLeaveTypeInDB(leaveType);

        const result: LeaveTypeAttributes | null =
          await LeaveTypeModelController.getLeaveTypeFromDB.byId(createdLeaveType?.id as string);

        expect(result).toHaveProperty('id');
        expect(result?.reason).toBe(leaveType.reason);
        expect(uuidV4Regex.test(result?.id as string)).toBe(true);

        expect.assertions(3);
      });

      it('should return null if the LeaveType does not exist', async () => {
        const result: LeaveTypeAttributes | null =
          await LeaveTypeModelController.getLeaveTypeFromDB.byId('123');

        expect(result).toBeNull();

        expect.assertions(1);
      });
    });
  });

  describe('updateLeaveTypeInDB', () => {
    it('should update a LeaveType in the database', async () => {
      const leaveType = {
        reason: 'Test Reason 1'
      };

      const createdLeaveType: LeaveTypeAttributes | null =
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);

      const updatedLeaveType = {
        reason: 'Updated Reason'
      };

      const result: LeaveTypeAttributes | null = await LeaveTypeModelController.updateLeaveTypeInDB(
        createdLeaveType?.id as string,
        updatedLeaveType
      );

      expect(result).toHaveProperty('id');
      expect(result?.reason).toBe(updatedLeaveType.reason);
      expect(uuidV4Regex.test(result?.id as string)).toBe(true);

      expect.assertions(3);
    });

    it('should throw an error if reason is empty', async () => {
      const leaveType = {
        reason: 'Test Reason 2'
      };

      const createdLeaveType: LeaveTypeAttributes | null =
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);

      const updatedLeaveType = {
        reason: ''
      };

      try {
        await LeaveTypeModelController.updateLeaveTypeInDB(
          createdLeaveType?.id as string,
          updatedLeaveType
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason is required');
      }

      expect.assertions(2);
    });

    it('should throw an error if reason is not a string', async () => {
      const leaveType = {
        reason: 'Test Reason 3'
      };

      const createdLeaveType: LeaveTypeAttributes | null =
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);

      const updatedLeaveType = {
        reason: 123
      };

      try {
        await LeaveTypeModelController.updateLeaveTypeInDB(
          createdLeaveType?.id as string,
          // @ts-expect-error - Testing for non-string reason
          updatedLeaveType
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason must be a string');
      }

      expect.assertions(2);
    });

    it('should throw an error if reason is less than 5 characters', async () => {
      const leaveType = {
        reason: 'Test'
      };

      try {
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason must be between 5 and 100 characters');
      }

      expect.assertions(2);
    });

    it('should throw an error if reason is more than 100 characters', async () => {
      const leaveType = {
        reason: 'Test'.repeat(26)
      };

      try {
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toBe('Error: Reason must be between 5 and 100 characters');
      }

      expect.assertions(2);
    });

    it('should throw an error if the reason is undefined', async () => {
      const leaveType = {
        reason: 'Test Reason 4'
      };

      const createdLeaveType: LeaveTypeAttributes | null =
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);

      const updatedLeaveType = {
        reason: undefined
      };

      try {
        await LeaveTypeModelController.updateLeaveTypeInDB(
          createdLeaveType?.id as string,
          // @ts-expect-error - Testing for undefined reason
          updatedLeaveType
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect.assertions(1);
    });

    it('should throw an error if the reason is not unique', async () => {
      const leaveType1 = {
        reason: 'Test Reason 8'
      };

      const leaveType2 = {
        reason: 'Test Reason 9'
      };

      const createdLeaveType1: LeaveTypeAttributes | null =
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType1);

      await LeaveTypeModelController.createLeaveTypeInDB(leaveType2);

      const updatedLeaveType = {
        reason: leaveType2.reason
      };

      try {
        await LeaveTypeModelController.updateLeaveTypeInDB(
          createdLeaveType1?.id as string,
          updatedLeaveType
        );
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect.assertions(1);
    });
  });

  describe('deleteLeaveTypeFromDB', () => {
    it('should delete a LeaveType from the database', async () => {
      const leaveType = {
        reason: 'Test Reason 10'
      };

      const createdLeaveType: LeaveTypeAttributes | null =
        await LeaveTypeModelController.createLeaveTypeInDB(leaveType);

      const result: boolean = await LeaveTypeModelController.deleteLeaveTypeFromDB(
        createdLeaveType?.id as string
      );

      expect(result).toBe(true);

      expect.assertions(1);
    });

    it('should return false if the LeaveType does not exist', async () => {
      const result: boolean = await LeaveTypeModelController.deleteLeaveTypeFromDB('123');

      expect(result).toBe(false);

      expect.assertions(1);
    });
  });
});
