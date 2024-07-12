import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

const basicLinks = [
  {href: '/dashboard', text: 'Home'},
  {href: '/divisions/public-parking', text: 'Public Parking'},
  {href: '/divisions/employee-parking', text: 'Employee Parking'},
  {href: '/divisions/ground-transportation', text: 'Ground Transportation'}
];

const adminLinks = [{href: '/admin/dashboard', text: 'Admin Home'}];

const linkClasses = `hover:scale-110 text-lg 
 text-gray-300 text-center rounded-md text-center`;

const activeLinkClass = 'text-[var(--green)] text-lg underline underline-offset-8 text-center';

function NavLinks() {
  const router = useRouter();
  return (
    router.pathname !== '/dashboard' && (
      <>
        {basicLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={router.pathname === link.href ? activeLinkClass : linkClasses}>
            <strong>{link.text}</strong>
          </Link>
        ))}
      </>
    )
  );
}

function AdminLinks() {
  const router = useRouter();

  let className = router.pathname === '/admin/dashboard' ? activeLinkClass : linkClasses;

  className +=
    ' absolute top-28 sm:top-2 right-[155px] p-3 rounded-md tracking-wide text-xl hover:bg-[var(--green)] Text-outline bg-slate-700';

  return (
    router.pathname !== '/admin/dashboard' && (
      <>
        {adminLinks.map((link, index) => (
          <Link key={index} href={link.href} className={className}>
            <strong>{link.text}</strong>
          </Link>
        ))}
      </>
    )
  );
}

export default function DivisionNavBar(props: {isAdmin?: boolean}) {
  return (
    <nav className="w-full flex flex-wrap flex-row justify-center items-center gap-6 md:gap-16 ">
      <NavLinks />
      {props.isAdmin && <AdminLinks />}
    </nav>
  );
}
