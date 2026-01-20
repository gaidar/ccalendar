## ADDED Requirements

### Requirement: Environment File Structure

The project SHALL use environment files for configuration management.

#### Scenario: Development environment file
- **WHEN** the development environment is configured
- **THEN** a `.env.development` file SHALL exist with:
  - `NODE_ENV=development`
  - `PORT=3001`
  - `DATABASE_URL` with development database connection
  - `REDIS_URL` with development Redis connection
  - `JWT_SECRET` for token signing
  - `JWT_ACCESS_EXPIRY=15m`
  - `JWT_REFRESH_EXPIRY=7d`
  - `FRONTEND_URL=http://localhost:3000`
  - `VITE_API_URL=http://localhost:3001/api/v1`

#### Scenario: Environment file template
- **WHEN** a new developer clones the repository
- **THEN** a `.env.example` file SHALL exist documenting all required variables
- **AND** the example file SHALL contain placeholder values, not real secrets

#### Scenario: Environment file gitignore
- **WHEN** `.gitignore` is examined
- **THEN** `.env*` files SHALL be ignored (except `.env.example`)
- **AND** real secrets SHALL never be committed to the repository

### Requirement: API Configuration Module

The API SHALL have a centralized configuration module.

#### Scenario: Configuration loading
- **WHEN** the API starts
- **THEN** a `config/index.ts` module SHALL load and validate all environment variables
- **AND** missing required variables SHALL cause startup to fail with a clear error message

#### Scenario: Configuration export
- **WHEN** configuration is needed in the application
- **THEN** it SHALL be imported from `@/config`
- **AND** the configuration object SHALL be typed with TypeScript

#### Scenario: Configuration structure
- **WHEN** the config module is examined
- **THEN** it SHALL export:
```typescript
{
  env: 'development' | 'production' | 'test',
  port: number,
  database: {
    url: string
  },
  redis: {
    url: string
  },
  jwt: {
    secret: string,
    accessExpiry: string,
    refreshExpiry: string
  },
  frontend: {
    url: string
  },
  email: {
    from: string,
    provider: 'mailgun' | 'smtp'
  }
}
```

### Requirement: Frontend Environment Variables

The frontend SHALL use Vite environment variables.

#### Scenario: Frontend environment access
- **WHEN** environment variables are accessed in the frontend
- **THEN** they SHALL be prefixed with `VITE_`
- **AND** they SHALL be accessed via `import.meta.env.VITE_*`

#### Scenario: Frontend required variables
- **WHEN** the frontend starts
- **THEN** `VITE_API_URL` SHALL be available
- **AND** it SHALL default to `http://localhost:3001/api/v1` if not set

### Requirement: Production Environment Preparation

The configuration SHALL support production deployment.

#### Scenario: Production environment variables
- **WHEN** deploying to production
- **THEN** the following variables SHALL be configurable:
  - `NODE_ENV=production`
  - `DATABASE_URL` (Heroku Postgres connection string)
  - `REDIS_URL` (Heroku Redis connection string)
  - `JWT_SECRET` (strong random secret)
  - `FRONTEND_URL=https://countrycalendar.app`
  - OAuth provider credentials (when implemented)
  - Email service credentials (when implemented)

#### Scenario: Production security
- **WHEN** production configuration is examined
- **THEN** secrets SHALL NOT be hardcoded
- **AND** secrets SHALL be loaded from environment variables only
- **AND** JWT_SECRET SHALL be at least 32 characters

### Requirement: Configuration Validation

All configuration SHALL be validated at startup.

#### Scenario: Missing required variable
- **WHEN** a required environment variable is missing
- **THEN** the application SHALL NOT start
- **AND** an error message SHALL clearly indicate which variable is missing

#### Scenario: Invalid variable format
- **WHEN** an environment variable has an invalid format (e.g., invalid URL)
- **THEN** the application SHALL NOT start
- **AND** an error message SHALL describe the expected format

#### Scenario: Validation library
- **WHEN** configuration is validated
- **THEN** Zod or a similar library SHALL be used for type-safe validation
