import {uuidV4Regex} from '../../../utils';
import LeaveType, {LeaveTypeCreationAttributes} from './';

describe('LeaveType Model', () => {
  let leaveType: LeaveType;
  it('Should be defined', async () => {
    expect(LeaveType).toBeDefined();
    expect.assertions(1);
  });

  it('Should create a leaveType', async () => {
    leaveType = await LeaveType.create({
      reason: 'Test Leave'
    } as LeaveTypeCreationAttributes);

    expect(leaveType).toBeDefined();
    expect.assertions(1);
  });

  it('Should have an id', () => {
    expect(leaveType.id).toBeDefined();
    expect(uuidV4Regex.test(leaveType.id)).toBe(true);
    expect.assertions(2);
  });

  it('Should have a reason', () => {
    expect(leaveType.reason).toBe('Test Leave');
    expect.assertions(1);
  });

  it('Should have a createdAt date', () => {
    expect(leaveType.createdAt).toBeDefined();
    expect(leaveType.createdAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });

  it('Should have an updatedAt date', () => {
    expect(leaveType.updatedAt).toBeDefined();
    expect(leaveType.updatedAt).toBeInstanceOf(Date);
    expect.assertions(2);
  });
});
