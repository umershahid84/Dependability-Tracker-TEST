# Visual Guide: Where to Find the CSV Button

## Step-by-Step Visual Walkthrough

### Step 1: Navigate to Reports Page
```
URL: http://localhost:5000/divisions/employee-parking/reports/
     (or ground-transportation/reports or public-parking/reports)
```

### Step 2: You'll See This Form
```
┌─────────────────────────────────────────────────────┐
│         Generate Call-Out Report                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Division:     [Select Division ▼]                  │
│                                                      │
│  Start Date:   [MM/DD/YYYY]                         │
│                                                      │
│  End Date:     [MM/DD/YYYY]                         │
│                                                      │
│                [Generate Report]                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Step 3: Fill Out Form and Click "Generate Report"

### Step 4: After Report Generates - LOOK HERE! 👇

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  [📥 PDF]  [📥 CSV]  [🖨 Print]  ← THREE BUTTONS HERE!     │
│            ↑↑↑↑↑↑↑↑                                         │
│         THIS IS NEW!                                        │
│                                                              │
│     Detailed Callout History For Employee Parking           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Employee Name │ Call Date │ Shift Date │ Leave Type│   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ John Doe      │ 01/05/26  │ 01/05/26   │ Sick      │   │
│  │ Jane Smith    │ 01/06/26  │ 01/06/26   │ Personal  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## What Each Button Does

### 📥 PDF Button (Already Existed)
- Downloads a formatted PDF report
- Filename: `detailed-callout-history.pdf`

### 📥 CSV Button (NEW! ⭐)
- Downloads data in CSV format
- Filename: `detailed-callout-history-2026-01-10.csv`
- Opens in Excel, Google Sheets, etc.
- **This is what we added!**

### 🖨 Print Button (Already Existed)
- Opens browser print dialog
- Prints the report directly

## Button Appearance

The CSV button looks identical to the PDF button, just with "CSV" text instead of "PDF".

**Button styling:**
- Blue background (`bg-tertiary`)
- White text (`text-primary`)
- Download icon (📥) on the left
- Text "CSV" on the right
- Same size and style as PDF button

## Code Location

If you want to see the code:

**File:** `src/components/DivisionReport/DetailedCallOutReport.tsx`

**Lines 78-83:**
```tsx
{showDownloadButton &&
  <span className={styles.buttonContainer}>
    <DownloadPDF callOuts={callOuts} />
    <DownloadCSV callOuts={callOuts} />  ← Line 81: THIS IS THE CSV BUTTON
    <PrintButton />
  </span>}
```

## When the Buttons Appear

The buttons ONLY appear after:
1. ✅ You've navigated to a reports page
2. ✅ You've filled out the form
3. ✅ You've clicked "Generate Report"
4. ✅ The report has data to display (callOuts.length > 0)

If you don't see the buttons, it means:
- ❌ No report has been generated yet, OR
- ❌ The report has no data (empty date range), OR
- ❌ You're experiencing a caching issue

## Quick Test

1. Make sure you're running the app:
   ```bash
   npm start
   ```

2. Open browser to: `http://localhost:5000/divisions/employee-parking/reports/`

3. Fill form:
   - Division: "Employee Parking"
   - Start Date: 30 days ago
   - End Date: Today
   - Click "Generate Report"

4. Wait 1-2 seconds for report to load

5. Look at the TOP of the report table

6. You should see THREE buttons in a row

If you only see TWO buttons (PDF and Print), then:
- Clear your browser cache (Ctrl+Shift+R)
- Or rebuild: `npm run clean && npm run build && npm start`

## File Downloads

When you click the CSV button:
1. Browser downloads file immediately
2. Check your Downloads folder
3. Look for: `detailed-callout-history-2026-01-10.csv`
4. Open in Excel or any spreadsheet app

The CSV file contains 10 columns:
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
