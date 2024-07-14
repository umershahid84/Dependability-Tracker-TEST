'use client';
import {makeToast, ToastTypes} from '../components';

export type EmployeeFormData = {
  name: string;
  division: string;
  isAdmin: '0' | '1';
  isSupervisor: '0' | '1';
};

export const defaultEmployeeFormData: EmployeeFormData = {
  name: '',
  division: '',
  isAdmin: '0',
  isSupervisor: '0'
};

export type CreateEmployeeData = {
  name: string;
  isAdmin: boolean;
  division_ids: string[];
  isSupervisor: boolean;
};

export type CreateEmployeeProps = {
  formData: EmployeeFormData;

  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
};

export const CreateEmployee = async ({
  formData,
  setFormData
}: Readonly<CreateEmployeeProps>): Promise<void> => {
  try {
    const employeeDivisions = formData.division.split(',');

    // convert the 1 or 0 to a boolean value
    const newEmployeeData: CreateEmployeeData = {
      name: formData.name,
      division_ids: employeeDivisions,
      isAdmin: formData.isAdmin === '1',
      isSupervisor: formData.isSupervisor === '1'
    };

    console.log('New Employee Data:', newEmployeeData);

    const response = await fetch(`/api/admin/employees/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...newEmployeeData})
    });

    const data = await response.json();

    console.log('Response:', data);

    if (!response.ok) {
      throw new Error('Failed to create employee');
    } else {
      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: 'Employee Created Successfully'
      });
      setFormData(defaultEmployeeFormData);
    }
  } catch (error) {
    console.error(error);
    makeToast({
      title: 'Error',
      type: ToastTypes.Error,
      message: String(error),
      timeOut: 7500
    });
  }
};
