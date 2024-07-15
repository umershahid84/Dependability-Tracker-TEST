import {useState} from 'react';
import {EmployeeFormData} from '../client-api';

export const defaultEmployeeFormData: EmployeeFormData = {
  name: '',
  division: '',
  isAdmin: '0',
  isSupervisor: '0'
};

export type UseEmployeeFormState = {
  formData: EmployeeFormData;
  resetFormData: () => void;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  onChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};

export function useEmployeeFormState(divisionIds: Readonly<string[]>): UseEmployeeFormState {
  const [formData, setFormData] = useState<EmployeeFormData>(defaultEmployeeFormData);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    const divisions = divisionIds.map(el => el.toString()).join(',');

    setFormData(prevFormData => ({...prevFormData, [name]: value}));
    // if admin, set all divisions and set the isSupervisor to yes as admins are supervisors
    if (name === 'isAdmin' && value === '1') {
      setFormData(prevFormData => ({...prevFormData, isSupervisor: '1', division: divisions}));
    }

    // if supervisor is set to no, set is admin to no and clear the divisions
    if (name === 'isSupervisor' && value === '0') {
      setFormData(prevFormData => ({...prevFormData, isAdmin: '0', division: ''}));
    }

    // if supervisor is set to yes, set the divisions to all divisions
    if (name === 'isSupervisor' && value === '1') {
      setFormData(prevFormData => ({...prevFormData, division: divisions}));
    }
  };

  const resetFormData = () => setFormData(defaultEmployeeFormData);

  return {formData, resetFormData, setFormData, onChangeHandler};
}
