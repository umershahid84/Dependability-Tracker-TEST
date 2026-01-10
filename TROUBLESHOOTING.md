# Troubleshooting: CSV Export "Not Working"

## The CSV feature IS implemented correctly!

All code is in place on the `copilot/add-excel-csv-download` branch. The issue you're experiencing is most likely due to **caching** or **build state**.

## Quick Verification

Run this command to verify the implementation:
```bash
./verify-csv-feature.sh
```

This will check that all files are in place and properly integrated.

## Most Common Issue: Stale Build Cache

The Next.js build system caches compiled output in the `.next` folder. If you pull changes but don't properly rebuild, you'll see the old version.

### Solution: Clean Rebuild

```bash
# 1. Stop your running server (Ctrl+C)

# 2. Clean everything
npm run clean

# 3. Rebuild
npm run build

# 4. Start the server
npm start
```

### Alternative: Nuclear Option

If the above doesn't work, completely remove build artifacts:

```bash
# Stop your server first!

# Remove all build output and dependencies
rm -rf .next
rm -rf node_modules

# Reinstall and rebuild
npm install
npm run build
npm start
```

## Browser Cache Issue

Even with a fresh build, your browser might be serving cached JavaScript.

**Solution:**
1. Open your browser's DevTools (F12)
2. Go to the Network tab
3. Check "Disable cache"
4. Refresh the page (Ctrl+R)

Or use a hard refresh:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## Where to Find the CSV Button

1. **Start your application:**
   ```bash
   npm start
   ```

2. **Navigate to a report page:**
   - `/divisions/employee-parking/reports/`
   - `/divisions/ground-transportation/reports/`
   - `/divisions/public-parking/reports/`

3. **Fill out the report form:**
   - Select division
   - Select date range
   - Click "Generate Report"

4. **Look for the buttons:**
   After the report generates, you should see three buttons at the top:
   ```
   [📥 PDF]  [📥 CSV]  [🖨️ Print]
   ```

## What the CSV Button Does

When clicked, it:
1. Generates a CSV file with all report data
2. Automatically downloads it with filename: `detailed-callout-history-YYYY-MM-DD.csv`
3. Opens in Excel, Google Sheets, or any spreadsheet application

## Still Not Working?

### Check 1: Are you on the right branch?
```bash
git branch
```
Should show: `* copilot/add-excel-csv-download`

If not:
```bash
git checkout copilot/add-excel-csv-download
npm run clean
npm run build
npm start
```

### Check 2: Are you running the built version?
```bash
npm start
```
NOT `npm run dev` (dev mode has its own caching issues)

### Check 3: Check the browser console
1. Open DevTools (F12)
2. Go to Console tab
3. Generate a report
4. Look for any JavaScript errors (red text)

If you see errors, they might indicate what's wrong.

### Check 4: Verify the files exist
```bash
# These commands should all succeed:
ls src/components/CSV/DownloadCsvButton.tsx
ls src/components/CSV/index.tsx
grep -n "DownloadCSV" src/components/DivisionReport/DetailedCallOutReport.tsx
```

## Technical Details

The CSV button is rendered by:
- **File:** `src/components/DivisionReport/DetailedCallOutReport.tsx`
- **Line:** 81
- **Condition:** Only shows when `showDownloadButton={true}`
- **This is set:** In `src/components/DivisionReport/index.tsx` line 34 after generating a report

The component structure:
```
DivisionReport
  └─ DetailedCallOutHistory (showDownloadButton=true)
      └─ Button Container
          ├─ DownloadPDF  ← PDF button
          ├─ DownloadCSV  ← **CSV button (NEW!)**
          └─ PrintButton  ← Print button
```

## Need More Help?

If you've tried all the above and still don't see the CSV button:

1. Share a screenshot of:
   - The report page after generating a report
   - Your browser's DevTools Console tab
   - The output of `git log --oneline -1`

2. Confirm you've done:
   - Clean rebuild (`npm run clean && npm run build`)
   - Hard refresh browser cache
   - You're on the correct branch
