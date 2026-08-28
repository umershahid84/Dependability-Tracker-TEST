import {useEffect, useState} from 'react';
import {Logo} from '../Logo';
import Spinner, {SpinnerStyles} from '../Spinner';
import {useKioskCallOuts} from '../../hooks';
import type {KioskCallOut} from '../../pages/api/kiosk/callouts';

const styles = {
  main: 'min-h-screen w-full bg-primary flex flex-col items-center px-6 py-8',
  header: 'w-full flex flex-col items-center gap-2 mb-8',
  title: 'text-4xl md:text-5xl font-bold text-primary text-center tracking-wide',
  subtitle: 'text-lg text-tertiary text-center',
  list: 'w-full max-w-5xl flex flex-col gap-4',
  card: 'w-full bg-secondary border-l-8 border-accent-primary rounded-md shadow-lg p-6 grid grid-cols-1 sm:grid-cols-3 gap-4',
  field: 'flex flex-col',
  fieldLabel: 'text-xs uppercase tracking-wider text-tertiary',
  fieldValue: 'text-xl font-semibold text-primary',
  employeeName: 'text-2xl font-bold text-primary sm:col-span-3',
  empty: 'text-2xl text-tertiary text-center mt-24',
  loading: 'flex items-center justify-center mt-24'
};

function CallOutCard({callOut}: Readonly<{callOut: KioskCallOut}>) {
  return (
    <div className={styles.card}>
      <p className={styles.employeeName}>{callOut.employeeName}</p>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Call Date</span>
        <span className={styles.fieldValue}>{callOut.callDate}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Call Time</span>
        <span className={styles.fieldValue}>{callOut.callTime}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Leave Type</span>
        <span className={styles.fieldValue}>{callOut.leaveType}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Shift Date</span>
        <span className={styles.fieldValue}>{callOut.shiftDate}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Shift Time</span>
        <span className={styles.fieldValue}>{callOut.shiftTime}</span>
      </div>
    </div>
  );
}

export function KioskCallOutBoard() {
  const {callOuts, isLoading} = useKioskCallOuts();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Logo />
        <h1 className={styles.title}>EMPLOYEE CALLOUTS</h1>
        <p className={styles.subtitle}>
          Callouts entered in the last 24 hours{now ? ` — ${now.toLocaleString()}` : ''}
        </p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>
          <Spinner label="Loading callouts..." textColor={SpinnerStyles.greenText} />
        </div>
      ) : callOuts.length === 0 ? (
        <p className={styles.empty}>No callouts in the last 24 hours.</p>
      ) : (
        <div className={styles.list}>
          {callOuts.map(callOut => (
            <CallOutCard key={callOut.id} callOut={callOut} />
          ))}
        </div>
      )}
    </main>
  );
}
