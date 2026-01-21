# Rate Limiting - Delta Spec

## ADDED Requirements

### Requirement: Rate Limiter Key Generation
The rate limiting middleware SHALL identify authenticated users by their `userId` property from the JWT payload.

#### Scenario: Authenticated user rate limiting
- **WHEN** an authenticated user makes requests
- **THEN** the rate limiter SHALL use `req.user.userId` as the rate limit key
- **AND** requests SHALL be counted per user, not per IP address

#### Scenario: Unauthenticated user rate limiting
- **WHEN** an unauthenticated user makes requests
- **THEN** the rate limiter SHALL fall back to using `req.ip` as the rate limit key

#### Scenario: Unknown user fallback
- **WHEN** neither user ID nor IP is available
- **THEN** the rate limiter SHALL use `'unknown'` as the rate limit key

## ADDED Requirements

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
