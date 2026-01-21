# travel-records Specification

## Purpose
TBD - created by archiving change add-core-travel-features. Update Purpose after archive.
## Requirements
### Requirement: Create Travel Record

The API SHALL allow authenticated users to create a single travel record for a specific date and country.

#### Scenario: Successful record creation
- **WHEN** `POST /api/v1/travel-records` is called with valid `date` and `countryCode`
- **AND** the user is authenticated
- **THEN** the response SHALL have status 201
- **AND** the response SHALL include:
  - `id`: UUID of the created record
  - `date`: the date in YYYY-MM-DD format
  - `countryCode`: the ISO 3166-1 alpha-2 country code
  - `countryName`: the full country name
  - `createdAt`: ISO timestamp of creation

#### Scenario: Duplicate record prevention
- **WHEN** `POST /api/v1/travel-records` is called with a date and country that already exists for the user
- **THEN** the response SHALL have status 409
- **AND** the response SHALL include error code `DUPLICATE_RECORD`
- **AND** the existing record SHALL be returned

#### Scenario: Unauthenticated request
- **WHEN** `POST /api/v1/travel-records` is called without a valid JWT token
- **THEN** the response SHALL have status 401
- **AND** the response SHALL include error code `UNAUTHORIZED`

### Requirement: Delete Travel Record

The API SHALL allow authenticated users to delete their own travel records.

#### Scenario: Successful record deletion
- **WHEN** `DELETE /api/v1/travel-records/:id` is called with a valid record ID
- **AND** the user owns the record
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include `message: "Record deleted successfully"`

#### Scenario: Record not found
- **WHEN** `DELETE /api/v1/travel-records/:id` is called with a non-existent record ID
- **THEN** the response SHALL have status 404
- **AND** the response SHALL include error code `NOT_FOUND`

#### Scenario: Record owned by another user
- **WHEN** `DELETE /api/v1/travel-records/:id` is called for a record owned by another user
- **THEN** the response SHALL have status 404
- **AND** the response SHALL include error code `NOT_FOUND`
- **AND** the system SHALL NOT reveal that the record exists

### Requirement: Get Travel Records by Date Range

The API SHALL allow authenticated users to retrieve their travel records within a specified date range.

#### Scenario: Successful records retrieval
- **WHEN** `GET /api/v1/travel-records?start=YYYY-MM-DD&end=YYYY-MM-DD` is called
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include:
  - `records`: array of travel records within the date range
  - `total`: count of records returned
- **AND** each record SHALL include `id`, `date`, `countryCode`, and `countryName`

#### Scenario: Empty date range
- **WHEN** `GET /api/v1/travel-records` is called with a date range containing no records
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include `records: []` and `total: 0`

#### Scenario: Missing query parameters
- **WHEN** `GET /api/v1/travel-records` is called without `start` or `end` parameters
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the response SHALL specify which parameters are missing

#### Scenario: Invalid date range
- **WHEN** `GET /api/v1/travel-records` is called with `start` after `end`
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate that start date must be before or equal to end date

### Requirement: Bulk Update Travel Records

The API SHALL allow authenticated users to update multiple travel records for a date range with multiple countries.

#### Scenario: Successful bulk update
- **WHEN** `POST /api/v1/travel-records/bulk` is called with valid `startDate`, `endDate`, and `countryCodes`
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include:
  - `message`: "Records updated successfully"
  - `created`: count of new records created
  - `deleted`: count of existing records removed from the date range

#### Scenario: Bulk update replaces existing records
- **WHEN** `POST /api/v1/travel-records/bulk` is called
- **THEN** all existing records in the date range SHALL be deleted first
- **AND** new records SHALL be created for each date/country combination

#### Scenario: Empty country codes array
- **WHEN** `POST /api/v1/travel-records/bulk` is called with an empty `countryCodes` array
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate at least one country is required

#### Scenario: Exceeds maximum countries
- **WHEN** `POST /api/v1/travel-records/bulk` is called with more than 10 countries
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate maximum 10 countries per bulk update

#### Scenario: Date range exceeds limit
- **WHEN** `POST /api/v1/travel-records/bulk` is called with a date range exceeding 365 days
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate date range cannot exceed 365 days

### Requirement: Travel Record Date Validation

The API SHALL validate all travel record dates.

#### Scenario: Future date rejected
- **WHEN** a travel record is created or updated with a future date
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate cannot add travel records for future dates

#### Scenario: Date too far in past rejected
- **WHEN** a travel record is created or updated with a date more than 100 years ago
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate date cannot be more than 100 years in the past

#### Scenario: Invalid date format rejected
- **WHEN** a travel record is created or updated with an invalid date format
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate invalid date format and specify YYYY-MM-DD

### Requirement: Country Code Validation

The API SHALL validate all country codes against ISO 3166-1 alpha-2.

#### Scenario: Valid country code accepted
- **WHEN** a travel record is created with a valid ISO 3166-1 alpha-2 country code
- **THEN** the country code SHALL be accepted
- **AND** the code SHALL be normalized to uppercase

#### Scenario: Invalid country code rejected
- **WHEN** a travel record is created with an invalid country code
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate invalid country code

#### Scenario: Country code length validation
- **WHEN** a travel record is created with a country code not exactly 2 characters
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include error code `VALIDATION_ERROR`
- **AND** the message SHALL indicate country code must be exactly 2 characters

