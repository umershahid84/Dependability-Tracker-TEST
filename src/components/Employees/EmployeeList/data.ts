import {trim} from '../../../lib/utils/shared/strings';

export const employeeListStyles = {
  h1: 'w-auto text-xl font-semibold whitespace-nowrap',
  section: 'w-full flex flex-col items-center justify-center gap-4 ',
  span: 'w-full flex flex-wrap flex-row gap-4 justify-center items-center',
  div: 'w-full flex flex-col md:flex-row justify-center items-center gap-4  bg-gray-800 p-2 rounded-md mt-6',
  addEmployeeBtn:
    trim(`px-4 py-2 bg-[var(--green)] flex flex-row flex-wrap text-center items-center hover:bg-black 
  text-white rounded-md text-sm w-26 md:w-auto  md:whitespace-nowrap md:text-base absolute top-[51px] right-1
   md:relative md:top-0 md:right-0 hide-on-print`)
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
    text: 'Is Admin'
  },
  {
    value: 'isSupervisor',
    text: 'Is Supervisor'
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
