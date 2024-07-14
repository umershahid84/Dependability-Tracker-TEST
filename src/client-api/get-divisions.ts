import {makeToast, ToastTypes} from '../components';

export const getDivisions = async () => {
  const response = await fetch('/api/admin/divisions');

  if (!response.ok) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: 'Failed to fetch divisions for Add Employee form'
    });
    return [];
  }

  const {data} = await response.json();
  return data;
};
