import React from 'react';
import { DownloadIcon } from '../Icons';
import { trim } from '../../lib/utils/shared/strings';
import { CallOutWithAssociations } from '../../lib/db/models/Callout';
import {
  formatDate_YYYY_MM_DD_TZ,
  formatTimeNoSeconds_TZ,
  formatTime_hh_mm_ss_TZ
} from '../../lib/utils';

const styles = {
  icon: `w-4 h-4`,
  button: `rounded-md bg-tertiary hover:bg-blue-600 text-primary px-4 py-2 w-auto text-sm
   flex flex-row justify-start items-center gap-4 `
};

const DownloadCSV = ({
  callOuts
}: {
  callOuts: CallOutWithAssociations[];
}) => {
  const handleDownload = () => {
    // Define CSV headers
    const headers = [
      'Employee Name',
      'Call Date',
      'Call Time',
      'Shift Date',
      'Shift Time',
      'Leave Type',
      'Arrived Late (mins)',
      'Left Early (mins)',
      'Created By',
      'Edited By',
      'Edited Date',
      'Supervisor Comments'
    ];

    // Convert data to CSV rows
    const rows = callOuts.map((callOut) => [
      callOut.employee?.name || '',
      formatDate_YYYY_MM_DD_TZ(callOut.callout_date, 'UTC'),
      formatTime_hh_mm_ss_TZ(callOut.callout_time),
      callOut.shift_date_to
        ? `${formatDate_YYYY_MM_DD_TZ(callOut.shift_date, 'UTC')} - ${formatDate_YYYY_MM_DD_TZ(callOut.shift_date_to, 'UTC')}`
        : formatDate_YYYY_MM_DD_TZ(callOut.shift_date, 'UTC'),
      formatTimeNoSeconds_TZ(callOut.shift_time),
      callOut.leaveType?.reason || '',
      callOut.arrived_late_mins || '',
      callOut.left_early_mins || '',
      callOut.supervisor?.supervisor_info?.name || '',
      callOut.editedBySupervisor?.supervisor_info?.name || '',
      callOut.editedBySupervisor
        ? `${formatDate_YYYY_MM_DD_TZ(callOut.updatedAt, 'UTC')} @ ${formatTime_hh_mm_ss_TZ(callOut.updatedAt)}`
        : '',
      callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : ''
    ]);

    // Escape CSV values that contain commas or quotes
    const escapedHeaders = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');
    const escapedRows = rows
      .map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(',')
      )
      .join('\n');

    // Combine headers and rows
    const csvContent = `${escapedHeaders}\n${escapedRows}`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'detailed-callout-history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      title="Download as CSV"
      onClick={handleDownload}
      className={trim(styles.button)}>
      <DownloadIcon className={styles.icon} /> {' '}
    </button>
  );
};

export default DownloadCSV;
