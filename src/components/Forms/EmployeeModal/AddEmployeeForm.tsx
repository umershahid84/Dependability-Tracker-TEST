import React from 'react';
import {CreateEmployee} from '../../../client-api';
import {AddOrEditEmployeeForm} from './AddOrEditEmployee';
import type {EmployeeWithAssociations} from '../../../lib/db/controller';

export function AddEmployeeForm({
  onModalEditCallBack
}: Readonly<{
  onModalEditCallBack: (employee: EmployeeWithAssociations, isNew?: boolean) => void;
}>) {
  return (
    <AddOrEditEmployeeForm
      type="Add Employee"
      onSubmit={CreateEmployee}
      onModalEditCallBack={onModalEditCallBack}
    />
  );
}

export default AddEmployeeForm;
