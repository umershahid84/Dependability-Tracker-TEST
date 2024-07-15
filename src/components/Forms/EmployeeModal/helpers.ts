import {makeToast, ToastTypes} from '../../Toasts';
import {UseEmployeeFormState} from '../../../hooks/employeeFormState';

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

export const validateAddEmployeeForm = (
  formData: UseEmployeeFormState['formData'],
  divisionIds: string[]
): [boolean, string[]] => {
  const missingFields: string[] = [];
  let validated = true;

  requiredFieldsEmployeeFields.forEach(field => {
    if (!formData[field.key as keyof typeof formData]) {
      missingFields.push(field.name);
    }
  });

  try {
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
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: String(error)
    });
  }

  return [validated, missingFields];
};
