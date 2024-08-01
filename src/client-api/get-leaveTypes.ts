import { makeToast, ToastTypes } from '../components';

export const getLeaveTypes = async () => {
  try {
    const response = await fetch('/api/admin/leave-types');

    if (!response.ok) {
      throw new Error('Failed to fetch Leave Types');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    const errMessage = '❌ Error in getLeaveTypes:' + ' ' + error;
    console.error(errMessage);
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: 'Failed to fetch Leave Types'
    });
    return [];
  }
};
