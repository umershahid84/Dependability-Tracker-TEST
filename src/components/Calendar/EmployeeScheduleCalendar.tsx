import React from 'react';
import {EmployeeCalendarProjection} from '../../client-api/employees';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  return (
    <div className="w-full border rounded-md p-4 bg-tertiary">
      <h3 className="font-semibold mb-1">{title ?? 'Employee Schedule Calendar'}</h3>
      <p className="text-xs text-tertiary mb-2">
        {calendar.schedule
          ? `Shift ${calendar.schedule.shift_start_time}-${calendar.schedule.shift_end_time} • ${
              calendar.schedule.employee_status === 'FULL_TIME' ? 'Full-Time' : 'Part-Time'
            } • ${calendar.schedule.days_off_type.replaceAll('_', ' ')}`
          : 'No active schedule'}
      </p>
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
            ? 'bg-red-600 text-white'
            : day.isDayOff
              ? 'bg-yellow-600 text-black'
              : 'bg-secondary';

          return (
            <div
              key={day.date}
              className={`border rounded-md min-h-[52px] p-1 text-xs flex flex-col ${bgClass}`}>
              <span className="font-semibold">{dayOfMonth}</span>
              {day.isCallOut && <span>Call-out</span>}
              {!day.isCallOut && day.isDayOff && <span>Day off</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmployeeScheduleCalendar;
