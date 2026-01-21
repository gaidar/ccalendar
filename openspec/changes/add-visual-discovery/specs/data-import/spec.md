# Data Import

## ADDED Requirements

### Requirement: Import File Formats

The system SHALL support importing travel data from CSV and Excel (XLSX) files.

**Supported formats:**
- CSV (comma, semicolon, or tab delimited)
- XLSX (Excel 2007+)

**Required data:**
- Date (various formats supported)
- Country (code or name)

**Optional data:**
- Notes or comments (ignored during import)

#### Scenario: Import CSV file
- **WHEN** user uploads a CSV file with date and country columns
- **THEN** system parses the file
- **AND** identifies date and country columns
- **AND** presents column mapping interface

#### Scenario: Import Excel file
- **WHEN** user uploads an XLSX file with date and country columns
- **THEN** system parses the first sheet
- **AND** identifies date and country columns
- **AND** presents column mapping interface

#### Scenario: Unsupported file format
- **WHEN** user uploads a file that is not CSV or XLSX
- **THEN** error message displays
- **AND** message lists supported formats

---

### Requirement: Column Mapping

The system SHALL provide a column mapping interface for flexible file formats.

**Auto-detection:**
- Date columns detected by header keywords: date, day, when, travel_date
- Country columns detected by header keywords: country, location, destination, country_code

**Manual mapping:**
- User can override auto-detected mappings
- User can select which column contains dates
- User can select which column contains countries

#### Scenario: Auto-detect columns
- **WHEN** user uploads file with "Date" and "Country" headers
- **THEN** columns are automatically mapped
- **AND** user sees mapping preview
- **AND** user can modify if incorrect

#### Scenario: Manual column mapping
- **WHEN** auto-detection fails or is incorrect
- **THEN** user can manually select date column from dropdown
- **AND** user can manually select country column from dropdown
- **AND** preview updates with new mapping

#### Scenario: Missing required column
- **WHEN** file does not contain identifiable date or country column
- **THEN** error message explains what is missing
- **AND** user is prompted to map columns manually

---

### Requirement: Date Parsing

The system SHALL parse dates in multiple formats.

**Supported formats:**
- ISO 8601: `2024-01-15`, `2024-01-15T00:00:00Z`
- US format: `01/15/2024`, `1/15/24`
- European format: `15/01/2024`, `15.01.2024`
- Written: `January 15, 2024`, `15 Jan 2024`

The system SHALL reject future dates (same validation as manual entry).

#### Scenario: Parse ISO date
- **WHEN** file contains date `2024-01-15`
- **THEN** date is parsed as January 15, 2024

#### Scenario: Parse ambiguous date
- **WHEN** file contains date `01/02/2024`
- **THEN** system prompts user to confirm date format (MM/DD vs DD/MM)
- **AND** user selection applies to all rows

#### Scenario: Invalid date
- **WHEN** file contains unparseable date like `not-a-date`
- **THEN** row is marked as error
- **AND** error message explains the issue
- **AND** row is excluded from import

#### Scenario: Future date rejected
- **WHEN** file contains date in the future
- **THEN** row is marked as error
- **AND** error message indicates future dates not allowed

---

### Requirement: Country Parsing

The system SHALL parse countries by code or name.

**Supported formats:**
- ISO 3166-1 alpha-2 code: `US`, `FR`, `DE`
- Full country name: `United States`, `France`, `Germany`
- Common variations: `USA`, `UK`, `UAE`

**Matching:**
- Case-insensitive
- Whitespace trimmed
- Common aliases supported

#### Scenario: Parse country code
- **WHEN** file contains country `US`
- **THEN** country is matched to United States

#### Scenario: Parse country name
- **WHEN** file contains country `United States of America`
- **THEN** country is matched to US code

#### Scenario: Parse country alias
- **WHEN** file contains country `UK`
- **THEN** country is matched to GB code (United Kingdom)

#### Scenario: Unknown country
- **WHEN** file contains unrecognized country `Narnia`
- **THEN** row is marked as error
- **AND** error message lists unrecognized value
- **AND** row is excluded from import

---

### Requirement: Import Preview

The system SHALL display a preview of data to be imported before execution.

**Preview includes:**
- Total rows to import
- Sample of first 10 rows
- List of validation errors
- Duplicate detection results

#### Scenario: Preview valid import
- **WHEN** user completes column mapping
- **THEN** preview shows total rows to import
- **AND** preview shows sample data
- **AND** user can proceed or cancel

#### Scenario: Preview with errors
- **WHEN** some rows have validation errors
- **THEN** preview shows error count
- **AND** error details are expandable
- **AND** valid rows can still be imported
- **AND** user decides whether to proceed

---

### Requirement: Duplicate Detection

The system SHALL detect and handle duplicate records.

**Duplicate definition:** Same user, same date, same country

**Options:**
- Skip duplicates (default)
- Replace duplicates
- Import all (create duplicates)

#### Scenario: Duplicate detected
- **WHEN** import file contains record that already exists
- **THEN** preview highlights duplicate
- **AND** user can choose how to handle duplicates

#### Scenario: Skip duplicates
- **WHEN** user chooses to skip duplicates
- **THEN** existing records are preserved
- **AND** only new records are imported

#### Scenario: Replace duplicates
- **WHEN** user chooses to replace duplicates
- **THEN** existing records are deleted
- **AND** new records from file are imported

---

### Requirement: Import Execution

The system SHALL execute imports in batches with progress tracking.

**Batch size:** 100 records per API call
**Progress:** Real-time progress indicator

#### Scenario: Execute import
- **WHEN** user confirms import
- **THEN** progress bar displays
- **AND** records are imported in batches
- **AND** progress updates after each batch

#### Scenario: Import completion
- **WHEN** import completes successfully
- **THEN** success message displays
- **AND** total records imported shown
- **AND** user can view imported records in calendar

#### Scenario: Partial failure
- **WHEN** some batches fail during import
- **THEN** error message displays
- **AND** successfully imported records are preserved
- **AND** failed records are listed for review

---

### Requirement: Import Size Limits

The system SHALL enforce size limits to prevent abuse and performance issues.

**Limits:**
- Maximum file size: 10 MB
- Maximum rows: 10,000
- Rate limit: 5 imports per hour per user

#### Scenario: File too large
- **WHEN** user uploads file larger than 10 MB
- **THEN** error message displays
- **AND** file is rejected
- **AND** user is advised to split file

#### Scenario: Too many rows
- **WHEN** file contains more than 10,000 rows
- **THEN** warning displays
- **AND** user can proceed with first 10,000 rows
- **OR** user can cancel and split file

#### Scenario: Rate limit exceeded
- **WHEN** user attempts 6th import within one hour
- **THEN** error message displays
- **AND** message indicates when next import allowed

---

### Requirement: Import History

The system SHALL track import history for users.

**Tracked data:**
- Import date/time
- Filename
- Total rows
- Successful rows
- Error count
- Status (completed, failed, partial)

#### Scenario: View import history
- **WHEN** user navigates to import page
- **THEN** previous imports are listed
- **AND** each shows date, filename, and result

#### Scenario: View import details
- **WHEN** user clicks on past import
- **THEN** details show complete statistics
- **AND** error details available if any

---

### Requirement: Import Page

The system SHALL provide a dedicated import page with wizard interface.

**Route:** `/import`
**Access:** Authenticated users only

**Wizard steps:**
1. File upload
2. Column mapping
3. Preview and options
4. Import progress
5. Completion summary

#### Scenario: Navigate to import page
- **WHEN** authenticated user navigates to `/import`
- **THEN** import wizard displays at step 1
- **AND** file upload interface is shown

#### Scenario: Step navigation
- **WHEN** user completes a wizard step
- **THEN** next step becomes active
- **AND** user can go back to previous steps
- **AND** user can cancel at any step

---

### Requirement: Import API Endpoints

The system SHALL provide API endpoints for import operations.

**Endpoints:**
- `POST /api/import/preview` - Validate and preview import
- `POST /api/import/execute` - Execute validated import
- `GET /api/import/jobs` - List import history
- `GET /api/import/jobs/:id` - Get import job details

#### Scenario: Preview endpoint
- **WHEN** client sends file data to preview endpoint
- **THEN** response contains validation results
- **AND** response contains preview data
- **AND** no records are persisted

#### Scenario: Execute endpoint
- **WHEN** client sends validated data to execute endpoint
- **THEN** records are created in database
- **AND** response contains import job ID
- **AND** import history is updated
