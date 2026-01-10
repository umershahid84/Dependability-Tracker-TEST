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

        const csvRows = [
            headers.join(','), // Header row
            ...callOuts.map(callOut => {
                const row = [
                    `"${callOut.employee?.name || 'N/A'}"`,
                    `"${getDate(callOut.callout_date)}"`,
                    `"${getTime(callOut.callout_time)}"`,
                    `"${getDate(callOut.shift_date)}"`,
                    `"${getTimeNoSeconds(makeDate(callOut.shift_time))}"`,
                    `"${callOut.leaveType?.reason || 'N/A'}"`,
                    `"${callOut.left_early_mins || 0}"`,
                    `"${callOut.arrived_late_mins || 0}"`,
                    `"${callOut.supervisor?.supervisor_info?.name || 'N/A'}"`,
                    `"${(callOut.supervisor_comments !== ' ' ? callOut.supervisor_comments : 'N/A').replace(/"/g, '""')}"`
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
