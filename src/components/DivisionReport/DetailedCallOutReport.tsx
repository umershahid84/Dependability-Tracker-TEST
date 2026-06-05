'use client';
import {PrinterIcon} from '../Icons';
import {useEffect, useState} from 'react';
import DownloadPDF from '../PDF/DownloadPdfButton';
import {NextRouter, useRouter} from 'next/router';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {EmployeeCalendarProjection} from '../../client-api/employees';
import {
  formatDate_YYYY_MM_DD_TZ,
  formatTimeNoSeconds_TZ,
  formatTime_hh_mm_ss_TZ
} from '../../lib/utils';
import {getDivisionNameFromPath, headingNormalizer} from '../../lib/utils/shared/strings';
import {EmployeeScheduleCalendar} from '../Calendar';
import {ModalAction, ModalType} from '../Modal';

const styles = {
  icon: `w-4 h-4`,
  headerTr: 'bg-tertiary',
  subTd: 'text-tertiary text-xs text-nowrap',
  h2: 'text-xl font-semibold my-2 text-center mb-6',
  div: 'w-full flex flex-col overflow-x-auto mx-auto h-auto',
  th: 'px-4 py-2 border border-gray-600 print:border-black',
  td: 'px-4 py-2 border border-gray-600 print:border-black',
  table:
    'w-full h-auto table-auto text-left border-collapse mb-6 text-xs lg:text-sm xl:text-base bg-secondary',
  buttonContainer:
    'lg:absolute lg:top-[8px] lg:left-0 flex flex-row justify-start items-center gap-4 hide-on-print',
  headingSpan:
    'w-full flex flex-col lg:flex-wrap lg:flex-row items-center justify-center relative mb-6 lg:mb-0',
  printButton:
    'rounded-md bg-tertiary hover:bg-blue-600 text-primary px-4 py-2 w-auto text-sm flex flex-row justify-start items',
  modalClasses: 'bg-tertiary rounded-md shadow-lg relative w-auto'
};

const headings = [
  'Employee Name',
  'Call Date',
  'Shift Date',
  'Leave Type',
  'Created By',
  'Edited By',
  'Supervisor Comments',
  'Actions'
];

function PrintButton() {
  return (
    <button
      type="button"
      title="Print"
      onClick={() => {
        // fire a print event
        window.dispatchEvent(new Event('beforeprint'));
        window.print();
      }}
      className={styles.printButton}>
      <PrinterIcon className={styles.icon} />{' '}
    </button>
  );
}
export function DetailedCallOutHistory({
  callOuts,
  calendar,
  showDownloadButton = false,
  onModalEditCallBack
}: Readonly<{
  callOuts: CallOutWithAssociations[];
  calendar?: EmployeeCalendarProjection | null;
  showDownloadButton?: boolean;
  onModalEditCallBack?: (callOut: CallOutWithAssociations) => void;
}>) {
  const router: NextRouter = useRouter();
  const [mounted, setMounted] = useState(false);
  const canEditCallOuts = Boolean(onModalEditCallBack);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderCell = (value: string | number, subValue?: string | number, center = true) => (
    <td className={!center ? styles.td : `${styles.td} text-center`}>
      {value}
      {subValue && (
        <div className={styles.subTd} suppressHydrationWarning>
          {subValue}
        </div>
      )}
    </td>
  );

  const renderHead = (value: string, center = false) => (
    <th
      key={value}
      className={`${!center ? styles.th : `${styles.th} text-center`} ${
        value === 'Actions' ? 'hide-on-print' : ''
      }`}>
      {value}
    </th>
  );

  const handleEditClick = (callOut: CallOutWithAssociations) => {
    if (!onModalEditCallBack) {
      return;
    }

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
  };

  return (
    <div className={styles.div}>
      <span className={styles.headingSpan}>
        <h2 className={styles.h2}>
          Detailed Callout History For {headingNormalizer(getDivisionNameFromPath(router.pathname))}
        </h2>
        {showDownloadButton && (
          <span className={styles.buttonContainer}>
            <DownloadPDF callOuts={callOuts} calendar={calendar ?? null} />
            <PrintButton />
          </span>
        )}
      </span>

      <table className={styles.table}>
        <thead className={styles.th}>
          <tr className={styles.headerTr}>
            {headings
              .filter(heading => canEditCallOuts || heading !== 'Actions')
              .map(h => renderHead(h, true))}
          </tr>
        </thead>
        <tbody>
          {callOuts?.map(callOut => {
            return (
              <tr key={callOut.id} className="no-page-break">
                {renderCell(callOut.employee?.name)}
                {renderCell(
                  formatDate_YYYY_MM_DD_TZ(callOut.callout_date, 'UTC'),
                  `Call Time: ${formatTime_hh_mm_ss_TZ(callOut.callout_time)}`
                )}

                {renderCell(
                  `${formatDate_YYYY_MM_DD_TZ(callOut.shift_date, 'UTC')}${
                    callOut.shift_date_to
                      ? ` - ${formatDate_YYYY_MM_DD_TZ(callOut.shift_date_to, 'UTC')}`
                      : ''
                  }`,
                  `Shift Time: ${formatTimeNoSeconds_TZ(callOut.shift_time)}`
                )}
                {renderCell(
                  callOut.leaveType?.reason,
                  `${
                    (callOut?.arrived_late_mins ?? 0) > 0
                      ? `Arrived Late: ${callOut.arrived_late_mins} mins`
                      : ''
                  } ${
                    (callOut?.left_early_mins ?? 0) > 0
                      ? `Left Early: ${callOut.left_early_mins} mins`
                      : ''
                  }`.trim()
                )}
                {renderCell(callOut.supervisor?.supervisor_info?.name)}
                {renderCell(
                  callOut.editedBySupervisor?.supervisor_info?.name ?? '-',
                  callOut.editedBySupervisor
                    ? `${formatDate_YYYY_MM_DD_TZ(callOut.updatedAt, 'UTC')} @ ${formatTime_hh_mm_ss_TZ(
                        callOut.updatedAt
                      )}`
                    : undefined
                )}
                {renderCell(
                  callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : 'N/A'
                )}
                {canEditCallOuts && (
                  <td className={`${styles.td} text-center hide-on-print`}>
                    <button
                      type="button"
                      className="px-2 py-1 bg-quaternary hover:bg-amber-500 text-primary rounded"
                      onClick={() => handleEditClick(callOut)}>
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {calendar && (
        <div className="w-full mb-6 max-w-3xl mx-auto">
          <EmployeeScheduleCalendar calendar={calendar} title="Employee Calendar For Report Period" />
        </div>
      )}
    </div>
  );
}
