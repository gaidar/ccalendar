# build-process Specification

## Purpose
TBD - created by archiving change add-deployment. Update Purpose after archive.
## Requirements
### Requirement: Frontend Production Build

The frontend SHALL be built for production deployment.

#### Scenario: Vite build command
- **WHEN** `npm run build:web` is executed
- **THEN** Vite SHALL create an optimized production build
- **AND** output SHALL be in packages/web/dist

#### Scenario: Environment variables
- **WHEN** building for production
- **THEN** VITE_API_URL SHALL be set to the production API URL
- **AND** environment variables SHALL be embedded in the build

#### Scenario: Code optimization
- **WHEN** building for production
- **THEN** JavaScript SHALL be minified
- **AND** CSS SHALL be minified
- **AND** dead code SHALL be eliminated

#### Scenario: Asset hashing
- **WHEN** building for production
- **THEN** asset filenames SHALL include content hashes
- **AND** cache busting SHALL be automatic on changes

#### Scenario: Source maps
- **WHEN** building for production
- **THEN** source maps SHALL be generated
- **AND** source maps SHALL be available for error tracking

### Requirement: Static File Serving

The API server SHALL serve the frontend static files.

#### Scenario: Public directory
- **WHEN** the API server starts
- **THEN** it SHALL serve static files from packages/api/public
- **AND** Express static middleware SHALL be configured

#### Scenario: SPA fallback
- **WHEN** a non-API route is requested
- **THEN** index.html SHALL be served
- **AND** client-side routing SHALL work correctly

#### Scenario: Cache headers for assets
- **WHEN** hashed assets are served (JS, CSS, images)
- **THEN** Cache-Control SHALL be set to max-age=31536000 (1 year)
- **AND** assets SHALL be immutable

#### Scenario: Cache headers for HTML
- **WHEN** index.html is served
- **THEN** Cache-Control SHALL be set to no-cache
- **AND** browsers SHALL always revalidate

#### Scenario: Compression
- **WHEN** static files are served
- **THEN** gzip compression SHALL be enabled
- **AND** response sizes SHALL be reduced

### Requirement: Build Scripts

The application SHALL have build scripts for deployment.

#### Scenario: Build web script
- **WHEN** `npm run build:web` is executed
- **THEN** the frontend SHALL be built

#### Scenario: Build API script
- **WHEN** `npm run build:api` is executed
- **THEN** TypeScript SHALL be compiled
- **AND** Prisma client SHALL be generated

#### Scenario: Build all script
- **WHEN** `npm run build:all` is executed
- **THEN** both frontend and API SHALL be built

#### Scenario: Copy assets script
- **WHEN** `npm run copy:assets` is executed
- **THEN** packages/web/dist SHALL be copied to packages/api/public

#### Scenario: Heroku postbuild script
- **WHEN** Heroku runs postbuild
- **THEN** the frontend SHALL be built
- **AND** assets SHALL be copied to the API public folder
- **AND** Prisma client SHALL be generated

### Requirement: Database Migrations

Database migrations SHALL be handled safely in production.

#### Scenario: Migration deploy command
- **WHEN** deploying to production
- **THEN** `prisma migrate deploy` SHALL be used
- **AND** pending migrations SHALL be applied

#### Scenario: Release phase
- **WHEN** Heroku deploys a new release
- **THEN** migrations MAY run in the release phase
- **AND** deployment SHALL fail if migrations fail

#### Scenario: Migration safety
- **WHEN** migrations run in production
- **THEN** they SHALL be non-destructive where possible
- **AND** data loss SHALL be avoided

### Requirement: Health Check Endpoint

The application SHALL have a health check endpoint.

#### Scenario: Health endpoint
- **WHEN** `GET /health` is called
- **THEN** the response status SHALL be 200 if healthy
- **AND** the response SHALL be JSON

#### Scenario: Database health
- **WHEN** the health check runs
- **THEN** database connectivity SHALL be verified
- **AND** unhealthy database SHALL cause health check failure

#### Scenario: Redis health
- **WHEN** the health check runs
- **THEN** Redis connectivity SHALL be verified
- **AND** unhealthy Redis MAY be reported but not fail the check

#### Scenario: Health response content
- **WHEN** the health check succeeds
- **THEN** the response SHALL include status "ok"
- **AND** the response MAY include application version
- **AND** the response MAY include uptime

### Requirement: Production Start Script

The application SHALL have a production start command.

#### Scenario: Start script
- **WHEN** `npm start` is executed in packages/api
- **THEN** the API server SHALL start in production mode
- **AND** NODE_ENV SHALL be "production"

#### Scenario: Port configuration
- **WHEN** the server starts
- **THEN** it SHALL listen on the PORT environment variable
- **AND** PORT SHALL default to 3001 if not set

