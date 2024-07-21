import {NextRouter} from 'next/router';
import {makeToast, ToastTypes} from '../../components';

export const Logout = async (router: NextRouter) => {
  try {
    const response = await fetch('/api/logout');
    if (!response.ok) {
      throw new Error('Error logging out of account.');
    } else {
      const data = await response.json();

      makeToast({
        title: 'Success',
        type: ToastTypes.Success,
        message: data.message,
        timeOut: 1500
      });

      setTimeout(() => {
        router.push('/login');
      }, 250);
    }
  } catch (error) {
    makeToast({
      title: 'Error',
      type: ToastTypes.Error,
      message: 'There was an error logging out of your account. Please try again.',
      timeOut: 2500
    });
  }
};
