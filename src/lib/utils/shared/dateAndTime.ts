/**
 * Simplified Date/Time Utilities
 * 
 * This module provides a clean, simple approach to date/time handling:
 * - All dates stored in DB are in UTC
 * - All dates displayed to users are in APP_TZ (America/Los_Angeles by default)
 * - Clear separation between input parsing and output formatting
 * - No complex timezone logic - just simple, reliable functions
 */

// ==========================
// CONFIGURATION
// ==========================

/**
 * Get the application timezone
 * Priority: browser timezone -> env var -> fallback
 */
export const APP_TZ = (): string => {
  const fallback = 'America/Los_Angeles';

  // Server-side: use environment variable or fallback
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_TIMEZONE || process.env.TIMEZONE || fallback;
  }

  // Client-side: use browser timezone, env var, or fallback
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || fallback;
  } catch {
    return fallback;
  }
};

// ==========================
// DISPLAY FORMATTING
// ==========================

/**
 * Format a date for display in YYYY-MM-DD format
 * Always uses APP_TZ for consistent display
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TZ(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

/**
 * Format a time for display in HH:MM:SS format (24-hour)
 * Always uses APP_TZ for consistent display
 */
export const formatTime24 = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: APP_TZ(),
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
};

/**
 * Format a time for display in h:MM AM/PM format (12-hour)
 * Always uses APP_TZ for consistent display
 */
export const formatTime12 = (date: Date | string | undefined, includeSeconds = false): string => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: APP_TZ(),
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  if (includeSeconds) {
    options.second = '2-digit';
  }

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

/**
 * Format a date and time for display
 * Returns format: "YYYY-MM-DD @ h:MM AM/PM"
 */
export const formatDateTime = (date: Date | string | undefined): string => {
  if (!date) return '';
  return `${formatDate(date)} @ ${formatTime12(date)}`;
};

/**
 * Format a readable date with day of week
 * Returns format: "Mon, Jan 1, 2024"
 */
export const formatDateReadable = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TZ(),
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

// ==========================
// INPUT PARSING
// ==========================

/**
 * Parse a date string from user input (YYYY-MM-DD format)
 * Creates a Date object at midnight in the local timezone
 */
export const parseDateInput = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  
  const [year, month, day] = parts.map(Number);
  
  // Validate
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (year < 1900 || year > 2200) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  
  // Create date at midnight in local timezone
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  
  // Validate the date is valid (e.g., not Feb 31)
  if (
    isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  
  return date;
};

/**
 * Parse a time string from user input (HH:MM or HH:MM:SS format)
 * Returns the time components
 */
export const parseTimeInput = (timeString: string): { hours: number; minutes: number; seconds: number } | null => {
  if (!timeString) return null;
  
  const parts = timeString.split(':');
  if (parts.length < 2) return null;
  
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = parts.length > 2 ? Number(parts[2]) : 0;
  
  // Validate
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;
  if (seconds < 0 || seconds > 59) return null;
  
  return { hours, minutes, seconds };
};

/**
 * Combine a date and time into a single Date object
 * The resulting Date represents the exact moment in UTC
 */
export const combineDateAndTime = (
  dateString: string,
  timeString: string
): Date | null => {
  const date = parseDateInput(dateString);
  if (!date) return null;
  
  const time = parseTimeInput(timeString);
  if (!time) return null;
  
  // Set the time on the date
  date.setHours(time.hours, time.minutes, time.seconds, 0);
  
  return date;
};

/**
 * Convert a local date/time to UTC ISO string for storage
 * This is what should be sent to the API
 */
export const toUTCString = (date: Date | null): string => {
  if (!date) return '';
  return date.toISOString();
};

// ==========================
// DATE MANIPULATION
// ==========================

/**
 * Add time to a date object
 */
export const addTimeToDate = (date: Date, hours: number, minutes: number, seconds = 0): Date => {
  const d = new Date(date);
  d.setHours(hours, minutes, seconds, 0);
  return d;
};

/**
 * Get start of day (midnight) in local timezone
 */
export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day (23:59:59.999) in local timezone
 */
export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Normalize to start of day in UTC
 */
export const startOfDayUTC = (date: Date): Date => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
  );
};

/**
 * Normalize to end of day in UTC
 */
export const endOfDayUTC = (date: Date): Date => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999)
  );
};

// ==========================
// LEGACY COMPATIBILITY
// ==========================
// These functions maintain compatibility with existing code
// They map to the new simplified functions

export const dateTo_YYYY_MM_DD = (date?: Date | string): string => formatDate(date);
export const dateTo_HH_MM_SS = (date?: Date): string => formatTime24(date);
export const getDate = (date: Date): string => formatDate(date);
export const getTime = (date: Date): string => formatTime12(date, true);
export const getTimeNoSeconds = (date: Date): string => formatTime12(date, false);

export const formatDate_YYYY_MM_DD_TZ = (date?: Date | string, _tz?: string): string => formatDate(date);
export const formatTime_hh_mm_ss_TZ = (date?: Date | string, _tz?: string): string => formatTime12(date, true);
export const formatTimeNoSeconds_TZ = (date?: Date | string, _tz?: string): string => formatTime12(date, false);

export const formatDateYYYYMMDD = (date?: Date | string, _tz?: string): string => formatDate(date);
export const formatDateReadable = formatDateReadable;
export const formatTimeWithAmPm = (time: string): string => {
  const parts = time.split(':');
  if (parts.length < 2) return '';
  
  const hours = Number(parts[0]);
  const minutes = parts[1];
  
  if (isNaN(hours)) return '';
  
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 || 12;
  
  return `${displayHour}:${minutes} ${ampm}`;
};

export const parseDateString = parseDateInput;
export const makeDate = (value: Date | string): Date => new Date(value);

export const normalizeToStartOfDayUTC = startOfDayUTC;
export const normalizeToEndOfDayUTC = endOfDayUTC;
export const startOfDayLocal = startOfDay;
export const endOfDayLocal = endOfDay;
