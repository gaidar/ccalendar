# Change: Add JSON Export and Data Import Functionality

## Why
Users need to export their travel data in JSON format for interoperability with other tools, and import travel history from CSV/JSON files to migrate existing data or restore from backups.

## What Changes
- Add JSON export format alongside existing CSV/XLSX
- Add data import functionality (CSV and JSON formats)
- Import overwrites existing records in the import date range
- Add import UI to the account/profile page

## Impact
- Affected specs: `export`, `profile-ui`
- Affected code: `packages/api/src/controllers/`, `packages/api/src/services/`, `packages/web/src/pages/`
