import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { EmployeeCalendarProjection } from '../../client-api/employees';

// Color mapping for call-out types (matching your UI)
const callOutColorMap: Record<string, string> = {
  'Sick': '#DC2626', // Red
  'FMLA': '#9333EA', // Purple
  'Late Arrival': '#86EFAC', // Light Green
  'Left Early': '#FCD34D', // Light Yellow
  'PTO': '#15803D', // Dark Green
  'Other Call-out': '#F97316', // Orange
  'Day off': '#FBBF24', // Amber
};

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
  },
  multiMonthContainer: {
    marginTop: 15,
  },
  monthContainer: {
    marginBottom: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
  },
  monthHeader: {
    marginBottom: 8,
  },
  calendarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  monthTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    backgroundColor: '#d3d3d3',
    padding: 6,
  },
  scheduleInfo: {
    fontSize: 9,
    marginBottom: 8,
    color: '#333',
  },
  legendContainer: {
    marginBottom: 8,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#ccc',
    padding: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    fontSize: 7,
    marginRight: 8,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 8,
    height: 8,
    marginRight: 3,
    borderRadius: 1,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 2,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
    paddingVertical: 4,
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  weekdayLast: {
    borderRightWidth: 0,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    minHeight: 35,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000',
    padding: 2,
    justifyContent: 'flex-start',
  },
  dayNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  dayLabel: {
    fontSize: 6,
    textAlign: 'center',
    lineHeight: 1.2,
  },
});

const getColorForDay = (day: {
  isCallOut: boolean;
  isDayOff: boolean;
  callOutType: string | null;
}): string => {
  if (day.isCallOut && day.callOutType) {
    return callOutColorMap[day.callOutType] || '#999';
  }
  if (day.isDayOff) {
    return callOutColorMap['Day off'];
  }
  return '#ffffff'; // Work day - white
};

const getTextColorForBackground = (bgColor: string): string => {
  // Light backgrounds get dark text, dark backgrounds get light text
  const lightBackgrounds = ['#86EFAC', '#FCD34D', '#FBBF24', '#ffffff'];
  return lightBackgrounds.includes(bgColor) ? '#000' : '#fff';
};

const getDayLabel = (day: {
  isCallOut: boolean;
  isDayOff: boolean;
  callOutType: string | null;
}): string => {
  if (day.isCallOut) {
    return day.callOutType || 'Call-out';
  }
  if (day.isDayOff) {
    return 'Day off';
  }
  return 'Work';
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MonthCalendarData {
  year: number;
  month: number;
  monthName: string;
}

// Helper function to get month name
const getMonthName = (year: number, month: number): string => {
  return new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

// Helper function to check if date range spans multiple months
const getMonthsInRange = (startDate: Date, endDate: Date): MonthCalendarData[] => {
  const months: MonthCalendarData[] = [];
  
  let currentDate = new Date(startDate);
  const endYearMonth = endDate.getFullYear() * 12 + endDate.getMonth();
  
  while (true) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const currentYearMonth = year * 12 + month;
    
    if (currentYearMonth > endYearMonth) break;
    
    months.push({
      year,
      month,
      monthName: getMonthName(year, month),
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return months;
};

// Single month calendar component
const SingleMonthCalendar: React.FC<{
  month: MonthCalendarData;
  daysMap: Map<string, any>;
  startDate: Date;
  endDate: Date;
}> = ({ month, daysMap, startDate, endDate }) => {
  // Calculate the actual date range for this month
  const monthStart = new Date(month.year, month.month, 1);
  const monthEnd = new Date(month.year, month.month + 1, 0);
  
  const rangeStart = new Date(Math.max(startDate.getTime(), monthStart.getTime()));
  const rangeEnd = new Date(Math.min(endDate.getTime(), monthEnd.getTime()));
  
  // Get all dates for this month in the range
  const monthDates: Date[] = [];
  const current = new Date(rangeStart);
  while (current <= rangeEnd) {
    monthDates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  // Calculate empty cells at the beginning of the actual calendar month
  const firstDayOfMonth = monthStart.getDay();
  const emptyDays = Array(firstDayOfMonth).fill(null);
  const calendarDays = [...emptyDays, ...monthDates];
  
  return (
    <View style={styles.monthContainer}>
      <Text style={styles.monthTitle}>{month.monthName}</Text>
      
      {/* Weekday Headers */}
      <View style={styles.weekdaysRow}>
        {weekDays.map((day, index) => {
          const weekdayStyle = index === 6 ? [styles.weekday, styles.weekdayLast] : [styles.weekday];
          return (
            <View key={day} style={weekdayStyle}>
              <Text>{day}</Text>
            </View>
          );
        })}
      </View>
      
      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((dateOrNull, index) => {
          if (!dateOrNull) {
            // Empty cell
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }
          
          const dateKey = dateOrNull.toLocaleDateString('en-CA').split('T')[0];
          const day = daysMap.get(dateKey);
          const dayOfMonth = dateOrNull.getDate();
          const bgColor = day ? getColorForDay(day) : '#ffffff';
          const textColor = getTextColorForBackground(bgColor);
          const label = day ? getDayLabel(day) : '';
          
          return (
            <View
              key={dateKey}
              style={[
                styles.dayCell,
                {
                  backgroundColor: bgColor,
                  color: textColor,
                },
              ]}>
              <Text style={[styles.dayNumber, { color: textColor }]}>{dayOfMonth}</Text>
              {label && <Text style={[styles.dayLabel, { color: textColor }]}>{label}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
};

interface CalendarGridProps {
  calendar: EmployeeCalendarProjection;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ calendar }) => {
  const startDate = new Date(calendar.startDate + 'T00:00:00');
  const endDate = new Date(calendar.endDate + 'T00:00:00');
  
  // Create a map of dates to days for quick lookup
  const daysMap = new Map(calendar.days.map(d => [d.date, d]));
  
  // Get all months in the date range
  const months = getMonthsInRange(startDate, endDate);
  const isMultiMonth = months.length > 1;
  
  // Single month view (original logic)
  if (!isMultiMonth) {
    // Calculate empty cells at the beginning
    const firstDayOfWeek = startDate.getDay();
    const emptyDays = Array(firstDayOfWeek).fill(null);
    
    // Get all dates in range
    const allDates: (Date | null)[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      allDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    // Combine empty days with actual dates
    const calendarDays = [...emptyDays, ...allDates];
    
    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>
          Employee Calendar ({calendar.startDate} to {calendar.endDate})
        </Text>
        
        {calendar.schedule && (
          <Text style={styles.scheduleInfo}>
            Shift {calendar.schedule.shift_start_time}-{calendar.schedule.shift_end_time} •{' '}
            {calendar.schedule.employee_status === 'FULL_TIME' ? 'Full-Time' : 'Part-Time'} •{' '}
            {calendar.schedule.days_off && calendar.schedule.days_off.length > 0
              ? `Days Off: ${calendar.schedule.days_off.map(d => weekDays[d]).join(', ')}`
              : calendar.schedule.days_off_type?.replace(/_/g, ' ')}
          </Text>
        )}
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          {Object.entries(callOutColorMap).map(([label, color]) => (
            <View key={label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: color, borderWidth: 0.5, borderColor: '#000' },
                ]}
              />
              <Text>{label}</Text>
            </View>
          ))}
        </View>
        
        {/* Weekday Headers */}
        <View style={styles.weekdaysRow}>
          {weekDays.map((day, index) => {
            const weekdayStyle = index === 6 ? [styles.weekday, styles.weekdayLast] : [styles.weekday];
            return (
              <View key={day} style={weekdayStyle}>
                <Text>{day}</Text>
              </View>
            );
          })}
        </View>
        
        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((dateOrNull, index) => {
            if (!dateOrNull) {
              // Empty cell
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }
            
            const dateKey = dateOrNull.toLocaleDateString('en-CA').split('T')[0];
            const day = daysMap.get(dateKey);
            const dayOfMonth = dateOrNull.getDate();
            const bgColor = day ? getColorForDay(day) : '#ffffff';
            const textColor = getTextColorForBackground(bgColor);
            const label = day ? getDayLabel(day) : '';
            
            return (
              <View
                key={dateKey}
                style={[
                  styles.dayCell,
                  {
                    backgroundColor: bgColor,
                    color: textColor,
                  },
                ]}>
                <Text style={[styles.dayNumber, { color: textColor }]}>{dayOfMonth}</Text>
                {label && (
                  <Text style={[styles.dayLabel, { color: textColor }]}>{label}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  
  // Multi-month view
  return (
    <View style={styles.multiMonthContainer}>
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>
          Employee Calendar ({calendar.startDate} to {calendar.endDate})
        </Text>
        
        {calendar.schedule && (
          <Text style={styles.scheduleInfo}>
            Shift {calendar.schedule.shift_start_time}-{calendar.schedule.shift_end_time} •{' '}
            {calendar.schedule.employee_status === 'FULL_TIME' ? 'Full-Time' : 'Part-Time'} •{' '}
            {calendar.schedule.days_off && calendar.schedule.days_off.length > 0
              ? `Days Off: ${calendar.schedule.days_off.map(d => weekDays[d]).join(', ')}`
              : calendar.schedule.days_off_type?.replace(/_/g, ' ')}
          </Text>
        )}
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          {Object.entries(callOutColorMap).map(([label, color]) => (
            <View key={label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: color, borderWidth: 0.5, borderColor: '#000' },
                ]}
              />
              <Text>{label}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Render individual month calendars */}
      {months.map((month) => (
        <SingleMonthCalendar
          key={`month-${month.year}-${month.month}`}
          month={month}
          daysMap={daysMap}
          startDate={startDate}
          endDate={endDate}
        />
      ))}
    </View>
  );
};

export default CalendarGrid;
