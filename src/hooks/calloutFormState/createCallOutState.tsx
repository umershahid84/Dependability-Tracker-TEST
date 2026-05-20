import React, {useEffect, useState} from 'react';
import {validateEmployeeCallOut} from './helpers';
import {makeToast, ToastTypes} from '../../components';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {UseIncrementingTime, useIncrementingTime, useIsMounted} from '../../hooks';
import {
  CreateEmployeeCallOut,
  DefaultCallOutFormData,
  getDefaultCallOutFormData
} from '../../client-api/employees';

export type UseCreateCallOutFormState = {
  callTime: string;
  shiftTime: string;
  formData: DefaultCallOutFormData;
  resetFormData: (employeeId?: string) => void;
  handleFormSubmit: (e: React.SyntheticEvent) => Promise<void>;
  handleCallTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShiftTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCallOutFormData>>;
  onChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};

export function localDateAndTimeToUTC(date: Date | string, time: string): string {
  let dateStr: string;

  if (typeof date === 'string') {
    // String from date picker - already in YYYY-MM-DD format
    dateStr = date;
  } else {
    // Date object - extract local date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const [hh, mm, ss = 0] = time.split(':').map(Number);

  const localDate = new Date(year, month - 1, day, hh, mm, ss);
  return localDate.toISOString();
}

export function useCreateCallOutFormState(
  callback?: (data: CallOutWithAssociations) => void
): UseCreateCallOutFormState {
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
      const data = await CreateEmployeeCallOut({
        formData,
        callTime: localDateAndTimeToUTC(formData.callDate, callTime),
        shiftTime: localDateAndTimeToUTC(formData.shiftDate, shiftTime)
      });

      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: data.message ?? 'Callout Created Successfully'
      });
      resetFormData();
      callback?.(data?.data as CallOutWithAssociations);
    } catch (error) {
      console.error('Error Creating Callout:\n', error);
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

  const resetFormData = (employeeId?: string) => {
    setFormData({...defaultFormData, employeeName: employeeId ?? ''});
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
