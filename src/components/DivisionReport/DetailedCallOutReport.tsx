import {NextRouter, useRouter} from 'next/router';
import {getDate, getTime, getTimeNoSeconds} from '../../lib/utils';
import {CallOutWithAssociations} from '../../lib/db/models/Callout';
import {getDivisionNameFromPath, headingNormalizer} from '../../lib/utils/shared/strings';

const styles = {
  headerTr: 'bg-slate-900',
  th: 'px-4 py-2 border border-gray-600',
  td: 'px-4 py-2 border border-gray-600',
  subTd: 'text-gray-500 text-xs text-nowrap',
  h2: 'text-xl font-semibold my-2 text-center mb-6',
  div: 'w-full flex flex-col overflow-x-auto mx-auto',
  table: 'w-full min-w-[621px] table-auto text-left border-collapse mb-6 text-sm lg:text-base'
};

const headings = [
  'Employee Name',
  'Call Date',
  'Shift Date',
  'Leave Type',
  'Created By',
  'Supervisor Comments'
];

export function DetailedCallOutHistory({
  callOuts
}: Readonly<{callOuts: CallOutWithAssociations[]}>) {
  const router: NextRouter = useRouter();

  const renderCell = (value: string | number, subValue?: string | number) => (
    <td className={styles.td}>
      {value}
      {subValue && <div className={styles.subTd}>{subValue}</div>}
    </td>
  );

  const renderHead = (value: string) => (
    <th key={value} className={styles.th}>
      {value}
    </th>
  );

  return (
    <div className={styles.div}>
      <h2 className={styles.h2}>
        Detailed Callout History For {headingNormalizer(getDivisionNameFromPath(router.pathname))}
      </h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerTr}>{headings.map(heading => renderHead(heading))}</tr>
        </thead>
        <tbody>
          {callOuts?.map(callOut => (
            <tr key={callOut.id}>
              {renderCell(callOut.employee?.name)}
              {renderCell(
                getDate(callOut.callout_date),
                `Call Time: ${getTime(callOut.callout_time)}`
              )}

              {renderCell(
                getDate(callOut.shift_date),
                `Shift Time: ${getTimeNoSeconds(callOut.shift_time)}`
              )}

              {renderCell(
                callOut.leaveType?.reason,
                `${
                  (callOut?.left_early_mins ?? 0) > 0
                    ? `Left Early: ${callOut.left_early_mins} mins`
                    : ''
                } ${
                  (callOut?.arrived_late_mins ?? 0) > 0
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
