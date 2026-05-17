import {EmployeeFormData} from '../../../../client-api/employees';
import {getDivisionFromDB} from '../../../db/controller';

export const requiredFieldsEmployeeFields: {name: string; key: string}[] = [
  {
    name: 'Employee Name',
    key: 'name'
  },
  {
    name: 'Division',
    key: 'division'
  },
  {
    name: 'Shift Start Time',
    key: 'shiftStartTime'
  },
  {
    name: 'Shift End Time',
    key: 'shiftEndTime'
  },
  {
    name: 'Days Off',
    key: 'daysOffType'
  },
  {
    name: 'Employee Status',
    key: 'employeeStatus'
  }
];

export const validateAddEmployeeForm = async (
  formData: EmployeeFormData
): Promise<[boolean, string[]]> => {
  const missingFields: string[] = [];

  const divisions = await getDivisionFromDB.all();
  const divisionIds = divisions.map(({id}) => id.toString());

  requiredFieldsEmployeeFields.forEach(field => {
    if (!formData[field.key as keyof typeof formData]) {
      missingFields.push(field.name);
    }
  });

  try {
    let validated = true;
    if (missingFields.length) {
      validated = false;
      throw new Error(`The following fields are required: ${missingFields.join(', ')}`);
    }

    // if the user is an admin or supervisor, they must have all divisions

    if (formData.isAdmin === '1' || formData.isSupervisor === '1') {
      if (formData.division !== divisionIds.join(',')) {
        validated = false;
        throw new Error('Admins and Supervisors must belong to all divisions');
      }
    }

    // if admin is present then the supervisor must be present
    if (formData.isAdmin === '1' && formData.isSupervisor === '0') {
      validated = false;
      throw new Error('Admins must be supervisors');
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.shiftStartTime)) {
      validated = false;
      throw new Error('Shift Start Time must be in HH:MM format');
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.shiftEndTime)) {
      validated = false;
      throw new Error('Shift End Time must be in HH:MM format');
    }

    if (!['2_DAYS_OFF', '3_DAYS_OFF', '4_DAYS_OFF'].includes(formData.daysOffType)) {
      validated = false;
      throw new Error('Days Off must be one of: 2, 3, or 4 Days Off');
    }

    if (!['FULL_TIME', 'PART_TIME'].includes(formData.employeeStatus)) {
      validated = false;
      throw new Error('Employee Status must be Full-Time or Part-Time');
    }

    return [validated, missingFields];
  } catch (error) {
    throw new Error(String(error));
  }
};
