export const dateTo_HH_MM_SS = (date: Date | undefined): string => {
  if (!date) return '';
  const _date = new Date(date);
  const hours = _date.getHours();
  const minutes = _date.getMinutes();
  const seconds = _date.getSeconds();

  // ensure the hours, minutes, and seconds are always two digits
  const _hours = hours < 10 ? `0${hours}` : hours;
  const _minutes = minutes < 10 ? `0${minutes}` : minutes;
  const _seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${_hours}:${_minutes}:${_seconds}`;
};

const default_tz = 'America/Los_Angeles';

export const APP_TZ = (): string => {
  // On the server, always use env var or default
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_TIMEZONE || process.env.TIMEZONE || default_tz;
  }

  // On the client, use browser's timezone or env var or default
  return (
    (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null) ||
    process.env.NEXT_PUBLIC_TIMEZONE ||
    process.env.TIMEZONE ||
    default_tz
  );
};

export const formatDate_YYYY_MM_DD_TZ = (date?: Date | string, tz = APP_TZ()): string => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
};

export const formatTime_hh_mm_ss_TZ = (date?: Date | string, tz = APP_TZ()): string => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(d);
};

export const formatTimeNoSeconds_TZ = (date?: Date | string, tz = APP_TZ()): string => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d);
};

export const dateTo_YYYY_MM_DD = (date: Date | string | undefined): string => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  const d = new Date(date);
  // Use UTC methods to avoid timezone shifts for date-only values stored in DB
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDate = (date: Date): string => {
  // For date-only values from DB (stored as UTC midnight), use UTC methods
  // to avoid timezone shifts
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {timeZone: 'UTC'});
};

export const getTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString();
};

export const getTimeNoSeconds = (date: Date): string => {
  date = new Date(date);
  let dateString = `${date.toLocaleTimeString().slice(0, 5)} ${
    date.toLocaleTimeString().split(' ')[1]
  }`;

  let numberOfColons = dateString.split(':').length - 1;

  if (numberOfColons === 2) {
    const timeOfDay = dateString.split(' ')[1]?.trim();
    let [time] = dateString.split(timeOfDay);
    time = time.trim();

    if (time.endsWith(':')) {
      time = time.slice(0, -1);
    }
    return `${time.trim()} ${timeOfDay.trim()}`;
  }

  return dateString;
};

// Function to normalize date to the beginning of the day in UTC
export const normalizeToStartOfDayUTC = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

// Function to normalize date to the end of the day in UTC
export const normalizeToEndOfDayUTC = (date: Date) => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999)
  );
};

export const addTimeToDate = (date: Date, time: string) => {
  const [hours, minutes, seconds] = time.split(':');
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  date = new Date(year, month, day, Number(hours), Number(minutes), Number(seconds ?? 0), 0);
  return date;
};

export const formatTimeWithAmPm = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const amOrPm = parseInt(hours) > 12 ? 'pm' : 'am';
  return `${parseInt(hours) % 12}:${minutes} ${amOrPm}`;
};

export const makeDate = (date: Date | string) => new Date(date);

export const isValid24HourTimeHHMM = (value: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export const formatDateToISODateOnly = (value: Date): string =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
    value.getDate()
  ).padStart(2, '0')}`;

export const getMonthDateRange = (
  dateValue: Date | string
): {
  startDate: string;
  endDate: string;
} => {
  const date =
    typeof dateValue === 'string' ? new Date(`${dateValue}T00:00:00`) : new Date(dateValue);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {startDate: formatDateToISODateOnly(start), endDate: formatDateToISODateOnly(end)};
};
