# Change: Fix Codebase Issues (Security, Performance, Code Quality)

## Why

A comprehensive code review identified 17 issues across security, performance, and code quality categories. These issues range from OAuth cookie security concerns to React component re-rendering inefficiencies. Addressing them will improve application security posture, reduce unnecessary server load and client-side re-renders, and improve code maintainability.

## What Changes

### Security Fixes
- **OAuth cookie SameSite alignment**: Change `sameSite: 'lax'` to `sameSite: 'strict'` in OAuth controller to match auth controller behavior and prevent CSRF exposure
- **OAuth error message sanitization**: Map OAuth provider errors to generic messages before passing to frontend URL to prevent information leakage

### Performance Fixes - Backend
- **Batch country lookups**: Replace N+1 country lookup pattern in reports/export service with batch pre-fetch
- **Add database indexes**:
  - `User.createdAt` index for admin listing queries
  - `SupportTicket(userId, createdAt)` compound index
  - `OAuth.userId` index for foreign key lookups
- **Optimize date range calculation**: Use `Math.min/max` instead of sorting entire array in import service

### Performance Fixes - Frontend
- **Memoize DayCell component**: Wrap in `React.memo()` - renders 42 times per month view
- **Memoize admin list rows**: Add `React.memo()` to UserRow, TicketRow, CountryRow components
- **Memoize callbacks**: Add `useCallback` to `toggleCountry` and `handleSearchChange` handlers

### Code Quality Fixes
- **Extract shared API URL constant**: Remove duplication across 3 files (`api.ts`, `OAuthButtons.tsx`, `useReports.ts`)
- **Replace console.error**: Use structured logging in CalendarPage, LoginPage, OAuthButtons components

### Nice-to-Have (Low Priority)
- **XLSX streaming export**: Investigate streaming for large exports (currently loads entire workbook in memory)
- **Extend password reset expiry**: Consider 2-4 hours instead of 1 hour for better UX

## Impact

### Affected Specs
- `auth` - OAuth cookie handling
- `performance` - Database indexing, component memoization
- `logging` - Frontend logging patterns
- `calendar-view` - DayCell memoization
- `admin-ui` - List component memoization
- `export` - Country lookup batching, XLSX streaming
- `reports-ui` - CountryRow memoization

### Affected Code

#### Backend (packages/api)
- `src/controllers/oauthController.ts:34,93-94` - Cookie settings, error handling
- `src/services/reportsService.ts:159-167,233-240` - Country lookups
- `src/services/travelRecordsService.ts:45,165` - Country lookups in response transformer
- `src/services/importService.ts:132` - Date range calculation
- `src/services/exportService.ts:131-132` - XLSX memory usage
- `prisma/schema.prisma` - New indexes

#### Frontend (packages/web)
- `src/lib/api.ts:2-3` - API URL extraction
- `src/components/features/OAuthButtons.tsx:12-13,81` - Duplicate URL, console.error
- `src/hooks/useReports.ts:13-14` - Duplicate URL
- `src/components/features/calendar/DayCell.tsx:29-158` - Memoization
- `src/components/features/calendar/CountryPicker.tsx:82-93` - useCallback
- `src/components/features/admin/UserList.tsx:25-62,105-108` - Memoization, useCallback
- `src/components/features/admin/TicketList.tsx:64-96` - Memoization
- `src/components/features/reports/CountryStats.tsx:31-61` - Memoization
- `src/pages/CalendarPage.tsx:86,107,121` - console.error
- `src/pages/LoginPage.tsx:48` - console.error

## Risk Assessment

- **Low risk**: All changes are isolated, incremental improvements
- **No breaking changes**: API contracts and database schema remain compatible
- **Database migrations**: New indexes are additive (CREATE INDEX CONCURRENTLY)
- **Testing**: Existing tests cover affected functionality
