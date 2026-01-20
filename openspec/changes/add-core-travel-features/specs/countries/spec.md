## ADDED Requirements

### Requirement: Countries List Endpoint

The API SHALL provide a public endpoint to retrieve the list of all countries with their display colors.

#### Scenario: Successful countries list retrieval
- **WHEN** `GET /api/v1/countries` is called
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include a `countries` array
- **AND** the array SHALL contain all 249 ISO 3166-1 alpha-2 countries
- **AND** each country SHALL include:
  - `code`: ISO 3166-1 alpha-2 country code (2 uppercase letters)
  - `name`: full country name in English
  - `color`: hex color code for display (e.g., "#d4a59a")

#### Scenario: Countries list is public
- **WHEN** `GET /api/v1/countries` is called without authentication
- **THEN** the response SHALL still return status 200
- **AND** the full countries list SHALL be returned

#### Scenario: Countries list alphabetical order
- **WHEN** `GET /api/v1/countries` is called
- **THEN** the countries SHALL be sorted alphabetically by name

### Requirement: Countries Response Caching

The API SHALL implement caching for the countries list endpoint.

#### Scenario: Cache headers set
- **WHEN** `GET /api/v1/countries` is called
- **THEN** the response SHALL include `Cache-Control` header
- **AND** the cache duration SHALL be set to at least 1 hour
- **AND** the response SHALL include appropriate ETag header

#### Scenario: Conditional request handling
- **WHEN** `GET /api/v1/countries` is called with `If-None-Match` header matching current ETag
- **THEN** the response SHALL have status 304 (Not Modified)
- **AND** no response body SHALL be sent

#### Scenario: Server-side caching
- **WHEN** multiple requests to `GET /api/v1/countries` are made
- **THEN** the countries data SHALL be loaded from memory cache
- **AND** the data file SHALL NOT be read on every request

### Requirement: Country Data Integrity

The API SHALL ensure country data is complete and valid.

#### Scenario: All ISO 3166-1 alpha-2 codes present
- **WHEN** the countries data is loaded
- **THEN** all 249 officially assigned ISO 3166-1 alpha-2 codes SHALL be present
- **AND** no duplicate codes SHALL exist

#### Scenario: Valid color codes
- **WHEN** the countries data is loaded
- **THEN** each country SHALL have a valid hex color code
- **AND** colors SHALL be in the format "#RRGGBB"

#### Scenario: Country names in English
- **WHEN** the countries data is loaded
- **THEN** each country name SHALL be in English
- **AND** names SHALL match the ISO 3166-1 standard English short name

### Requirement: Country Lookup Service

The API SHALL provide internal services for country code validation and lookup.

#### Scenario: Valid country code lookup
- **WHEN** `getCountryByCode("US")` is called
- **THEN** the country object for United States SHALL be returned
- **AND** it SHALL include code, name, and color

#### Scenario: Invalid country code lookup
- **WHEN** `getCountryByCode("XX")` is called with an invalid code
- **THEN** `null` or `undefined` SHALL be returned

#### Scenario: Country code validation
- **WHEN** `isValidCountryCode("FR")` is called with a valid code
- **THEN** `true` SHALL be returned

#### Scenario: Country code validation - invalid
- **WHEN** `isValidCountryCode("ZZ")` is called with an invalid code
- **THEN** `false` SHALL be returned

#### Scenario: Case-insensitive lookup
- **WHEN** `getCountryByCode("us")` is called with lowercase
- **THEN** the country SHALL still be found
- **AND** the code SHALL be normalized to uppercase internally
