# ci-cd Specification

## Purpose
TBD - created by archiving change add-deployment. Update Purpose after archive.
## Requirements
### Requirement: GitHub Actions CI Workflow

The application SHALL have a CI workflow that runs on pull requests.

#### Scenario: CI trigger
- **WHEN** a pull request is opened or updated targeting main branch
- **THEN** the CI workflow SHALL run automatically

#### Scenario: Node.js environment
- **WHEN** the CI workflow runs
- **THEN** it SHALL use Node.js version 20
- **AND** it SHALL run on ubuntu-latest

#### Scenario: Postgres service
- **WHEN** the CI workflow runs
- **THEN** a Postgres 15 service container SHALL be available
- **AND** port 5432 SHALL be exposed
- **AND** DATABASE_URL SHALL be configured for tests

#### Scenario: Dependency installation
- **WHEN** the CI workflow runs
- **THEN** dependencies SHALL be installed using `npm ci`
- **AND** node_modules SHALL be cached for performance

#### Scenario: Type checking
- **WHEN** the CI workflow runs
- **THEN** TypeScript type checking SHALL run
- **AND** the workflow SHALL fail if type errors exist

#### Scenario: Linting
- **WHEN** the CI workflow runs
- **THEN** ESLint SHALL check code quality
- **AND** the workflow SHALL fail if linting errors exist

#### Scenario: Unit tests
- **WHEN** the CI workflow runs
- **THEN** all unit tests SHALL execute
- **AND** the workflow SHALL fail if any test fails

#### Scenario: Integration tests
- **WHEN** the CI workflow runs
- **THEN** all integration tests SHALL execute
- **AND** tests SHALL use the Postgres service container

### Requirement: GitHub Actions CD Workflow

The application SHALL have a CD workflow that deploys on merge to main.

#### Scenario: CD trigger
- **WHEN** code is pushed to the main branch
- **THEN** the CD workflow SHALL run automatically

#### Scenario: Test before deploy
- **WHEN** the CD workflow runs
- **THEN** the test job SHALL run first
- **AND** deployment SHALL only proceed if tests pass

#### Scenario: Heroku deployment
- **WHEN** tests pass
- **THEN** the application SHALL be deployed to Heroku
- **AND** the heroku-deploy action SHALL be used

#### Scenario: Deployment secrets
- **WHEN** deploying to Heroku
- **THEN** HEROKU_API_KEY SHALL be retrieved from GitHub Secrets
- **AND** HEROKU_EMAIL SHALL be retrieved from GitHub Secrets

#### Scenario: Application name
- **WHEN** deploying to Heroku
- **THEN** the correct Heroku app name SHALL be specified

### Requirement: Deployment Health Check

The application SHALL verify deployment success.

#### Scenario: Post-deploy verification
- **WHEN** deployment completes
- **THEN** the health check endpoint SHALL be called
- **AND** deployment SHALL be marked failed if health check fails

### Requirement: Workflow Security

The workflows SHALL follow security best practices.

#### Scenario: Secret handling
- **WHEN** secrets are used in workflows
- **THEN** they SHALL be accessed via `${{ secrets.* }}`
- **AND** secrets SHALL never be logged

#### Scenario: Minimal permissions
- **WHEN** workflows run
- **THEN** they SHALL use minimal required permissions

