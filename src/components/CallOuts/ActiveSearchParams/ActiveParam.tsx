import { useState } from 'react';
import { CloseIcon } from '../../Icons';
import { formatTimeWithAmPm } from '../../../lib/utils';
import { GetAllCallOutOptions } from '../../../lib/db/controller/Callout/helpers';
import { useCallOutAdvancedSearchContext } from '../../../providers';

export type ActiveParamProps = {
  // an entry in the searchParams object
  activeParam: {
    [key: string]:
    | string
    | number
    | Date
    | [Date, Date]
    | [string, string]
    | [number, number]
    | null;
  };

  onRemove: (key: string) => void;
};

const styles = {
  p: 'p-2 bg-tertiary rounded-md relative',
  activeParam: 'rounded-md text-primary ',
  iconStyles: 'w-5 h-5 absolute -right-2 -top-2 cursor-pointer hover:text-red-500 stroke-2'
};

const formatParamKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char: string) => char.toUpperCase())
    .replace('Id', '')
    .trim();
};

const useFormatParamValue = (key: keyof GetAllCallOutOptions, value: string) => {
  let formatted = '';
  const { divisions, employees, leaveTypes, supervisors } = useCallOutAdvancedSearchContext();

  switch (key) {
    case 'created_at_range':
    case 'shift_date_range':
    case 'callout_date_range': {
      const [start, end] = value.split(',');
      const startDate = new Date(start).toLocaleDateString();
      const endDate = new Date(end).toLocaleDateString();
      formatted = `${startDate} to ${endDate}`;
      break;
    }
    case 'shift_time_range':
    case 'callout_time_range': {
      const [start, end] = value.split(',');
      formatted = `${formatTimeWithAmPm(start)} - ${formatTimeWithAmPm(end)}`;
      break;
    }
    case 'arrived_late_mins_range':
    case 'left_early_mins_range': {
      const [min, max] = value.split(',');
      formatted = `${min} to ${max} mins`;
      break;
    }
    case 'left_early_mins':
    case 'arrived_late_mins':
      formatted = `${value} mins`;
      break;
    case 'division_id':
      formatted = divisions.find(division => division.id === value)?.name ?? '';
      break;
    case 'employee_id':
      formatted = employees.find(employee => employee.id === value)?.name ?? '';
      break;
    case 'leave_type_id':
      formatted = leaveTypes.find(leaveType => leaveType.id === value)?.reason ?? '';
      break;
    case 'supervisor_id':
      formatted =
        supervisors.find(supervisor => supervisor.id === value)?.supervisor_info.name ?? '';
      break;
    default:
      formatted = value;
      break;
  }

  return formatted;
};

export function ActiveParam({ activeParam, onRemove }: Readonly<ActiveParamProps>) {
  const [key, value] = Object.entries(activeParam)[0];
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <li //NOSONAR
      className={styles.activeParam}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <p className={styles.p}>
        {isHovered && <CloseIcon onClick={() => onRemove(key)} className={styles.iconStyles} />}
        {formatParamKey(key)}:{' '}
        {useFormatParamValue(
          key as keyof GetAllCallOutOptions,
          typeof value === 'string' ? value ?? '' : value?.toString() ?? ''
        )}
      </p>
    </li>
  );
}
