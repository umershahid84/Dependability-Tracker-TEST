import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {Logo} from '../Logo';
import Spinner, {SpinnerStyles} from '../Spinner';
import {useKioskCallOuts} from '../../hooks';
import type {KioskCallOut} from '../../pages/api/kiosk/callouts';
import {kioskDivisions, type KioskDivisionSlug} from '../../lib/utils/shared/kioskDivisions';

const styles = {
  main: 'min-h-screen w-full bg-primary flex flex-col items-center px-6 py-8',
  header: 'w-full flex flex-col items-center gap-2 mb-6',
  title: 'text-4xl md:text-5xl font-bold text-primary text-center tracking-wide',
  subtitle: 'text-lg text-tertiary text-center',
  nav: 'w-full flex flex-wrap items-center justify-center gap-3 mb-8 hide-on-print',
  navLink: 'px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide',
  navLinkActive: 'bg-accent-primary text-primary',
  navLinkInactive: 'bg-secondary text-tertiary hover:bg-tertiary',
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

function KioskNav({activeSlug}: Readonly<{activeSlug?: KioskDivisionSlug}>) {
  const router = useRouter();
  const isAllActive = router.pathname === '/kiosk';

  return (
    <nav className={styles.nav}>
      <Link
        href="/kiosk"
        className={`${styles.navLink} ${isAllActive ? styles.navLinkActive : styles.navLinkInactive}`}>
        All Divisions
      </Link>
      {kioskDivisions.map(division => (
        <Link
          key={division.slug}
          href={`/kiosk/${division.slug}`}
          className={`${styles.navLink} ${
            activeSlug === division.slug ? styles.navLinkActive : styles.navLinkInactive
          }`}>
          {division.name}
        </Link>
      ))}
    </nav>
  );
}

export type KioskCallOutBoardProps = {
  division?: KioskDivisionSlug;
};

export function KioskCallOutBoard({division}: Readonly<KioskCallOutBoardProps>) {
  const {callOuts, isLoading} = useKioskCallOuts(division);
  const [now, setNow] = useState<Date | null>(null);

  const divisionName = kioskDivisions.find(el => el.slug === division)?.name;
  const title = divisionName ? `${divisionName.toUpperCase()} CALLOUTS` : 'EMPLOYEE CALLOUTS';

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Logo />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>
          Callouts entered in the last 24 hours{now ? ` — ${now.toLocaleString()}` : ''}
        </p>
      </header>

      <KioskNav activeSlug={division} />

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
