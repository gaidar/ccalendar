## ADDED Requirements

### Requirement: Helmet.js Security Headers

The API SHALL use Helmet.js to set security headers on all responses.

#### Scenario: Content Security Policy
- **WHEN** the API returns a response
- **THEN** the Content-Security-Policy header SHALL be set
- **AND** default-src SHALL be 'self'
- **AND** style-src SHALL allow 'self' and 'unsafe-inline'
- **AND** script-src SHALL be 'self'
- **AND** img-src SHALL allow 'self', data:, and https:
- **AND** connect-src SHALL allow 'self' and the API domain

#### Scenario: Strict Transport Security
- **WHEN** the API returns a response in production
- **THEN** the Strict-Transport-Security header SHALL be set
- **AND** max-age SHALL be 31536000 (1 year)
- **AND** includeSubDomains SHALL be enabled

#### Scenario: X-Frame-Options
- **WHEN** the API returns a response
- **THEN** the X-Frame-Options header SHALL be set to DENY

#### Scenario: X-Content-Type-Options
- **WHEN** the API returns a response
- **THEN** the X-Content-Type-Options header SHALL be set to nosniff

#### Scenario: Referrer-Policy
- **WHEN** the API returns a response
- **THEN** the Referrer-Policy header SHALL be set to strict-origin-when-cross-origin

### Requirement: CORS Configuration

The API SHALL configure CORS to allow requests from authorized origins.

#### Scenario: Allowed origins
- **WHEN** a request is made from the frontend origin
- **THEN** the request SHALL be allowed
- **AND** the Access-Control-Allow-Origin header SHALL be set

#### Scenario: Development origin
- **WHEN** in development mode
- **THEN** localhost origins SHALL be allowed

#### Scenario: Production origin
- **WHEN** in production mode
- **THEN** only the production frontend URL SHALL be allowed

#### Scenario: Disallowed origins
- **WHEN** a request is made from an unauthorized origin
- **THEN** the CORS preflight SHALL fail
- **AND** the request SHALL be rejected

#### Scenario: CORS methods
- **WHEN** CORS is configured
- **THEN** the following methods SHALL be allowed: GET, POST, PATCH, DELETE, OPTIONS

#### Scenario: CORS credentials
- **WHEN** CORS is configured
- **THEN** credentials (cookies) SHALL be allowed

### Requirement: Input Sanitization

The API SHALL sanitize all user inputs.

#### Scenario: String trimming
- **WHEN** a string input is received
- **THEN** leading and trailing whitespace SHALL be trimmed

#### Scenario: Email normalization
- **WHEN** an email input is received
- **THEN** it SHALL be converted to lowercase

#### Scenario: Control character removal
- **WHEN** a string input is received
- **THEN** control characters SHALL be removed

#### Scenario: HTML in text fields
- **WHEN** HTML is submitted in text fields
- **THEN** it SHALL be stored as-is but escaped on output
- **AND** XSS attacks SHALL be prevented

### Requirement: CSRF Protection

The API SHALL implement CSRF protection for state-changing operations.

#### Scenario: OAuth state parameter
- **WHEN** initiating an OAuth flow
- **THEN** a state parameter SHALL be generated and validated

#### Scenario: Cookie security
- **WHEN** setting cookies
- **THEN** httpOnly flag SHALL be set for sensitive cookies
- **AND** secure flag SHALL be set in production
- **AND** sameSite SHALL be set appropriately
