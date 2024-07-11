import {dateToHH_MM_SS_sss} from '@/lib/utils';

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

export const getDefaultFormData = (): DefaultCallOutFormData => {
  const now = new Date();
  return {
    comment: '',
    leaveType: '',
    callDate: now,
    shiftDate: now,
    employeeName: '',
    leftEarlyMinutes: 0,
    lateArrivalMinutes: 0,
    shiftTime: dateToHH_MM_SS_sss(now),
    callTime: dateToHH_MM_SS_sss(now)
  };
};
