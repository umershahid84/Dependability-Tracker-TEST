import {dateTo_HH_MM_SS} from '../lib/utils';
import {ApiData} from '../lib/apiController';
import {makeToast, ToastTypes} from '../components';
import {CallOutWithAssociations} from '../lib/db/models/Callout';

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

export type EmployeeCallOutProps = {
  callTime: string;
  shiftTime: string;
  formData: DefaultCallOutFormData;
  defaultFormData: DefaultCallOutFormData;
  callback?: (data: CallOutWithAssociations) => void;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCallOutFormData>>;
};

export const EmployeeCallOut = async ({
  callback,
  callTime,
  formData,
  shiftTime,

  setFormData,
  defaultFormData
}: EmployeeCallOutProps) => {
  try {
    const result = await fetch('/api/employee-callout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        callTime,
        shiftTime
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
