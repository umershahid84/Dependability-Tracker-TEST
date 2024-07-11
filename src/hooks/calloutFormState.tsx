import {useIsMounted} from '@/hooks';
import {dateTo_HH_MM_SS} from '@/lib/utils';
import React, {useEffect, useState} from 'react';
import {makeToast, ToastTypes} from '@/components';

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
    shiftTime: dateTo_HH_MM_SS(now),
    callTime: dateTo_HH_MM_SS(now)
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

export function useCallOutFormState() {
  const isMounted = useIsMounted();
  const defaultFormData = getDefaultCallOutFormData();
  const [callTime, setCallTime] = useState<string>(dateTo_HH_MM_SS(new Date()));
  const [formData, setFormData] = useState<DefaultCallOutFormData>(defaultFormData);
  const [callTimeInterval, setCallTimeInterval] = useState<NodeJS.Timeout | null>(null);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleCallTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    callTimeInterval && clearInterval(callTimeInterval);
    setCallTime(value);
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

    const data = await result.json();

    if (!result.ok) {
      makeToast({
        title: 'Error',
        type: ToastTypes.Error,
        message: data.error,
        timeOut: 7500
      });
    } else {
      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: data.message
      });

      setFormData(defaultFormData);
    }
  };

  useEffect(() => {
    isMounted &&
      setCallTimeInterval(
        setInterval(() => {
          const now = new Date();
          setCallTime(dateTo_HH_MM_SS(now));
        }, 1000)
      );
    return () => {
      callTimeInterval && clearInterval(callTimeInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const resetFormData = () => {
    setFormData(getDefaultCallOutFormData());
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
