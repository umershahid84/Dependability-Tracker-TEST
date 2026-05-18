import {EmployeeSchedule} from '../../models';
import {Division, Employee} from '../../models';

describe('EmployeeSchedule model', () => {
  let employeeId = '';

  beforeAll(async () => {
    const divisionIds = await Division.findAll().then(divisions => divisions.map(division => division.id));
    const employee = await Employee.create({
      name: 'Schedule Model Test Employee',
      division_ids: divisionIds
    });

    employeeId = employee.id;
  });

  it('should create an employee schedule record', async () => {
    const schedule = await EmployeeSchedule.create({
      employee_id: employeeId,
      shift_start_time: '07:00',
      shift_end_time: '15:00',
      days_off_type: '2_DAYS_OFF',
      employee_status: 'FULL_TIME',
      is_active: true
    });

    expect(schedule).toBeDefined();
    expect(schedule.employee_id).toBe(employeeId);
    expect(schedule.is_active).toBe(true);
    expect(schedule.effective_end).toBeNull();
    expect.assertions(4);
  });
});
