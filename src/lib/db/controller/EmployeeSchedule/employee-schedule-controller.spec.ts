import {Division, Employee, EmployeeSchedule} from '../../models';
import {
  getEmployeeScheduleFromDB,
  upsertEmployeeScheduleVersionInDB
} from './index';

describe('EmployeeSchedule controller', () => {
  let employeeId = '';

  beforeAll(async () => {
    const divisionIds = await Division.findAll().then(divisions => divisions.map(division => division.id));
    const employee = await Employee.create({
      name: 'Schedule Controller Test Employee',
      division_ids: divisionIds
    });

    employeeId = employee.id;
  });

  it('creates an active schedule', async () => {
    await upsertEmployeeScheduleVersionInDB(employeeId, {
      shiftStartTime: '06:00',
      shiftEndTime: '14:00',
      daysOffType: '2_DAYS_OFF',
      employeeStatus: 'FULL_TIME'
    });

    const active = await getEmployeeScheduleFromDB.activeByEmployeeId(employeeId);
    expect(active).toBeDefined();
    expect(active?.is_active).toBe(true);
    expect(active?.effective_end).toBeNull();
    expect.assertions(3);
  });

  it('does not create a new version when schedule data is unchanged', async () => {
    const before = await getEmployeeScheduleFromDB.historyByEmployeeId(employeeId);
    await upsertEmployeeScheduleVersionInDB(employeeId, {
      shiftStartTime: '06:00',
      shiftEndTime: '14:00',
      daysOffType: '2_DAYS_OFF',
      employeeStatus: 'FULL_TIME'
    });

    const after = await getEmployeeScheduleFromDB.historyByEmployeeId(employeeId);
    expect(after.length).toBe(before.length);
  });

  it('archives old active schedule and creates a new active version when changed', async () => {
    await upsertEmployeeScheduleVersionInDB(employeeId, {
      shiftStartTime: '08:00',
      shiftEndTime: '16:00',
      daysOffType: '3_DAYS_OFF',
      employeeStatus: 'PART_TIME'
    });

    const history = await EmployeeSchedule.findAll({
      where: {employee_id: employeeId},
      order: [['createdAt', 'ASC']]
    });

    const active = history.find(schedule => schedule.is_active);
    const archived = history.filter(schedule => !schedule.is_active);

    expect(active).toBeDefined();
    expect(active?.days_off_type).toBe('3_DAYS_OFF');
    expect(active?.employee_status).toBe('PART_TIME');
    expect(archived.length).toBeGreaterThan(0);
    expect(archived.every(schedule => schedule.effective_end !== null)).toBe(true);
    expect.assertions(5);
  });
});
