import { PrinterIcon } from '../Icons';
import DownloadPDF from '../PDF/DownloadPdfButton';
import { NextRouter, useRouter } from 'next/router';
import { CallOutWithAssociations } from '../../lib/db/models/Callout';
import { getDate, getTime, getTimeNoSeconds, makeDate } from '../../lib/utils';
import { getDivisionNameFromPath, headingNormalizer } from '../../lib/utils/shared/strings';


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
  buttonContainer: 'lg:absolute lg:top-[8px] lg:left-0 flex flex-row justify-start items-center gap-4 hide-on-print',
  headingSpan: 'w-full flex flex-col lg:flex-wrap lg:flex-row items-center justify-center relative mb-6 lg:mb-0',
  printButton: 'rounded-md bg-tertiary hover:bg-blue-600 text-primary px-4 py-2 w-auto text-sm flex flex-row justify-start items',
};

const headings = [
  'Employee Name',
  'Call Date',
  'Shift Date',
  'Leave Type',
  'Created By',
  'Supervisor Comments'
];



function PrintButton() {
  return (
    <button
      type='button'
      title='Print'
      onClick={() => {
        // fire a print event
        window.dispatchEvent(new Event('beforeprint'));
        window.print();

      }}
      className={styles.printButton} >
      <PrinterIcon className={styles.icon} /> {' '}
    </button>
  );
}
export function DetailedCallOutHistory({
  callOuts,
  showDownloadButton = false
}: Readonly<{ callOuts: CallOutWithAssociations[], showDownloadButton?: boolean }>) {
  const router: NextRouter = useRouter();

  const renderCell = (value: string | number, subValue?: string | number, center = true) => (
    <td className={!center ? styles.td : `${styles.td} text-center`}>
      {value}
      {subValue && <div className={styles.subTd}>{subValue}</div>}
    </td>
  );

  const renderHead = (value: string, center = false) => (
    <th key={value} className={!center ? styles.th : `${styles.th} text-center`}>
      {value}
    </th>
  );

  return (
    <div className={styles.div}>
      <span className={styles.headingSpan}>
        <h2 className={styles.h2}>
          Detailed Callout History For {headingNormalizer(getDivisionNameFromPath(router.pathname))}
        </h2>
        {showDownloadButton &&
          <span className={styles.buttonContainer}>
            <DownloadPDF callOuts={callOuts} />
            <PrintButton />
          </span>}
      </span>

      <table className={styles.table}>
        <thead className={styles.th}>
          <tr className={styles.headerTr}>{headings.map(heading => renderHead(heading, true))}</tr>
        </thead>
        <tbody>
          {callOuts?.map(callOut => (
            <tr key={callOut.id} className='no-page-break'>
              {renderCell(callOut.employee?.name)}
              {renderCell(
                getDate(callOut.callout_date),
                `Call Time: ${getTime(callOut.callout_time)}`
              )}

              {renderCell(
                getDate(callOut.shift_date),
                `Shift Time: ${getTimeNoSeconds(makeDate(callOut.shift_time))}`
              )}

              {renderCell(
                callOut.leaveType?.reason,
                `${(callOut?.left_early_mins ?? 0) > 0
                  ? `Left Early: ${callOut.left_early_mins} mins`
                  : ''
                  } ${(callOut?.arrived_late_mins ?? 0) > 0
                    ? `Arrived Late: ${callOut.arrived_late_mins} mins`
                    : ''
                  }`.trim()
              )}
              {renderCell(callOut.supervisor?.supervisor_info?.name)}
              {renderCell(
                callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : 'N/A'
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
