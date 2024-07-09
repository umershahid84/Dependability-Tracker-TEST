import Employee from '../Employee';
import LeaveType from '../LeaveType';
import Supervisor from '../Supervisor';
import {uuidV4Regex} from '../../../utils';
import CallOut, {CallOutCreationAttributes} from './';

describe('CallOut model', () => {
  let callOut: CallOut;
  it('Should be defined', async () => {
    expect(CallOut).toBeDefined();
    expect.assertions(1);
  });

  it('Should create a callOut', async () => {
    const newDate = new Date();
    const supervisorId = await Supervisor.findOne().then(supervisor => supervisor?.id);
    if (!supervisorId) {
      throw new Error('Supervisor not found');
    }
    const leaveTypeId = await LeaveType.findOne().then(leaveType => leaveType?.id);
    if (!leaveTypeId) {
      throw new Error('LeaveType not found');
    }

    const employeeID = await Employee.findOne().then(employee => employee?.id);
    if (!employeeID) {
      throw new Error('Employee not found');
    }

    callOut = await CallOut.create({
      shift_date: newDate,
      shift_time: newDate,
      callout_date: newDate,
      callout_time: newDate,
      left_early_mins: 0,
      arrived_late_mins: 0,
      supervisor_comments: 'Test comment',
      employee_id: employeeID,
      supervisor_id: supervisorId,
      leave_type_id: leaveTypeId
    } as CallOutCreationAttributes);

    expect(callOut).toBeDefined();

    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(callOut.id).toBeDefined();
    expect(uuidV4Regex.test(callOut.id)).toBe(true);
    expect.assertions(2);
  });

  it('Should have a shift_date', () => {
    expect(callOut.shift_date).toBeDefined();
    expect(callOut.shift_date).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have a shift_time', () => {
    expect(callOut.shift_time).toBeDefined();
    expect(callOut.shift_time).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have a callout_date', () => {
    expect(callOut.callout_date).toBeDefined();
    expect(callOut.callout_date).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have a callout_time', () => {
    expect(callOut.callout_time).toBeDefined();
    expect(callOut.callout_time).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have a left_early_mins', () => {
    expect(callOut.left_early_mins).toBe(0);
    expect.assertions(1);
  });

  it('Should have an arrived_late_mins', () => {
    expect(callOut.arrived_late_mins).toBe(0);
    expect.assertions(1);
  });

  it('Should have a supervisor_comments', () => {
    expect(callOut.supervisor_comments).toBe('Test comment');
    expect.assertions(1);
  });

  it('Should have an employee_id', () => {
    expect(callOut.employee_id).toBeDefined();
    expect.assertions(1);
  });

  it('Should have a supervisor_id', () => {
    expect(callOut.supervisor_id).toBeDefined();
    expect.assertions(1);
  });

  it('Should have a leave_type_id', () => {
    expect(callOut.leave_type_id).toBeDefined();
    expect.assertions(1);
  });

  it('Should have a createdAt date', () => {
    expect(callOut.createdAt).toBeDefined();
    expect(callOut.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have an updatedAt date', () => {
    expect(callOut.updatedAt).toBeDefined();
    expect(callOut.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });
});
