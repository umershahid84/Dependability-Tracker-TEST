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
                // Helper function to safely format string values
                const formatStringValue = (value: string | null | undefined): string => {
                    if (value === null || value === undefined) {
                        return '"N/A"';
                    }
                    // Trim whitespace
                    const trimmedValue = value.trim();
                    // Empty string is valid data
                    if (trimmedValue === '') {
                        return '""';
                    }
                    // Convert to string and escape quotes, newlines, then wrap in quotes
                    return `"${trimmedValue.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ')}"`;
                };

                // Helper function to format numeric values
                const formatNumericValue = (value: number | null | undefined): string => {
                    if (value === null || value === undefined) {
                        return '0';
                    }
                    return String(value);
                };

                const row = [
                    formatStringValue(callOut.employee?.name),
                    formatStringValue(getDate(callOut.callout_date)),
                    formatStringValue(getTime(callOut.callout_time)),
                    formatStringValue(getDate(callOut.shift_date)),
                    formatStringValue(getTimeNoSeconds(makeDate(callOut.shift_time))),
                    formatStringValue(callOut.leaveType?.reason),
                    formatNumericValue(callOut.left_early_mins),
                    formatNumericValue(callOut.arrived_late_mins),
                    formatStringValue(callOut.supervisor?.supervisor_info?.name),
                    formatStringValue(callOut.supervisor_comments)
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
