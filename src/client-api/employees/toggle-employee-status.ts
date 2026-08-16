'use client';

import {ModalAction} from '../../components/Modal';
import {makeToast, ToastTypes} from '../../components';

export type ToggleEmployeeStatusProps = {
  id: string;
  is_active: boolean;
};

export const ToggleEmployeeStatus = async ({
  id,
  is_active
}: Readonly<ToggleEmployeeStatusProps>): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/employees`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, is_active})
    });

    const {error} = await response.json();

    if (!response.ok) {
      throw new Error(error ?? 'Failed to update employee status');
    } else {
      const action = is_active ? 'Enabled' : 'Disabled';
      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: `Employee ${action}!`
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
