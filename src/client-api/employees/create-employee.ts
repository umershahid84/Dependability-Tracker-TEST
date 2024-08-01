'use client';
import { ApiData } from '../../lib/apiController';
import { ModalAction } from '../../components/Modal';
import { makeToast, ToastTypes } from '../../components';
import { EmployeeWithAssociations } from '../../lib/db/controller';

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
};

export const CreateEmployee = async ({
  formData
}: Readonly<CreateEmployeeProps>): Promise<EmployeeWithAssociations | null> => {
  try {
    const response = await fetch(`/api/admin/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData })
    });

    const { error, data } = (await response.json()) as ApiData<EmployeeWithAssociations>;

    if (!response.ok) {
      throw new Error(error ?? 'Failed to create employee');
    } else {
      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: 'Employee Created Successfully'
      });
      window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
      return data as EmployeeWithAssociations;
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
