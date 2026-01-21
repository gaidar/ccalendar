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

