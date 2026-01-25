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
}

const convertToCSV = (callOuts: CallOutWithAssociations[]): string => {
  // Define CSV headers
  const headers = [
    'Employee Name',
    'Call Date',
    'Call Time',
    'Shift Date',
    'Shift Time',
    'Leave Type',
    'Left Early (mins)',
    'Arrived Late (mins)',
    'Created By',
    'Supervisor Comments'
  ];

  // Helper function to escape CSV values
  const escapeCSV = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // If value contains comma, newline, or double quote, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Create header row
  const csvRows = [headers.map(escapeCSV).join(',')];

  // Add data rows
  callOuts.forEach(callOut => {
    const row = [
      escapeCSV(callOut.employee?.name || ''),
      escapeCSV(formatDate_YYYY_MM_DD_TZ(callOut.callout_date)),
      escapeCSV(formatTime_hh_mm_ss_TZ(callOut.callout_time)),
      escapeCSV(formatDate_YYYY_MM_DD_TZ(callOut.shift_date)),
      escapeCSV(formatTimeNoSeconds_TZ(callOut.shift_time)),
      escapeCSV(callOut.leaveType?.reason || ''),
      escapeCSV(callOut.left_early_mins || ''),
      escapeCSV(callOut.arrived_late_mins || ''),
      escapeCSV(callOut.supervisor?.supervisor_info?.name || ''),
      escapeCSV(callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : 'N/A')
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

const DownloadCSV = ({ callOuts }: { callOuts: CallOutWithAssociations[] }) => {
    const handleDownload = () => {
        const csvContent = convertToCSV(callOuts);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'detailed-callout-history.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button
            type='button'
            title='Download as CSV'
            onClick={handleDownload}
            className={trim(styles.button)}
        >
            <DownloadIcon className={styles.icon} /> {' '}
        </button>
    );
};

export default DownloadCSV;
