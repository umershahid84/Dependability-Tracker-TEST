import { useEffect, useState } from 'react';
import { useIsMounted } from '../../../../hooks';
import { CallOutsListItemAccordion } from '../CallOutsListItemAccordion';
import { getDate, getTime, getTimeNoSeconds } from '../../../../lib/utils';
import { CallOutWithAssociations } from '../../../../lib/db/models/Callout';

const styles = {
  calloutHeader: 'ml-2 w-3/4 flex flex-col justify-center p-2',
  span: 'w-auto p-1 flex flex-row justify-between gap-3 mt-2 ',
  div: 'rounded-md employee drop-shadow-md toggle-container w-full',
  flex: 'flex justify-between items-center  cursor-pointer bg-tertiary hide-on-print rounded-md',
  button: 'toggle-details px-2 py-1 bg-quinary hover:bg-accent-primary text-primary rounded mr-2 '
};

export type CallOutsListItemProps = {
  callOut: CallOutWithAssociations;
  onModalDeleteCallBack: (callOutId: string) => void;
  onModalEditCallBack: (callOut: CallOutWithAssociations) => void;
};

export function CallOutsListItem({
  callOut,
  onModalEditCallBack,
  onModalDeleteCallBack
}: Readonly<CallOutsListItemProps>) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, callOut]);

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
          <p className="text-tertiary text-sm">
            Created: {getDate(callOut.createdAt)} @ {getTime(callOut.createdAt)}
          </p>
          <p className="text-tertiary text-sm">
            Last Updated: {getDate(callOut.updatedAt)} @ {getTime(callOut.updatedAt)}
          </p>
        </header>
        <div>
          <button type="button" className={styles.button} onClick={toggleDetails}>
            Details
          </button>
        </div>
      </div>

      <CallOutsListItemAccordion
        show={show}
        callOut={callOut}
        onModalEditCallBack={onModalEditCallBack}
        onModalDeleteCallBack={onModalDeleteCallBack}
      />
    </div>
  );
}
