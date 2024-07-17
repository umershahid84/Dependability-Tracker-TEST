// import {ModalAction, ModalType} from '../../../ Modal';

import {trim} from '../../../../lib/utils/shared/strings';
import {getDate, getTime, getTimeNoSeconds} from '../../../../lib/utils';
import {CallOutWithAssociations} from '../../../../lib/db/models/Callout';

const styles = {
  infoContainer: 'ml-4 w-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2',
  hideOnPrint: 'hide-on-print w-auto flex flex-row justify-between gap-3 mt-2',
  edit: 'px-2 py-1 bg-slate-400 hover:bg-amber-500 text-white rounded mr-2',
  delete: 'px-2 py-1 bg-slate-400 hover:bg-red-500 text-white rounded mr-2',
  div: `flex justify-between items-center border-t-2 p-2 text-sm cursor-pointer bg-slate-800 rounded-b-md details-print`
};

export function CallOutsListItemAccordion({
  show,
  callOut
}: Readonly<{
  show: boolean;
  callOut: CallOutWithAssociations;
}>) {
  const handleOnClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // get the button name
    const buttonName = e.target as HTMLButtonElement;
    //NOSONAR
    // // if the button name is edit
    // if (buttonName.textContent === 'Edit') {
    //   window.dispatchEvent(
    //     new CustomEvent('modalEvent', {
    //       detail: {action: ModalAction.OPEN, type: ModalType.EDIT_EMPLOYEE, payload: employee}
    //     })
    //   );
    // }
    // // if the button name is delete
    // if (buttonName.textContent === 'Delete') {
    //   window.dispatchEvent(
    //     new CustomEvent('modalEvent', {
    //       detail: {action: ModalAction.OPEN, type: ModalType.DELETE_EMPLOYEE, payload: employee}
    //     })
    //   );
    // }
  };
  return (
    show && (
      <div className={trim(styles.div)}>
        <div className="w-full flex flex-col justify-start gap-4">
          <div className={styles.infoContainer}>
            <p>
              Call Date: {getDate(callOut.callout_date)} @ {getTimeNoSeconds(callOut.callout_time)}
            </p>{' '}
            <p>Employee: {callOut.employee.name}</p>
            <p>Entered By: {callOut.supervisor.supervisor_info.name} </p>
            <p>Reason: {callOut.leaveType.reason}</p>
            <p>
              Shift Date: {getDate(callOut.shift_date)} @ {getTimeNoSeconds(callOut.shift_time)}
            </p>
            <p>
              Division(s): {callOut.employee.divisions.map(division => division.name).join(', ')}
            </p>
            <p>Supervisor Comments: {callOut.supervisor_comments}</p>
          </div>

          <span className="ml-4 w-full flex flex-col justify-center items-start md:flex-row md:justify-start md:items-center md:gap-32">
            <p className="text-gray-400 text-sm">
              Created: {getDate(callOut.createdAt)} @ {getTime(callOut.createdAt)}
            </p>

            <p className="text-gray-400 text-sm">
              Last Updated: {getDate(callOut.updatedAt)} @ {getTime(callOut.updatedAt)}
            </p>
          </span>
        </div>

        <div className={styles.hideOnPrint} onClick={handleOnClick} /* NOSONAR*/>
          {' '}
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
