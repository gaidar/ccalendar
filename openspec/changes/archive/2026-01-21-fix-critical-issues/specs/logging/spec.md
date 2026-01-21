# Logging - Delta Spec

## ADDED Requirements

### Requirement: Consistent Logger Usage
All application code SHALL use the Winston logger utility instead of direct console methods.

#### Scenario: Configuration errors
- **WHEN** environment validation fails during startup
- **THEN** the system SHALL log errors using `logger.error()`
- **AND** NOT use `console.error()` directly

#### Scenario: OAuth errors
- **WHEN** an OAuth authentication error occurs
- **THEN** the system SHALL log the error using `logger.error()`
- **AND** include relevant context (provider, error type)

#### Scenario: Error boundary logging (frontend)
- **WHEN** a React error boundary catches an error in development
- **THEN** the component MAY use `console.error()` for debugging
- **AND** SHALL send errors to Sentry in production
