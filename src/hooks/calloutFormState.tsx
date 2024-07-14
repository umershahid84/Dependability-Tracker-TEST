import React, {useEffect, useState} from 'react';
import {makeToast, ToastTypes} from '../components';
import {CallOutWithAssociations} from '../lib/db/models/Callout';
import {UseIncrementingTime, useIncrementingTime, useIsMounted} from '../hooks';
import {EmployeeCallOut, DefaultCallOutFormData, getDefaultCallOutFormData} from '../client-api';

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
  const clearCallTimeInterval = incrementingCallTime.clearTimeInterval;

  const shiftTime: string = incrementingShiftTime.time;
  const clearShiftTimeInterval = incrementingShiftTime.clearTimeInterval;

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    clearCallTimeInterval();
    clearShiftTimeInterval();
    const {name, value} = e.target;
    setFormData(prevFormData => ({...prevFormData, [name]: value}));
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // validate form data before sending
    const requiredFields = [
      'comment',
      'callDate',
      'callTime',
      'shiftDate',
      'leaveType',
      'shiftTime',
      'employeeName'
    ];

    const missingFields = requiredFields.filter(
      field => !formData[field as keyof DefaultCallOutFormData]
    );

    if (missingFields.length) {
      makeToast({
        title: 'Error',
        type: ToastTypes.Error,
        message: `Missing fields: ${missingFields
          .map(field =>
            field
              .replace(/([A-Z])/g, ' $1')
              .trim()
              .split(' ')
              .map(word => word[0].toUpperCase() + word.slice(1))
              .join(' ')
          )
          .join(', ')}`
      });
      return;
    }

    await EmployeeCallOut({
      callback,
      formData,
      callTime,
      shiftTime,
      setFormData,
      defaultFormData
    });
  };

  useEffect(() => {
    return () => {
      clearCallTimeInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const resetFormData = () => {
    setFormData(defaultFormData);
    clearCallTimeInterval();
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
