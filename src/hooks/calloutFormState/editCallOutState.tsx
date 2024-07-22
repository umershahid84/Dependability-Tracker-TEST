import React, {useState} from 'react';
import {validateEmployeeCallOut} from './helpers';
import {makeToast, ToastTypes} from '../../components';
import {ClientAPI, DefaultCallOutFormData} from '../../client-api';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';

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
    setFormData(prevFormData => ({...prevFormData, [name]: needsNumber ? Number(value) : value}));
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formValidated = validateEmployeeCallOut(formData);
    if (!formValidated) {
      return;
    }

    try {
      const {data, message, error} = await ClientAPI.CallOuts.Update(calloutId, formData);

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
