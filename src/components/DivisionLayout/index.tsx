import {Logo} from '../Logo';
import NavBar from '../NavBar';
import {Toaster} from '@/components';
import {LogoutButton} from '../LogoutButton';
import React, {PropsWithChildren} from 'react';

const styles = {
  header: 'w-full h-auto flex flex-col gap-8',
  body: ' bg-slate-950 text-gray-200 flex min-h-full flex-col items-center justify-start p-5 '
};

export function DivisionLayout({children}: PropsWithChildren) {
  return (
    <div className={styles.body}>
      <Toaster />
      <LogoutButton />
      <header className={styles.header}>
        <Logo />
        <NavBar />
      </header>
      {children}
    </div>
  );
}
