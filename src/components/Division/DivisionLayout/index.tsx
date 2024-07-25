import React, {useEffect} from 'react';
import {NavBar, NavLinks} from '../../NavBar';
import {NextRouter, useRouter} from 'next/router';
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
  const router: NextRouter = useRouter();
  const [navLinks, setNavLinks] = React.useState<NavLinks>(supervisorLinks);

  useEffect(() => {
    const existingLink = navLinks.find(link => link.text === 'Generate Report');

    if (!existingLink && router.pathname !== '/dashboard') {
      const newLink = {
        href: !router.pathname.includes('reports') ? `${router.pathname}/reports` : router.pathname,
        text: 'Generate Report'
      };
      setNavLinks([...navLinks, newLink]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return (
    <SupervisorLayout>
      <NavBar
        navLinks={navLinks}
        hideOnPath="/dashboard"
        showSecondary={isAdmin}
        secondaryLinks={adminLinks}
      />
      {children}
    </SupervisorLayout>
  );
}
