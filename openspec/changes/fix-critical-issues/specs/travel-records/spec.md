# Travel Records - Delta Spec

## ADDED Requirements

### Requirement: Travel Records Pagination
The travel records query endpoint SHALL support optional pagination.

#### Scenario: Paginated request
- **WHEN** `skip` and `take` parameters are provided
- **THEN** the system SHALL return records starting at `skip` offset
- **AND** return at most `take` records

#### Scenario: Pagination response
- **WHEN** pagination is used
- **THEN** the response SHALL include `total` count of matching records
- **AND** include `skip` and `take` values used

#### Scenario: Default behavior without pagination
- **WHEN** pagination parameters are not provided
- **THEN** the system SHALL return all records in the date range
- **AND** maintain backward compatibility

### Requirement: Date Range Validation
Travel records queries SHALL validate that the requested date range does not exceed maximum allowed span.

#### Scenario: Valid date range
- **WHEN** date range is 5 years or less
- **THEN** the query SHALL proceed normally

#### Scenario: Excessive date range
- **WHEN** date range exceeds 5 years
- **THEN** the system SHALL return HTTP 400
- **AND** error message SHALL indicate maximum range is 5 years
