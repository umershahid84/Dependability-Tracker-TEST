import { ModalAction, ModalType } from '../../Modal';
import { trim } from '../../../lib/utils/shared/strings';
import { EmployeeWithAssociations } from '../../../lib/db/controller';
import { ToggleEmployeeStatus } from '../../../client-api/employees';

const styles = {
  infoContainer: 'ml-2',
  hideOnPrint: 'hide-on-print',
  edit: 'px-2 py-1 bg-quinary hover:bg-amber-500 rounded mr-2',
  disable: 'px-2 py-1 bg-quinary hover:bg-red-500 rounded mr-2',
  enable: 'px-2 py-1 bg-quinary hover:bg-green-500 rounded mr-2',
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
  const isActive = employee.is_active !== false;

  const handleOnClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const buttonName = e.target as HTMLButtonElement;

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

    if (buttonName.textContent === 'Disable' || buttonName.textContent === 'Enable') {
      const newStatus = !isActive;
      ToggleEmployeeStatus({ id: employee.id, is_active: newStatus }).then(success => {
        if (success && onModalDeleteCallBack) {
          onModalDeleteCallBack(employee.id);
        }
      });
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
            <strong>Status:</strong>{' '}
            <span className={isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {isActive ? 'Active' : 'Disabled'}
            </span>
          </p>

          <p className="mt-2">
            <strong>Divisions: </strong>
            {employee.divisions.map(division => division.name).join(', ')}
          </p>

          {employee.shuttle_number && (
            <p className="mt-2">
              <strong>Shuttle Number: </strong>
              {employee.shuttle_number}
            </p>
          )}
        </div>
        <div className={styles.hideOnPrint} onClick={handleOnClick}>
          <button type="button" className={styles.edit}>
            Edit
          </button>
          <button type="button" className={isActive ? styles.disable : styles.enable}>
            {isActive ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    )
  );
}
