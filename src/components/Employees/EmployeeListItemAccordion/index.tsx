import {trim} from '../../../lib/utils/shared/strings';
import {EmployeeWithAssociations} from '../../../lib/db/controller';

const styles = {
  infoContainer: 'ml-2',
  hideOnPrint: 'hide-on-print',
  edit: 'px-2 py-1 bg-slate-400 hover:bg-amber-500 text-white rounded mr-2',
  delete: 'px-2 py-1 bg-slate-400 hover:bg-red-500 text-white rounded mr-2',
  div: `flex justify-between items-center border-t-2 p-2 text-sm cursor-pointer bg-slate-800 rounded-b-md`
};

export function EmployeeListItemAccordion({
  show,
  employee
}: Readonly<{
  show: boolean;
  employee: EmployeeWithAssociations;
}>) {
  return (
    show && (
      <div className={trim(styles.div)}>
        <div className={styles.infoContainer}>
          <p>
            <strong>Name:</strong> {employee.name}
          </p>

          <p className="mt-2">
            <strong>Role:</strong> {employee.role}
          </p>

          <p className="mt-2">
            <strong>Divisions: </strong>
            {employee.divisions.map(division => division.name).join(', ')}
          </p>
        </div>
        <div className={styles.hideOnPrint}>
          <button type="button" className={styles.edit}>
            Edit
          </button>
          <button type="button" className={styles.delete}>
            Delete
          </button>
        </div>
      </div>
    )
  );
}
