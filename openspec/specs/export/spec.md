# export Specification

## Purpose
TBD - created by archiving change add-reports-export. Update Purpose after archive.
## Requirements
### Requirement: Export to CSV

The API SHALL provide CSV export functionality for travel records.

#### Scenario: Successful CSV export
- **WHEN** `GET /api/v1/reports/export?format=csv&start=2024-01-01&end=2024-12-31` is called
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the Content-Type SHALL be `text/csv`
- **AND** the Content-Disposition SHALL trigger file download

#### Scenario: CSV file format
- **WHEN** a CSV export is generated
- **THEN** the file SHALL include a header row
- **AND** columns SHALL be: `date`, `country_code`, `country_name`
- **AND** rows SHALL be sorted by date ascending

#### Scenario: CSV file content
- **WHEN** a CSV export is generated
- **THEN** each travel record SHALL be one row
- **AND** dates SHALL be in YYYY-MM-DD format
- **AND** country codes SHALL be ISO 3166-1 alpha-2

#### Scenario: CSV streaming for large datasets
- **WHEN** exporting a large number of records
- **THEN** the response SHALL be streamed
- **AND** the server SHALL NOT load all data into memory at once

### Requirement: Export to XLSX

The API SHALL provide XLSX export functionality for travel records.

#### Scenario: Successful XLSX export
- **WHEN** `GET /api/v1/reports/export?format=xlsx&start=2024-01-01&end=2024-12-31` is called
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the Content-Type SHALL be `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **AND** the Content-Disposition SHALL trigger file download

#### Scenario: XLSX file format
- **WHEN** an XLSX export is generated
- **THEN** the file SHALL include a header row with bold formatting
- **AND** columns SHALL be: `Date`, `Country Code`, `Country Name`
- **AND** column widths SHALL be auto-sized for content

#### Scenario: XLSX date formatting
- **WHEN** an XLSX export is generated
- **THEN** dates SHALL be formatted as Excel dates
- **AND** users SHALL be able to apply date formatting in Excel

### Requirement: Export Date Range

The export endpoint SHALL support date range parameters.

#### Scenario: Required date range
- **WHEN** `GET /api/v1/reports/export` is called without date range
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate start and end dates are required

#### Scenario: Valid date range
- **WHEN** export is called with valid start and end dates
- **THEN** only records within the range (inclusive) SHALL be exported

#### Scenario: Export range maximum
- **WHEN** export is called with a date range exceeding 10 years
- **THEN** the response SHALL have status 400
- **AND** the error message SHALL indicate export date range cannot exceed 10 years

#### Scenario: Invalid date format
- **WHEN** export is called with invalid date format
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate expected format (YYYY-MM-DD)

### Requirement: Export Rate Limiting

The export endpoint SHALL enforce rate limiting.

#### Scenario: Rate limit configuration
- **WHEN** the export endpoint is called
- **THEN** a rate limit of 5 requests per hour per user SHALL be enforced

#### Scenario: Rate limit exceeded
- **WHEN** a user exceeds 5 exports per hour
- **THEN** the response SHALL have status 429
- **AND** the error code SHALL be `RATE_LIMITED`
- **AND** the Retry-After header SHALL indicate when the limit resets

#### Scenario: Rate limit headers
- **WHEN** an export request is made
- **THEN** the response SHALL include rate limit headers:
  - `X-RateLimit-Limit`: 5
  - `X-RateLimit-Remaining`: remaining requests
  - `X-RateLimit-Reset`: reset timestamp

### Requirement: Export Empty Data

The export functionality SHALL handle empty data gracefully.

#### Scenario: Export with no records
- **WHEN** export is called for a date range with no records
- **THEN** the response SHALL have status 200
- **AND** the file SHALL contain only the header row (CSV) or header (XLSX)

### Requirement: Export UI Component

The frontend SHALL provide an export options component.

#### Scenario: Export options display
- **WHEN** the export options section is displayed
- **THEN** CSV and XLSX export buttons SHALL be available
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

### Requirement: Export Authentication

Export endpoints SHALL require authentication.

#### Scenario: Unauthenticated export request
- **WHEN** export is called without authentication
- **THEN** the response SHALL have status 401
- **AND** the error code SHALL be `UNAUTHORIZED`

#### Scenario: User data isolation
- **WHEN** an authenticated user exports data
- **THEN** only that user's travel records SHALL be included
- **AND** other users' data SHALL NOT be accessible

