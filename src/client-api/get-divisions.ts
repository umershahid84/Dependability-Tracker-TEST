import {makeToast, ToastTypes} from '../components';

export const getDivisions = async () => {
  try {
    const response = await fetch('/api/admin/divisions');

    if (!response.ok) {
      throw new Error('Failed to fetch divisions');
    }

    const {data} = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: 'Failed to fetch divisions for Add Employee form'
    });
    return [];
  }
};
