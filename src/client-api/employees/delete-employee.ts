'use client';

import {ModalAction} from '../../components/Modal';
import {makeToast, ToastTypes} from '../../components';

export type DeleteEmployeeProps = {
  id: string;
};

export const DeleteEmployee = async ({id}: Readonly<DeleteEmployeeProps>): Promise<boolean> => {
  try {
    const deleteEmployeeData: DeleteEmployeeProps = {
      id: id
    };

    const response = await fetch(`/api/admin/employees`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...deleteEmployeeData})
    });

    const {error} = await response.json();

    if (!response.ok) {
      throw new Error(error ?? 'Failed to delete employee');
    } else {
      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: 'Employee Deleted!'
      });
      window.dispatchEvent(new CustomEvent('modalEvent', {detail: {action: ModalAction.CLOSE}}));
      return true;
    }
  } catch (error) {
    console.error(error);
    makeToast({
      title: 'Error',
      type: ToastTypes.Error,
      message: String(error),
      timeOut: 7500
    });
    return false;
  }
};
