// CRUD controller for LeaveType
import {LeaveType} from '../../models';
import {validateLeaveTypeReason} from './helpers';
import {LeaveTypeAttributes, LeaveTypeCreationAttributes} from '../../models/types';

// (C)reate
export const createLeaveTypeInDB = async (
  leaveType: LeaveTypeCreationAttributes
): Promise<LeaveTypeAttributes | null> => {
  validateLeaveTypeReason(leaveType.reason);
  try {
    return (await LeaveType.create(leaveType))?.get({plain: true});
  } catch (error) {
    throw new Error(`\n❌ Error creating leave type: ${error}`);
  }
};
// (R)ead
export const getLeaveTypeFromDB = {
  all: async (): Promise<LeaveTypeAttributes[]> => {
    try {
      return (await LeaveType.findAll()).map(leaveType => leaveType.get({plain: true}));
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching leave types: ${error}`);
    }
  },
  byId: async (id: string): Promise<LeaveTypeAttributes | null> => {
    try {
      return (await LeaveType.findByPk(id))?.get({plain: true}) ?? null;
    } catch (error) {
      // istanbul ignore next
      throw new Error(`\n❌ Error fetching leave type: ${error}`);
    }
  }
};
// (U)pdate
export const updateLeaveTypeInDB = async (
  id: string,
  leaveType: LeaveTypeCreationAttributes
): Promise<LeaveTypeAttributes | null> => {
  validateLeaveTypeReason(leaveType.reason);
  try {
    await LeaveType.update(leaveType, {where: {id}});
    return getLeaveTypeFromDB.byId(id);
  } catch (error) {
    throw new Error(`\n❌ Error updating leave type: ${error}`);
  }
};
// (D)elete
export const deleteLeaveTypeFromDB = async (id: string): Promise<boolean> => {
  try {
    const deleted = await LeaveType.destroy({where: {id}});
    return deleted > 0;
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error deleting leave type: ${error}`);
  }
};

export const LeaveTypeModelController = {
  createLeaveTypeInDB,
  getLeaveTypeFromDB,
  updateLeaveTypeInDB,
  deleteLeaveTypeFromDB
};

export default LeaveTypeModelController;
