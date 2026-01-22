## ADDED Requirements

### Requirement: Export to JSON
The API SHALL provide JSON export functionality for travel records.

#### Scenario: Successful JSON export
- **WHEN** `GET /api/v1/reports/export?format=json&start=2024-01-01&end=2024-12-31` is called
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the Content-Type SHALL be `application/json`
- **AND** the Content-Disposition SHALL trigger file download

#### Scenario: JSON file structure
- **WHEN** a JSON export is generated
- **THEN** the file SHALL be a JSON object with:
  - `exportDate`: ISO timestamp of export
  - `startDate`: start of date range (YYYY-MM-DD)
  - `endDate`: end of date range (YYYY-MM-DD)
  - `totalRecords`: count of records
  - `records`: array of travel records

#### Scenario: JSON record format
- **WHEN** a JSON export is generated
- **THEN** each record in the `records` array SHALL include:
  - `date`: date in YYYY-MM-DD format
  - `countryCode`: ISO 3166-1 alpha-2 code
  - `countryName`: full country name
- **AND** records SHALL be sorted by date ascending

#### Scenario: Multiple countries per day in JSON
- **WHEN** a user has multiple countries for a single day
- **THEN** each country SHALL be a separate object in the `records` array
- **AND** all countries for that day SHALL appear consecutively (sorted by date, then by country code)

#### Scenario: JSON streaming for large datasets
- **WHEN** exporting a large number of records
- **THEN** the response SHALL use efficient JSON generation
- **AND** the server SHALL NOT build the entire response in memory for very large exports

### Requirement: Import Travel Records
The API SHALL provide import functionality to upload travel records from CSV or JSON files.

#### Scenario: Successful CSV import
- **WHEN** `POST /api/v1/travel-records/import` is called with a CSV file
- **AND** the user is authenticated
- **AND** the file is valid
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include:
  - `imported`: count of records imported
  - `deleted`: count of existing records deleted (overwritten)
  - `startDate`: start of imported date range
  - `endDate`: end of imported date range

#### Scenario: Successful JSON import
- **WHEN** `POST /api/v1/travel-records/import` is called with a JSON file
- **AND** the user is authenticated
- **AND** the file is valid
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include:
  - `imported`: count of records imported
  - `deleted`: count of existing records deleted (overwritten)
  - `startDate`: start of imported date range
  - `endDate`: end of imported date range

#### Scenario: Import CSV format
- **WHEN** a CSV file is imported
- **THEN** the file SHALL have columns: `date`, `country_code` (or `countryCode`)
- **AND** dates SHALL be parsed from YYYY-MM-DD format
- **AND** country codes SHALL be validated against ISO 3166-1 alpha-2
- **AND** a header row SHALL be expected

#### Scenario: Import JSON format
- **WHEN** a JSON file is imported
- **THEN** the file SHALL contain a `records` array
- **AND** each record SHALL have `date` and `countryCode` fields
- **AND** dates SHALL be in YYYY-MM-DD format
- **AND** country codes SHALL be validated against ISO 3166-1 alpha-2

#### Scenario: Import overwrites existing data
- **WHEN** records are imported
- **THEN** the system SHALL determine the date range from the import data (min and max dates)
- **AND** all existing records within that date range SHALL be deleted first
- **AND** then imported records SHALL be inserted
- **AND** this operation SHALL be atomic (transaction)

#### Scenario: Import multiple countries per day
- **WHEN** import data contains multiple countries for a single day
- **THEN** each country SHALL be imported as a separate record
- **AND** duplicate date+country combinations within the import SHALL be deduplicated

### Requirement: Import File Validation
The import endpoint SHALL validate uploaded files.

#### Scenario: Maximum file size
- **WHEN** an import file exceeds 5MB
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `FILE_TOO_LARGE`
- **AND** the error message SHALL indicate maximum file size is 5MB

#### Scenario: Invalid file format
- **WHEN** an import file is not CSV or JSON
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `INVALID_FORMAT`
- **AND** the error message SHALL indicate accepted formats are CSV and JSON

#### Scenario: Malformed CSV
- **WHEN** a CSV file has invalid structure
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `PARSE_ERROR`
- **AND** the error message SHALL indicate the parsing issue

#### Scenario: Malformed JSON
- **WHEN** a JSON file has invalid structure
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `PARSE_ERROR`
- **AND** the error message SHALL indicate the JSON is invalid

#### Scenario: Missing required columns
- **WHEN** a CSV file is missing required columns (date, country_code)
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `VALIDATION_ERROR`
- **AND** the error message SHALL list missing columns

#### Scenario: Invalid data in import
- **WHEN** import data contains invalid records (bad date format, invalid country code)
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `VALIDATION_ERROR`
- **AND** the response SHALL include details of invalid records (line number for CSV, index for JSON)

#### Scenario: Empty import file
- **WHEN** an import file contains no records (only header for CSV, empty array for JSON)
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `VALIDATION_ERROR`
- **AND** the error message SHALL indicate file contains no records

#### Scenario: Future dates in import
- **WHEN** import data contains future dates
- **THEN** those records SHALL be rejected
- **AND** the error SHALL indicate which records have future dates

### Requirement: Import Rate Limiting
The import endpoint SHALL enforce rate limiting.

#### Scenario: Import rate limit configuration
- **WHEN** the import endpoint is called
- **THEN** a rate limit of 10 imports per hour per user SHALL be enforced

#### Scenario: Import rate limit exceeded
- **WHEN** a user exceeds 10 imports per hour
- **THEN** the response SHALL have status 429
- **AND** the error code SHALL be `RATE_LIMITED`
- **AND** the Retry-After header SHALL indicate when the limit resets

### Requirement: Import Authentication
Import endpoints SHALL require authentication.

#### Scenario: Unauthenticated import request
- **WHEN** import is called without authentication
- **THEN** the response SHALL have status 401
- **AND** the error code SHALL be `UNAUTHORIZED`

#### Scenario: Import data isolation
- **WHEN** an authenticated user imports data
- **THEN** the data SHALL only affect that user's travel records
- **AND** other users' data SHALL NOT be affected

## MODIFIED Requirements

### Requirement: Export UI Component
The frontend SHALL provide an export options component.

#### Scenario: Export options display
- **WHEN** the export options section is displayed
- **THEN** CSV, XLSX, and JSON export buttons SHALL be available
- **AND** date range selection for export SHALL be available

#### Scenario: Export button click
- **WHEN** a user clicks an export button
- **THEN** the export SHALL be initiated
- **AND** a loading indicator SHALL be displayed on the button

#### Scenario: Export success
- **WHEN** an export completes successfully
- **THEN** the file download SHALL start automatically
- **AND** a success message "Your export is being prepared. Download will start automatically." MAY be displayed

#### Scenario: Export rate limit error
- **WHEN** an export fails due to rate limiting
- **THEN** an error message SHALL be displayed
- **AND** the message SHALL indicate when the user can try again

#### Scenario: Export range validation
- **WHEN** a user selects an export date range exceeding 10 years
- **THEN** the export button SHALL be disabled
- **AND** an error message SHALL indicate the maximum range
