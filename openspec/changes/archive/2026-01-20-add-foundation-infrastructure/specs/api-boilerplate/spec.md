## ADDED Requirements

### Requirement: Express.js Server Setup

The API SHALL use Express.js as the web framework with TypeScript.

#### Scenario: Server initialization
- **WHEN** the API server starts
- **THEN** it SHALL listen on the port specified by the `PORT` environment variable
- **AND** it SHALL log a startup message indicating the port and environment
- **AND** it SHALL handle graceful shutdown on SIGTERM and SIGINT

#### Scenario: API versioning
- **WHEN** API routes are defined
- **THEN** all routes SHALL be prefixed with `/api/v1`
- **AND** the base URL SHALL be `http://localhost:3001/api/v1` in development

### Requirement: Health Check Endpoint

The API SHALL provide a health check endpoint for monitoring.

#### Scenario: Health check response
- **WHEN** `GET /api/v1/health` is called
- **THEN** it SHALL return status 200
- **AND** the response SHALL include:
  - `status`: "ok"
  - `timestamp`: current ISO timestamp
  - `version`: application version from package.json

#### Scenario: Health check with database
- **WHEN** the health check includes database connectivity
- **THEN** it SHALL verify the database connection is active
- **AND** it SHALL return `database: "connected"` or `database: "disconnected"`

### Requirement: Request Body Parsing

The API SHALL parse incoming request bodies.

#### Scenario: JSON body parsing
- **WHEN** a request with `Content-Type: application/json` is received
- **THEN** the body SHALL be parsed and available as `req.body`
- **AND** the body size limit SHALL be 10MB

#### Scenario: URL-encoded body parsing
- **WHEN** a request with `Content-Type: application/x-www-form-urlencoded` is received
- **THEN** the body SHALL be parsed and available as `req.body`

### Requirement: CORS Configuration

The API SHALL handle Cross-Origin Resource Sharing (CORS).

#### Scenario: Development CORS
- **WHEN** the API runs in development mode
- **THEN** it SHALL allow requests from `http://localhost:3000`
- **AND** it SHALL allow credentials

#### Scenario: Production CORS
- **WHEN** the API runs in production mode
- **THEN** it SHALL allow requests only from `https://countrycalendar.app`
- **AND** it SHALL allow credentials

#### Scenario: CORS headers
- **WHEN** a CORS-enabled request is made
- **THEN** the response SHALL include appropriate `Access-Control-Allow-*` headers
- **AND** preflight OPTIONS requests SHALL be handled correctly

### Requirement: Security Headers

The API SHALL set security headers using Helmet.js.

#### Scenario: Security headers applied
- **WHEN** any API response is sent
- **THEN** it SHALL include security headers:
  - Content-Security-Policy
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security (in production)

### Requirement: Error Handling Middleware

The API SHALL have centralized error handling.

#### Scenario: Validation error response
- **WHEN** a request fails validation
- **THEN** the response SHALL have status 400
- **AND** the response SHALL include:
  - `error`: "VALIDATION_ERROR"
  - `message`: human-readable error message
  - `details`: array of field-specific errors

#### Scenario: Not found error response
- **WHEN** a requested resource is not found
- **THEN** the response SHALL have status 404
- **AND** the response SHALL include:
  - `error`: "NOT_FOUND"
  - `message`: description of what was not found

#### Scenario: Internal server error response
- **WHEN** an unexpected error occurs
- **THEN** the response SHALL have status 500
- **AND** the response SHALL include:
  - `error`: "INTERNAL_ERROR"
  - `message`: "An unexpected error occurred"
- **AND** the actual error details SHALL NOT be exposed to clients
- **AND** the error SHALL be logged server-side

#### Scenario: Error response format
- **WHEN** any error response is sent
- **THEN** it SHALL follow the format:
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "details": []
}
```

### Requirement: Request Logging

The API SHALL log all incoming requests.

#### Scenario: Request log format
- **WHEN** a request is received
- **THEN** the log SHALL include:
  - HTTP method
  - Request path
  - Response status code
  - Response time in milliseconds
  - Request ID (if present)

#### Scenario: Log levels
- **WHEN** configuring the logger
- **THEN** it SHALL use:
  - `debug` level in development
  - `info` level in production
- **AND** logs SHALL be JSON-formatted in production

### Requirement: Prisma Client Integration

The API SHALL use Prisma Client for database operations.

#### Scenario: Prisma client initialization
- **WHEN** the API starts
- **THEN** the Prisma client SHALL be initialized
- **AND** it SHALL be available for use in services and controllers

#### Scenario: Prisma client shutdown
- **WHEN** the API receives a shutdown signal
- **THEN** the Prisma client SHALL disconnect gracefully
- **AND** pending transactions SHALL be completed or rolled back

### Requirement: TypeScript Configuration

The API SHALL use strict TypeScript configuration.

#### Scenario: TypeScript compiler options
- **WHEN** the API is compiled
- **THEN** it SHALL use:
  - `strict: true`
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `esModuleInterop: true`
  - Target ES2022 or later

#### Scenario: Development mode
- **WHEN** running in development
- **THEN** `ts-node-dev` or `tsx` SHALL be used for hot reloading
- **AND** TypeScript SHALL be compiled on-the-fly

### Requirement: Environment Variable Loading

The API SHALL load environment variables from `.env` files.

#### Scenario: Environment file loading
- **WHEN** the API starts
- **THEN** it SHALL load variables from `.env` file using `dotenv`
- **AND** environment-specific files (`.env.development`, `.env.production`) SHALL be supported
