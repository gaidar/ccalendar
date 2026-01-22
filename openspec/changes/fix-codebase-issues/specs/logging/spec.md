# logging Specification Delta

## ADDED Requirements

### Requirement: Frontend Structured Logging

The frontend SHALL use structured logging instead of direct console methods.

- Production code MUST NOT use `console.log`, `console.error`, or `console.warn` directly
- A logger utility SHALL provide environment-aware logging
- Development environment SHALL output to console for debugging
- Production environment SHALL suppress console output (Sentry captures errors separately)
- Logger SHALL provide `error`, `warn`, and `info` methods

#### Scenario: Development logging

- **WHEN** an error occurs in development environment
- **THEN** logger.error SHALL output to console.error
- **AND** full error details SHALL be visible for debugging

#### Scenario: Production logging

- **WHEN** an error occurs in production environment
- **THEN** logger.error SHALL NOT output to console
- **AND** errors SHALL be captured by Sentry via ErrorBoundary

#### Scenario: CalendarPage error logging

- **WHEN** a travel record mutation fails in CalendarPage
- **THEN** the error SHALL be logged using structured logger
- **AND** direct console.error SHALL NOT be used

#### Scenario: LoginPage error logging

- **WHEN** auth config fetch fails in LoginPage
- **THEN** the error SHALL be logged using structured logger
- **AND** direct console.error SHALL NOT be used

#### Scenario: OAuthButtons error logging

- **WHEN** OAuth provider fetch fails in OAuthButtons
- **THEN** the error SHALL be logged using structured logger
- **AND** direct console.error SHALL NOT be used

---

### Requirement: Shared API Configuration

The frontend SHALL use a single source of truth for API configuration.

- API_BASE_URL SHALL be defined in exactly one location
- All components and hooks SHALL import from the shared configuration
- No duplicate API URL definitions SHALL exist in the codebase

#### Scenario: API URL single definition

- **WHEN** the frontend is built
- **THEN** API_BASE_URL SHALL be defined only in `src/lib/api-config.ts`
- **AND** `api.ts`, `OAuthButtons.tsx`, and `useReports.ts` SHALL import from this file

#### Scenario: API URL environment handling

- **WHEN** API_BASE_URL is resolved
- **THEN** VITE_API_URL environment variable SHALL be used if set
- **AND** production SHALL default to `/api/v1`
- **AND** development SHALL default to `http://localhost:3001/api/v1`
