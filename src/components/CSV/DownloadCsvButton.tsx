import React from 'react';
import { DownloadIcon } from '../Icons';
import { trim } from '../../lib/utils/shared/strings';
import { CallOutWithAssociations } from '../../lib/db/models/Callout';
import { getDate, getTime, getTimeNoSeconds, makeDate } from '../../lib/utils';

const styles = {
    icon: `w-4 h-4`,
    button: `rounded-md bg-tertiary hover:bg-blue-600 text-primary px-4 py-2 w-auto text-sm
     flex flex-row justify-start items-center gap-4 `
}

const DownloadCSV = ({ callOuts }: { callOuts: CallOutWithAssociations[] }) => {
    const handleDownload = () => {
        // Create CSV content
        const headers = [
            '"Employee Name"',
            '"Call Date"',
            '"Call Time"',
            '"Shift Date"',
            '"Shift Time"',
            '"Leave Type"',
            '"Left Early (mins)"',
            '"Arrived Late (mins)"',
            '"Created By"',
            '"Supervisor Comments"'
        ];

        const csvRows = [
            headers.join(','), // Header row
            ...callOuts.map(callOut => {
                // Helper function to safely format values
                const formatValue = (value: any): string => {
                    if (value === null || value === undefined || value === '') {
                        return '"N/A"';
                    }
                    // Convert to string and escape quotes, then wrap in quotes
                    return `"${String(value).replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ')}"`;
                };

                const row = [
                    formatValue(callOut.employee?.name),
                    formatValue(getDate(callOut.callout_date)),
                    formatValue(getTime(callOut.callout_time)),
                    formatValue(getDate(callOut.shift_date)),
                    formatValue(getTimeNoSeconds(makeDate(callOut.shift_time))),
                    formatValue(callOut.leaveType?.reason),
                    formatValue(callOut.left_early_mins || 0),
                    formatValue(callOut.arrived_late_mins || 0),
                    formatValue(callOut.supervisor?.supervisor_info?.name),
                    formatValue(callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : '')
                ];
                return row.join(',');
            })
        ];

        const csvContent = csvRows.join('\n');
        
        // Create blob and download
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
            <DownloadIcon className={styles.icon} /> CSV
        </button>
    );
};

export default DownloadCSV;
