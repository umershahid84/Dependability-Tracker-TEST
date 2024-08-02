import { ModalAction, ModalType } from '../../../Modal';
import { trim } from '../../../../lib/utils/shared/strings';
import { getDate, getTime, getTimeNoSeconds } from '../../../../lib/utils';
import { CallOutWithAssociations } from '../../../../lib/db/models/Callout';

const styles = {
  superComments: 'ml-4 ',
  container: 'w-full flex flex-col justify-start gap-4 relative',
  modalClasses: 'bg-tertiary rounded-md shadow-lg relative w-auto',
  edit: 'px-2 py-1 bg-quaternary hover:bg-amber-500 text-primary rounded ',
  delete: 'px-2 py-1 bg-quaternary hover:bg-red-500 text-primary rounded ',
  infoContainer: 'ml-4 w-5/6 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2',
  buttonContainer:
    'hide-on-print w-[125px] flex flex-row justify-between gap-3 absolute top-24 right-0 ',
  createdUpdatedAtContainer:
    'ml-4 w-5/6 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2',
  div: `flex justify-between items-center border-t-2 p-2 text-sm cursor-pointer bg-secondary rounded-b-md details-print`
};

export type CallOutsListItemProps = {
  show: boolean;
  callOut: CallOutWithAssociations;
  onModalDeleteCallBack: (callOutId: string) => void;
  onModalEditCallBack: (callOut: CallOutWithAssociations) => void;
};

export function CallOutsListItemAccordion({
  show,
  callOut,
  onModalEditCallBack,
  onModalDeleteCallBack
}: Readonly<CallOutsListItemProps>) {
  const handleOnClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // get the button name
    const buttonName = e.target as HTMLButtonElement;

    if (buttonName.textContent === 'Edit') {
      window.dispatchEvent(
        new CustomEvent('modalEvent', {
          detail: {
            action: ModalAction.OPEN,
            type: ModalType.EDIT_CALL_OUT,
            payload: {
              callOut,
              onModalEditCallBack,
              modalClasses: styles.modalClasses
            }
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
            type: ModalType.DELETE_CALL_OUT,
            payload: {
              callOut,
              onModalDeleteCallBack
            }
          }
        })
      );
    }
  };
  return (
    show && (
      <div className={trim(styles.div)}>
        <div className={styles.container}>
          <div className={styles.infoContainer}>
            <p>
              Call Date: {getDate(callOut.callout_date)} @ {getTimeNoSeconds(callOut.callout_time)}
            </p>
            <p>Entered By: {callOut.supervisor.supervisor_info.name} </p>
            <p>Employee: {callOut.employee.name}</p>

            <p>
              Division(s): {callOut.employee.divisions.map(division => division.name).join(', ')}
            </p>
            <p>
              Shift Date: {getDate(callOut.shift_date)} @ {getTimeNoSeconds(callOut.shift_time)}
            </p>
            <p>Reason: {callOut.leaveType.reason}</p>
            {(callOut?.left_early_mins ?? 0) > 0 && (
              <p>Left Early: {callOut.left_early_mins} mins</p>
            )}

            {(callOut?.arrived_late_mins ?? 0) > 0 && (
              <p>Arrived Late: {callOut.arrived_late_mins} mins</p>
            )}
          </div>
          <p className={styles.superComments}>Supervisor Comments: {callOut.supervisor_comments}</p>

          <span className={styles.createdUpdatedAtContainer}>
            <p className="text-tertiary text-sm">
              Created: {getDate(callOut.createdAt)} @ {getTime(callOut.createdAt)}
            </p>

            <p className="text-tertiary text-sm">
              Last Updated: {getDate(callOut.updatedAt)} @ {getTime(callOut.updatedAt)}
            </p>
          </span>

          <div className={styles.buttonContainer} onClick={handleOnClick} /* NOSONAR*/>
            {' '}
            <button type="button" className={styles.edit}>
              Edit
            </button>
            <button type="button" className={styles.delete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
}
