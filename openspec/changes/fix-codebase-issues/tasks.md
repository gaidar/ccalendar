# Tasks: Fix Codebase Issues

## 1. Security Fixes (HIGH Priority)

### 1.1 OAuth Cookie Security
- [ ] 1.1.1 Change `sameSite: 'lax'` to `sameSite: 'strict'` in `oauthController.ts:34`
- [ ] 1.1.2 Verify OAuth login flow still works after change
- [ ] 1.1.3 Update OAuth integration tests if needed

### 1.2 OAuth Error Sanitization
- [ ] 1.2.1 Create error message mapping in `oauthController.ts`
- [ ] 1.2.2 Map OAuth provider errors to generic user-friendly messages
- [ ] 1.2.3 Update redirect to use sanitized error messages (line 93-94)
- [ ] 1.2.4 Add tests for error message sanitization

## 2. Performance Fixes - Database (MEDIUM Priority)

### 2.1 Add Database Indexes
- [ ] 2.1.1 Create migration for `User.createdAt` index
- [ ] 2.1.2 Create migration for `SupportTicket(userId, createdAt)` compound index
- [ ] 2.1.3 Create migration for `OAuth.userId` index
- [ ] 2.1.4 Run migrations in development environment
- [ ] 2.1.5 Verify query performance improvement with EXPLAIN

## 3. Performance Fixes - Backend Services (HIGH Priority)

### 3.1 Batch Country Lookups in Reports
- [ ] 3.1.1 Pre-fetch all required countries before mapping in `reportsService.ts:159-167`
- [ ] 3.1.2 Pre-fetch all required countries in export function `reportsService.ts:233-240`
- [ ] 3.1.3 Add batch lookup method to `countriesService` if needed
- [ ] 3.1.4 Update unit tests for reports service

### 3.2 Batch Country Lookups in Travel Records
- [ ] 3.2.1 Refactor `toResponse` in `travelRecordsService.ts` to accept pre-fetched country map
- [ ] 3.2.2 Pre-fetch countries before mapping in list operations
- [ ] 3.2.3 Update unit tests for travel records service

### 3.3 Optimize Import Date Range Calculation
- [ ] 3.3.1 Replace sort-based date range with `Math.min/max` in `importService.ts:132`
- [ ] 3.3.2 Update unit tests if needed

## 4. Performance Fixes - Frontend Components (HIGH Priority)

### 4.1 Memoize DayCell Component
- [ ] 4.1.1 Wrap `DayCell` component export with `React.memo()` in `DayCell.tsx`
- [ ] 4.1.2 Ensure props comparison works correctly (no inline objects/functions)
- [ ] 4.1.3 Run component tests to verify behavior unchanged

### 4.2 Memoize Admin List Components
- [ ] 4.2.1 Wrap `UserRow` with `React.memo()` in `UserList.tsx:25-62`
- [ ] 4.2.2 Wrap `TicketRow` with `React.memo()` in `TicketList.tsx:64-96`
- [ ] 4.2.3 Add `useCallback` to `handleSearchChange` in `UserList.tsx:105-108`
- [ ] 4.2.4 Run component tests to verify behavior unchanged

### 4.3 Memoize Reports Components
- [ ] 4.3.1 Wrap `CountryRow` with `React.memo()` in `CountryStats.tsx:31-61`

### 4.4 Memoize CountryPicker Callbacks
- [ ] 4.4.1 Wrap `toggleCountry` with `useCallback` in `CountryPicker.tsx:82-93`
- [ ] 4.4.2 Run component tests to verify behavior unchanged

## 5. Code Quality Fixes (MEDIUM Priority)

### 5.1 Extract Shared API URL
- [ ] 5.1.1 Create `src/lib/api-config.ts` with exported `API_BASE_URL` constant
- [ ] 5.1.2 Update `api.ts` to import from `api-config.ts`
- [ ] 5.1.3 Update `OAuthButtons.tsx` to import from `api-config.ts`
- [ ] 5.1.4 Update `useReports.ts` to import from `api-config.ts`
- [ ] 5.1.5 Remove duplicate definitions

### 5.2 Replace Console.error with Structured Logging
- [ ] 5.2.1 Create or identify existing frontend logger utility
- [ ] 5.2.2 Replace `console.error` in `CalendarPage.tsx:86,107,121`
- [ ] 5.2.3 Replace `console.error` in `LoginPage.tsx:48`
- [ ] 5.2.4 Replace `console.error` in `OAuthButtons.tsx:81`

## 6. Low Priority Improvements (Backlog)

### 6.1 XLSX Export Streaming (Investigation)
- [ ] 6.1.1 Research ExcelJS streaming capabilities
- [ ] 6.1.2 Implement streaming if beneficial for large exports
- [ ] 6.1.3 Benchmark memory usage before/after

### 6.2 Password Reset Token Expiry
- [ ] 6.2.1 Evaluate user feedback on reset token expiry
- [ ] 6.2.2 Extend expiry from 1 hour to 2-4 hours if warranted
- [ ] 6.2.3 Update email template to reflect new expiry time

## 7. Testing and Validation

- [ ] 7.1 Run full test suite (`npm test`)
- [ ] 7.2 Run E2E tests (`npm run test:e2e`)
- [ ] 7.3 Run linter (`npm run lint`)
- [ ] 7.4 Manual testing of OAuth flow
- [ ] 7.5 Manual testing of calendar performance
- [ ] 7.6 Manual testing of admin panel

## 8. Documentation

- [ ] 8.1 Update any affected API documentation
- [ ] 8.2 Document new database indexes in schema comments
