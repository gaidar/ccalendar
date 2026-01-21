# rate-limiting Specification

## Purpose
TBD - created by archiving change add-security-performance. Update Purpose after archive.
## Requirements
### Requirement: Global Rate Limiting

The API SHALL enforce global rate limiting on all endpoints.

#### Scenario: Global rate limit
- **WHEN** any API request is made
- **THEN** a global rate limit of 100 requests per 15 minutes SHALL be enforced

#### Scenario: Rate limit exceeded
- **WHEN** the global rate limit is exceeded
- **THEN** the response SHALL have status 429
- **AND** the error code SHALL be `RATE_LIMITED`

### Requirement: Authentication Rate Limiting

The API SHALL enforce specific rate limits on authentication endpoints.

#### Scenario: Registration rate limit
- **WHEN** `POST /api/v1/auth/register` is called
- **THEN** a rate limit of 3 requests per hour per IP SHALL be enforced

#### Scenario: Login rate limit
- **WHEN** `POST /api/v1/auth/login` is called
- **THEN** a rate limit of 5 requests per minute per IP SHALL be enforced

#### Scenario: Password reset rate limit
- **WHEN** `POST /api/v1/auth/reset-password` is called
- **THEN** a rate limit of 3 requests per hour per IP SHALL be enforced

#### Scenario: OAuth rate limit
- **WHEN** `GET /api/v1/auth/oauth/*` is called
- **THEN** a rate limit of 10 requests per minute per IP SHALL be enforced

### Requirement: API Rate Limiting

The API SHALL enforce rate limits on data endpoints.

#### Scenario: Travel records rate limit
- **WHEN** `POST /api/v1/travel-records` is called
- **THEN** a rate limit of 60 requests per minute per user SHALL be enforced

#### Scenario: Export rate limit
- **WHEN** `GET /api/v1/reports/export` is called
- **THEN** a rate limit of 5 requests per hour per user SHALL be enforced

### Requirement: Rate Limit Headers

The API SHALL include rate limit information in response headers.

#### Scenario: Rate limit headers present
- **WHEN** any request is made
- **THEN** the response SHALL include:
  - `X-RateLimit-Limit`: maximum requests allowed
  - `X-RateLimit-Remaining`: remaining requests in window
  - `X-RateLimit-Reset`: timestamp when limit resets

#### Scenario: Retry-After header
- **WHEN** rate limit is exceeded
- **THEN** the `Retry-After` header SHALL indicate seconds until reset

### Requirement: Rate Limit Storage

The rate limiter SHALL use Redis for distributed storage.

#### Scenario: Redis store configuration
- **WHEN** the application starts
- **THEN** rate limit data SHALL be stored in Redis

#### Scenario: Redis unavailable
- **WHEN** Redis is unavailable
- **THEN** rate limiting SHALL fall back to in-memory storage
- **AND** a warning SHALL be logged

### Requirement: Redis-Based Export Rate Limiting
The export rate limiter SHALL use Redis for distributed rate limiting across multiple server instances.

#### Scenario: Rate limit counting
- **WHEN** a user requests an export
- **THEN** the system SHALL increment a Redis counter with key `export:ratelimit:{userId}`
- **AND** set TTL of 1 hour on first request in window

#### Scenario: Rate limit exceeded
- **WHEN** user exceeds 5 export requests per hour
- **THEN** the system SHALL return HTTP 429 with error code `RATE_LIMIT_EXCEEDED`
- **AND** include `Retry-After` header with seconds until reset

#### Scenario: Redis unavailable fallback
- **WHEN** Redis is unavailable
- **THEN** the system SHALL allow the export request
- **AND** log a warning about rate limiter fallback

### Requirement: Export Rate Limiter Memory Management
The in-memory export rate limiter (if used) SHALL minimize memory accumulation.

#### Scenario: Cleanup frequency
- **WHEN** the server is running
- **THEN** the rate limiter SHALL clean up expired entries every 5 minutes
- **AND** NOT accumulate stale entries for extended periods

#### Scenario: Entry expiration
- **WHEN** a rate limit window expires
- **THEN** the entry SHALL be removed during the next cleanup cycle
- **AND** memory SHALL be released

Note: This requirement becomes obsolete when Redis-based rate limiting is implemented (fix-critical-issues change).

