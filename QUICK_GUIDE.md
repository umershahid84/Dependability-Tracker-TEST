# Quick Guide: Where to Add CSV/Excel Export Code

## Question
> "Currently I have download reports in PDF or print reports directly. What if I need to add to download in EXCEL/CSV file. I just need to know what code and where do I need to apply that code."

## Answer

### What Was Done

I've implemented CSV export functionality that works alongside your existing PDF download and Print features. The CSV file can be opened in Excel, Google Sheets, or any spreadsheet application.

### Files and Code Added

#### 1. New CSV Export Button Component
**File:** `src/components/CSV/DownloadCsvButton.tsx`

```typescript
import React from 'react';
import { DownloadIcon } from '../Icons';
import { trim } from '../../lib/utils/shared/strings';
import { CallOutWithAssociations } from '../../lib/db/models/Callout';
import { getDate, getTime, getTimeNoSeconds, makeDate } from '../../lib/utils';

const DownloadCSV = ({ callOuts }: { callOuts: CallOutWithAssociations[] }) => {
    const handleDownload = () => {
        // Create CSV content with proper formatting
        const headers = ['Employee Name', 'Call Date', 'Call Time', ...];
        const csvRows = [
            headers.join(','),
            ...callOuts.map(callOut => { /* format each row */ })
        ];
        const csvContent = csvRows.join('\n');
        
        // Download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'detailed-callout-history.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button onClick={handleDownload}>
            <DownloadIcon /> CSV
        </button>
    );
};
```

#### 2. Integration in Report Page
**File:** `src/components/DivisionReport/DetailedCallOutReport.tsx`

**Added this import at the top:**
```typescript
import DownloadCSV from '../CSV/DownloadCsvButton';
```

**Added the CSV button in the button container (around line 81):**
```typescript
{showDownloadButton &&
  <span className={styles.buttonContainer}>
    <DownloadPDF callOuts={callOuts} />
    <DownloadCSV callOuts={callOuts} />  {/* <-- NEW LINE */}
    <PrintButton />
  </span>}
```

### Where the Buttons Appear

The export buttons appear on these pages:
- `/divisions/employee-parking/reports/`
- `/divisions/ground-transportation/reports/`
- `/divisions/public-parking/reports/`

When users generate a report, they will see three buttons:
```
[📥 PDF]  [📥 CSV]  [🖨️ Print]
```

### Key Points

1. **No External Libraries Needed**: The CSV export uses native JavaScript - no npm packages required
2. **Reusable Component**: The `DownloadCSV` component can be used anywhere you have `CallOutWithAssociations[]` data
3. **Consistent with Existing Pattern**: Follows the same pattern as the existing PDF download button
4. **Excel Compatible**: CSV files open directly in Microsoft Excel

### To Use in Other Pages

If you need CSV export in other parts of your application:

```typescript
// Import the component
import { DownloadCSV } from '../CSV';

// Use it with your data
<DownloadCSV callOuts={yourCallOutsArray} />
```

### CSV File Contents

The exported CSV includes these columns:
- Employee Name
- Call Date
- Call Time
- Shift Date
- Shift Time
- Leave Type
- Left Early (mins)
- Arrived Late (mins)
- Created By
- Supervisor Comments

### Converting CSV to Excel

Users can convert CSV to native Excel format:
1. Open the CSV file in Excel
2. File → Save As
3. Choose "Excel Workbook (*.xlsx)"
4. Save

## Summary

**What:** Added CSV export functionality
**Where:** Report pages (`/divisions/*/reports/`)
**Code:** 
- New component: `src/components/CSV/DownloadCsvButton.tsx`
- Integrated in: `src/components/DivisionReport/DetailedCallOutReport.tsx`
**Result:** Users can now download reports as PDF, CSV, or Print directly

All changes are committed and ready to use!
