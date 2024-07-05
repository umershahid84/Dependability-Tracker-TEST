import CallOut, {CallOutCreationAttributes} from './';

describe('CallOut model', () => {
  let callOut: CallOut;
  it('Should be defined', async () => {
    expect(CallOut).toBeDefined();
    expect.assertions(1);
  });

  it('Should create a callOut', async () => {
    const newDate = new Date();
    callOut = await CallOut.create({
      shift_date: newDate,
      shift_time: newDate,
      callout_date: newDate,
      callout_time: newDate,
      left_early_mins: 0,
      arrived_late_mins: 0,
      supervisor_comments: 'Test comment',
      employee_id: 20,
      supervisor_id: 1,
      leave_type_id: 1
    } as CallOutCreationAttributes);

    expect(callOut).toBeDefined();

    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(callOut.id).toBeDefined();
    expect(callOut.id).toBeGreaterThan(0);
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
    expect(callOut.employee_id).toBe(20);
    expect.assertions(1);
  });

  it('Should have a supervisor_id', () => {
    expect(callOut.supervisor_id).toBe(1);
    expect.assertions(1);
  });

  it('Should have a leave_type_id', () => {
    expect(callOut.leave_type_id).toBe(1);
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
