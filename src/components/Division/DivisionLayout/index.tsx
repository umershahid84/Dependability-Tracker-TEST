import React from 'react';
import {NavBar, NavLinks} from '../../NavBar';
import {SupervisorLayout} from '../../SupervisorLayout';

const supervisorLinks: NavLinks = [
  {href: '/dashboard', text: 'Home'},
  {href: '/divisions/public-parking', text: 'Public Parking'},
  {href: '/divisions/employee-parking', text: 'Employee Parking'},
  {href: '/divisions/ground-transportation', text: 'Ground Transportation'}
];

const adminLinks: NavLinks = [{href: '/admin/dashboard', text: 'Admin Home'}];

export function DivisionLayout({
  children,
  isAdmin
}: Readonly<{
  isAdmin?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <SupervisorLayout>
      <NavBar
        hideOnPath="/dashboard"
        showSecondary={isAdmin}
        secondaryLinks={adminLinks}
        navLinks={supervisorLinks}
      />
      {children}
    </SupervisorLayout>
  );
}
