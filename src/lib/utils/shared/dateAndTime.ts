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

export const dateTo_YYYY_MM_DD = (date: Date | undefined): string => {
  if (!date) return '';
  const _date = new Date(date);
  return _date.toISOString().split('T')[0];
};

export const getDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
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
