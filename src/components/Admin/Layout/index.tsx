import React from 'react';
import { ModalViewer } from '../../Modal';
import { NavBar, NavLinks } from '../../NavBar';
import { SupervisorLayout } from '../../SupervisorLayout';
import { CallOutAdvancedSearchProvider } from '../../../providers';

const adminLinks: NavLinks = [
  { href: '/admin/dashboard', text: 'Home' },
  { href: '/admin/employees', text: 'Employees' },
  { href: '/admin/callouts', text: 'CallOuts' },
  { href: '/admin/supervisors', text: 'Supervisors' }
];
const supervisorLinks: NavLinks = [{ href: '/dashboard', text: 'Supervisor Home' }];

export function AdminLayout({ children }: Readonly<{ children?: React.ReactNode }>) {
  return (

    <CallOutAdvancedSearchProvider>
      <ModalViewer />
      <SupervisorLayout title="Admin Portal">
        <NavBar
          showSecondary={true}
          navLinks={adminLinks}
          hideOnPath="/dashboard"
          secondaryLinks={supervisorLinks}
        />
        {children}
      </SupervisorLayout>
    </CallOutAdvancedSearchProvider>

  );
}
