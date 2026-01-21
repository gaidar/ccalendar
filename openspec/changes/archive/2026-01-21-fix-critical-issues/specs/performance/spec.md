# Performance - Delta Spec

## ADDED Requirements

### Requirement: Response Compression
The API SHALL compress HTTP responses using gzip compression.

#### Scenario: Large response compression
- **WHEN** response body exceeds 1KB
- **THEN** the system SHALL compress the response using gzip level 6
- **AND** set `Content-Encoding: gzip` header

#### Scenario: Small response pass-through
- **WHEN** response body is less than 1KB
- **THEN** the system SHALL NOT compress the response

#### Scenario: Stream response exclusion
- **WHEN** response is a streaming export
- **THEN** the system SHALL NOT apply compression middleware

### Requirement: Country Lookup Cache
The countries service SHALL maintain an in-memory cache for O(1) country lookups.

#### Scenario: Cache initialization
- **WHEN** the API server starts
- **THEN** the system SHALL populate a `Map<string, Country>` with all countries

#### Scenario: Country lookup
- **WHEN** a country is looked up by code
- **THEN** the system SHALL return the country from the cache in O(1) time

#### Scenario: Cache miss
- **WHEN** an invalid country code is requested
- **THEN** the system SHALL return `undefined`

### Requirement: API Request Timeout
The frontend API client SHALL implement request timeouts to prevent hanging requests.

#### Scenario: Request timeout
- **WHEN** an API request takes longer than 30 seconds
- **THEN** the client SHALL abort the request
- **AND** throw a timeout error

#### Scenario: Timeout cleanup
- **WHEN** a request completes before timeout
- **THEN** the client SHALL clear the timeout timer
