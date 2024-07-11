import {useIsMounted} from '@/hooks';
import {dateTo_HH_MM_SS} from '@/lib/utils';
import React, {useEffect, useState} from 'react';
import {makeToast, ToastTypes} from '@/components';
import {ApiData} from '@/pages/api/sign-up';
import {CallOutWithAssociations} from '@/lib/db/models/Callout';

export type DefaultCallOutFormData = {
  callDate: Date;
  callTime: string;
  comment: string;
  shiftDate: Date;
  shiftTime: string;
  leaveType: string;
  employeeName: string;
  leftEarlyMinutes: number;
  lateArrivalMinutes: number;
};

export const getDefaultCallOutFormData = (): DefaultCallOutFormData => {
  const now = new Date();
  return {
    comment: '',
    leaveType: '',
    callDate: now,
    shiftDate: now,
    employeeName: '',
    leftEarlyMinutes: 0,
    lateArrivalMinutes: 0,
    callTime: dateTo_HH_MM_SS(now),
    shiftTime: dateTo_HH_MM_SS(now)
  };
};

export type UseCallOutFormState = {
  callTime: string;
  formData: DefaultCallOutFormData;
  resetFormData: () => void;
  handleFormSubmit: (e: React.SyntheticEvent) => Promise<void>;
  handleCallTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCallOutFormData>>;
  onChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
};

export function useCallOutFormState(callback?: (data: CallOutWithAssociations) => void) {
  const isMounted = useIsMounted();
  const defaultFormData = getDefaultCallOutFormData();
  const [callTime, setCallTime] = useState<string>(dateTo_HH_MM_SS(new Date()));
  const [formData, setFormData] = useState<DefaultCallOutFormData>(defaultFormData);
  const [callTimeInterval, setCallTimeInterval] = useState<NodeJS.Timeout | null>(null);

  const handleClearCallTimeInterval = () => {
    if (callTimeInterval) {
      clearInterval(callTimeInterval);
      setCallTimeInterval(null);
    }
  };

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    handleClearCallTimeInterval();
    const {name, value} = e.target;
    setFormData(prevFormData => ({...prevFormData, [name]: value}));
  };

  const handleCallTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    handleClearCallTimeInterval();
    setCallTime(value);
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // validate form data before sending
    const requiredFields = [
      'employeeName',
      'callDate',
      'shiftDate',
      'leaveType',
      'comment',
      'shiftTime',
      'callTime'
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

    try {
      const result = await fetch('/api/employee-callout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          callTime
        })
      });

      const data: ApiData<CallOutWithAssociations> = await result.json();

      if (!result.ok) {
        throw new Error(data.error);
      } else {
        makeToast({
          title: 'Success',
          type: ToastTypes.Success,
          message: data.message ?? 'Callout Created Successfully'
        });
        setFormData(defaultFormData);
        callback?.(data?.data as CallOutWithAssociations);
      }
    } catch (error) {
      makeToast({
        title: 'Error',
        type: ToastTypes.Error,
        message: String(error),
        timeOut: 7500
      });
    }
  };

  const startCallTimeInterval = () => {
    !callTimeInterval &&
      setCallTimeInterval(
        setInterval(() => {
          const now = new Date();
          setCallTime(dateTo_HH_MM_SS(now));
        }, 1000)
      );
  };

  useEffect(() => {
    isMounted && startCallTimeInterval();
    return () => {
      handleClearCallTimeInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const resetFormData = () => {
    setFormData(defaultFormData);
    startCallTimeInterval();
  };

  return {
    formData,
    callTime,
    setFormData,
    resetFormData,
    onChangeHandler,
    handleFormSubmit,
    handleCallTimeChange
  };
}
