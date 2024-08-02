import { useEffect, useState } from 'react';
import { useIsMounted } from '../../../hooks';
import { EmployeeRoles } from '../../Employees/EmployeeRoles';
import { SupervisorStatusHeader } from './SupervisorStatusHeader';
import { SupervisorListItemAccordion } from './SupervisorListItemAccordion';
import type { SupervisorWithAssociations } from '../../../lib/db/models/types';

const styles = {
  ml: 'ml-2',
  infoContainer: 'ml-2',
  span: 'w-auto p-1 flex flex-row justify-between gap-3 mt-2',
  div: 'rounded-md employee drop-shadow-md toggle-container w-full relative',
  button: 'toggle-details px-2 py-1 bg-quinary  hover:bg-accent-primary text-primary rounded mr-2 ',
  flex: 'flex justify-between items-center p-2 cursor-pointer bg-tertiary hide-on-print rounded-md'
};

export function SupervisorListItem({
  supervisor,
  onModalEditCallBack,
  onModalDeleteCallBack
}: Readonly<{
  supervisor: SupervisorWithAssociations;
  onModalDeleteCallBack: (supervisorId: string) => void;
  onModalEditCallBack: (supervisor: SupervisorWithAssociations, isNew?: boolean) => void;
}>) {
  const isMounted: boolean = useIsMounted();
  const [show, setShow] = useState<boolean>(false);

  const roles: ('Supervisor' | 'Admin')[] = ['Supervisor'];
  if (supervisor.is_admin) {
    roles.push('Admin');
  }

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
        <div className={styles.ml}>
          <p>{supervisor.supervisor_info.name}</p>
          <span className={styles.span}>
            <EmployeeRoles roles={roles} />
          </span>
        </div>
        <div>
          <button type="button" className={styles.button} onClick={toggleDetails}>
            Details
          </button>
        </div>
      </div>
      <SupervisorStatusHeader {...supervisor} />
      <SupervisorListItemAccordion
        supervisor={supervisor}
        show={show}
        roles={roles}
        onModalEditCallBack={onModalEditCallBack}
        onModalDeleteCallBack={onModalDeleteCallBack}
      />
    </div>
  );
}
