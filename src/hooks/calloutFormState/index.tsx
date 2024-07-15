import React, {useEffect, useState} from 'react';
import {validateEmployeeCallOut} from './helpers';
import {makeToast, ToastTypes} from '../../components';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {UseIncrementingTime, useIncrementingTime, useIsMounted} from '../../hooks';
import {EmployeeCallOut, DefaultCallOutFormData, getDefaultCallOutFormData} from '../../client-api';

export type UseCallOutFormState = {
  callTime: string;
  shiftTime: string;
  formData: DefaultCallOutFormData;
  resetFormData: () => void;
  handleFormSubmit: (e: React.SyntheticEvent) => Promise<void>;
  handleCallTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShiftTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCallOutFormData>>;
  onChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};

export function useCallOutFormState(
  callback?: (data: CallOutWithAssociations) => void
): UseCallOutFormState {
  const isMounted = useIsMounted();
  const incrementingCallTime: UseIncrementingTime = useIncrementingTime();
  const incrementingShiftTime: UseIncrementingTime = useIncrementingTime();
  const defaultFormData: DefaultCallOutFormData = getDefaultCallOutFormData();
  const [formData, setFormData] = useState<DefaultCallOutFormData>(defaultFormData);

  const callTime: string = incrementingCallTime.time;
  const shiftTime: string = incrementingShiftTime.time;

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    incrementingCallTime.clearTimeInterval();
    incrementingShiftTime.clearTimeInterval();
    const {name, value} = e.target;
    setFormData(prevFormData => ({...prevFormData, [name]: value}));
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formValidated = validateEmployeeCallOut(formData);
    if (!formValidated) {
      return;
    }

    try {
      await EmployeeCallOut({
        callback,
        formData,
        callTime,
        shiftTime,
        setFormData,
        defaultFormData
      });
    } catch (error) {
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: String(error)
      });
    }
  };

  useEffect(() => {
    return () => {
      incrementingCallTime.clearTimeInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const resetFormData = () => {
    setFormData(defaultFormData);
    incrementingCallTime.resetTime();
    incrementingShiftTime.resetTime();
  };

  return {
    formData,
    callTime,
    shiftTime,
    setFormData,
    resetFormData,
    onChangeHandler,
    handleFormSubmit,
    handleCallTimeChange: incrementingCallTime.handleTimeChange,
    handleShiftTimeChange: incrementingShiftTime.handleTimeChange
  };
}
