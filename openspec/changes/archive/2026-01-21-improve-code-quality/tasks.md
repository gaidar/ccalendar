# Tasks: Improve Code Quality and Minor Optimizations

## 1. Type Safety Improvements

### 1.1 Fix React Query Key Object Reference
- [x] 1.1.1 Update `packages/web/src/hooks/useReports.ts` lines 37-42
- [x] 1.1.2 Change `queryKey: ['reports', 'summary', params]` to destructured: `queryKey: ['reports', 'summary', params.days, params.start, params.end]`
- [x] 1.1.3 Apply same fix to any other hooks using object references in query keys

### 1.2 Add Runtime Validation Before Type Assertions
- [x] 1.2.1 Update `packages/api/src/controllers/oauthController.ts` line 35
- [x] 1.2.2 Add shape validation before casting `req.user` to `LoginResult`
- [x] 1.2.3 Throw appropriate error if validation fails

### 1.3 Improve Type Safety in Passport Config
- [x] 1.3.1 Review `packages/api/src/config/passport.ts` lines 41, 78
- [x] 1.3.2 Document the intentional `as any` workaround for Passport types (already documented)
- [x] 1.3.3 Consider creating proper type definitions if feasible (not feasible due to Passport library constraints)

## 2. Code Quality Improvements

### 2.1 Remove Non-null Assertions on Optional Parameters
- [x] 2.1.1 Update `packages/api/src/services/reportsService.ts` line 96
- [x] 2.1.2 Add explicit null check before using `end` parameter
- [x] 2.1.3 Update function signature to be explicit about required parameters

### 2.2 Add Date Format Validation
- [x] 2.2.1 Update `parseLocalDate()` in `packages/api/src/services/reportsService.ts` lines 50-54
- [x] 2.2.2 Add regex validation for YYYY-MM-DD format
- [x] 2.2.3 Throw validation error for invalid format

## 3. Minor Performance Optimizations

### 3.1 Simplify Country Search (Optional)
- [x] 3.1.1 Review if Fuse.js is necessary for ~200 countries
- [x] 3.1.2 Benchmark simple `filter()` vs Fuse.js performance
- [x] 3.1.3 If filter is faster, replace Fuse.js implementation
- [x] 3.1.4 Keep Fuse.js if fuzzy matching is a valued feature (KEPT: fuzzy matching provides better UX)

### 3.2 Add Vite Pre-compression (Optional)
- [x] 3.2.1 Evaluate adding `vite-plugin-compression`
- [x] 3.2.2 Configure gzip and brotli pre-compression
- [x] 3.2.3 Measure bundle size improvement

### 3.3 Improve Export Rate Limiter Memory Cleanup
- [x] 3.3.1 Review `packages/api/src/services/exportRateLimiter.ts` lines 142-147
- [x] 3.3.2 Consider reducing cleanup interval from 10 minutes (REDUCED to 1 minute)
- [x] 3.3.3 Or implement TTL-based Map alternative (not needed, existing Map with cleanup is sufficient)
- [x] 3.3.4 Note: This becomes moot if Redis rate limiter is implemented (P0 task) (Redis already implemented)

## 4. Testing & Validation

- [x] 4.1 Run type check (`tsc --noEmit`) to verify type improvements
- [x] 4.2 Run all existing tests
- [x] 4.3 Run linter on modified files
- [x] 4.4 Manual testing of affected features (not needed - unit/integration tests cover functionality)

## 5. Documentation

- [x] 5.1 Document any intentional type workarounds with comments
- [x] 5.2 Update code comments for clarity where needed
