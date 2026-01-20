## ADDED Requirements

### Requirement: Countries Data File

The project SHALL include a JSON file with all ISO 3166-1 alpha-2 country codes.

#### Scenario: Countries data location
- **WHEN** the countries data is needed
- **THEN** it SHALL be located at `packages/api/data/countries.json`

#### Scenario: Countries data format
- **WHEN** the countries.json file is examined
- **THEN** it SHALL contain an array of country objects with:
  - `code` - ISO 3166-1 alpha-2 code (e.g., "US")
  - `name` - Full country name in English (e.g., "United States")
  - `color` - Hex color for calendar display (e.g., "#3b82f6")

#### Scenario: Complete country list
- **WHEN** the countries data is loaded
- **THEN** it SHALL contain all 249 ISO 3166-1 alpha-2 codes
- **AND** each country SHALL have a unique color for visual distinction

### Requirement: Countries API Endpoint

The API SHALL provide an endpoint to retrieve the countries list.

#### Scenario: Countries endpoint response
- **WHEN** `GET /api/v1/countries` is called
- **THEN** it SHALL return status 200
- **AND** the response SHALL include:
```json
{
  "countries": [
    { "code": "AF", "name": "Afghanistan", "color": "#d4a59a" },
    { "code": "AL", "name": "Albania", "color": "#e6b9b8" }
  ],
  "total": 249
}
```

#### Scenario: Countries endpoint caching
- **WHEN** the countries endpoint is called
- **THEN** the response SHALL include cache headers
- **AND** `Cache-Control: public, max-age=86400` SHALL be set (24 hours)

#### Scenario: Countries endpoint performance
- **WHEN** the countries data is requested
- **THEN** it SHALL be loaded from memory (not disk) on each request
- **AND** the data SHALL be loaded into memory at application startup

### Requirement: Countries Data Seeding

The countries data SHALL be seeded and available immediately.

#### Scenario: Data availability
- **WHEN** the API starts
- **THEN** the countries data SHALL be loaded into memory
- **AND** the `/countries` endpoint SHALL return data immediately

#### Scenario: Data immutability
- **WHEN** the countries data is loaded
- **THEN** it SHALL be treated as immutable reference data
- **AND** no API endpoint SHALL modify the countries list

### Requirement: Country Code Validation

The API SHALL validate country codes against the countries data.

#### Scenario: Valid country code
- **WHEN** a request includes a country code like "US"
- **THEN** validation SHALL succeed if the code exists in countries.json

#### Scenario: Invalid country code
- **WHEN** a request includes an invalid country code like "XX"
- **THEN** validation SHALL fail with error "Invalid country code"

#### Scenario: Case insensitivity
- **WHEN** a country code is validated
- **THEN** it SHALL be converted to uppercase before validation
- **AND** "us", "Us", and "US" SHALL all be treated as valid

### Requirement: Country Color Assignment

Each country SHALL have a unique display color.

#### Scenario: Color format
- **WHEN** country colors are examined
- **THEN** each color SHALL be a valid 6-digit hex color (e.g., "#3b82f6")
- **AND** colors SHALL provide good visual distinction on a calendar

#### Scenario: Color consistency
- **WHEN** a user views their calendar
- **THEN** the same country SHALL always display with the same color
- **AND** colors SHALL be deterministic based on the countries.json file

### Requirement: Frontend Countries Access

The frontend SHALL be able to access the countries list.

#### Scenario: Frontend countries hook
- **WHEN** the frontend needs countries data
- **THEN** a `useCountries` hook SHALL be available
- **AND** it SHALL fetch data from the `/countries` endpoint
- **AND** data SHALL be cached using TanStack Query with long stale time

#### Scenario: Countries search
- **WHEN** a user searches for a country
- **THEN** the frontend SHALL support fuzzy search by name and code
- **AND** Fuse.js or similar library SHALL be used for fuzzy matching
