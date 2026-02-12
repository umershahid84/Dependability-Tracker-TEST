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
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(d);
};

export const formatTimeNoSeconds_TZ = (date?: Date | string, tz = APP_TZ()): string => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
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
  return new Date(date).toLocaleTimeString('en-US', {hour12: false});
};

export const getTimeNoSeconds = (date: Date): string => {
  date = new Date(date);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
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

export const formatTime24Hour = (time: string): string => {
  // Format time in 24-hour military time format with zero padding
  const [hours, minutes] = time.split(':');
  const paddedHours = hours.padStart(2, '0');
  return `${paddedHours}:${minutes}`;
};

// Alias for backward compatibility - use formatTime24Hour instead
export const formatTimeWithAmPm = formatTime24Hour;

export const makeDate = (date: Date | string) => new Date(date);
