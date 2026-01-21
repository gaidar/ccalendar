# performance Specification

## Purpose
TBD - created by archiving change add-security-performance. Update Purpose after archive.
## Requirements
### Requirement: Database Indexes

The database SHALL have appropriate indexes for query performance.

#### Scenario: User email index
- **WHEN** the database is set up
- **THEN** a unique index on `users.email` SHALL exist

#### Scenario: Travel records date index
- **WHEN** the database is set up
- **THEN** a compound index on `travel_records(userId, date)` SHALL exist

#### Scenario: Travel records unique constraint
- **WHEN** the database is set up
- **THEN** a unique constraint on `travel_records(userId, date, countryCode)` SHALL exist

#### Scenario: OAuth unique constraint
- **WHEN** the database is set up
- **THEN** a unique constraint on `oauth_accounts(provider, providerId)` SHALL exist

#### Scenario: Support ticket reference index
- **WHEN** the database is set up
- **THEN** a unique index on `support_tickets.referenceId` SHALL exist

### Requirement: Redis Caching

The application SHALL use Redis for caching frequently accessed data.

#### Scenario: Redis connection
- **WHEN** the application starts
- **THEN** a Redis connection SHALL be established using REDIS_URL

#### Scenario: Countries list caching
- **WHEN** the countries list is requested
- **THEN** it SHALL be served from Redis cache if available
- **AND** the cache TTL SHALL be 24 hours

#### Scenario: Cache miss
- **WHEN** cached data is not available
- **THEN** data SHALL be fetched from the database
- **AND** the result SHALL be cached

#### Scenario: Token blacklist
- **WHEN** a user logs out
- **THEN** the refresh token SHALL be added to a Redis blacklist
- **AND** the blacklist entry SHALL expire when the token would expire

### Requirement: Frontend Code Splitting

The frontend SHALL implement route-based code splitting.

#### Scenario: Route lazy loading
- **WHEN** the application is built
- **THEN** each route SHALL be in a separate chunk
- **AND** chunks SHALL be loaded on demand

#### Scenario: Suspense boundaries
- **WHEN** a lazy-loaded route is being fetched
- **THEN** a loading indicator SHALL be displayed

#### Scenario: Split routes
- **WHEN** code splitting is configured
- **THEN** the following routes SHALL be split:
  - Landing page
  - Login page
  - Register page
  - Calendar page
  - Reports page
  - Profile page
  - Support page
  - Admin pages

### Requirement: Frontend Optimizations

The frontend SHALL implement performance optimizations.

#### Scenario: Component memoization
- **WHEN** rendering expensive components
- **THEN** React.memo SHALL be used to prevent unnecessary re-renders

#### Scenario: Computation memoization
- **WHEN** performing expensive calculations
- **THEN** useMemo SHALL be used to cache results

#### Scenario: Callback stability
- **WHEN** passing callbacks to child components
- **THEN** useCallback SHALL be used for stable references

#### Scenario: Image lazy loading
- **WHEN** images are displayed
- **THEN** images below the fold SHALL be lazy loaded

### Requirement: API Performance

The API SHALL implement performance optimizations.

#### Scenario: Database connection pooling
- **WHEN** the application connects to the database
- **THEN** connection pooling SHALL be used via Prisma

#### Scenario: Streaming exports
- **WHEN** exporting large datasets
- **THEN** the response SHALL be streamed
- **AND** memory usage SHALL remain constant regardless of data size

#### Scenario: Pagination
- **WHEN** returning list endpoints
- **THEN** pagination SHALL be enforced
- **AND** maximum page size SHALL be limited

### Requirement: Performance Monitoring

The application SHALL log performance metrics.

#### Scenario: Request duration logging
- **WHEN** a request completes
- **THEN** the response time SHALL be logged

#### Scenario: Slow query logging
- **WHEN** a database query takes more than 100ms
- **THEN** it SHALL be logged as a warning

#### Scenario: Memory monitoring
- **WHEN** running in production
- **THEN** memory usage MAY be periodically logged

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

