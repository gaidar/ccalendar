# Change: Fix Critical and High-Priority Issues

## Why

A comprehensive code review identified critical bugs and performance issues affecting production reliability. The most severe issues include incorrect rate limiting behavior (all users rate-limited by IP instead of user ID) and in-memory rate limiting that fails in multi-instance deployments. Additionally, there are performance bottlenecks (N+1 queries, missing compression) and reliability issues (unhandled errors in email operations, stream handling).

## What Changes

### P0 - Critical
- **BREAKING**: Fix rate limiter key generation to use `userId` instead of `id`
- Replace in-memory export rate limiter with Redis-based implementation

### P1 - High Priority
- Create in-memory country lookup cache to eliminate N+1 queries
- Add try-catch error handling for all async email operations
- Add response compression middleware to Express
- Implement streaming CSV export instead of building in memory
- Add error handler for stream pipe operations in export controller

### P2 - Medium Priority
- Add pagination support to travel records query
- Add time constraint to login attempt cleanup (delete only old attempts)
- Optimize admin stats query (use `distinct` instead of `groupBy`)
- Replace `console.error` with logger in config, OAuth controller, and error boundary
- Wrap API JSON parsing in try-catch
- Add AbortController timeout to frontend API requests
- Add limit parameter to reports topCountries response
- Add maximum date range validation to API queries
- Add database index on login attempts `(success, createdAt)`
- Implement scheduled token cleanup job
- Use HttpError instead of generic Error in support service
- Combine admin user stats queries into single query

## Impact

- Affected specs: `rate-limiting`, `performance`, `export`, `email-service`, `reports-api`, `travel-records`, `logging`, `admin-api`, `support-api`
- Affected code:
  - `packages/api/src/middleware/rateLimit.ts`
  - `packages/api/src/services/exportRateLimiter.ts`
  - `packages/api/src/services/countriesService.ts`
  - `packages/api/src/services/reportsService.ts`
  - `packages/api/src/services/travelRecordsService.ts`
  - `packages/api/src/services/exportService.ts`
  - `packages/api/src/services/authService.ts`
  - `packages/api/src/services/adminStatsService.ts`
  - `packages/api/src/services/adminUserService.ts`
  - `packages/api/src/services/supportService.ts`
  - `packages/api/src/controllers/authController.ts`
  - `packages/api/src/controllers/supportController.ts`
  - `packages/api/src/controllers/profileController.ts`
  - `packages/api/src/controllers/reportsController.ts`
  - `packages/api/src/config/index.ts`
  - `packages/api/src/index.ts`
  - `packages/api/prisma/schema.prisma`
  - `packages/web/src/lib/api.ts`
  - `packages/web/src/components/ErrorBoundary.tsx`
