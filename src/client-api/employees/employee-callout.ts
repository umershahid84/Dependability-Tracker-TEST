import {dateTo_HH_MM_SS} from '../../lib/utils';
import {ApiData} from '../../lib/apiController';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';

export type DefaultCallOutFormData = {
  callDate: Date | string;
  callTime: string;
  comment: string;
  shiftDate: Date | string;
  shiftTime: string;
  leaveType: string;
  employeeName: string;
  leftEarlyMinutes: number;
  lateArrivalMinutes: number;
};

export const getDefaultCallOutFormData = (): DefaultCallOutFormData => {
  const now = new Date();
  // Create date string in YYYY-MM-DD format for consistency with date picker
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  return {
    comment: '',
    leaveType: '',
    callDate: todayStr,
    shiftDate: todayStr,
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
};

export const CreateEmployeeCallOut = async ({
  callTime,
  formData,
  shiftTime
}: EmployeeCallOutProps): Promise<ApiData<CallOutWithAssociations>> => {
  try {
    const result = await fetch('/api/employee-callout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: formData.comment,
        leaveType: formData.leaveType,
        employeeName: formData.employeeName,
        leftEarlyMinutes: formData.leftEarlyMinutes,
        lateArrivalMinutes: formData.lateArrivalMinutes,
        callDate: formData.callDate,
        shiftDate: formData.shiftDate,
        callTime,
        shiftTime
      })
    });

    const data: ApiData<CallOutWithAssociations> = await result.json();

    if (!result.ok) {
      throw new Error(data.error);
    } else {
      return data;
    }
  } catch (error) {
    return {
      error: String(error)
    };
  }
};
