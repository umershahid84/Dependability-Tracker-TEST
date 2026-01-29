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
  tz: string = APP_TZ()
): string => {
  if (!date) return '';
  
  let d: Date;
  if (typeof date === 'string') {
    // Parse date-only strings as local dates to avoid timezone issues
    const [year, month, day] = date.split('T')[0].split('-').map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(date);
  }
  
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

export const formatDateReadable = (
  date?: Date | string,
  tz: string = APP_TZ()
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

// ==========================
// LEGACY DATE EXPORTS
// ==========================

export const dateTo_YYYY_MM_DD = (
  date?: Date | string
): string => {
  return formatDateYYYYMMDD(date);
};

export const formatDate_YYYY_MM_DD_TZ = (
  date?: Date | string,
  tz: string = APP_TZ()
): string => {
  return formatDateYYYYMMDD(date, tz);
};

// ==========================
// TIME FORMATTING
// ==========================

export const formatTime24h = (
  date?: Date | string,
  tz: string = APP_TZ()
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
};

export const formatTime12h = (
  date?: Date | string,
  tz: string = APP_TZ(),
  withSeconds = true
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: true,
  }).format(d);
};

// ==========================
// LEGACY TIME EXPORTS
// ==========================

/**
 * Required by existing imports
 * Returns HH:mm:ss (24h) in APP_TZ
 */
export const dateTo_HH_MM_SS = (
  date?: Date
): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: APP_TZ(),
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d);
};

export const formatTime_hh_mm_ss_TZ = (
  date?: Date | string,
  tz: string = APP_TZ()
): string => {
  return formatTime12h(date, tz, true);
};

export const formatTimeNoSeconds_TZ = (
  date?: Date | string,
  tz: string = APP_TZ()
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

  const [h, m] = time.split(':');
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
