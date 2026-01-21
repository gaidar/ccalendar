# Reports API - Delta Spec

## MODIFIED Requirements

### Requirement: Summary Report Top Countries
The summary report endpoint SHALL support limiting the number of top countries returned.

#### Scenario: Default limit
- **WHEN** no limit parameter is provided
- **THEN** the system SHALL return the top 10 countries by days visited

#### Scenario: Custom limit
- **WHEN** a `limit` parameter is provided
- **THEN** the system SHALL return at most that many countries
- **AND** limit SHALL be between 1 and 100

#### Scenario: Fewer countries than limit
- **WHEN** user has visited fewer countries than the limit
- **THEN** the system SHALL return all visited countries

## ADDED Requirements

### Requirement: Date Range Validation
Report queries SHALL validate that the requested date range does not exceed maximum allowed span.

#### Scenario: Valid date range
- **WHEN** date range is 5 years or less
- **THEN** the query SHALL proceed normally

#### Scenario: Excessive date range
- **WHEN** date range exceeds 5 years
- **THEN** the system SHALL return HTTP 400
- **AND** error message SHALL indicate maximum range is 5 years

#### Scenario: Date range calculation
- **WHEN** validating date range
- **THEN** the system SHALL calculate span as `endDate - startDate` in days
- **AND** maximum allowed span SHALL be 1826 days (5 years)
