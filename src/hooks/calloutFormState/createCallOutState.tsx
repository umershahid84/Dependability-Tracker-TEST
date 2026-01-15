import React, { useEffect, useState } from 'react';
import { validateEmployeeCallOut } from './helpers';
import { makeToast, ToastTypes } from '../../components';
import { CallOutWithAssociations } from '../../lib/db/models/Callout';
import { UseIncrementingTime, useIncrementingTime, useIsMounted } from '../../hooks';
import { ClientAPI, DefaultCallOutFormData, getDefaultCallOutFormData } from '../../client-api';

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

export function useCreateCallOutFormState(
  callback?: (data: CallOutWithAssociations) => void
): UseCreateCallOutFormState {
  const isMounted = useIsMounted();
  const incrementingCallTime: UseIncrementingTime = useIncrementingTime();
  const incrementingShiftTime: UseIncrementingTime = useIncrementingTime();
  // Initialize with a placeholder date to avoid hydration mismatch
  const [formData, setFormData] = useState<DefaultCallOutFormData>(() => getDefaultCallOutFormData());

  const callTime: string = incrementingCallTime.time;
  const shiftTime: string = incrementingShiftTime.time;

  // Update dates on client side after mount to ensure correct timezone
  useEffect(() => {
    if (isMounted) {
      const clientFormData = getDefaultCallOutFormData();
      setFormData(clientFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    incrementingCallTime.clearTimeInterval();
    incrementingShiftTime.clearTimeInterval();
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formValidated = validateEmployeeCallOut(formData);
    if (!formValidated) {
      return;
    }

    try {
      // Convert date strings back to Date objects to preserve user's timezone
      // When user changes date input, it becomes a string like "2026-01-14"
      // We need to convert it to a Date object in their local timezone
      const submissionData = {
        ...formData,
        callDate: typeof formData.callDate === 'string' 
          ? new Date(formData.callDate.replace(/-/g, '/')) // Use / instead of - for local timezone parsing
          : formData.callDate,
        shiftDate: typeof formData.shiftDate === 'string'
          ? new Date(formData.shiftDate.replace(/-/g, '/'))
          : formData.shiftDate
      };

      const data = await ClientAPI.Employees.CallOuts.Create({
        formData: submissionData,
        callTime,
        shiftTime
      });

      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: data.message ?? 'Callout Created Successfully'
      });
      resetFormData();
      callback?.(data?.data as CallOutWithAssociations);
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
    setFormData(getDefaultCallOutFormData());
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
