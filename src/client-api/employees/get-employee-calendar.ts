import {ApiData} from '../../lib/apiController';

export type EmployeeCalendarDay = {
  date: string;
  isCallOut: boolean;
  isDayOff: boolean;
  isScheduledWorkDay: boolean;
};

export type EmployeeCalendarProjection = {
  employeeId: string;
  startDate: string;
  endDate: string;
  schedule: {
    shift_start_time: string;
    shift_end_time: string;
    days_off_type: '2_DAYS_OFF' | '3_DAYS_OFF' | '4_DAYS_OFF';
    employee_status: 'FULL_TIME' | 'PART_TIME';
  } | null;
  days: EmployeeCalendarDay[];
};

export const GetEmployeeCalendar = async ({
  employeeId,
  startDate,
  endDate
}: {
  employeeId: string;
  startDate: string;
  endDate: string;
}): Promise<ApiData<EmployeeCalendarProjection>> => {
  try {
    const params = new URLSearchParams({employeeId, startDate, endDate});
    const response = await fetch(`/api/admin/employee-calendar?${params.toString()}`);
    const data = (await response.json()) as ApiData<EmployeeCalendarProjection>;

    if (!response.ok) {
      throw new Error(data.error ?? 'Failed to fetch employee calendar');
    }

    return data;
  } catch (error) {
    return {error: String(error)};
  }
};
