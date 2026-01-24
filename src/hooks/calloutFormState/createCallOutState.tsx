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
  resetFormData: () => void;
  handleFormSubmit: (e: React.SyntheticEvent) => Promise<void>;
  handleCallTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShiftTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCallOutFormData>>;
  onChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};
// export function localDateAndTimeToUTC(date: Date | string, time: string): string {
//   const d = date instanceof Date ? date : new Date(date);

//   if (Number.isNaN(d.getTime())) {
//     throw new TypeError('Invalid date input');
//   }

//   const y = d.getFullYear();
//   const m = d.getMonth();
//   const day = d.getDate();

//   const [hh, mm, ss = 0] = time.split(':').map(Number);

//   const localDate = new Date(y, m, day, hh, mm, ss);
//   return localDate.toISOString();
// }

export function localDateAndTimeToUTC(date: Date | string, time: string): string {
  // If it's a Date object, extract just the date portion in local timezone
  let dateStr: string;
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  } else {
    dateStr = date;
  }

  // Parse the date string and time to create a local datetime
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hh, mm, ss = 0] = time.split(':').map(Number);

  // Create date in local timezone
  const localDate = new Date(year, month - 1, day, hh, mm, ss);

  // Convert to ISO string (UTC)
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
