# Export - Delta Spec

## MODIFIED Requirements

### Requirement: CSV Export Generation
The export service SHALL generate CSV files using streaming to minimize memory usage.

#### Scenario: Large export streaming
- **WHEN** generating CSV for a large dataset (1000+ records)
- **THEN** the system SHALL use an async generator to yield rows
- **AND** NOT build the entire CSV in memory

#### Scenario: Stream format
- **WHEN** streaming CSV content
- **THEN** each yield SHALL produce one CSV row
- **AND** the first yield SHALL be the header row

### Requirement: Export Stream Error Handling
The export controller SHALL handle stream errors gracefully.

#### Scenario: Stream error during export
- **WHEN** a stream error occurs during export
- **THEN** the controller SHALL catch the error via stream error listener
- **AND** pass the error to the Express error handler

#### Scenario: Stream error response
- **WHEN** a stream error is caught before headers sent
- **THEN** the system SHALL return HTTP 500 with appropriate error message
