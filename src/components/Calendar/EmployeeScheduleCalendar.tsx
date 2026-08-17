import React from 'react';
import type {EmployeeCalendarProjection} from '../../client-api/employees';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getCallOutBgClass = (callOutType: string | null): string => {
  if (!callOutType) return 'bg-secondary';
  const lower = callOutType.toLowerCase();
  if (lower === 'sick') return 'bg-red-600 text-white';
  if (lower === 'fmla') return 'bg-purple-600 text-white';
  if (lower === 'tardiness' || lower === 'late arrival') return 'bg-green-300 text-black';
  if (lower === 'left early' || lower === 'leaving early') return 'bg-yellow-200 text-black';
  if (lower === 'pto') return 'bg-green-700 text-white';
  return 'bg-orange-500 text-white';
};

export function EmployeeScheduleCalendar({
  calendar,
  title
}: Readonly<{calendar: EmployeeCalendarProjection | null; title?: string}>) {
  if (!calendar) {
    return (
      <div className="w-full border rounded-md p-4 bg-tertiary min-h-[320px]">
        <h3 className="font-semibold mb-2">{title ?? 'Employee Schedule Calendar'}</h3>
        <p className="text-sm text-tertiary">Select an employee to view schedule calendar.</p>
      </div>
    );
  }

  const start = new Date(calendar.startDate + 'T00:00:00');
  const startOffset = start.getDay();
  const emptySlots = Array.from({length: startOffset}, (_, index) => (
    <div key={`empty-${index}`} className="border rounded-md min-h-[52px] bg-secondary opacity-40" />
  ));

  const daysOffLabel = calendar.schedule?.days_off && calendar.schedule.days_off.length > 0
    ? `Days Off: ${calendar.schedule.days_off.map(d => weekDays[d]).join(', ')}`
    : calendar.schedule?.days_off_type
      ? `${calendar.schedule.days_off_type.replace(/_/g, ' ')}`
      : null;

  return (
    <div className="w-full border rounded-md p-4 bg-tertiary [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
      <h3 className="font-semibold mb-1">{title ?? 'Employee Schedule Calendar'}</h3>
      <p className="text-xs text-tertiary mb-2">
        {calendar.schedule
          ? `Shift ${calendar.schedule.shift_start_time}-${calendar.schedule.shift_end_time} • ${
              calendar.schedule.employee_status === 'FULL_TIME' ? 'Full-Time' : 'Part-Time'
            }${daysOffLabel ? ' • ' + daysOffLabel : ''}`
          : 'No active schedule'}
      </p>
      <div className="flex flex-wrap gap-2 mb-2 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-600"></span>Sick</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-purple-600"></span>FMLA</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-300"></span>Late Arrival</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-yellow-200 border"></span>Left Early</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-700"></span>PTO</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-orange-500"></span>Other Call-out</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-yellow-600"></span>Day Off</span>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-xs text-center font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptySlots}
        {calendar.days.map(day => {
          const dayOfMonth = new Date(day.date + 'T00:00:00').getDate();
          const bgClass = day.isCallOut
            ? getCallOutBgClass(day.callOutType)
            : day.isDayOff
              ? 'bg-yellow-600 text-black'
              : 'bg-secondary';

          return (
            <div
              key={day.date}
              className={`border rounded-md min-h-[52px] p-1 text-xs flex flex-col ${bgClass}`}>
              <span className="font-semibold">{dayOfMonth}</span>
              {day.isCallOut && <span>{day.callOutType ?? 'Call-out'}</span>}
              {!day.isCallOut && day.isDayOff && <span>Day off</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmployeeScheduleCalendar;
