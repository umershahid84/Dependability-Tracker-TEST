'use client';
import {EmployeeFormData} from './create-employee';
import {ModalAction} from '../../components/Modal';
import {makeToast, ToastTypes} from '../../components';
import {EmployeeWithAssociations} from '../../lib/db/controller';

export type EditEmployeeProps = {
  formData: EmployeeFormData;
  id: string;
};

export const EditEmployee = async ({
  formData,
  id
}: Readonly<EditEmployeeProps>): Promise<EmployeeWithAssociations | null> => {
  try {
    const updateEmployeeData: EditEmployeeProps = {
      id: id,
      formData: {
        name: formData.name,
        division: formData.division,
        isAdmin: formData.isAdmin,
        isSupervisor: formData.isSupervisor
      }
    };

    const response = await fetch(`/api/admin/employees`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...updateEmployeeData})
    });

    const {data, error} = (await response.json()) as {
      data: EmployeeWithAssociations;
      error: string;
    };

    if (!response.ok) {
      throw new Error(error ?? 'Failed to update employee');
    } else {
      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: 'Employee Updated!'
      });
      window.dispatchEvent(new CustomEvent('modalEvent', {detail: {action: ModalAction.CLOSE}}));

      return data;
    }
  } catch (error) {
    console.error(error);
    makeToast({
      title: 'Error',
      type: ToastTypes.Error,
      message: String(error),
      timeOut: 7500
    });
    return null;
  }
};
