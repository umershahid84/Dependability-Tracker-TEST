import { trim } from '../../../lib/utils/shared/strings';

export const employeeListStyles = {
  h1: 'w-auto text-xl font-semibold whitespace-nowrap',
  section: 'w-full flex flex-col items-center justify-center gap-4',
  span: 'w-[95%] flex flex-wrap flex-row gap-4 justify-between md:justify-center items-center',
  addEmployeeBtn:
    trim(`px-4 py-2 bg-blue-600 hover:bg-blue-500 text-center rounded-md text-sm md:whitespace-nowrap
           md:text-base w-[95%] md:w-auto hide-on-print`)
};
export type EmployeeLimit = '5' | '10' | '15' | '20' | '25' | '50' | '100' | '-1';
export type EmployeeSortBy = 'name' | 'isAdmin' | 'isSupervisor' | 'isEmployee' | 'isNonSupervisor';

export const employeeLimitOptions = [
  {
    value: '5',
    text: '5'
  },
  {
    value: '10',
    text: '10'
  },
  {
    value: '15',
    text: '15'
  },
  {
    value: '20',
    text: '20'
  },
  {
    value: '25',
    text: '25'
  },
  {
    value: '50',
    text: '50'
  },
  {
    value: '100',
    text: '100'
  },
  {
    value: '-1',
    text: 'All'
  }
];

export const employeeSortOptions = [
  {
    value: 'name',
    text: 'Name'
  },
  {
    value: 'isAdmin',
    text: 'Admin'
  },
  {
    value: 'isSupervisor',
    text: 'Supervisor'
  },
  {
    value: 'isEmployee',
    text: 'Employees'
  },
  {
    value: 'isNonSupervisor',
    text: 'Non-Supervisors'
  }
];
