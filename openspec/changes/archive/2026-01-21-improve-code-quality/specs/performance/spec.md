# Performance - Delta Spec

## ADDED Requirements

### Requirement: React Query Key Stability
React Query hooks SHALL use stable query keys that do not change reference unnecessarily.

#### Scenario: Query key with parameters
- **WHEN** a query depends on multiple parameters
- **THEN** the query key SHALL include individual parameter values
- **AND** NOT include entire objects that may have unstable references

#### Scenario: Query key format
- **WHEN** constructing a query key for reports summary
- **THEN** the key SHALL be `['reports', 'summary', days, start, end]`
- **AND** NOT `['reports', 'summary', params]` where params is an object

### Requirement: Static Asset Pre-compression
The frontend build process SHALL support optional pre-compression of static assets for faster serving.

#### Scenario: Gzip pre-compression configuration
- **WHEN** the build is configured for pre-compression
- **THEN** the build SHALL generate `.gz` versions of JavaScript and CSS files

#### Scenario: Build without pre-compression
- **WHEN** pre-compression is not configured
- **THEN** the build SHALL complete normally without generating compressed files
