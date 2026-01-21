# Country Calendar - Code Improvements Task List

This document contains a prioritized list of improvements identified during a comprehensive code review covering security, error handling, performance, and code quality.

## Priority Legend

| Priority | Description |
|----------|-------------|
| **P0 - Critical** | Bugs affecting production functionality or security vulnerabilities |
| **P1 - High** | Significant performance issues or important missing functionality |
| **P2 - Medium** | Code quality issues that should be addressed |
| **P3 - Low** | Minor improvements and optimizations |

---

## P0 - Critical Issues

### 1. Rate Limiter Uses Wrong Property Name (Production Bug)
- **File**: `packages/api/src/middleware/rateLimit.ts` (lines 145, 160)
- **Issue**: Rate limiter key generation uses `user?.id` but authentication middleware sets `userId`
- **Impact**: All authenticated users are rate-limited by IP address instead of user ID, causing incorrect rate limiting behavior
- **Fix**: Change `user?.id` to `user?.userId` in keyGenerator functions
```typescript
// Current (wrong):
const user = req.user as { id?: string } | undefined;
return user?.id || req.ip || 'unknown';

// Should be:
const user = req.user as { userId?: string } | undefined;
return user?.userId || req.ip || 'unknown';
```

### 2. In-Memory Export Rate Limiter Not Production-Ready
- **File**: `packages/api/src/services/exportRateLimiter.ts` (line 24)
- **Issue**: Uses `Map<string, RateLimitEntry>` for rate limiting, which fails with multiple server instances
- **Impact**: Export rate limits don't work correctly in multi-instance deployments (Heroku dynos)
- **Fix**: Replace with Redis-based rate limiting (ioredis is already a dependency)

---

## P1 - High Priority Issues

### 3. N+1 Query Problem in Country Lookups
- **Files**:
  - `packages/api/src/services/reportsService.ts` (line 134)
  - `packages/api/src/services/travelRecordsService.ts` (line 40)
  - `packages/api/src/services/exportService.ts` (line 208)
- **Issue**: `countriesService.getCountryByCode()` called in loops for each record
- **Impact**: Unnecessary repeated lookups; degrades performance with large datasets
- **Fix**: Build a `Map<string, Country>` once during app startup and use it for all lookups

### 4. Fire-and-Forget Email Operations Without Error Handling
- **Files**:
  - `packages/api/src/controllers/authController.ts` (lines 45-49, 108-112, 256-261, 308-312)
  - `packages/api/src/controllers/supportController.ts` (lines 24-43)
  - `packages/api/src/controllers/profileController.ts` (lines 103-107, 149-153)
- **Issue**: 9+ async email calls without try-catch or error tracking
- **Impact**: Email failures are silently ignored; users won't know if emails failed
- **Fix**: Add try-catch blocks with proper logging, or use a job queue for email sending

### 5. Missing Response Compression
- **File**: `packages/api/src/index.ts`
- **Issue**: No compression middleware configured for Express
- **Impact**: Large JSON responses (reports, country lists) sent uncompressed
- **Fix**: Add compression middleware
```typescript
import compression from 'compression';
app.use(compression({ level: 6 }));
```

### 6. CSV Export Builds Entire Content in Memory
- **File**: `packages/api/src/services/exportService.ts` (lines 38-51)
- **Issue**: Builds entire CSV as a string before streaming
- **Impact**: Large exports (50K+ records) cause significant memory pressure
- **Fix**: Use generator-based streaming approach

### 7. Stream Pipe Without Error Handler
- **File**: `packages/api/src/controllers/reportsController.ts` (line 156)
- **Issue**: `result.stream.pipe(res)` has no error handler
- **Impact**: Stream failures abort response without proper error handling
- **Fix**: Add error listener to stream before piping

---

## P2 - Medium Priority Issues

### 8. Missing Pagination on Travel Records
- **File**: `packages/api/src/services/travelRecordsService.ts` (lines 135-144)
- **Issue**: No pagination on `findMany` query for travel records
- **Impact**: Users with 10+ years of data could fetch thousands of records at once
- **Fix**: Add optional `skip` and `take` parameters

### 9. Unbounded Delete in Login Attempt Cleanup
- **File**: `packages/api/src/services/authService.ts` (lines 158-164)
- **Issue**: Deletes ALL failed login attempts for an email without time limit
- **Impact**: Could be slow operation on large datasets
- **Fix**: Add time constraint (e.g., only delete attempts older than 30 days)

### 10. Inefficient Admin Stats Query
- **File**: `packages/api/src/services/adminStatsService.ts` (lines 22-28)
- **Issue**: Using `groupBy` just to count unique active users
- **Impact**: Suboptimal query performance
- **Fix**: Use `distinct` query instead

### 11. Console.error Used Instead of Logger
- **Files**:
  - `packages/api/src/config/index.ts` (lines 41-43)
  - `packages/api/src/controllers/oauthController.ts` (line 60)
  - `packages/web/src/components/ErrorBoundary.tsx` (lines 36-37)
- **Issue**: Direct console.error bypasses structured logging and error tracking
- **Impact**: Inconsistent logging, missing Sentry tracking
- **Fix**: Replace with logger utility calls

### 12. API JSON Response Parsing Can Fail Silently
- **File**: `packages/web/src/lib/api.ts` (line 51)
- **Issue**: `await response.json()` not wrapped in try-catch
- **Impact**: Malformed responses cause unhandled promise rejections
- **Fix**: Wrap in try-catch or use safer JSON parser

### 13. No API Request Timeout
- **File**: `packages/web/src/lib/api.ts`
- **Issue**: Fetch requests have no timeout configured
- **Impact**: Slow/dead servers cause UI to freeze indefinitely
- **Fix**: Add AbortController with timeout

### 14. Large Report Payloads Without Limits
- **File**: `packages/api/src/services/reportsService.ts` (lines 131-141)
- **Issue**: `topCountries` array returned without pagination or limit
- **Impact**: Users with 100+ countries get unnecessarily large responses
- **Fix**: Add `limit` parameter, default to top 10

### 15. Missing Date Range Validation
- **Files**: Various validators
- **Issue**: No maximum date range validation on queries
- **Impact**: Queries like `?start=1900-01-01&end=2099-12-31` could fetch massive datasets
- **Fix**: Add maximum date range validation (e.g., max 5 years)

### 16. Missing Index on Login Attempts
- **File**: `packages/api/prisma/schema.prisma`
- **Issue**: No index on `(success, createdAt)` for login attempts table
- **Impact**: Admin stats query for active users is slower than necessary
- **Fix**: Add composite index

### 17. Token Cleanup Job Not Scheduled
- **File**: `packages/api/src/services/tokenService.ts`
- **Issue**: `cleanupExpiredTokens()` function exists but not scheduled
- **Impact**: Expired tokens accumulate in database
- **Risk**: Low - tokens are validated before use
- **Fix**: Implement scheduled task (e.g., daily cron job)

### 18. Generic Error Instead of HttpError
- **File**: `packages/api/src/services/supportService.ts` (line 62)
- **Issue**: Throws generic `Error` instead of custom `HttpError`
- **Impact**: Caught as "INTERNAL_ERROR" instead of descriptive error code
- **Fix**: Use `new HttpError(500, 'REFERENCE_ID_GENERATION_FAILED', ...)`

### 19. Multiple Queries for Admin User Stats
- **File**: `packages/api/src/services/adminUserService.ts` (lines 98-104)
- **Issue**: Two separate queries to get record count and country count
- **Impact**: Unnecessary database round-trips
- **Fix**: Combine into single `groupBy` query with `_count`

---

## P3 - Low Priority Issues

### 20. Object Reference in React Query Key
- **File**: `packages/web/src/hooks/useReports.ts` (lines 37-42)
- **Issue**: Using entire `params` object in queryKey
- **Impact**: Unnecessary cache invalidation if object reference changes
- **Fix**: Destructure params: `queryKey: ['reports', 'summary', params.days, params.start, params.end]`

### 21. Fuse.js Overkill for Country Search
- **File**: `packages/web/src/hooks/useCountries.ts` (lines 29-36)
- **Issue**: Creates Fuse.js search index for ~200 countries
- **Impact**: Minimal, but simple array filter would be faster
- **Fix**: Consider replacing with simple `filter()` for this small dataset

### 22. Unsafe Type Assertions in OAuth
- **File**: `packages/api/src/controllers/oauthController.ts` (line 35)
- **Issue**: Double type assertion `req.user as unknown as LoginResult`
- **Impact**: Type safety weakened
- **Fix**: Add runtime validation before casting

### 23. Unsafe Type Assertions in Passport Config
- **File**: `packages/api/src/config/passport.ts` (lines 41, 78)
- **Issue**: Using `as any` for Passport callbacks
- **Impact**: Documented workaround, but weakens type safety
- **Note**: Low priority - intentional due to Passport type limitations

### 24. Date Parsing Without Format Validation
- **File**: `packages/api/src/services/reportsService.ts` (lines 50-54)
- **Issue**: `parseLocalDate()` doesn't validate date string format
- **Impact**: Invalid date strings could cause unexpected behavior
- **Fix**: Add format validation before parsing

### 25. Vite Build Without Pre-compression
- **File**: `packages/web/vite.config.ts`
- **Issue**: No gzip pre-compression of assets
- **Impact**: Slightly slower initial loads
- **Fix**: Consider adding `vite-plugin-compression`

### 26. Memory Leak Risk in Export Rate Limiter Cleanup
- **File**: `packages/api/src/services/exportRateLimiter.ts` (lines 142-147)
- **Issue**: 10-minute cleanup interval could accumulate entries
- **Impact**: Minor memory pressure with burst traffic
- **Fix**: More aggressive cleanup or use TTL Map library

### 27. Non-null Assertions on Optional Parameters
- **File**: `packages/api/src/services/reportsService.ts` (line 96)
- **Issue**: `end!` assertion on optional parameter
- **Impact**: Could fail if called incorrectly
- **Fix**: Make function signature more explicit about required params

---

## Security Notes (No Immediate Action Required)

The security review found the following areas are **well-implemented**:

- **JWT Implementation**: Proper secret validation (32+ chars), appropriate token expiry
- **Password Security**: bcrypt with 12 rounds, rotating refresh tokens
- **Input Validation**: Zod schemas, sanitization middleware, no SQL injection risks
- **Rate Limiting**: Comprehensive per-endpoint limits
- **CORS & Headers**: Strict whitelist, Helmet.js configured properly
- **Authorization**: Ownership checks on all resources, admin middleware
- **OAuth**: Proper account linking, email verification

---

## Implementation Order Recommendation

### Sprint 1: Critical & High Priority (P0-P1)
1. Fix rate limiter property name (P0) - Quick fix
2. Add email operation error handling (P1) - Important for reliability
3. Add compression middleware (P1) - Quick win
4. Create country lookup cache (P1) - Significant performance improvement

### Sprint 2: Infrastructure Improvements
5. Replace in-memory export rate limiter with Redis (P0)
6. Add stream error handling (P1)
7. Implement streaming CSV export (P1)

### Sprint 3: API & Frontend Polish
8. Add travel records pagination (P2)
9. Add API request timeout (P2)
10. Replace console.error with logger (P2)
11. Add date range validation (P2)

### Sprint 4: Optimization
12. Optimize admin stats queries (P2)
13. Add missing database indexes (P2)
14. Implement token cleanup job (P2)
15. Address remaining P3 items as time permits

---

## Notes

- Items marked as completed can be removed from this list
- New issues discovered during implementation should be added with appropriate priority
- Performance improvements should be measured before/after to confirm impact
