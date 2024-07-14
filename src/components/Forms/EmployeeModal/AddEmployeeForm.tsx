import {useIsMounted} from '../../../hooks';
import {DynamicOption} from '../DynamicOptions';
import React, {useEffect, useState} from 'react';
import {getDivisions} from '../../../client-api';
import {makeToast, ToastTypes} from '../../Toasts';
import EmployeeCrudFromModalLayout from './FormLayout';
import {DivisionAttributes} from '../../../lib/db/models/types';
import {CreateEmployee} from '../../../client-api/create-employee';
import {UseEmployeeFormState, useEmployeeFormState} from '../../../hooks/employeeFormState';

const requiredFields: {name: string; key: string}[] = [
  {
    name: 'Employee Name',
    key: 'name'
  },
  {
    name: 'Division',
    key: 'division'
  }
];

const validateForm = (formData: UseEmployeeFormState['formData']): [boolean, string[]] => {
  const missingFields: string[] = [];

  requiredFields.forEach(field => {
    if (!formData[field.key as keyof typeof formData]) {
      missingFields.push(field.name);
    }
  });

  if (missingFields.length) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: `The following fields are required: ${missingFields.join(', ')}`
    });
  }

  return [missingFields.length === 0, missingFields];
};

export function AddEmployeeForm() {
  const isMounted: boolean = useIsMounted();
  const [divisions, setDivisions] = useState<DivisionAttributes[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<DynamicOption['dynamicOptions']>([]);
  const {formData, setFormData, onChangeHandler}: UseEmployeeFormState = useEmployeeFormState(
    divisions.map(({id}) => id.toString())
  );

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const [validated] = validateForm(formData);

    if (!validated) {
      return;
    }

    await CreateEmployee({
      formData,
      setFormData
    });
  };

  useEffect(() => {
    isMounted && (async () => setDivisions(await getDivisions()))();
  }, [isMounted]);

  useEffect(() => {
    const data = divisions.map(({id, name}) => ({
      value: id.toString(),
      text: name
    }));

    setDivisionOptions(data);
  }, [divisions]);

  return (
    <EmployeeCrudFromModalLayout
      title="Add Employee"
      formData={formData}
      divisions={divisions}
      onChange={onChangeHandler}
      onSubmit={handleFormSubmit}
      divisionOptions={divisionOptions}
    />
  );
}

export default AddEmployeeForm;
