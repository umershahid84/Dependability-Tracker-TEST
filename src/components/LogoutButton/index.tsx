import {useIsMounted} from '../../hooks';
import React, {useEffect} from 'react';
import {trim} from '../../lib/utils/shared/strings';
import {NextRouter, useRouter} from 'next/router';
import {makeToast, ToastTypes} from '../../components';

const styles = {
  logout: `absolute top-28 sm:top-2 right-2 p-3 rounded-md tracking-wide text-xl hover:bg-[var(--green)]
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
  const isMounted: boolean = useIsMounted();

  const handleMetaShiftL = (event: KeyboardEvent) => {
    if ((event.key === 'l' || event.key === 'L') && event.metaKey && event.shiftKey) {
      logoutHandler(router);
    }
  };
  useEffect(() => {
    isMounted && window.addEventListener('keydown', handleMetaShiftL);

    return () => {
      !isMounted && window.removeEventListener('keydown', handleMetaShiftL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return (
    <button
      type="button"
      onClick={() => logoutHandler(router)}
      className={className ?? trim(styles.logout)}>
      Logout
    </button>
  );
};
