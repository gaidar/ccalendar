# Reports API - Delta Spec

## ADDED Requirements

### Requirement: Date Parsing Validation
The reports service date parsing utility SHALL validate input format before parsing.

#### Scenario: Valid date format
- **WHEN** a date string in YYYY-MM-DD format is provided
- **THEN** the parser SHALL return a valid Date object
- **AND** the date SHALL be parsed as local time (not UTC)

#### Scenario: Invalid date format
- **WHEN** a date string in invalid format is provided
- **THEN** the parser SHALL throw a validation error
- **AND** the error message SHALL indicate expected format

#### Scenario: Format validation
- **WHEN** validating date format
- **THEN** the parser SHALL verify the string matches `^\d{4}-\d{2}-\d{2}$` pattern
