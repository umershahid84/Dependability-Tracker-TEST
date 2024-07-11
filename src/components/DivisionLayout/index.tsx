import Image from 'next/image';
import NavBar from '../NavBar';
import React, {PropsWithChildren} from 'react';
import logo from '../../assets/images/seatac-dark.png';
import {makeToast, Toaster, ToastTypes} from '@/components';
import {removeExtraWhiteSpaces} from '@/lib/utils/shared/strings';
import {NextRouter, useRouter} from 'next/router';

const styles = {
  body: ' bg-slate-950 text-gray-200 flex min-h-full flex-col items-center justify-start p-5 ',
  logo: 'w-[375px] h-auto',
  header: 'w-full h-auto flex flex-col gap-16',
  logout: `absolute top-2 right-2 p-3 rounded-md tracking-wide text-xl hover:bg-[var(--green)]
           Text-outline bg-slate-700`,
  imgWidth: 350,
  imgHeight: 100
};

const logoutHandler = async (router: NextRouter) => {
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

export function DivisionLayout({children}: PropsWithChildren) {
  const router = useRouter();
  return (
    <div className={styles.body}>
      <Toaster />
      <button
        type="button"
        onClick={() => logoutHandler(router)}
        className={removeExtraWhiteSpaces(styles.logout)}>
        Logout
      </button>
      <header className={styles.header}>
        <Image
          id="logo"
          alt="SEA-TAC"
          priority
          className={styles.logo}
          width={styles.imgWidth}
          height={styles.imgHeight}
          src={logo}
        />
        <NavBar />
      </header>

      {children}
    </div>
  );
}
