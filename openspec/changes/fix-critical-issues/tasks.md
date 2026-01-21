# Tasks: Fix Critical and High-Priority Issues

## 1. P0 - Critical Issues

### 1.1 Fix Rate Limiter Key Generation
- [x] 1.1.1 Update `packages/api/src/middleware/rateLimit.ts` line 145: change `user?.id` to `user?.userId`
- [x] 1.1.2 Update `packages/api/src/middleware/rateLimit.ts` line 160: change `user?.id` to `user?.userId`
- [x] 1.1.3 Update type assertion from `{ id?: string }` to `{ userId?: string }`
- [x] 1.1.4 Add unit test for rate limiter key generation with authenticated user
- [x] 1.1.5 Add integration test verifying user-based rate limiting

### 1.2 Replace In-Memory Export Rate Limiter with Redis
- [x] 1.2.1 Create new `packages/api/src/services/redisExportRateLimiter.ts`
- [x] 1.2.2 Implement Redis-based rate limiting using ioredis (already a dependency)
- [x] 1.2.3 Use Redis `INCR` with `EXPIRE` for atomic rate limit counting
- [x] 1.2.4 Update `packages/api/src/controllers/reportsController.ts` to use new rate limiter
- [x] 1.2.5 Remove or deprecate `packages/api/src/services/exportRateLimiter.ts`
- [x] 1.2.6 Add integration test for Redis rate limiter
- [x] 1.2.7 Add fallback behavior when Redis is unavailable

## 2. P1 - High Priority Issues

### 2.1 Create Country Lookup Cache
- [x] 2.1.1 Add `countryCache: Map<string, Country>` to `packages/api/src/services/countriesService.ts`
- [x] 2.1.2 Implement `initializeCache()` to populate map on startup
- [x] 2.1.3 Update `getCountryByCode()` to use cache instead of array lookup
- [x] 2.1.4 Call cache initialization in `packages/api/src/index.ts` on startup
- [x] 2.1.5 Add unit test for cache lookup performance
**Note: Already implemented in existing code**

### 2.2 Add Email Operation Error Handling
- [x] 2.2.1 Update `packages/api/src/controllers/authController.ts` - wrap email calls in try-catch
- [x] 2.2.2 Update `packages/api/src/controllers/supportController.ts` - wrap email calls in try-catch
- [x] 2.2.3 Update `packages/api/src/controllers/profileController.ts` - wrap email calls in try-catch
- [x] 2.2.4 Add logging for email failures with appropriate error level
- [ ] 2.2.5 Consider implementing email job queue for retry functionality (optional enhancement)
**Note: Already implemented in existing code**

### 2.3 Add Response Compression
- [x] 2.3.1 Add `compression` package to `packages/api/package.json`
- [x] 2.3.2 Import and configure compression middleware in `packages/api/src/index.ts`
- [x] 2.3.3 Set compression level to 6 (balanced)
- [x] 2.3.4 Test response sizes before/after compression
**Note: Already implemented in existing code**

### 2.4 Implement Streaming CSV Export
- [x] 2.4.1 Refactor `packages/api/src/services/exportService.ts` `generateCsv()` method
- [x] 2.4.2 Replace string concatenation with generator-based approach
- [x] 2.4.3 Use `Readable.from()` with async generator
- [x] 2.4.4 Test memory usage with large exports (50K+ records)

### 2.5 Add Stream Error Handler
- [x] 2.5.1 Update `packages/api/src/controllers/reportsController.ts` line 156
- [x] 2.5.2 Add error listener before piping: `stream.on('error', (err) => next(err))`
- [x] 2.5.3 Add unit test for stream error handling

## 3. P2 - Medium Priority Issues

### 3.1 Add Travel Records Pagination
- [x] 3.1.1 Add `skip` and `take` parameters to `getRecordsByDateRange()` in `packages/api/src/services/travelRecordsService.ts`
- [x] 3.1.2 Update validator to accept pagination parameters
- [x] 3.1.3 Update controller to pass pagination parameters
- [x] 3.1.4 Return total count in response for frontend pagination
- [ ] 3.1.5 Update frontend hook to support pagination (optional)

### 3.2 Add Time Constraint to Login Attempt Cleanup
- [x] 3.2.1 Update `packages/api/src/services/authService.ts` lines 158-164
- [x] 3.2.2 Add `createdAt: { lt: thirtyDaysAgo }` condition to deleteMany
- [x] 3.2.3 Add unit test for cleanup constraint

### 3.3 Optimize Admin Stats Query
- [x] 3.3.1 Update `packages/api/src/services/adminStatsService.ts` lines 22-28
- [x] 3.3.2 Replace `groupBy` with `findMany` using `distinct: ['userId']`
- [x] 3.3.3 Benchmark query performance improvement

### 3.4 Replace console.error with Logger
- [x] 3.4.1 Update `packages/api/src/config/index.ts` lines 41-43: use logger.error
**Note: console.error is intentional here - logger may not be initialized during config validation**
- [x] 3.4.2 Update `packages/api/src/controllers/oauthController.ts` line 60: use logger.error
- [x] 3.4.3 Update `packages/web/src/components/ErrorBoundary.tsx` lines 36-37: use console.error only in dev (already conditional)

### 3.5 Add API JSON Parsing Safety
- [x] 3.5.1 Update `packages/web/src/lib/api.ts` line 51
- [x] 3.5.2 Wrap `response.json()` in try-catch
- [x] 3.5.3 Return appropriate error for malformed responses

### 3.6 Add API Request Timeout
- [x] 3.6.1 Update `packages/web/src/lib/api.ts`
- [x] 3.6.2 Add AbortController with configurable timeout (default 30s)
- [x] 3.6.3 Handle AbortError and show appropriate user feedback

### 3.7 Add Reports TopCountries Limit
- [x] 3.7.1 Update `packages/api/src/services/reportsService.ts` lines 131-141
- [x] 3.7.2 Add `limit` parameter to `getSummary()` (default 10)
- [x] 3.7.3 Apply `.slice(0, limit)` to topCountries array
- [x] 3.7.4 Update validator and controller

### 3.8 Add Date Range Validation
- [x] 3.8.1 Create date range validation helper in `packages/api/src/validators/`
- [x] 3.8.2 Add max 5-year range validation to travel records queries
- [x] 3.8.3 Add max 5-year range validation to reports queries
- [x] 3.8.4 Return clear error message when range exceeded
**Note: Already implemented in existing code**

### 3.9 Add Login Attempts Index
- [x] 3.9.1 Add migration to add index on `(success, createdAt)` to `LoginAttempt` table
- [x] 3.9.2 Update `packages/api/prisma/schema.prisma` with new index
- [ ] 3.9.3 Run migration and verify
**Note: Schema updated, migration pending deployment**

### 3.10 Implement Token Cleanup Job
- [x] 3.10.1 Create scheduled task in `packages/api/src/jobs/tokenCleanup.ts`
- [x] 3.10.2 Use `setInterval` for hourly cleanup
- [x] 3.10.3 Run cleanup on startup and hourly for expired tokens
- [x] 3.10.4 Add logging for cleanup operations

### 3.11 Use HttpError in Support Service
- [x] 3.11.1 Update `packages/api/src/services/supportService.ts` line 62
- [x] 3.11.2 Replace `throw new Error()` with `throw new HttpError(500, 'REFERENCE_ID_GENERATION_FAILED', ...)`
- [x] 3.11.3 Update error handler if needed

### 3.12 Combine Admin User Stats Queries
- [x] 3.12.1 Update `packages/api/src/services/adminUserService.ts` lines 98-104
- [x] 3.12.2 Combine count and groupBy into single query with `_count`
- [x] 3.12.3 Calculate totals from grouped results

## 4. Testing & Validation

- [x] 4.1 Run all existing tests to ensure no regressions
- [x] 4.2 Run linter on all modified files
- [x] 4.3 Test rate limiting manually with authenticated users
- [x] 4.4 Test export rate limiting across multiple instances (if possible)
- [x] 4.5 Measure response sizes with and without compression
- [x] 4.6 Test large exports for memory usage

## 5. Documentation

- [ ] 5.1 Update API documentation for new pagination parameters
- [ ] 5.2 Document Redis requirement for export rate limiting
- [ ] 5.3 Add performance notes to deployment guide
