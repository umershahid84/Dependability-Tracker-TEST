import {Division, Employee} from '../../models';
import {employeeModelController} from './index';

describe('Employee Controller', () => {
  describe('createEmployeeInDB', () => {
    it('should create an employee', async () => {
      const divisionIds = await Division.findAll().then(divisions =>
        divisions.map(division => division.id)
      );

      const employeeData = {
        name: 'John Doe',
        division_ids: divisionIds
      };

      const newEmployee = await employeeModelController.createEmployeeInDB(employeeData);
      expect(newEmployee).toHaveProperty('id');
      expect(newEmployee).toHaveProperty('divisions');
      expect(newEmployee).toHaveProperty('name', 'John Doe');
      expect(newEmployee).not.toHaveProperty('division_ids');

      expect.assertions(4);
    });

    it('should throw an error if the employee create data is missing a division id', async () => {
      const employeeData = {
        name: 'John Doe',
        division_ids: []
      };

      try {
        await employeeModelController.createEmployeeInDB(employeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error creating employee/);
      }

      expect.assertions(2);
    });

    it('should throw an error if the employee create data is missing a name', async () => {
      const divisionIds = await Division.findAll().then(divisions =>
        divisions.map(division => division.id)
      );

      const employeeData = {
        name: '',
        division_ids: divisionIds
      };

      try {
        await employeeModelController.createEmployeeInDB(employeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error creating employee/);
      }

      expect.assertions(2);
    });

    it('should throw an error if the division id is invalid', async () => {
      const employeeData = {
        name: 'John Doe',
        division_ids: ['invalid-id']
      };

      try {
        await employeeModelController.createEmployeeInDB(employeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error creating employee/);
      }

      expect.assertions(2);
    });

    it('should throw an error if the division id is not a string', async () => {
      const employeeData = {
        name: 'John Doe',
        division_ids: [1]
      };

      try {
        // @ts-expect-error - Testing invalid data
        await employeeModelController.createEmployeeInDB(employeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error creating employee/);
      }

      expect.assertions(2);
    });

    it('should throw an error if the division id is not an array', async () => {
      const employeeData = {
        name: 'John Doe',
        division_ids: 'invalid-id'
      };

      try {
        // @ts-expect-error - Testing invalid data
        await employeeModelController.createEmployeeInDB(employeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error creating employee/);
      }

      expect.assertions(2);
    });

    it('should throw an error if the name is not a string', async () => {
      const divisionIds = await Division.findAll().then(divisions =>
        divisions.map(division => division.id)
      );

      const employeeData = {
        name: 1,
        division_ids: divisionIds
      };

      try {
        // @ts-expect-error - Testing invalid data
        await employeeModelController.createEmployeeInDB(employeeData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error creating employee/);
      }

      expect.assertions(2);
    });
  });

  describe('getEmployeeFromDB', () => {
    it('should get an employee by id', async () => {
      const employeeId = await Employee.findOne().then(employee => employee?.id);
      const employee = await employeeModelController.getEmployeeFromDB.byId(employeeId as string);
      expect(employee).toHaveProperty('id', employeeId);

      expect.assertions(1);
    });

    it('should get an employee by name', async () => {
      const employeeName = 'John Doe';
      const employee = await employeeModelController.getEmployeeFromDB.byName(employeeName);
      expect(employee).toHaveProperty('name', employeeName);

      expect.assertions(1);
    });

    it('should get all employees', async () => {
      const employees = await employeeModelController.getEmployeeFromDB.all();
      expect(employees).toBeInstanceOf(Array);
      expect(employees.length).toBeGreaterThan(0);

      expect.assertions(2);
    });

    it('should return null if the employee id does not exist', async () => {
      const employee = await employeeModelController.getEmployeeFromDB.byId('invalid-id');
      expect(employee).toBeNull();

      expect.assertions(1);
    });

    it('should return null if the employee name does not exist', async () => {
      const employee = await employeeModelController.getEmployeeFromDB.byName('invalid-name');
      expect(employee).toBeNull();
    });

    it('should throw an error if the employee id is invalid', async () => {
      try {
        // @ts-expect-error - Testing invalid data
        await employeeModelController.getEmployeeFromDB.byId(1);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error fetching employee/);
      }
    });

    it('should throw an error if the employee name is invalid', async () => {
      try {
        // @ts-expect-error - Testing invalid data
        await employeeModelController.getEmployeeFromDB.byName(1);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Error fetching employee/);
      }
    });
  });

  describe('updateEmployeeInDB', () => {
    describe('employeeName', () => {
      it('should update an employee name', async () => {
        const employeeId = await Employee.findOne().then(employee => employee?.id);
        const updatedEmployee = await employeeModelController.updateEmployeeInDB.employeeName(
          employeeId as string,
          'Jane Doe'
        );
        expect(updatedEmployee).toBe(1);
      });

      it('should throw an error if the employee id is invalid', async () => {
        try {
          await employeeModelController.updateEmployeeInDB.employeeName('invalid-id', 'Jane Doe');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(String(error)).toMatch(/Employee with ID invalid-id not found/);
        }
      });

      it('should throw an error if the employee name is invalid', async () => {
        try {
          const employeeId = await Employee.findOne().then(employee => employee?.id);
          // @ts-expect-error - Testing invalid data
          await employeeModelController.updateEmployeeInDB.employeeName(employeeId, 1);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(String(error)).toMatch(/Error updating employee/);
        }
      });
    });

    describe('addDivisionToEmployee', () => {
      it('should add a division to an employee', async () => {
        const employeeId = await Employee.findOne().then(employee => employee?.id);

        // create a new division
        const division: Division = await Division.create({name: 'New Division'});

        const updatedEmployee =
          await employeeModelController.updateEmployeeInDB.addDivisionToEmployee(
            employeeId as string,
            division?.id as string
          );

        expect(updatedEmployee).toBe(1);
      });

      it('should throw an error if the employee id is invalid', async () => {
        try {
          const divisionId = await Division.findOne().then(division => division?.id);
          await employeeModelController.updateEmployeeInDB.addDivisionToEmployee(
            'invalid-id',
            divisionId as string
          );
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(String(error)).toMatch(/Employee with ID invalid-id not found/);
        }
      });

      it('should throw an error if the division id is invalid', async () => {
        try {
          const employeeId = await Employee.findOne().then(employee => employee?.id);
          await employeeModelController.updateEmployeeInDB.addDivisionToEmployee(
            employeeId as string,
            'invalid-id'
          );
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(String(error)).toMatch(/Division with ID invalid-id not found/);
        }
      });
    });

    describe('removeDivisionFromEmployee', () => {
      it('should remove a division from an employee', async () => {
        const employeeId = await Employee.findOne().then(employee => employee?.id);

        // create a new division
        const division: Division = await Division.create({name: 'New Division 2'});

        // add the division to the employee
        await employeeModelController.updateEmployeeInDB.addDivisionToEmployee(
          employeeId as string,
          division.id
        );

        const updatedEmployee =
          await employeeModelController.updateEmployeeInDB.removeDivisionFromEmployee(
            employeeId as string,
            division.id
          );

        expect(updatedEmployee).toBe(1);
      });

      it('should throw an error if the employee id is invalid', async () => {
        try {
          const divisionId = await Division.findOne().then(division => division?.id);
          await employeeModelController.updateEmployeeInDB.removeDivisionFromEmployee(
            'invalid-id',
            divisionId as string
          );
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(String(error)).toMatch(/Employee with ID invalid-id not found/);
        }
      });

      it('should throw an error if the division id is invalid', async () => {
        try {
          const employeeId = await Employee.findOne().then(employee => employee?.id);
          await employeeModelController.updateEmployeeInDB.removeDivisionFromEmployee(
            employeeId as string,
            'invalid-id'
          );
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(String(error)).toMatch(/Division with ID invalid-id not found/);
        }
      });
    });
  });

  describe('deleteEmployeeFromDB', () => {
    it('should delete an employee', async () => {
      const employeeId = await Employee.findOne().then(employee => employee?.id);
      const deletedEmployee = await employeeModelController.deleteEmployeeFromDB(
        employeeId as string
      );
      expect(deletedEmployee).toBe(1);
    });

    it('should throw an error if the employee id is invalid', async () => {
      try {
        await employeeModelController.deleteEmployeeFromDB('invalid-id');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(String(error)).toMatch(/Employee with ID invalid-id not found/);
      }
    });

    it('should return 0 if the employee does not exist', async () => {
      const deletedEmployee = await employeeModelController.deleteEmployeeFromDB('invalid-id');
      expect(deletedEmployee).toBe(0);
    });
  });
});
