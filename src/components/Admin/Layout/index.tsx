import React from 'react';
import {Logo} from '../../Logo';
import AdminNavBar from '../NavBar';
import {LogoutButton} from '../../LogoutButton';

const styles = {
  header: 'w-full h-auto flex flex-col gap-8',
  body: ' bg-slate-950 text-gray-200 flex min-h-full flex-col items-center justify-start p-5 '
};

export function AdminLayout({children, isAdmin}: {children: React.ReactNode; isAdmin?: boolean}) {
  return (
    <div className={styles.body}>
      <LogoutButton />
      <header className={styles.header}>
        <Logo />
        <h1 className="text-center text-3xl">
          <strong>Admin Portal</strong>
        </h1>
        <AdminNavBar />
      </header>
      {children}
    </div>
  );
}
