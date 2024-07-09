import {SignUpForm} from '@/components';
import Toaster from '@/components/Toaster';

const styles = {
  h1: 'text-3xl md:text-4xl font-bold  mb-2 text-center mt-20',
  main: 'flex min-h-screen flex-col items-center justify-start p-24'
};

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.h1}>EMPLOYEE DEPENDABILITY</h1>
        <section>
          <h2 className="text-2xl font-bold text-center my-12">Create Account</h2>

          <SignUpForm />
        </section>
      </main>
      <Toaster />
    </>
  );
}
