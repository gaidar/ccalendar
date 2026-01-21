# Support API - Delta Spec

## MODIFIED Requirements

### Requirement: Support Service Error Types
The support service SHALL use proper HTTP error types for all error conditions.

#### Scenario: Reference ID generation failure
- **WHEN** the system fails to generate a unique reference ID
- **THEN** the service SHALL throw `HttpError` with:
  - Status code: 500
  - Error code: `REFERENCE_ID_GENERATION_FAILED`
  - Message: Descriptive error message

#### Scenario: Error handler processing
- **WHEN** the error handler receives an `HttpError`
- **THEN** it SHALL return the appropriate HTTP status code
- **AND** include the error code in the response body

## ADDED Requirements

### Requirement: Token Cleanup Scheduling
The token service SHALL implement scheduled cleanup of expired tokens.

#### Scenario: Scheduled cleanup
- **WHEN** the API server is running
- **THEN** the system SHALL run token cleanup once per day

#### Scenario: Cleanup operation
- **WHEN** cleanup runs
- **THEN** the system SHALL delete all expired:
  - Refresh tokens
  - Email confirmation tokens
  - Password reset tokens
- **AND** log the number of tokens deleted
