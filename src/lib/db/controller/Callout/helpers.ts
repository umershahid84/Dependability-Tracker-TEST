import {Op} from 'sequelize';
import {
  uuidV4Regex,
  addTimeToDate,
  normalizeToEndOfDayUTC,
  normalizeToStartOfDayUTC
} from '../../../utils';
import {
  CallOutAttributes,
  CallOutWithAssociations,
  EmployeeWithAssociations,
  CallOutCreationAttributes
} from '../../../db/models/types';
import {CallOut} from '../../models';
import {getEmployeeFromDB} from '../Employee';
import {getLeaveTypeFromDB} from '../LeaveType';
import {getSupervisorFromDB} from '../Supervisor';

// all the options that can be used to get callouts
export type GetAllCallOutOptions = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shift_date?: Date;
  shift_time?: string;
  callout_date?: Date;
  division_id?: string;
  callout_time?: string;
  supervisor_id?: string;
  employee_id?: string | string[];
  shift_date_range?: [Date, Date];
  created_at_range?: [Date, Date];
  updated_at_range?: [Date, Date];
  leave_type_id?: string | string[];
  callout_date_range?: [Date, Date];
  shift_time_range?: [string, string];
  callout_time_range?: [string, string];
  left_early_mins?: number | '-1' | null;
  arrived_late_mins?: number | '-1' | null;
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

const buildWhereConditionsForTimeRange = (
  range: [string, string],
  options: GetAllCallOutOptions
): {[Op.between]: Date[]}[] => {
  const betweenDates: Date[][] = [];
  const data: Date[] = buildCorrectTimeQuery(range[0], options) as Date[];
  const data2: Date[] = buildCorrectTimeQuery(range[1], options) as Date[];

  for (const date of data) {
    const range = [date, data2[data.indexOf(date)]];
    betweenDates.push(range);
  }

  const whereConditions = betweenDates.map(el => {
    return {
      [Op.between]: el
    };
  });

  return whereConditions;
};

const buildWhereConditionsForDateRange = (range: [Date, Date]): Date[] => {
  return [normalizeToStartOfDayUTC(new Date(range[0])), normalizeToEndOfDayUTC(new Date(range[1]))];
};

type DateRangeAttributes =
  | 'created_at_range'
  | 'updated_at_range'
  | 'shift_date_range'
  | 'callout_date_range'
  | 'shift_time_range'
  | 'callout_time_range';

const buildTimeQueryForDateRange = (
  time: string,
  props: GetAllCallOutOptions,
  attribute: DateRangeAttributes
) => {
  const timeRange: Date[] = [];
  const [start, end] = props[attribute] as [Date, Date];

  let startDateTime = new Date(start);
  if (attribute !== 'shift_time_range' && attribute !== 'callout_time_range') {
    startDateTime = addTimeToDate(startDateTime, time);
  }

  let endDateTime = new Date(end);
  if (attribute !== 'shift_time_range' && attribute !== 'callout_time_range') {
    endDateTime = addTimeToDate(endDateTime, time);
  }

  let d = new Date(startDateTime);

  for (d; d <= endDateTime; d.setDate(d.getDate() + 1)) {
    timeRange.push(new Date(d));
  }

  return timeRange;
};

// When searching times are in the format of HH:MM:SS
// We need to attach the time to a date and create a new datetime object to
// query against the database. This function will build the correct time query
// depending on the options provided
const buildCorrectTimeQuery = (
  time: string,
  props: GetAllCallOutOptions
): Date | Date[] | undefined => {
  let dateTime: Date | Date[] | undefined = undefined;

  if (props.updatedAt) {
    // add the time which is in the format of HH:MM:SS to the date
    dateTime = new Date(props.updatedAt);
    // add the time to the date
    dateTime = addTimeToDate(dateTime, time);
    return dateTime;
  }

  if (props.created_at_range) {
    return buildTimeQueryForDateRange(time, props, 'created_at_range');
  }

  if (props.updated_at_range) {
    return buildTimeQueryForDateRange(time, props, 'updated_at_range');
  }

  if (props.shift_date_range) {
    return buildTimeQueryForDateRange(time, props, 'shift_date_range');
  }

  if (props.callout_date_range) {
    return buildTimeQueryForDateRange(time, props, 'callout_date_range');
  }

  if (props.shift_date_range) {
    return buildTimeQueryForDateRange(time, props, 'shift_date_range');
  }

  if (props.shift_time_range) {
    return buildTimeQueryForDateRange(time, props, 'shift_time_range');
  }

  if (props.callout_time_range) {
    return buildTimeQueryForDateRange(time, props, 'callout_time_range');
  }

  if (props.shift_date) {
    dateTime = new Date(props.shift_date);
    dateTime = addTimeToDate(dateTime, time);
    return dateTime;
  }

  if (props.callout_date) {
    dateTime = new Date(props.callout_date);
    return dateTime;
  }

  if (props.shift_time) {
    dateTime = new Date(props.shift_time);
    return [dateTime];
  }

  if (props.callout_time) {
    dateTime = new Date(props.callout_time);
    return [dateTime];
  }

  return dateTime;
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
    const hours = existingTime.getHours();
    const minutes = existingTime.getMinutes();
    const seconds = existingTime.getSeconds();
    const milliseconds = existingTime.getMilliseconds();

    const year = withProps.shift_date.getFullYear();
    const month = withProps.shift_date.getMonth();
    const day = withProps.shift_date.getDate();

    withProps.shift_time = new Date(year, month, day, hours, minutes, seconds, milliseconds);
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

    const hours = existingTime.getHours();
    const minutes = existingTime.getMinutes();
    const seconds = existingTime.getSeconds();
    const milliseconds = existingTime.getMilliseconds();

    const year = withProps.callout_date.getFullYear();
    const month = withProps.callout_date.getMonth();
    const day = withProps.callout_date.getDate();

    withProps.callout_time = new Date(year, month, day, hours, minutes, seconds, milliseconds);
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

  if (props.shift_date && !(new Date(props.shift_date) instanceof Date)) {
    throw new Error('Invalid shift_date');
  }

  if (props.shift_time && !(new Date(props.shift_time) instanceof Date)) {
    throw new Error('Invalid shift_time');
  }

  if (props.callout_date && !(new Date(props.callout_date) instanceof Date)) {
    throw new Error('Invalid callout_date');
  }

  if (props.callout_time && !(new Date(props.callout_time) instanceof Date)) {
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
    try {
      props.left_early_mins = Number(props.left_early_mins);
      if (isNaN(props.left_early_mins)) {
        throw new Error('Invalid left_early_mins');
      }
    } catch (error) {
      throw new Error('Invalid left_early_mins');
    }
  }

  // istanbul ignore next
  if (props.arrived_late_mins && typeof props.arrived_late_mins !== 'number') {
    try {
      props.arrived_late_mins = Number(props.arrived_late_mins);
      if (isNaN(props.arrived_late_mins)) {
        throw new Error('Invalid arrived_late_mins');
      }
    } catch (error) {
      throw new Error('Invalid arrived_late_mins');
    }
  }

  return true;
};

// validate the options and build the where clause
export const buildCalloutAllQueryOptions = (options: GetAllCallOutOptions) => {
  const where: any = {};

  // if the id is provided and it is a valid uuid v4
  if (options.id) {
    if (!uuidV4Regex.test(options.id)) throw new Error('Invalid id');
    where.id = options.id;
  }
  if (options.createdAt) {
    const createdAt = new Date(options.createdAt);
    if (isNaN(createdAt.getTime())) throw new Error('Invalid createdAt');
    where.createdAt = createdAt;
  }
  if (options.updatedAt) {
    const updatedAt = new Date(options.updatedAt);
    if (isNaN(updatedAt.getTime())) throw new Error('Invalid updatedAt');
    where.updatedAt = updatedAt;
  }
  if (options.shift_date) {
    const shiftDate = new Date(options.shift_date);
    if (isNaN(shiftDate.getTime())) throw new Error('Invalid shift_date');

    const startOfDay = normalizeToStartOfDayUTC(shiftDate);
    const endOfDay = normalizeToEndOfDayUTC(shiftDate);

    where.shift_date = {[Op.between]: [startOfDay, endOfDay]};
  }
  if (options.callout_date) {
    const calloutDate = new Date(options.callout_date);
    if (isNaN(calloutDate.getTime())) throw new Error('Invalid callout_date');

    const startOfDay = normalizeToStartOfDayUTC(calloutDate);
    const endOfDay = normalizeToEndOfDayUTC(calloutDate);

    where.callout_date = {[Op.between]: [startOfDay, endOfDay]};
  }

  if (options.shift_time) {
    if (typeof options.shift_time !== 'string') throw new Error('Invalid shift_time');
    const whereConditions = buildWhereConditionsForTimeRange(
      [options.shift_time, `${options.shift_time}:59`],
      options
    );
    where.shift_time = {[Op.or]: whereConditions};
  }
  if (options.callout_time) {
    if (typeof options.callout_time != 'string') throw new Error('Invalid callout_time');

    const whereConditions = buildWhereConditionsForTimeRange(
      [options.callout_time, `${options.callout_time}:59`],
      options
    );
    where.callout_time = {[Op.or]: whereConditions};
  }
  if (options.employee_id) {
    if (Array.isArray(options.employee_id) === false && !uuidV4Regex.test(options.employee_id))
      throw new Error('Invalid employee_id');

    if (Array.isArray(options.employee_id)) {
      if (
        !options.employee_id.every((id: string) => {
          return uuidV4Regex.test(id);
        })
      ) {
        throw new Error('Invalid employee_id');
      }
      where.employee_id = {
        [Op.in]: options.employee_id
      };
    }
    where.employee_id = options.employee_id;
  }
  if (options.supervisor_id) {
    if (!uuidV4Regex.test(options.supervisor_id)) throw new Error('Invalid supervisor_id');
    where.supervisor_id = options.supervisor_id;
  }
  if (options.leave_type_id) {
    if (!Array.isArray(options.leave_type_id) && !uuidV4Regex.test(options.leave_type_id))
      throw new Error('Invalid leave_type_id');

    if (Array.isArray(options.leave_type_id)) {
      if (
        !options.leave_type_id.every((id: string) => {
          return uuidV4Regex.test(id);
        })
      ) {
        throw new Error('Invalid leave_type_id');
      }
      where.leave_type_id = {
        [Op.in]: options.leave_type_id
      };
    }

    where.leave_type_id = options.leave_type_id;
  }
  if (options.updated_at_range) {
    if (options.updated_at_range.length !== 2) throw new Error('Invalid updated_at_range');
    // istanbul ignore next
    if (
      !options.updated_at_range.every(el => {
        const date = new Date(el);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid updated_at_range');
        }
        return true;
      })
    ) {
      throw new Error('Invalid updated_at_range');
    }

    where.updatedAt = {
      [Op.between]: buildWhereConditionsForDateRange(options.updated_at_range)
    };
  }
  if (options.created_at_range) {
    if (options.created_at_range.length !== 2) throw new Error('Invalid created_at_range');
    // istanbul ignore next
    if (
      !options.created_at_range.every(el => {
        const date = new Date(el);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid created_at_range');
        }
        return true;
      })
    ) {
      throw new Error('Invalid created_at_range');
    }

    where.createdAt = {
      [Op.between]: buildWhereConditionsForDateRange(options.created_at_range)
    };
  }
  if (options.shift_date_range) {
    if (options.shift_date_range.length !== 2) throw new Error('Invalid shift_date_range');
    // istanbul ignore next
    if (
      !options.shift_date_range.every(el => {
        const date = new Date(el);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid shift_date_range');
        }
        return true;
      })
    ) {
      throw new Error('Invalid shift_date_range');
    }
    where.shift_date = {
      [Op.between]: buildWhereConditionsForDateRange(options.shift_date_range)
    };
  }
  if (options.shift_time_range) {
    if (options.shift_time_range.length !== 2) throw new Error('Invalid shift_time_range');
    // istanbul ignore next
    if (
      !options.shift_time_range.every(el => {
        if (typeof el !== 'string') {
          throw new Error('Invalid shift_time_range');
        }
        return true;
      })
    ) {
      throw new Error('Invalid shift_time_range');
    }

    const whereConditions: {
      [Op.between]: Date[];
    }[] = buildWhereConditionsForTimeRange(options.shift_time_range, options);

    where.shift_time = {
      [Op.or]: whereConditions
    };
  }
  if (options.left_early_mins) {
    const leftEarlyMins = Number(options.left_early_mins);
    if (isNaN(leftEarlyMins)) throw new Error('Invalid left_early_mins');
    where.left_early_mins = leftEarlyMins > 0 ? leftEarlyMins : {[Op.gt]: 0};
  }
  if (options.arrived_late_mins) {
    const arrivedLateMins = Number(options.arrived_late_mins);
    if (isNaN(arrivedLateMins)) throw new Error('Invalid arrived_late_mins');
    where.arrived_late_mins = arrivedLateMins > 0 ? arrivedLateMins : {[Op.gt]: 0};
  }
  if (options.callout_date_range) {
    if (options.callout_date_range.length !== 2) throw new Error('Invalid callout_date_range');
    // istanbul ignore next
    if (
      !options.callout_date_range.every(el => {
        const date = new Date(el);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid callout_date_range');
        }
        return true;
      })
    ) {
      throw new Error('Invalid callout_date_range');
    }
    where.callout_date = {
      [Op.between]: buildWhereConditionsForDateRange(options.callout_date_range)
    };
  }
  if (options.callout_time_range) {
    // istanbul ignore next
    if (options.callout_time_range) {
      if (options.callout_time_range.length !== 2) throw new Error('Invalid callout_time_range');
      // istanbul ignore next
      if (
        !options.callout_time_range.every(el => {
          if (typeof el !== 'string') {
            throw new Error('Invalid callout_time_range');
          }
          return true;
        })
      ) {
        throw new Error('Invalid callout_time_range');
      }

      const whereConditions: {
        [Op.between]: Date[];
      }[] = buildWhereConditionsForTimeRange(options.callout_time_range, options);

      where.callout_time = {
        [Op.or]: whereConditions
      };
    }
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
    if (options.left_early_mins_range[0] < 0 ?? options.left_early_mins_range[1] < 0)
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
    if (options.arrived_late_mins_range[0] < 0 ?? options.arrived_late_mins_range[1] < 0)
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
  if (!employee ?? !supervisor ?? !leaveType) {
    return null;
  }

  return {
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
    employee: employee as EmployeeWithAssociations,
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

  if (typeof props.supervisor_comments !== 'string' ?? props.supervisor_comments.length <= 1) {
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
