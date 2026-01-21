# heroku-config Specification

## Purpose
TBD - created by archiving change add-deployment. Update Purpose after archive.
## Requirements
### Requirement: Procfile Configuration

The application SHALL have a Procfile for Heroku deployment.

#### Scenario: Web process definition
- **WHEN** Heroku starts the application
- **THEN** the Procfile SHALL define a `web` process
- **AND** the process SHALL start the API server from packages/api

#### Scenario: Process command
- **WHEN** the web process starts
- **THEN** it SHALL execute `cd packages/api && npm start`

### Requirement: App.json Configuration

The application SHALL have an app.json for Heroku configuration.

#### Scenario: Application metadata
- **WHEN** app.json is configured
- **THEN** it SHALL include the application name "Country Calendar"
- **AND** it SHALL include a description
- **AND** it SHALL include the repository URL

#### Scenario: Buildpack configuration
- **WHEN** app.json is configured
- **THEN** it SHALL specify the Node.js buildpack (heroku/nodejs)

#### Scenario: Add-on configuration
- **WHEN** app.json is configured
- **THEN** it SHALL include Heroku Postgres (essential-0 plan)
- **AND** it SHALL include Heroku Redis (mini plan)

#### Scenario: Environment variable generators
- **WHEN** app.json is configured
- **THEN** JWT_SECRET SHALL use a secret generator
- **AND** JWT_REFRESH_SECRET SHALL use a secret generator
- **AND** NODE_ENV SHALL be set to "production"

### Requirement: Production Environment Variables

The application SHALL require specific environment variables in production.

#### Scenario: Required variables validation
- **WHEN** the application starts in production
- **THEN** it SHALL validate that all required environment variables are set
- **AND** it SHALL fail to start if any required variable is missing

#### Scenario: Database configuration
- **WHEN** running in production
- **THEN** DATABASE_URL SHALL be provided by Heroku Postgres
- **AND** REDIS_URL SHALL be provided by Heroku Redis

#### Scenario: Authentication secrets
- **WHEN** running in production
- **THEN** JWT_SECRET SHALL be a strong, unique value
- **AND** JWT_REFRESH_SECRET SHALL be a different strong, unique value

#### Scenario: OAuth credentials
- **WHEN** OAuth providers are enabled
- **THEN** the corresponding client IDs and secrets SHALL be configured
- **AND** missing OAuth credentials SHALL disable that provider

#### Scenario: Email configuration
- **WHEN** email functionality is enabled
- **THEN** MAILGUN_API_KEY SHALL be configured
- **AND** MAILGUN_DOMAIN SHALL be configured

#### Scenario: Frontend URL
- **WHEN** running in production
- **THEN** FRONTEND_URL SHALL be set to the production domain

### Requirement: Node.js Version

The application SHALL specify the required Node.js version.

#### Scenario: Engines configuration
- **WHEN** package.json is configured
- **THEN** the engines field SHALL specify Node.js 20.x
- **AND** Heroku SHALL use this version for deployment

### Requirement: Trust Proxy

The application SHALL trust the Heroku proxy.

#### Scenario: Proxy configuration
- **WHEN** running behind Heroku's router
- **THEN** Express SHALL be configured with `trust proxy`
- **AND** secure cookies SHALL work correctly
- **AND** rate limiting SHALL use the correct client IP

