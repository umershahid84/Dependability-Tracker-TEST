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
