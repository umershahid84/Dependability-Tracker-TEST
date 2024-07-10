import React from 'react';
import {Layout} from '@/components';

const styles = {
  h1: 'text-3xl md:text-4xl font-bold  mb-2 text-center mt-16',
  main: 'flex min-h-screen flex-col items-center justify-start'
};

export default function Home() {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.h1}>EMPLOYEE DEPENDABILITY - DASHBOARD</h1>
        <section>
          <h2 className="text-2xl font-bold text-center my-12">Welcome back, phucker</h2>
        </section>
      </main>
    </Layout>
  );
}
