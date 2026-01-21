# Rate Limiting - Delta Spec

## ADDED Requirements

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
