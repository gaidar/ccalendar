# Design: Fix Codebase Issues

## Context

A comprehensive code review identified issues across three categories:
1. **Security** - OAuth cookie configuration and error message exposure
2. **Performance** - N+1 queries, missing indexes, React re-renders
3. **Code Quality** - Code duplication, inconsistent logging

This document outlines technical decisions for non-trivial fixes.

## Goals / Non-Goals

### Goals
- Fix security vulnerabilities without breaking OAuth flows
- Improve query performance with minimal migration risk
- Reduce unnecessary React re-renders in calendar and admin views
- Eliminate code duplication for API configuration
- Establish consistent frontend logging pattern

### Non-Goals
- Major refactoring of service architecture
- Adding new features
- Breaking API compatibility
- Changing authentication mechanisms

## Decisions

### D1: OAuth Cookie SameSite Policy

**Decision**: Change `sameSite: 'lax'` to `sameSite: 'strict'` in OAuth controller.

**Rationale**: The auth controller uses `strict`, creating inconsistency. OAuth flows work with `strict` because:
- Initial OAuth redirect is user-initiated navigation
- Callback is a top-level navigation from OAuth provider
- `strict` only blocks cross-site subrequests, not navigations

**Alternatives Considered**:
- Keep `lax` and add CSRF token validation - adds complexity
- Use separate cookie names - inconsistent with auth flow

**Risk**: OAuth flow might fail if provider uses unusual redirect patterns. Mitigation: E2E test coverage.

### D2: OAuth Error Message Sanitization

**Decision**: Map all OAuth errors to a predefined set of generic messages.

**Implementation**:
```typescript
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  'access_denied': 'You cancelled the sign-in process',
  'invalid_request': 'Sign-in request was invalid. Please try again.',
  'server_error': 'The authentication service is unavailable. Please try again later.',
  'default': 'Authentication failed. Please try again.'
};
```

**Rationale**: Prevents leaking internal error details (provider names, token issues, email scopes) while still providing useful feedback.

### D3: Batch Country Lookups

**Decision**: Pre-fetch all required country codes into a Map before mapping operations.

**Implementation Pattern**:
```typescript
// Before (N+1):
return records.map(record => {
  const country = countriesService.getCountryByCode(record.countryCode);
  return { ...record, countryName: country.name };
});

// After (batch):
const countryCodes = [...new Set(records.map(r => r.countryCode))];
const countryMap = countriesService.getCountriesByCodes(countryCodes);
return records.map(record => {
  const country = countryMap.get(record.countryCode);
  return { ...record, countryName: country?.name ?? record.countryCode };
});
```

**Rationale**: Single pass to collect unique codes, single lookup to fetch all countries, then O(1) lookups during mapping.

### D4: Database Index Strategy

**Decision**: Add indexes using CREATE INDEX CONCURRENTLY for zero-downtime deployment.

**Indexes to Add**:
```prisma
model User {
  // ... fields
  @@index([createdAt])  // For admin listing sorted by creation date
}

model SupportTicket {
  // ... fields
  @@index([userId, createdAt])  // For user ticket queries
}

model OAuth {
  // ... fields
  @@index([userId])  // For foreign key lookups
}
```

**Migration Strategy**:
1. Generate Prisma migration
2. Modify SQL to use `CREATE INDEX CONCURRENTLY`
3. Run in Heroku release phase (non-blocking)

### D5: React Component Memoization

**Decision**: Use `React.memo()` for list item components that receive stable props.

**Components to Memoize**:
- `DayCell` - Renders 42 times per month, receives mostly primitive props
- `UserRow` - Renders for each user in admin list
- `TicketRow` - Renders for each ticket in admin list
- `CountryRow` - Renders for each country in stats

**Implementation Pattern**:
```typescript
// Wrap component export
export const DayCell = memo(function DayCell(props: DayCellProps) {
  // component body
});

// Or as HOC
const DayCell = memo(({ date, countries, ... }: DayCellProps) => {
  // component body
});
```

**Callback Memoization**:
```typescript
// Wrap event handlers passed to memoized children
const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setSearch(e.target.value);
}, []);
```

### D6: Shared API Configuration

**Decision**: Create `src/lib/api-config.ts` as single source of truth.

**Implementation**:
```typescript
// src/lib/api-config.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1');
```

**Usage**:
```typescript
// In api.ts, OAuthButtons.tsx, useReports.ts
import { API_BASE_URL } from '@/lib/api-config';
```

### D7: Frontend Logging Strategy

**Decision**: Use conditional logging that integrates with Sentry in production.

**Implementation**:
```typescript
// src/lib/logger.ts
export const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
    // Sentry already captures unhandled errors via ErrorBoundary
    // For explicit logging, use Sentry.captureException if needed
  },
  warn: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.warn(message, data);
    }
  }
};
```

**Rationale**:
- Development: Full console output for debugging
- Production: Errors captured by Sentry, no console pollution
- Consistent pattern across all components

## Risks / Trade-offs

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OAuth flow breaks with strict cookies | Low | High | E2E tests cover OAuth flows |
| Memoization causes stale renders | Low | Medium | Props are mostly primitives; test coverage |
| Index creation locks table | None | N/A | Using CONCURRENTLY flag |
| Batch lookup memory for large exports | Low | Low | Country list is fixed (249), not user data |

## Migration Plan

1. **Phase 1 (Security)**: OAuth fixes in single PR, deployed with monitoring
2. **Phase 2 (Performance-Backend)**: Database indexes + batch lookups
3. **Phase 3 (Performance-Frontend)**: Component memoization
4. **Phase 4 (Code Quality)**: Logging and deduplication

Each phase is independently deployable and testable.

## Rollback

All changes are backward-compatible:
- OAuth: Revert cookie setting if flows break
- Indexes: Drop index if causing issues (unlikely)
- Memoization: Remove memo wrapper if stale render issues
- Logging/Config: No runtime impact, simple revert

## Open Questions

1. **XLSX Streaming**: Should we prioritize this given current export sizes? (Deferred to investigation task)
2. **Password Reset Expiry**: Any user complaints about 1-hour window? (Deferred pending feedback)
