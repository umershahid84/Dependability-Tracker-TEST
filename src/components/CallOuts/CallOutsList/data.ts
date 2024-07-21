import {employeeLimitOptions} from '../../Employees';

export const callOutLimitOptions = employeeLimitOptions;

export type CallOutSortBy =
  | 'leaveType'
  | 'employeeName'
  | 'callDate'
  | 'shiftDate'
  | 'createdBy'
  | 'arrivedLate'
  | 'leftEarly'
  | 'createdAt'
  | 'updatedAt';

export const callOutSortBy: {value: CallOutSortBy; text: string}[] = [
  {
    value: 'leaveType',
    text: 'Leave Type'
  },
  {
    value: 'employeeName',
    text: 'Employee Name'
  },
  {
    value: 'callDate',
    text: 'Call Date'
  },
  {
    value: 'shiftDate',
    text: 'Shift Date'
  },
  {
    value: 'createdBy',
    text: 'Created By'
  },
  {
    value: 'arrivedLate',
    text: 'Arrived Late'
  },
  {
    value: 'leftEarly',
    text: 'Left Early'
  },
  {
    value: 'createdAt',
    text: 'Created At'
  },
  {
    value: 'updatedAt',
    text: 'Updated At'
  }
];

export const showLastOptions: {value: string; text: string}[] = [
  {
    value: '7',
    text: 'Last 7 Days'
  },
  {
    value: '14',
    text: 'Last 14 Days'
  },
  {
    value: '21',
    text: 'Last 21 Days'
  },
  {
    value: '30',
    text: 'Last 30 Days'
  },
  {
    value: '45',
    text: 'Last 45 Days'
  },
  {
    value: '60',
    text: 'Last 60 Days'
  },
  {
    value: '90',
    text: 'Last 90 Days'
  },
  {
    value: '180',
    text: 'Last 180 Days'
  },
  {
    value: '365',
    text: 'Last 365 Days'
  },
  {
    value: 'all',
    text: 'All'
  }
];
