import React from 'react';
import {Request} from 'express';
import {InferGetServerSidePropsType} from 'next';
import {DivisionLayout, DashboardLinks} from '../../components';
import {getTokenForServerSideProps, JwtPayload, ClientSidePayload, Redirect} from '../../auth';

const styles = {
  userGreetings: 'text-2xl font-bold text-center my-12',
  h1: 'text-3xl md:text-4xl font-bold  mb-2 text-center mt-16',
  main: 'flex h-full w-full flex-col items-center justify-start',
  section: 'w-full max-w-2xl min-h-[75vh] flex flex-col justify-start items-center'
};

function SupervisorMain({children, user}: {children: React.ReactNode; user: ClientSidePayload}) {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>EMPLOYEE DEPENDABILITY - DASHBOARD</h1>
      <section className={styles.section}>
        <h2 className={styles.userGreetings}>Welcome back, {user?.username ?? 'Guest'}</h2>
        {children}
      </section>
    </main>
  );
}

export default function SupervisorLandingPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <DivisionLayout isAdmin={props?.user?.isAdmin ?? false}>
      <SupervisorMain user={props.user}>
        <DashboardLinks />
      </SupervisorMain>
    </DivisionLayout>
  );
}

export const getServerSideProps = async (request: {req: Request}) => {
  const token: JwtPayload | Redirect | undefined = getTokenForServerSideProps(request);

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
