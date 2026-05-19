import {Op} from 'sequelize';
import {EmployeeSchedule} from '../../models';
import {
  DaysOffType,
  EmployeeScheduleAttributes,
  EmployeeScheduleCreationAttributes,
  EmployeeStatusType
} from '../../models/EmployeeSchedule';
import {getCallOutFromDB} from '../Callout';
import {CallOutWithAssociations} from '../../models/Callout';
import {isValid24HourTimeHHMM} from '../../../utils';

export type EmployeeScheduleFormData = {
  shiftStartTime: string;
  shiftEndTime: string;
  daysOffType: DaysOffType;
  daysOff?: number[] | null;
  employeeStatus: EmployeeStatusType;
};

export type EmployeeCalendarDay = {
  date: string;
  isCallOut: boolean;
  isDayOff: boolean;
  isScheduledWorkDay: boolean;
  callOutType: string | null;
};

export type EmployeeCalendarProjection = {
  employeeId: string;
  startDate: string;
  endDate: string;
  schedule: EmployeeScheduleAttributes | null;
  days: EmployeeCalendarDay[];
};

const daysOffCountMap: Record<DaysOffType, number> = {
  '2_DAYS_OFF': 2,
  '3_DAYS_OFF': 3,
  '4_DAYS_OFF': 4
};

const deriveDaysOffType = (daysOff: number[] | null | undefined): DaysOffType | null => {
  if (!daysOff || daysOff.length === 0) return null;
  const count = daysOff.length;
  if (count <= 2) return '2_DAYS_OFF';
  if (count === 3) return '3_DAYS_OFF';
  return '4_DAYS_OFF';
};

const parseDateInput = (value: string | Date): Date => {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toDateKey = (value: Date): string => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const validateEmployeeScheduleFormData = (formData: EmployeeScheduleFormData): void => {
  if (!isValid24HourTimeHHMM(formData.shiftStartTime)) {
    throw new Error('Invalid shift start time. Expected HH:MM.');
  }

  if (!isValid24HourTimeHHMM(formData.shiftEndTime)) {
    throw new Error('Invalid shift end time. Expected HH:MM.');
  }

  if (formData.daysOff && formData.daysOff.length > 0) {
    if (formData.daysOff.some(d => d < 0 || d > 6 || !Number.isInteger(d))) {
      throw new Error('Invalid days off selection. Days must be integers between 0 (Sun) and 6 (Sat).');
    }
  } else if (!['2_DAYS_OFF', '3_DAYS_OFF', '4_DAYS_OFF'].includes(formData.daysOffType)) {
    throw new Error('Invalid days off selection.');
  }

  if (!['FULL_TIME', 'PART_TIME'].includes(formData.employeeStatus)) {
    throw new Error('Invalid employee status.');
  }
};

const isSameSchedule = (
  current: EmployeeScheduleAttributes | null,
  nextData: EmployeeScheduleFormData
): boolean => {
  if (!current) {
    return false;
  }

  const sameDaysOff =
    nextData.daysOff && nextData.daysOff.length > 0
      ? JSON.stringify([...(nextData.daysOff ?? [])].sort()) ===
        JSON.stringify([...(current.days_off ?? [])].sort())
      : current.days_off_type === nextData.daysOffType;

  return (
    current.shift_start_time === nextData.shiftStartTime &&
    current.shift_end_time === nextData.shiftEndTime &&
    sameDaysOff &&
    current.employee_status === nextData.employeeStatus
  );
};

export const getEmployeeScheduleFromDB = {
  activeByEmployeeId: async (employeeId: string): Promise<EmployeeScheduleAttributes | null> => {
    const activeSchedule = await EmployeeSchedule.findOne({
      where: {
        employee_id: employeeId,
        is_active: true
      },
      order: [['effective_start', 'DESC']]
    });

    if (!activeSchedule) {
      return null;
    }

    return activeSchedule.get({plain: true}) as EmployeeScheduleAttributes;
  },
  historyByEmployeeId: async (employeeId: string): Promise<EmployeeScheduleAttributes[]> => {
    const schedules = await EmployeeSchedule.findAll({
      where: {employee_id: employeeId},
      order: [['effective_start', 'DESC']]
    });

    return schedules.map(schedule => schedule.get({plain: true}) as EmployeeScheduleAttributes);
  }
};

export const createEmployeeScheduleInDB = async (
  data: EmployeeScheduleCreationAttributes
): Promise<EmployeeScheduleAttributes> => {
  const created = await EmployeeSchedule.create(data);
  return created.get({plain: true}) as EmployeeScheduleAttributes;
};

export const upsertEmployeeScheduleVersionInDB = async (
  employeeId: string,
  formData: EmployeeScheduleFormData
): Promise<EmployeeScheduleAttributes> => {
  validateEmployeeScheduleFormData(formData);

  const activeSchedule = await getEmployeeScheduleFromDB.activeByEmployeeId(employeeId);
  if (isSameSchedule(activeSchedule, formData)) {
    return activeSchedule as EmployeeScheduleAttributes;
  }

  if (activeSchedule) {
    await EmployeeSchedule.update(
      {
        is_active: false,
        effective_end: new Date()
      },
      {
        where: {
          employee_id: employeeId,
          is_active: true
        }
      }
    );
  }

  const derivedDaysOffType = deriveDaysOffType(formData.daysOff);

  return createEmployeeScheduleInDB({
    employee_id: employeeId,
    shift_start_time: formData.shiftStartTime,
    shift_end_time: formData.shiftEndTime,
    days_off_type: derivedDaysOffType ?? formData.daysOffType,
    days_off: formData.daysOff ?? null,
    employee_status: formData.employeeStatus,
    effective_start: new Date(),
    effective_end: null,
    is_active: true
  });
};

const buildCycleDayType = (targetDate: Date, schedule: EmployeeScheduleAttributes) => {
  // If specific days of week are configured, use them directly
  if (schedule.days_off && schedule.days_off.length > 0) {
    return schedule.days_off.includes(targetDate.getDay()) ? 'DAY_OFF' : 'WORK_DAY';
  }

  const scheduleStart = new Date(schedule.effective_start);
  const normalizedStart = new Date(
    scheduleStart.getFullYear(),
    scheduleStart.getMonth(),
    scheduleStart.getDate()
  );

  const dayDiff = Math.floor(
    (targetDate.getTime() - normalizedStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const cycleDay = ((dayDiff % 7) + 7) % 7;
  const daysOffCount = daysOffCountMap[schedule.days_off_type];
  const workDayCount = 7 - daysOffCount;

  return cycleDay >= workDayCount ? 'DAY_OFF' : 'WORK_DAY';
};

export const buildEmployeeCalendarProjection = async ({
  employeeId,
  startDate,
  endDate
}: {
  employeeId: string;
  startDate: string | Date;
  endDate: string | Date;
}): Promise<EmployeeCalendarProjection> => {
  const start = parseDateInput(startDate);
  const end = parseDateInput(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    throw new Error('Invalid calendar date range.');
  }

  const daySpan = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (daySpan > 365) {
    throw new Error('Calendar date range cannot exceed 365 days.');
  }

  const queryStart = new Date(start);
  queryStart.setDate(queryStart.getDate() - 365);

  const [schedule, callouts] = await Promise.all([
    getEmployeeScheduleFromDB.activeByEmployeeId(employeeId),
    getCallOutFromDB.all({
      employee_id: employeeId,
      shift_date_range: [queryStart, end]
    }) as Promise<CallOutWithAssociations[]>
  ]);

  const calloutDateMap = new Map<string, string>();
  for (const callout of callouts ?? []) {
    const startDate = parseDateInput(callout.shift_date ?? callout.callout_date);
    const endDate = parseDateInput(callout.shift_date_to ?? callout.shift_date ?? callout.callout_date);

    if (endDate < start || startDate > end) {
      continue;
    }

    const rangeStart = startDate < start ? new Date(start) : new Date(startDate);
    const rangeEnd = endDate > end ? new Date(end) : new Date(endDate);
    const calloutType = callout.leaveType?.reason?.trim() || 'Other Call-out';

    for (const cursor = new Date(rangeStart); cursor <= rangeEnd; cursor.setDate(cursor.getDate() + 1)) {
      calloutDateMap.set(toDateKey(cursor), calloutType);
    }
  }

  const days: EmployeeCalendarDay[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const dateKey = toDateKey(cursor);
    const dayType = schedule ? buildCycleDayType(cursor, schedule) : 'WORK_DAY';
    const isDayOff = dayType === 'DAY_OFF';
    const callOutType = calloutDateMap.get(dateKey) ?? null;
    const isCallOut = callOutType !== null;

    days.push({
      date: dateKey,
      isCallOut,
      isDayOff,
      isScheduledWorkDay: !isDayOff,
      callOutType
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    employeeId,
    startDate: toDateKey(start),
    endDate: toDateKey(end),
    schedule,
    days
  };
};

export const archiveEmployeeSchedulesInDB = async (employeeId: string): Promise<number> => {
  const [archived] = await EmployeeSchedule.update(
    {
      is_active: false,
      effective_end: new Date()
    },
    {
      where: {
        employee_id: employeeId,
        is_active: true,
        effective_end: {
          [Op.is]: null
        }
      }
    }
  );

  return archived;
};
