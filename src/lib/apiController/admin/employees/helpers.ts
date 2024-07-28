import {EmployeeFormData} from '../../../../client-api';
import {getDivisionFromDB} from '../../../db/controller';

export const requiredFieldsEmployeeFields: {name: string; key: string}[] = [
  {
    name: 'Employee Name',
    key: 'name'
  },
  {
    name: 'Division',
    key: 'division'
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

    return [validated, missingFields];
  } catch (error) {
    throw new Error(String(error));
  }
};
