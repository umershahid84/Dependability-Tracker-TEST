import React from 'react';
import {Request} from 'express';
import {Layout, SignUpForm} from '../../components';
import {getCreateCredentialsInviteFromDB} from '../../lib/db/controller';

const styles = {
  h3: 'text-xl font-bold text-center my-6',
  h2: 'text-2xl font-bold text-center my-12',
  h1: 'text-3xl md:text-4xl font-bold mb-2 text-center mt-16',
  main: 'flex min-h-screen flex-col items-center justify-start'
};

export const getServerSideProps = async (request: {req: Request}) => {
  const queryParameters = request.req.query;
  const inviteId = queryParameters['invite-id'] as string;

  const credentialInvite = await getCreateCredentialsInviteFromDB({id: inviteId});
  const assignedEmail: string | undefined = credentialInvite?.email;
  const supervisorName = credentialInvite?.supervisor_info?.supervisor_info?.name ?? 'Supervisor';

  return {
    props: {
      supervisorName: supervisorName,
      assignedEmail: assignedEmail ?? null
    }
  };
};

export default function Home(
  props: Readonly<{supervisorName: string; assignedEmail?: string | null}>
) {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.h1}>Employee Dependability</h1>
        <section>
          <h2 className={styles.h2}>
            Welcome, <span className="ml-1">{props.supervisorName}!</span>
          </h2>
          <h3 className={styles.h3}>Create Login Credentials</h3>
          <SignUpForm assignedEmail={props?.assignedEmail ?? undefined} />
        </section>
      </main>
    </Layout>
  );
}
