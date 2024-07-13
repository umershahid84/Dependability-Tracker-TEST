import {useState} from 'react';
import {EmployeeRoles} from '../EmployeeRoles';
import {EmployeeWithAssociations} from '../../../lib/db/controller';
import {EmployeeListItemAccordion} from '../EmployeeListItemAccordion';

const styles = {
  ml: 'ml-2',

  span: 'w-auto p-1 flex flex-row justify-between gap-3 mt-2',
  div: 'rounded-md employee drop-shadow-md toggle-container w-full',
  button: 'toggle-details px-2 py-1 bg-slate-400 hover:bg-[var(--green)] text-white rounded mr-2',
  flex: 'flex justify-between items-center p-2 cursor-pointer bg-slate-800 rounded-md'
};

export function EmployeeListItem({employee}: Readonly<{employee: EmployeeWithAssociations}>) {
  const [show, setShow] = useState<boolean>(false);

  const toggleDetails = () => {
    setShow(prev => !prev);
  };

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

      <EmployeeListItemAccordion employee={employee} show={show} />
    </div>
  );
}
