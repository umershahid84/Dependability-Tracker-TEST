import {useEffect, useState} from 'react';
import {useIsMounted} from '../../../../hooks';
import {CallOutsListItemAccordion} from '../CallOutsListItemAccordion';
import {getDate, getTime, getTimeNoSeconds} from '../../../../lib/utils';
import {CallOutWithAssociations} from '../../../../lib/db/models/Callout';

const styles = {
  calloutHeader: 'ml-2  w-3/4 flex flex-col justify-center p-2',
  span: 'w-auto p-1 flex flex-row justify-between gap-3 mt-2 ',
  div: 'rounded-md employee drop-shadow-md toggle-container w-full',
  flex: 'flex justify-between items-center p-2 cursor-pointer bg-slate-800 hide-on-print rounded-md',
  button: 'toggle-details px-2 py-1 bg-slate-400 hover:bg-[var(--green)] text-white rounded mr-2 '
};

export function CallOutsListItem({callOut}: Readonly<{callOut: CallOutWithAssociations}>) {
  const isMounted: boolean = useIsMounted();
  const [show, setShow] = useState<boolean>(false);

  const toggleDetails = () => {
    setShow(prev => !prev);
  };

  const handleBeforePrint = () => {
    setShow(true);
  };

  const handleAfterPrint = () => {
    setShow(false);
  };

  useEffect(() => {
    if (isMounted) {
      //listen for print event to show details
      window.addEventListener('beforeprint', handleBeforePrint);
      window.addEventListener('afterprint', handleAfterPrint);

      //listen for after print event to hide details

      return () => {
        window.removeEventListener('beforeprint', handleBeforePrint);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [isMounted]);

  return (
    <div className={styles.div}>
      <div className={styles.flex}>
        <header className={styles.calloutHeader}>
          <p>
            Call Date: {getDate(callOut.callout_date)} @ {getTimeNoSeconds(callOut.callout_time)}
          </p>{' '}
          <p>Employee: {callOut.employee.name}</p>
          <p>Entered By: {callOut.supervisor.supervisor_info.name}</p>
          <p>Reason: {callOut.leaveType.reason}</p>
          <br />
          <p className="text-gray-400 text-sm">
            Created: {getDate(callOut.createdAt)} @ {getTime(callOut.createdAt)}
          </p>
          <p className="text-gray-400 text-sm">
            Last Updated: {getDate(callOut.updatedAt)} @ {getTime(callOut.updatedAt)}
          </p>
        </header>
        <div>
          <button type="button" className={styles.button} onClick={toggleDetails}>
            Details
          </button>
        </div>
      </div>

      <CallOutsListItemAccordion callOut={callOut} show={show} />
    </div>
  );
}
