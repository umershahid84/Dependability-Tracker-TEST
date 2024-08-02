import { makeToast, ToastTypes } from '../../components';
import { DefaultCallOutFormData } from '../../client-api';

export const validateEmployeeCallOut = (formData: DefaultCallOutFormData): boolean => {
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

  // find the id of the Leave Type Tardiness
  const missingLeftEarlyOrLateArrival =
    formData.lateArrivalMinutes == 0 && formData.leftEarlyMinutes == 0;

  const selectLeaveTypeEl = document.querySelector<HTMLSelectElement>('select[name="leaveType"]');
  const leaveTypeOptions =
    Array.from(
      (selectLeaveTypeEl?.querySelectorAll('option') as NodeListOf<HTMLOptionElement>) ?? []
    ) ?? [];

  const leftEarlyOption = leaveTypeOptions.find(option => option.textContent === 'Left Early');
  const tardinessOption = leaveTypeOptions.find(option => option.textContent === 'Tardiness');
  const tardinessId = tardinessOption?.value;
  const leftEarlyId = leftEarlyOption?.value;

  try {
    // if leave type is Tardiness, check if late arrival or left early minutes are missing
    if (
      !missingFields.includes('leaveType') &&
      formData.leaveType == tardinessId &&
      missingLeftEarlyOrLateArrival
    ) {
      throw new Error(
        'A Leave Type of Tardiness requires a non-zero value for Late Arrival Minutes or Left Early Minutes'
      );
    }

    // make sure the shift date is not before the call date
    // find the difference between the shift date and call date
    const callDate = new Date(formData.callDate);
    const shiftDate = new Date(formData.shiftDate);

    const dayDifference = shiftDate.getDate() - callDate.getDate();
    const monthDifference = shiftDate.getMonth() - callDate.getMonth();
    const yearDifference = shiftDate.getFullYear() - callDate.getFullYear();

    if (yearDifference < 0 || monthDifference < 0 || dayDifference < 0) {
      throw new Error('Shift Date cannot be before the Call Date');
    }
    // if leave type is Left Early, check if left early minutes are missing
    if (
      !missingFields.includes('leaveType') &&
      formData.leaveType == leftEarlyId &&
      !formData.leftEarlyMinutes
    ) {
      missingFields.push('leftEarly');
    }

    if (missingFields.length) {
      throw new Error(
        `Missing fields: ${missingFields
          .map(field =>
            field
              .replace(/([A-Z])/g, ' $1')
              .trim()
              .split(' ')
              .map(word => word[0].toUpperCase() + word.slice(1))
              .join(' ')
          )
          .join(', ')}`
      );
    }

    return true;
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: String(error)
    });

    return false;
  }
};
