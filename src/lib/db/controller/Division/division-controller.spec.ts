import {divisionModelController} from './index';
import {DivisionAttributes} from '../../models/Division';

describe('Division Controller', () => {
  describe('createDivisionInDB', () => {
    it('should create a division in the database', async () => {
      const divisionData = {
        name: 'Test'
      };
      const division = await divisionModelController.createDivisionInDB(divisionData);
      expect(division).toHaveProperty('id');
      expect(division).toHaveProperty('name', divisionData.name);
    });

    it('should throw an error if the division name is less than 3 characters', async () => {
      const divisionData = {
        name: ''
      };

      try {
        await divisionModelController.createDivisionInDB(divisionData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Division name must be at least 3 characters long');
      }

      expect.assertions(2);
    });

    it('should throw an error if the division name is not a string', async () => {
      const divisionData = {
        name: 123
      };

      try {
        // @ts-ignore - Testing invalid input
        await divisionModelController.createDivisionInDB(divisionData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Division name must be a string');
      }

      expect.assertions(2);
    });

    it('should throw an error if the division name is not provided', async () => {
      const divisionData = {};

      try {
        // @ts-ignore - Testing invalid input
        await divisionModelController.createDivisionInDB(divisionData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Division name must be a string');
      }

      expect.assertions(2);
    });

    it('should throw an error if the division name is not unique', async () => {
      const divisionData = {
        name: 'Test'
      };

      try {
        await divisionModelController.createDivisionInDB(divisionData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Error creating division');
      }

      expect.assertions(2);
    });
  });

  describe('getDivisionFromDB', () => {
    it('should get a division by ID from the database', async () => {
      const divisionData = {
        name: 'Test 1'
      };
      const division: DivisionAttributes | null = await divisionModelController.createDivisionInDB(
        divisionData
      );
      const foundDivision = await divisionModelController.getDivisionFromDB.byId(
        division?.id as string
      );
      expect(foundDivision).toHaveProperty('id', division?.id);
      expect(foundDivision).toHaveProperty('name', divisionData.name);
    });

    it('should get a division by name from the database', async () => {
      const divisionData = {
        name: 'Test 2'
      };
      const division = await divisionModelController.createDivisionInDB(divisionData);
      const foundDivision = await divisionModelController.getDivisionFromDB.byName(
        divisionData.name
      );
      expect(foundDivision).toHaveProperty('id', division?.id as string);
      expect(foundDivision).toHaveProperty('name', divisionData.name);
    });

    it('should return null if the division is not found by ID', async () => {
      const foundDivision = await divisionModelController.getDivisionFromDB.byId('invalid-id');
      expect(foundDivision).toBeNull();
    });

    it('should return null if the division is not found by name', async () => {
      const foundDivision = await divisionModelController.getDivisionFromDB.byName('invalid-name');
      expect(foundDivision).toBeNull();
    });
  });

  describe('updateDivisionInDB', () => {
    it('should update a division in the database', async () => {
      const divisionData = {
        name: 'Test 3'
      };
      const division = await divisionModelController.createDivisionInDB(divisionData);
      const updatedDivision = await divisionModelController.updateDivisionInDB(
        division?.id as string,
        'Updated Test'
      );
      expect(updatedDivision).toHaveProperty('id', division?.id);
      expect(updatedDivision).toHaveProperty('name', 'Updated Test');
    });

    it('should return null if the division is not found', async () => {
      const updatedDivision = await divisionModelController.updateDivisionInDB(
        'invalid-id',
        'Updated Test'
      );
      expect(updatedDivision).toBeNull();
    });

    it('should throw an error if the division name is less than 3 characters', async () => {
      const divisionData = {
        name: 'Test 4'
      };
      const division = await divisionModelController.createDivisionInDB(divisionData);

      try {
        await divisionModelController.updateDivisionInDB(division?.id as string, '');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Division name must be at least 3 characters long');
      }

      expect.assertions(2);
    });

    it('should throw an error if the division name is not a string', async () => {
      const divisionData = {
        name: 'Test 5'
      };
      const division = await divisionModelController.createDivisionInDB(divisionData);

      try {
        // @ts-ignore - Testing invalid input
        await divisionModelController.updateDivisionInDB(division?.id as string, 123);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Division name must be a string');
      }

      expect.assertions(2);
    });

    it('should throw an error if the division name is not provided', async () => {
      const divisionData = {
        name: 'Test 6'
      };
      const division = await divisionModelController.createDivisionInDB(divisionData);

      try {
        // @ts-ignore - Testing invalid input
        await divisionModelController.updateDivisionInDB(division?.id as string, {});
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Division name must be a string');
      }

      expect.assertions(2);
    });

    it('should throw an error if the division name is not unique', async () => {
      const divisionData = {
        name: 'Test 7'
      };
      await divisionModelController.createDivisionInDB(divisionData);
      const division2 = await divisionModelController.createDivisionInDB({
        name: 'Test 8'
      });

      try {
        await divisionModelController.updateDivisionInDB(
          division2?.id as string,
          divisionData.name
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toContain('❌ Error updating division');
      }

      expect.assertions(2);
    });
  });

  describe('deleteDivisionFromDB', () => {
    it('should delete a division from the database', async () => {
      const divisionData = {
        name: 'Test 9'
      };
      const division = await divisionModelController.createDivisionInDB(divisionData);
      const deleted = await divisionModelController.deleteDivisionFromDB(division?.id as string);
      expect(deleted).toBe(true);
    });

    it('should return false if the division is not found', async () => {
      const deleted = await divisionModelController.deleteDivisionFromDB('invalid-id');
      expect(deleted).toBe(false);
    });
  });
});
