// ==========================
// TIMEZONE (DISPLAY ONLY)
// ==========================

export const APP_TZ = (): string => {
  const fallback = 'America/Los_Angeles';

  if (typeof window === 'undefined') {
    return (
      process.env.NEXT_PUBLIC_TIMEZONE ||
      process.env.TIMEZONE ||
      fallback
    );
  }

  return (
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    process.env.NEXT_PUBLIC_TIMEZONE ||
    process.env.TIMEZONE ||
    fallback
  );
};

// ==========================
// DATE FORMATTING (DISPLAY ONLY)
// ==========================

export const formatDateYYYYMMDD = (
  date?: Date | string,
  tz?: string
): string => {
  if (!date) return '';
  
  let d: Date;
  if (typeof date === 'string') {
    // Try to parse as a date string first
    const parsedDate = parseDateString(date.split('T')[0]);
    if (parsedDate) {
      d = parsedDate;
    } else {
      // Fallback to standard Date parsing if not in expected format
      d = new Date(date);
    }
  } else {
    d = new Date(date);
  }
  
  if (isNaN(d.getTime())) return '';

  // Use local timezone if no timezone specified (for database timestamps)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  if (tz) {
    options.timeZone = tz;
  }

  return new Intl.DateTimeFormat('en-CA', options).format(d);
};

export const formatDateReadable = (
  date?: Date | string,
  tz?: string
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Use local timezone if no timezone specified
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (tz) {
    options.timeZone = tz;
  }

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

// ==========================
// LEGACY DATE EXPORTS
// ==========================

export const dateTo_YYYY_MM_DD = (
  date?: Date | string
): string => {
  // Don't pass timezone - use local timezone for database timestamps
  return formatDateYYYYMMDD(date);
};

export const formatDate_YYYY_MM_DD_TZ = (
  date?: Date | string,
  tz?: string
): string => {
  return formatDateYYYYMMDD(date, tz);
};

// ==========================
// TIME FORMATTING
// ==========================

export const formatTime24h = (
  date?: Date | string,
  tz?: string
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Use local timezone if no timezone specified (for database timestamps)
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  
  if (tz) {
    options.timeZone = tz;
  }

  return new Intl.DateTimeFormat('en-GB', options).format(d);
};

export const formatTime12h = (
  date?: Date | string,
  tz?: string,
  withSeconds = true
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Use local timezone if no timezone specified (for database timestamps)
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: true,
  };
  
  if (tz) {
    options.timeZone = tz;
  }

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

// ==========================
// LEGACY TIME EXPORTS
// ==========================

/**
 * Required by existing imports
 * Returns HH:mm:ss (24h) in local timezone
 */
export const dateTo_HH_MM_SS = (
  date?: Date
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  // Don't pass timezone - use local timezone for database timestamps
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
};

export const formatTime_hh_mm_ss_TZ = (
  date?: Date | string,
  tz?: string
): string => {
  return formatTime12h(date, tz, true);
};

export const formatTimeNoSeconds_TZ = (
  date?: Date | string,
  tz?: string
): string => {
  return formatTime12h(date, tz, false);
};

/**
 * Converts "HH:mm" or "HH:mm:ss" → "h:mm am/pm"
 * Legacy helper required by existing imports
 */
export const formatTimeWithAmPm = (
  time: string
): string => {
  if (!time) return '';

  const parts = time.split(':');
  if (parts.length < 2) return '';
  
  const [h, m] = parts;
  const hours = Number(h);

  if (isNaN(hours)) return '';

  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${m} ${ampm}`;
};

// ==========================
// LEGACY ALIASES
// ==========================

export const getDate = (date: Date): string =>
  dateTo_YYYY_MM_DD(date);

export const getTime = (date: Date): string =>
  formatTime_hh_mm_ss_TZ(date);

export const getTimeNoSeconds = (date: Date): string =>
  formatTimeNoSeconds_TZ(date);

// ==========================
// DATE MANIPULATION (SAFE)
// ==========================

/**
 * Adds time without string → Date parsing
 * Does NOT restrict past or future dates
 */
export const addTimeToDate = (
  date: Date,
  time: string
): Date => {
  const [h, m, s = '0'] = time.split(':');
  const d = new Date(date);
  d.setHours(
    Number(h),
    Number(m),
    Number(s),
    0
  );
  return d;
};

// ==========================
// NORMALIZATION (OPTIONAL)
// ==========================

export const startOfDayLocal = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDayLocal = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// ==========================
// UTC HELPERS (LEGACY SAFE)
// ==========================

export const normalizeToStartOfDayUTC = (
  date: Date
): Date => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
};

export const normalizeToEndOfDayUTC = (
  date: Date
): Date => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
};

// ==========================
// UTILITIES
// ==========================

export const makeDate = (
  value: Date | string
): Date => new Date(value);

/**
 * Parses a date string in YYYY-MM-DD format to a Date object in local timezone
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object or null if invalid
 */
export const parseDateString = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  
  const [year, month, day] = parts.map(Number);
  
  // Validate that all parts are valid numbers
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  
  // Validate ranges
  if (year < 1900 || year > 2200) return null; // Reasonable year range
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  
  const date = new Date(year, month - 1, day);
  
  // Validate that the date is valid and didn't overflow
  // (e.g., Feb 31 would overflow to Mar 3)
  if (isNaN(date.getTime()) || 
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day) {
    return null;
  }
  
  return date;
};
