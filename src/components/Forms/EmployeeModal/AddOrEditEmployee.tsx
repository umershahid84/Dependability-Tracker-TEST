import {DynamicOption} from '../FormInputs/DynamicOptions';
import React, {useEffect, useState} from 'react';
import EmployeeCrudFromModalLayout from './FormLayout';
import {EmployeeWithAssociations} from '../../../lib/db/controller';
import {UseDivisions, useDivisions, useIsMounted} from '../../../hooks';
import {UseEmployeeFormState, useEmployeeFormState} from '../../../hooks/employeeFormState';
import {CreateEmployeeProps, defaultEmployeeFormData, EditEmployeeProps} from '../../../client-api';

export type AddOrEditEmployeeFormProps = {
  type: 'Add Employee' | 'Edit Employee';
  employeeData?: EmployeeWithAssociations;
  onSubmit: (props: CreateEmployeeProps | EditEmployeeProps) => Promise<boolean>;
};

export function AddOrEditEmployeeForm({type, onSubmit, employeeData}: AddOrEditEmployeeFormProps) {
  const isMounted: boolean = useIsMounted();
  const {divisions}: UseDivisions = useDivisions();
  const [divisionOptions, setDivisionOptions] = useState<DynamicOption['dynamicOptions']>([]);
  const {formData, setFormData, onChangeHandler}: UseEmployeeFormState = useEmployeeFormState(
    divisions?.map(({id}) => id.toString()) ?? []
  );

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let successful = false;

    if (type === 'Add Employee') {
      successful = await onSubmit({
        formData
      });
    }

    if (type === 'Edit Employee') {
      successful = await onSubmit({
        formData,
        id: employeeData?.id
      });
    }

    if (successful) {
      setFormData(defaultEmployeeFormData);
    }

    window.dispatchEvent(new CustomEvent('employeeUpdated'));
  };

  useEffect(() => {
    if (divisions) {
      const data = divisions?.map(({id, name}) => ({
        value: id.toString(),
        text: name
      }));

      setDivisionOptions(data);
    }
  }, [divisions]);

  useEffect(() => {
    if (isMounted && type === 'Edit Employee') {
      // set the form data to the employee data
      setFormData({
        name: employeeData?.name ?? '',
        isAdmin: employeeData?.role?.includes('Admin') ? '1' : '0',
        isSupervisor: employeeData?.role?.includes('Supervisor') ? '1' : '0',
        division: employeeData?.divisions.map(({id}) => id.toString()).join(',') ?? ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, type, employeeData]);

  return isMounted ? (
    <EmployeeCrudFromModalLayout
      title={type}
      formData={formData}
      divisions={divisions ?? []}
      onChange={onChangeHandler}
      onSubmit={handleFormSubmit}
      divisionOptions={divisionOptions}
    />
  ) : (
    <></>
  );
}
