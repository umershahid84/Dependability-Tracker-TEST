import React from 'react';
import Link from 'next/link';
import { trim } from '../../lib/utils/shared/strings';

const styles = {
  div: `w-full flex flex-wrap flex-row justify-center items-center mt-8
        sm:mt-12 gap-8 sm:gap-12`,
  link: `flex bg-tertiary rounded-md p-10 hover:bg-accent-primary text-primary
         hover:scale-110 drop-shadow-md text-lg text-balance w-48 
         text-center Text-outline`
};

const links: { href: string; text: string }[] = [
  { href: '/divisions/public-parking', text: 'Public <br /> Parking' },
  { href: '/divisions/employee-parking', text: 'Employee Parking' },
  { href: '/divisions/ground-transportation', text: 'Ground Transportation' }
];

const linkClasses: string = trim(styles.link);

export function DashboardLinks() {
  return (
    <div className={trim(styles.div)}>
      {links.map(link => (
        <Link key={link.href} href={link.href} className={linkClasses}>
          <strong
            dangerouslySetInnerHTML={{ __html: link.text }}
            className="w-full mx-auto flex flex-row justify-center items-center"
          />
        </Link>
      ))}
    </div>
  );
}
