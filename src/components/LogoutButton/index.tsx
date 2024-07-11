import React from 'react';
import {NextRouter, useRouter} from 'next/router';
import {makeToast, ToastTypes} from '@/components';
import {removeExtraWhiteSpaces} from '@/lib/utils/shared/strings';

const styles = {
  logout: `absolute top-2 right-2 p-3 rounded-md tracking-wide text-xl hover:bg-[var(--green)]
           Text-outline bg-slate-700`
};

export const logoutHandler = async (router: NextRouter) => {
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
        timeOut: 7500
      });

      setTimeout(() => {
        router.push('/login');
      }, 800);
    }
  } catch (error) {
    makeToast({
      title: 'Error',
      type: ToastTypes.Error,
      message: 'There was an error logging out of your account. Please try again.',
      timeOut: 7500
    });
  }
};

export const LogoutButton = ({className}: {className?: string}) => {
  const router: NextRouter = useRouter();
  return (
    <button
      type="button"
      onClick={() => logoutHandler(router)}
      className={className ?? removeExtraWhiteSpaces(styles.logout)}>
      Logout
    </button>
  );
};
