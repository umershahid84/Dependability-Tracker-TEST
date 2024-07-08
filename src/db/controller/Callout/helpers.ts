import {Op} from 'sequelize';
import {
  CallOutAttributes,
  CallOutWithAssociations,
  CallOutCreationAttributes
} from '../../../db/models/types';
import {CallOut} from '../../models';
import {uuidV4Regex} from '../../../utils';
import {getEmployeeFromDB} from '../Employee';
import {getLeaveTypeFromDB} from '../LeaveType';
import {getSupervisorFromDB} from '../Supervisor';

// all the options that can be used to get callouts
export type GetCallAllCalloutOptions = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shift_date?: Date;
  shift_time?: Date;
  callout_date?: Date;
  callout_time?: Date;
  employee_id?: string;
  supervisor_id?: string;
  leave_type_id?: string;
  shift_date_range?: [Date, Date];
  shift_time_range?: [Date, Date];
  left_early_mins?: number | null;
  arrived_late_mins?: number | null;
  callout_date_range?: [Date, Date];
  callout_time_range?: [Date, Date];
  left_early_mins_range?: [number, number];
  arrived_late_mins_range?: [number, number];
};

export type EditableCalloutProps = {
  shift_date?: Date;
  shift_time?: Date;
  callout_date?: Date;
  callout_time?: Date;
  employee_id?: string;
  supervisor_id?: string;
  leave_type_id?: string;
  supervisor_comments?: string;
  left_early_mins?: number | null;
  arrived_late_mins?: number | null;
};

/**
 * Adjusts the properties of a callout to be updated so that the date/time properties are updated accordingly
 * @param forId - the id of the callout to be updated
 * @param withProps - the editable callout properties
 * @returns an array with the updated properties and the existing callout
 */
export const buildEditableCalloutProps = async (
  forId: string,
  withProps: EditableCalloutProps
): Promise<[EditableCalloutProps, CallOut]> => {
  validateEditableCalloutProps(withProps);
  const existingCallout = await CallOut.findByPk(forId);

  if (withProps.shift_date && !withProps.shift_time) {
    // need to grab the existing time and add it to the new date
    const existingTime = new Date(existingCallout?.shift_time as Date);
    withProps.shift_time = new Date(withProps.shift_date);
    withProps.shift_time.setHours(existingTime.getHours());
    withProps.shift_time.setMinutes(existingTime.getMinutes());
    withProps.shift_time.setSeconds(existingTime.getSeconds());
    withProps.shift_time.setMilliseconds(existingTime.getMilliseconds());
    withProps.shift_date = new Date(withProps.shift_time);
  }

  if (withProps.shift_time) {
    // update the shift date
    const newTime = new Date(withProps.shift_time);
    withProps.shift_date = newTime;
    withProps.shift_time = newTime;
  }

  if (withProps.callout_date && !withProps.callout_time) {
    const existingTime = new Date(existingCallout?.callout_time as Date);
    withProps.callout_time = new Date(withProps.callout_date);
    withProps.callout_time.setHours(existingTime.getHours());
    withProps.callout_time.setMinutes(existingTime.getMinutes());
    withProps.callout_time.setSeconds(existingTime.getSeconds());
    withProps.callout_time.setMilliseconds(existingTime.getMilliseconds());
    withProps.callout_date = new Date(withProps.callout_time);
  }

  if (withProps.callout_time) {
    // update the callout date
    const newTime = new Date(withProps.callout_time);
    withProps.callout_date = newTime;
    withProps.callout_time = newTime;
  }
  return [withProps, existingCallout as CallOut];
};

export const validateEditableCalloutProps = (props: EditableCalloutProps): boolean => {
  if (
    !props.shift_date &&
    !props.shift_time &&
    !props.callout_date &&
    !props.callout_time &&
    !props.employee_id &&
    !props.supervisor_id &&
    !props.leave_type_id &&
    !props.supervisor_comments &&
    !props.left_early_mins &&
    !props.arrived_late_mins
  ) {
    throw new Error('No properties to update');
  }

  if (props.shift_date && !(props.shift_date instanceof Date)) {
    throw new Error('Invalid shift_date');
  }

  if (props.shift_time && !(props.shift_time instanceof Date)) {
    throw new Error('Invalid shift_time');
  }

  if (props.callout_date && !(props.callout_date instanceof Date)) {
    throw new Error('Invalid callout_date');
  }

  if (props.callout_time && !(props.callout_time instanceof Date)) {
    throw new Error('Invalid callout_time');
  }

  if (props.employee_id && !uuidV4Regex.test(props.employee_id)) {
    throw new Error('Invalid employee_id');
  }

  if (props.supervisor_id && !uuidV4Regex.test(props.supervisor_id)) {
    throw new Error('Invalid supervisor_id');
  }

  if (props.leave_type_id && !uuidV4Regex.test(props.leave_type_id)) {
    throw new Error('Invalid leave_type_id');
  }

  // istanbul ignore next
  if (props.supervisor_comments && typeof props.supervisor_comments !== 'string') {
    throw new Error('Invalid supervisor_comments');
  }
  // istanbul ignore next
  if (props.left_early_mins && typeof props.left_early_mins !== 'number') {
    throw new Error('Invalid left_early_mins');
  }

  // istanbul ignore next
  if (props.arrived_late_mins && typeof props.arrived_late_mins !== 'number') {
    throw new Error('Invalid arrived_late_mins');
  }

  return true;
};

// validate the options and build the where clause
export const buildCalloutAllQueryOptions = (options: GetCallAllCalloutOptions) => {
  const where: any = {};

  // if the id is provided and it is a valid uuid v4
  if (options.id) {
    if (!uuidV4Regex.test(options.id)) throw new Error('Invalid id');
    where.id = options.id;
  }
  if (options.createdAt) {
    if (options.createdAt instanceof Date === false) throw new Error('Invalid createdAt');
    where.createdAt = options.createdAt;
  }
  if (options.updatedAt) {
    if (options.updatedAt instanceof Date === false) throw new Error('Invalid updatedAt');
    where.updatedAt = options.updatedAt;
  }
  if (options.shift_date) {
    if (options.shift_date instanceof Date === false) throw new Error('Invalid shift_date');
    where.shift_date = options.shift_date;
  }
  if (options.shift_time) {
    if (options.shift_time instanceof Date === false) throw new Error('Invalid shift_time');
    where.shift_time = options.shift_time;
  }
  if (options.callout_date) {
    if (options.callout_date instanceof Date === false) throw new Error('Invalid callout_date');
    where.callout_date = options.callout_date;
  }
  if (options.callout_time) {
    if (options.callout_time instanceof Date === false) throw new Error('Invalid callout_time');
    where.callout_time = options.callout_time;
  }
  if (options.employee_id) {
    if (!uuidV4Regex.test(options.employee_id)) throw new Error('Invalid employee_id');
    where.employee_id = options.employee_id;
  }
  if (options.supervisor_id) {
    if (!uuidV4Regex.test(options.supervisor_id)) throw new Error('Invalid supervisor_id');
    where.supervisor_id = options.supervisor_id;
  }
  if (options.leave_type_id) {
    if (!uuidV4Regex.test(options.leave_type_id)) throw new Error('Invalid leave_type_id');
    where.leave_type_id = options.leave_type_id;
  }
  if (options.shift_date_range) {
    if (options.shift_date_range.length !== 2) throw new Error('Invalid shift_date_range');
    // istanbul ignore next
    if (!options.shift_date_range.every(el => el instanceof Date))
      throw new Error('Invalid shift_date_range');

    where.shift_date = {
      [Op.between]: options.shift_date_range
    };
  }
  if (options.shift_time_range) {
    if (options.shift_time_range.length !== 2) throw new Error('Invalid shift_time_range');
    // istanbul ignore next
    if (!options.shift_time_range.every(el => el instanceof Date))
      throw new Error('Invalid shift_time_range');
    where.shift_time = {
      [Op.between]: options.shift_time_range
    };
  }
  if (options.left_early_mins) {
    if (typeof options.left_early_mins !== 'number') throw new Error('Invalid left_early_mins');
    where.left_early_mins = options.left_early_mins;
  }
  if (options.arrived_late_mins) {
    if (typeof options.arrived_late_mins !== 'number') throw new Error('Invalid arrived_late_mins');
    where.arrived_late_mins = options.arrived_late_mins;
  }
  if (options.callout_date_range) {
    if (options.callout_date_range.length !== 2) throw new Error('Invalid callout_date_range');
    // istanbul ignore next
    if (!options.callout_date_range.every(el => el instanceof Date))
      throw new Error('Invalid callout_date_range');
    where.callout_date = {
      [Op.between]: options.callout_date_range
    };
  }
  if (options.callout_time_range) {
    // istanbul ignore next
    if (options.callout_time_range.length !== 2) throw new Error('Invalid callout_time_range');
    // istanbul ignore next
    if (!options.callout_time_range.every(el => el instanceof Date))
      throw new Error('Invalid callout_time_range');
    where.callout_time = {
      [Op.between]: options.callout_time_range
    };
  }
  if (options.left_early_mins_range) {
    if (options.left_early_mins_range.length !== 2)
      throw new Error('Invalid left_early_mins_range');
    // istanbul ignore next
    if (!options.left_early_mins_range.every(el => typeof el === 'number'))
      throw new Error('Invalid left_early_mins_range');
    // istanbul ignore next
    if (options.left_early_mins_range[0] > options.left_early_mins_range[1])
      throw new Error('Invalid left_early_mins_range');
    // istanbul ignore next
    if (options.left_early_mins_range[0] < 0 || options.left_early_mins_range[1] < 0)
      throw new Error('Invalid left_early_mins_range');

    where.left_early_mins = {
      [Op.between]: options.left_early_mins_range
    };
  }
  if (options.arrived_late_mins_range) {
    // istanbul ignore next
    if (options.arrived_late_mins_range.length !== 2)
      throw new Error('Invalid arrived_late_mins_range');
    // istanbul ignore next
    if (!options.arrived_late_mins_range.every(el => typeof el === 'number'))
      throw new Error('Invalid arrived_late_mins_range');
    // istanbul ignore next
    if (options.arrived_late_mins_range[0] > options.arrived_late_mins_range[1])
      throw new Error('Invalid arrived_late_mins_range');
    // istanbul ignore next
    if (options.arrived_late_mins_range[0] < 0 || options.arrived_late_mins_range[1] < 0)
      throw new Error('Invalid arrived_late_mins_range');

    where.arrived_late_mins = {
      [Op.between]: options.arrived_late_mins_range
    };
  }

  return where;
};

export const populateCallOutAssociations = async (
  props: CallOutAttributes
): Promise<CallOutWithAssociations | null> => {
  const [employee, supervisor, leaveType] = await Promise.all([
    getEmployeeFromDB.byId(props.employee_id),
    getSupervisorFromDB.byId(props.supervisor_id),
    getLeaveTypeFromDB.byId(props.leave_type_id)
  ]);

  // istanbul ignore next
  if (!employee || !supervisor || !leaveType) {
    return null;
  }

  return {
    employee,
    leaveType,
    supervisor,
    id: props.id,
    createdAt: props.createdAt,
    updatedAt: props.updatedAt,
    shift_date: props.shift_date,
    shift_time: props.shift_time,
    callout_date: props.callout_date,
    callout_time: props.callout_time,
    left_early_mins: props.left_early_mins,
    arrived_late_mins: props.arrived_late_mins,
    supervisor_comments: props.supervisor_comments
  };
};

export const validateCallOutProps = async (props: CallOutCreationAttributes): Promise<boolean> => {
  if (
    !props.shift_date ||
    !props.shift_time ||
    !props.callout_date ||
    !props.callout_time ||
    !props.employee_id ||
    !props.supervisor_id ||
    !props.leave_type_id ||
    !props.supervisor_comments
  ) {
    let missingProps = '';
    if (!props.shift_date) missingProps += 'shift_date, ';
    if (!props.shift_time) missingProps += 'shift_time, ';
    if (!props.callout_date) missingProps += 'callout_date, ';
    if (!props.callout_time) missingProps += 'callout_time, ';
    if (!props.employee_id) missingProps += 'employee_id, ';
    if (!props.supervisor_id) missingProps += 'supervisor_id, ';
    if (!props.leave_type_id) missingProps += 'leave_type_id, ';
    if (!props.supervisor_comments) missingProps += 'supervisor_comments, ';
    throw new Error(`Missing required properties: ${missingProps}`);
  }

  if (typeof props.supervisor_comments !== 'string' || props.supervisor_comments.length <= 1) {
    throw new Error('Invalid supervisor comments');
  }

  // validate date and time
  if (props.shift_date < props.callout_date) {
    throw new Error('Shift date cannot be before callout date');
  }

  // ensure dates are dates
  // istanbul ignore next
  if (
    isNaN(Date.parse(props.shift_date?.toString())) ||
    isNaN(Date.parse(props.callout_date?.toString()))
  ) {
    throw new Error('Invalid date');
  }

  // ensure that the employee_id, supervisor_id, and leave_type_id are valid UUIDs
  if (
    !uuidV4Regex.test(props.employee_id) ||
    !uuidV4Regex.test(props.supervisor_id) ||
    !uuidV4Regex.test(props.leave_type_id)
  ) {
    throw new Error('Invalid UUID');
  }

  const [employee, supervisor, leaveType] = await Promise.all([
    getEmployeeFromDB.byId(props.employee_id),
    getSupervisorFromDB.byId(props.supervisor_id),
    getLeaveTypeFromDB.byId(props.leave_type_id)
  ]);

  if (!employee) {
    throw new Error('Employee not found');
  }

  if (!supervisor) {
    throw new Error('Supervisor not found');
  }

  if (!leaveType) {
    throw new Error('Leave type not found');
  }

  return true;
};
