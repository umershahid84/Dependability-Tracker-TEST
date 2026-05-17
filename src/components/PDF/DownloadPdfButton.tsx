import React from 'react';
import TablePdfDocument from './Table';
import { DownloadIcon } from '../Icons';
import { pdf } from '@react-pdf/renderer';
import { trim } from '../../lib/utils/shared/strings';
import { CallOutWithAssociations } from '../../lib/db/models/Callout';
import {EmployeeCalendarProjection} from '../../client-api/employees';

const styles = {
    icon: `w-4 h-4`,
    button: `rounded-md bg-tertiary hover:bg-blue-600 text-primary px-4 py-2 w-auto text-sm
     flex flex-row justify-start items-center gap-4 `
}


const DownloadPDF = ({
    callOuts,
    calendar
}: {
    callOuts: CallOutWithAssociations[];
    calendar?: EmployeeCalendarProjection | null;
}) => {
    const handleDownload = async () => {
        const blob = await pdf(<TablePdfDocument callOuts={callOuts} calendar={calendar ?? null} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'detailed-callout-history.pdf';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (

        <button
            type='button'
            title='Download as PDF'
            onClick={handleDownload}
            className={trim(styles.button)}
        >
            <DownloadIcon className={styles.icon} /> {' '}
        </button>

    );
};

export default DownloadPDF;
