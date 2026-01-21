# Change: Improve Code Quality and Minor Optimizations

## Why

During a comprehensive code review, several low-priority code quality issues were identified. While these don't affect production functionality or security, addressing them will improve maintainability, type safety, and minor performance characteristics.

## What Changes

### Type Safety Improvements
- Fix React Query key using object reference (use destructured values)
- Add runtime validation before type assertions in OAuth controller
- Improve date parsing validation in reports service

### Code Quality
- Remove non-null assertions on optional parameters where possible
- Add format validation to date parsing utilities

### Minor Performance Optimizations
- Consider simpler country search implementation (Fuse.js may be overkill for ~200 items)
- Add pre-compression of static assets in Vite build
- Improve memory cleanup in export rate limiter

## Impact

- Affected specs: `rate-limiting`, `reports-api`, `countries`, `auth`, `performance`
- Affected code:
  - `packages/web/src/hooks/useReports.ts`
  - `packages/web/src/hooks/useCountries.ts`
  - `packages/api/src/services/reportsService.ts`
  - `packages/api/src/controllers/oauthController.ts`
  - `packages/api/src/config/passport.ts`
  - `packages/api/src/services/exportRateLimiter.ts`
  - `packages/web/vite.config.ts`
