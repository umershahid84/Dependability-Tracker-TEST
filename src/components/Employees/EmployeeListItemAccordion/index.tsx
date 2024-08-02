import { ModalAction, ModalType } from '../../Modal';
import { trim } from '../../../lib/utils/shared/strings';
import { EmployeeWithAssociations } from '../../../lib/db/controller';

const styles = {
  infoContainer: 'ml-2',
  hideOnPrint: 'hide-on-print',
  edit: 'px-2 py-1 bg-quinary hover:bg-amber-500 rounded mr-2',
  delete: 'px-2 py-1 bg-quinary hover:bg-red-500 rounded mr-2',
  div: `flex justify-between items-center border-t-2 p-2 text-sm cursor-pointer bg-secondary rounded-b-md details-print`
};

export function EmployeeListItemAccordion({
  show,
  employee,
  onModalDeleteCallBack,
  onModalEditCallBack
}: Readonly<{
  show: boolean;
  employee: EmployeeWithAssociations;
  onModalDeleteCallBack?: (employeeId: string) => void;
  onModalEditCallBack?: (employee: EmployeeWithAssociations) => void;
}>) {
  const handleOnClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // get the button name
    const buttonName = e.target as HTMLButtonElement;

    // if the button name is edit
    if (buttonName.textContent === 'Edit') {
      window.dispatchEvent(
        new CustomEvent('modalEvent', {
          detail: {
            action: ModalAction.OPEN,
            type: ModalType.EDIT_EMPLOYEE,
            payload: { employee, onModalEditCallBack }
          }
        })
      );
    }
    // if the button name is delete
    if (buttonName.textContent === 'Delete') {
      window.dispatchEvent(
        new CustomEvent('modalEvent', {
          detail: {
            action: ModalAction.OPEN,
            type: ModalType.DELETE_EMPLOYEE,
            payload: { employee, onModalDeleteCallBack }
          }
        })
      );
    }
  };

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
        <div className={styles.hideOnPrint} onClick={handleOnClick}>
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
