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
import {parseDateInput, parseTimeInput, toUTCString, formatDate} from '../../lib/utils';

export type UseCreateCallOutFormState = {
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

/**
 * Simplified function to combine date and time into UTC ISO string
 */
export function localDateAndTimeToUTC(date: Date | string, time: string): string {
  // Convert date to YYYY-MM-DD string
  let dateStr: string;
  if (date instanceof Date) {
    dateStr = formatDate(date);
  } else {
    dateStr = date;
  }

  // Parse the date and time
  const parsedDate = parseDateInput(dateStr);
  if (!parsedDate) {
    throw new Error('Invalid date input');
  }

  const parsedTime = parseTimeInput(time);
  if (!parsedTime) {
    throw new Error('Invalid time input');
  }

  // Set the time on the date
  parsedDate.setHours(parsedTime.hours, parsedTime.minutes, parsedTime.seconds, 0);

  // Convert to UTC ISO string
  return toUTCString(parsedDate);
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
    
    // Convert date input strings to Date objects in local timezone
    if ((name === 'callDate' || name === 'shiftDate') && value) {
      const localDate = parseDateInput(value);
      if (localDate) {
        setFormData(prevFormData => ({...prevFormData, [name]: localDate}));
      }
    } else {
      setFormData(prevFormData => ({...prevFormData, [name]: value}));
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
      const callDateStr =
        formData.callDate instanceof Date
          ? formData.callDate.toISOString().split('T')[0]
          : formData.callDate;

      const shiftDateStr =
        formData.shiftDate instanceof Date
          ? formData.shiftDate.toISOString().split('T')[0]
          : formData.shiftDate;

      const data = await CreateEmployeeCallOut({
        formData,
        callTime: localDateAndTimeToUTC(callDateStr, callTime),
        shiftTime: localDateAndTimeToUTC(shiftDateStr, shiftTime)
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
