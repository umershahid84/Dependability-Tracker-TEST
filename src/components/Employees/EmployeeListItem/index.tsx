import { useEffect, useState } from 'react';
import { useIsMounted } from '../../../hooks';
import { EmployeeRoles } from '../EmployeeRoles';
import { EmployeeWithAssociations } from '../../../lib/db/controller';
import { EmployeeListItemAccordion } from '../EmployeeListItemAccordion';

const styles = {
  ml: 'ml-2',
  span: 'w-auto p-1 flex flex-row justify-between gap-3 mt-2',
  div: 'rounded-md employee drop-shadow-md toggle-container w-full bg-tertiary',
  flex: 'flex justify-between items-center p-2 cursor-pointer hide-on-print rounded-md',
  button: 'toggle-details px-2 py-1 bg-quinary hover:bg-accent-primary text-primary rounded mr-2 '
};

export function EmployeeListItem({
  employee,
  onModalDeleteCallBack,
  onModalEditCallBack
}: Readonly<{
  employee: EmployeeWithAssociations;
  onModalDeleteCallBack?: (employeeId: string) => void;
  onModalEditCallBack?: (employee: EmployeeWithAssociations) => void;
}>) {
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
        <div className={styles.ml}>
          <p>{employee.name}</p>
          <span className={styles.span}>
            <EmployeeRoles roles={employee.role?.split(',') ?? []} />
          </span>
        </div>
        <div>
          <button type="button" className={styles.button} onClick={toggleDetails}>
            Details
          </button>
        </div>
      </div>

      <EmployeeListItemAccordion
        show={show}
        employee={employee}
        onModalEditCallBack={onModalEditCallBack}
        onModalDeleteCallBack={onModalDeleteCallBack}
      />
    </div>
  );
}
