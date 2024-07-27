import {makeToast, ToastTypes} from '../../../components';

export const checkForCallOutUpdates = async (currentCount: number): Promise<boolean> => {
  const response = await fetch('/api/admin/dashboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({currentCount})
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const {data} = await response.json();

  return data ?? false;
};

export const getAdminDashData = async () => {
  try {
    const response = await fetch('/api/admin/dashboard');

    if (!response.ok) {
      makeToast({
        type: ToastTypes.Error,
        title: 'Error',
        message: 'Failed to fetch data'
      });
    }

    const adminData = await response.json();
    return adminData;
  } catch (error) {
    makeToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: 'Failed to fetch data'
    });
    return null;
  }
};
