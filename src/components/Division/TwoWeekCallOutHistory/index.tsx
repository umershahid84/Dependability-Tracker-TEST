import {getDate, getTime} from '../../../lib/utils';
import {NextRouter, useRouter} from 'next/router';
import {CallOutWithAssociations} from '../../../lib/db/models/Callout';
import {getDivisionNameFromPath, headingNormalizer} from '../../../lib/utils/shared/strings';

const styles = {
  headerTr: 'bg-slate-900',
  th: 'px-4 py-2 border border-gray-600',
  td: 'px-4 py-2 border border-gray-600',
  h2: 'text-xl font-semibold my-2 text-center',
  div: 'w-full flex flex-col overflow-x-auto mx-auto',
  table: 'w-full table-auto text-left border-collapse mb-6 text-sm lg:text-base'
};

const headings = [
  'Employee Name',
  'Call Date',
  'Call Time',
  'Shift Date',
  'Shift Time',
  'Leave Type',
  'Comments'
];

export function TwoWeekCallOutHistory({callOuts}: {callOuts: CallOutWithAssociations[]}) {
  const router: NextRouter = useRouter();

  const renderCell = (value: string) => <td className={styles.td}>{value}</td>;
  const renderHead = (value: string) => (
    <th key={value} className={styles.th}>
      {value}
    </th>
  );

  return (
    <div className={styles.div}>
      <h2 className={styles.h2}>
        Two Week Callout History For {headingNormalizer(getDivisionNameFromPath(router.pathname))}
      </h2>
      <table id="dependabilityTable" className={styles.table}>
        <thead>
          <tr className={styles.headerTr}>{headings.map(heading => renderHead(heading))}</tr>
        </thead>
        <tbody id="dependabilityData">
          {callOuts.map(callOut => (
            <tr key={callOut.id}>
              {renderCell(callOut.employee?.name)}
              {renderCell(getDate(callOut.callout_date))}
              {renderCell(getTime(callOut.callout_date))}
              {renderCell(getDate(callOut.shift_date))}
              {renderCell(getTime(callOut.shift_date))}
              {renderCell(callOut.leaveType?.reason)}
              {renderCell(callOut.supervisor_comments)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
