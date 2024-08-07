import React from 'react';
import { Logo } from '../Logo';
import { LogoutButton } from '../LogoutButton';

const styles = {
  header: 'w-full h-auto flex flex-col gap-8',
  title: 'text-center text-3xl hide-on-print mt-16 sm:mt-0',
  body: 'bg-primary text-primary print:text-black w-full flex min-h-full flex-col items-center justify-start p-5 '
};

export type SupervisorLayoutProps = {
  title?: string;
  children: React.ReactNode;
};
export function SupervisorLayout({ title, children }: Readonly<SupervisorLayoutProps>) {
  return (

    <div className={styles.body}>
      <LogoutButton />
      <header className={styles.header}>
        <Logo />
        {title && (
          <h1 className={styles.title}>
            <strong>{title}</strong>
          </h1>
        )}
      </header>
      {children}
    </div>

  );

}
