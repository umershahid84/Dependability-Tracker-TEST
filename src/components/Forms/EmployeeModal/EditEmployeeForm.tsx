import React from 'react';
import {EditEmployee} from '../../../client-api';
import {AddOrEditEmployeeForm} from './AddOrEditEmployee';
import {EmployeeWithAssociations} from '../../../lib/db/controller';

export type EditEmployeeFormProps = {
  employeeData?: EmployeeWithAssociations;
  onModalEditCallBack: (employee: EmployeeWithAssociations, isNew?: boolean) => void;
};

export function EditEmployeeForm({
  employeeData,
  onModalEditCallBack
}: Readonly<EditEmployeeFormProps>): React.ReactElement {
  return (
    <AddOrEditEmployeeForm
      type="Edit Employee"
      //@ts-ignore
      onSubmit={EditEmployee}
      employeeData={employeeData}
      onModalEditCallBack={onModalEditCallBack}
    />
  );
}
