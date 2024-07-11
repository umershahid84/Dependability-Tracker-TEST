import React from 'react';
import Link from 'next/link';
import {Request} from 'express';
import {DivisionLayout} from '@/components';
import {InferGetServerSidePropsType} from 'next';
import {removeExtraWhiteSpaces} from '@/lib/utils/shared/strings';
import {getTokenForServerSideProps, IJwtPayload, ClientSidePayload, Redirect} from '@/auth';

const styles = {
  h1: 'text-3xl md:text-4xl font-bold  mb-2 text-center mt-16',
  main: 'flex h-full w-full flex-col items-center justify-start',
  userGreetings: 'text-2xl font-bold text-center my-12',
  section: 'w-full max-w-2xl min-h-[75vh] flex flex-col justify-start items-center',
  div: `w-full flex flex-wrap flex-row justify-center items-center mt-8
        sm:mt-12 gap-8 sm:gap-12`,
  link: `bg-[var(--green)] dark:bg-slate-800 rounded-md p-10 hover:bg-black 
        dark:hover:bg-[var(--green)] text-white hover:scale-110 drop-shadow-md text-lg 
        whitespace-normal w-48 text-center Text-outline`
};

const links: {href: string; text: string}[] = [
  {href: '/divisions/public-parking', text: 'Public <br /> Parking'},
  {href: '/divisions/employee-parking', text: 'Employee Parking'},
  {href: '/divisions/ground-transportation', text: 'Ground Transportation'}
];
const linkClasses: string = removeExtraWhiteSpaces(styles.link);

function DashboardLinks() {
  return (
    <div className={removeExtraWhiteSpaces(styles.div)}>
      {links.map((link, index) => (
        <Link key={index} href={link.href} className={linkClasses}>
          <strong dangerouslySetInnerHTML={{__html: link.text}} />
        </Link>
      ))}
    </div>
  );
}

export default function SupervisorLandingPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <DivisionLayout>
      <main className={styles.main}>
        <h1 className={styles.h1}>EMPLOYEE DEPENDABILITY - DASHBOARD</h1>
        <section className={styles.section}>
          <h2 className={styles.userGreetings}>Welcome back, {props?.user?.username ?? 'Guest'}</h2>
          <div className={removeExtraWhiteSpaces(styles.div)}>
            <DashboardLinks />
          </div>
        </section>
      </main>
    </DivisionLayout>
  );
}

export const getServerSideProps = async (request: {req: Request}) => {
  const token: IJwtPayload | Redirect | undefined = getTokenForServerSideProps(request);

  const isAdmin = token && 'isAdmin' in token ? token.isAdmin : false;
  const username = token && 'username' in token ? token.username : '';

  const clientProps: ClientSidePayload = {
    isAdmin,
    username
  };

  return {
    props: {
      user: {...clientProps}
    }
  };
};
