import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';

const basicLinks = [
  {href: '/admin/dashboard', text: 'Home'},
  {href: '/admin/employees', text: 'Employees'},
  {href: '/admin/callouts', text: 'CallOuts'}
];

const linkClasses = `hover:scale-110 text-lg 
 text-gray-300 text-center rounded-md text-center`;

const activeLinkClass = 'text-[var(--green)] text-lg underline underline-offset-8 text-center';

function AdminNavLinks() {
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

export default function AdminNavBar() {
  return (
    <nav className="w-full flex flex-wrap flex-row justify-center items-center gap-6 md:gap-16 ">
      <AdminNavLinks />
    </nav>
  );
}
