import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trim } from '../../lib/utils/shared/strings';

const navClasses = trim(`w-full flex flex-wrap flex-row justify-center items-center gap-6 md:gap-16 
                    hide-on-print mt-20 sm:mt-8`);
const linkClasses = `hover:scale-110 text-lg text-primary print:text-black text-center rounded-md text-center`;
const activeLinkClass = 'text-accent text-lg underline underline-offset-8 text-center';
const adminClassName = trim(`absolute top-32 sm:top-2 right-[115px] p-2 rounded-md 
                        hover:bg-accent-primary bg-tertiary hide-on-print bg-tertiary hover:text-white`);

export type NavLinks = { href: string; text: string }[];

type NavLinksProps = { navLinks: NavLinks };

function NavLinks({ navLinks }: Readonly<NavLinksProps>) {
  const router = useRouter();
  return (
    <>
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={router.pathname === link.href ? activeLinkClass : linkClasses}>
          <strong>{link.text}</strong>
        </Link>
      ))}
    </>
  );
}

function SecondaryLinks({ links }: Readonly<{ links: NavLinks }>) {
  return (
    <>
      {links.map(link => (
        <Link key={link.href} href={link.href} className={adminClassName}>
          {link.text}
        </Link>
      ))}
    </>
  );
}

export type NavBarProps = {
  navLinks: NavLinks;
  hideOnPath?: string;
  showSecondary?: boolean;
  secondaryLinks: NavLinks;
  hideSecondaryOnPath?: string;
};
export function NavBar({
  navLinks,
  hideOnPath,
  showSecondary,
  secondaryLinks,
  hideSecondaryOnPath
}: Readonly<NavBarProps>) {
  const router = useRouter();
  return (
    <nav className={navClasses}>
      {hideOnPath && typeof hideOnPath === 'string' ? (
        router.pathname !== hideOnPath && <NavLinks navLinks={navLinks} />
      ) : (
        <NavLinks navLinks={navLinks} />
      )}
      {showSecondary &&
        (hideSecondaryOnPath ? (
          router.pathname !== hideSecondaryOnPath && <SecondaryLinks links={secondaryLinks} />
        ) : (
          <SecondaryLinks links={secondaryLinks} />
        ))}
    </nav>
  );
}
