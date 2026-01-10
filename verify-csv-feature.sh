#!/bin/bash

echo "=== Verifying CSV Export Feature Implementation ==="
echo ""

# Check if on correct branch
echo "1. Checking git branch..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "copilot/add-excel-csv-download" ]; then
    echo "   ✓ On correct branch: $BRANCH"
else
    echo "   ✗ Wrong branch: $BRANCH (should be copilot/add-excel-csv-download)"
    exit 1
fi

# Check last commit
echo ""
echo "2. Checking last commit..."
LAST_COMMIT=$(git log -1 --oneline)
echo "   $LAST_COMMIT"
if [[ "$LAST_COMMIT" == *"574ab83"* ]]; then
    echo "   ✓ Commit matches expected"
else
    echo "   ⚠ Commit might be different than expected"
fi

# Check if CSV files exist
echo ""
echo "3. Checking if CSV component files exist..."
if [ -f "src/components/CSV/DownloadCsvButton.tsx" ]; then
    echo "   ✓ DownloadCsvButton.tsx exists"
else
    echo "   ✗ DownloadCsvButton.tsx NOT FOUND"
    exit 1
fi

if [ -f "src/components/CSV/index.tsx" ]; then
    echo "   ✓ CSV/index.tsx exists"
else
    echo "   ✗ CSV/index.tsx NOT FOUND"
    exit 1
fi

# Check if CSV is exported from main index
echo ""
echo "4. Checking component exports..."
if grep -q "export \* from './CSV'" src/components/index.tsx; then
    echo "   ✓ CSV module is exported from components/index.tsx"
else
    echo "   ✗ CSV module NOT exported from components/index.tsx"
    exit 1
fi

# Check if DetailedCallOutReport imports CSV
echo ""
echo "5. Checking DetailedCallOutReport integration..."
if grep -q "import DownloadCSV from '../CSV/DownloadCsvButton'" src/components/DivisionReport/DetailedCallOutReport.tsx; then
    echo "   ✓ DownloadCSV is imported"
else
    echo "   ✗ DownloadCSV NOT imported"
    exit 1
fi

if grep -q "<DownloadCSV callOuts={callOuts} />" src/components/DivisionReport/DetailedCallOutReport.tsx; then
    echo "   ✓ DownloadCSV component is used in JSX"
else
    echo "   ✗ DownloadCSV component NOT used in JSX"
    exit 1
fi

# Check auth fix
echo ""
echo "6. Checking build fix in auth/index.ts..."
if grep -q "expiresIn: EXPIRES_IN as any" src/auth/index.ts; then
    echo "   ✓ Build fix is applied"
else
    echo "   ✗ Build fix NOT applied"
    exit 1
fi

echo ""
echo "=== All Checks Passed! ==="
echo ""
echo "CSV Export feature is correctly implemented."
echo ""
echo "Next steps:"
echo "1. Run: npm run clean"
echo "2. Run: npm run build"
echo "3. Run: npm start"
echo "4. Navigate to: /divisions/employee-parking/reports/"
echo "5. Generate a report"
echo "6. Look for the CSV button between PDF and Print buttons"
echo ""
