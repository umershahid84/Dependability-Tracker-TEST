import React from 'react';
import {CreateEmployee} from '../../../client-api';
import {AddOrEditEmployeeForm} from './AddOrEditEmployee';

export function AddEmployeeForm() {
  return <AddOrEditEmployeeForm type="Add Employee" onSubmit={CreateEmployee} />;
}

export default AddEmployeeForm;
