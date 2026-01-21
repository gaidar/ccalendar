# Countries - Delta Spec

## ADDED Requirements

### Requirement: Country Search Implementation
The countries search functionality SHALL provide fast filtering of the countries list.

#### Scenario: Search by name
- **WHEN** user enters a search term
- **THEN** the system SHALL filter countries whose name contains the search term (case-insensitive)

#### Scenario: Search by code
- **WHEN** user enters a 2-letter code
- **THEN** the system SHALL also match countries by their ISO code

#### Scenario: Search performance
- **WHEN** filtering ~200 countries
- **THEN** the search SHALL complete in under 10ms
- **AND** MAY use simple string matching or fuzzy matching based on requirements
