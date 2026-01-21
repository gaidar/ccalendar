# reports-api Specification

## Purpose
TBD - created by archiving change add-reports-export. Update Purpose after archive.
## Requirements
### Requirement: Summary Report Endpoint

The API SHALL provide an endpoint for retrieving travel summary statistics.

#### Scenario: Get summary with preset period
- **WHEN** `GET /api/v1/reports/summary?days=30` is called
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include:
  - `totalDays`: count of unique dates with at least one travel record
  - `totalCountries`: count of unique country codes
  - `topCountries`: array of countries sorted by days visited (descending)
  - `period`: object with `start` and `end` dates

#### Scenario: Get summary with custom date range
- **WHEN** `GET /api/v1/reports/summary?start=2024-01-01&end=2024-06-30` is called
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the summary SHALL be calculated for the specified date range

#### Scenario: Supported preset periods
- **WHEN** `GET /api/v1/reports/summary?days=N` is called
- **THEN** the following values for `days` SHALL be supported: 7, 30, 90, 365
- **AND** invalid values SHALL return status 400

#### Scenario: Custom range exceeds maximum
- **WHEN** `GET /api/v1/reports/summary` is called with a custom range exceeding 5 years
- **THEN** the response SHALL have status 400
- **AND** the error message SHALL indicate custom date ranges cannot exceed 5 years

#### Scenario: Summary with no data
- **WHEN** a user with no travel records requests a summary
- **THEN** the response SHALL have status 200
- **AND** `totalDays` SHALL be 0
- **AND** `totalCountries` SHALL be 0
- **AND** `topCountries` SHALL be an empty array

### Requirement: Top Countries Calculation

The summary endpoint SHALL calculate top countries by days visited.

#### Scenario: Top countries list
- **WHEN** a summary is requested
- **THEN** `topCountries` SHALL include countries sorted by days visited (descending)
- **AND** each entry SHALL include: `code`, `name`, `days`

#### Scenario: Top countries limit
- **WHEN** a user has visited more than 10 countries
- **THEN** `topCountries` SHALL include all countries (no limit)
- **AND** the list SHALL be sorted by days descending

#### Scenario: Multiple countries same day
- **WHEN** a user has multiple countries recorded for the same date
- **THEN** each country SHALL be counted separately in `topCountries`
- **AND** `totalDays` SHALL count the date only once

### Requirement: Days Calculation

The API SHALL correctly calculate total travel days.

#### Scenario: Total days counts unique dates
- **WHEN** a summary is calculated
- **THEN** `totalDays` SHALL count unique dates with at least one travel record
- **AND** dates with multiple countries SHALL be counted once

#### Scenario: Total days within range
- **WHEN** a date range is specified
- **THEN** only records within the range (inclusive) SHALL be counted

### Requirement: Countries Calculation

The API SHALL correctly calculate total countries visited.

#### Scenario: Total countries counts unique codes
- **WHEN** a summary is calculated
- **THEN** `totalCountries` SHALL count unique country codes
- **AND** visiting the same country on multiple days SHALL count as one country

#### Scenario: Countries within range
- **WHEN** a date range is specified
- **THEN** only countries visited within the range SHALL be counted

### Requirement: Reports Authentication

The reports endpoints SHALL require authentication.

#### Scenario: Unauthenticated request
- **WHEN** reports endpoints are called without authentication
- **THEN** the response SHALL have status 401
- **AND** the error code SHALL be `UNAUTHORIZED`

#### Scenario: User data isolation
- **WHEN** an authenticated user requests reports
- **THEN** only that user's travel records SHALL be included in calculations
- **AND** other users' data SHALL NOT be accessible

