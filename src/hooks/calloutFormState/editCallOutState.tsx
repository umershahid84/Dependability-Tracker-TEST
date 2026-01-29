import React, {useState} from 'react';
import {validateEmployeeCallOut} from './helpers';
import {makeToast, ToastTypes} from '../../components';
import {EditCallOut} from '../../client-api/callouts';
import {DefaultCallOutFormData} from '../../client-api/employees';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {parseDateString} from '../../lib/utils';

export type UseEditCallOutFormState = {
  formData: DefaultCallOutFormData;
  resetFormData: () => void;
  handleFormSubmit: (e: React.SyntheticEvent) => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCallOutFormData>>;
  onChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};

export function useEditCallOutFormState(
  calloutId: string,
  defaultFormData: DefaultCallOutFormData,
  callback?: (data: CallOutWithAssociations) => void
): UseEditCallOutFormState {
  const [formData, setFormData] = useState<DefaultCallOutFormData>(defaultFormData);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    const needsNumber = ['leftEarlyMinutes', 'lateArrivalMinutes'].includes(name);
    
    // Convert date input strings to Date objects in local timezone
    if ((name === 'callDate' || name === 'shiftDate') && value) {
      const localDate = parseDateString(value);
      if (localDate) {
        setFormData(prevFormData => ({...prevFormData, [name]: localDate}));
      }
    } else {
      setFormData(prevFormData => ({...prevFormData, [name]: needsNumber ? Number(value) : value}));
    }
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formValidated = validateEmployeeCallOut(formData);
    if (!formValidated) {
      return;
    }

    try {
      const {data, message, error} = await EditCallOut(calloutId, formData);

      if (!data) {
        throw new Error(error ?? 'Failed to Edit Callout');
      }

      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: message ?? 'Callout Edited Successfully'
      });
      setFormData(defaultFormData);
      callback?.(data);
    } catch (error) {
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: String(error)
      });
    }
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
  };

  return {
    formData,
    setFormData,
    resetFormData,
    onChangeHandler,
    handleFormSubmit
  };
}
