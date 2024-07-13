import React from 'react';
import Link from 'next/link';
import {trim} from '../../lib/utils/shared/strings';

const styles = {
  div: `w-full flex flex-wrap flex-row justify-center items-center mt-8
        sm:mt-12 gap-8 sm:gap-12`,
  link: `bg-slate-800 rounded-md p-10 hover:bg-[var(--green)] text-white
         hover:scale-110 drop-shadow-md text-lg whitespace-normal w-48 
         text-center Text-outline`
};

const links: {href: string; text: string}[] = [
  {href: '/divisions/public-parking', text: 'Public <br /> Parking'},
  {href: '/divisions/employee-parking', text: 'Employee Parking'},
  {href: '/divisions/ground-transportation', text: 'Ground Transportation'}
];

const linkClasses: string = trim(styles.link);

export function DashboardLinks() {
  return (
    <div className={trim(styles.div)}>
      {links.map((link, index) => (
        <Link key={index} href={link.href} className={linkClasses}>
          <strong dangerouslySetInnerHTML={{__html: link.text}} />
        </Link>
      ))}
    </div>
  );
}
