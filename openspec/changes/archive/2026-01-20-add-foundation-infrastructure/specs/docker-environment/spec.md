## ADDED Requirements

### Requirement: Docker Compose Development Environment

The project SHALL provide a Docker Compose configuration for local development that orchestrates all required services.

#### Scenario: Starting development environment
- **WHEN** `docker compose up` is run from the project root
- **THEN** all services SHALL start successfully
- **AND** the API SHALL be accessible at `http://localhost:3001`
- **AND** the Web app SHALL be accessible at `http://localhost:3000`
- **AND** PostgreSQL SHALL be accessible at `localhost:5432`
- **AND** Redis SHALL be accessible at `localhost:6379`

#### Scenario: Service health checks
- **WHEN** all services are running
- **THEN** each service SHALL have a health check configured
- **AND** dependent services SHALL wait for their dependencies to be healthy

### Requirement: API Container

The API service SHALL be containerized with hot-reload support for development.

#### Scenario: API container configuration
- **WHEN** the API container is built and started
- **THEN** it SHALL use Node.js 20 Alpine as the base image
- **AND** it SHALL expose port 3001
- **AND** it SHALL mount the `packages/api` directory for live code changes
- **AND** it SHALL use `npm run dev` for the start command
- **AND** code changes SHALL trigger automatic restart

#### Scenario: API environment variables
- **WHEN** the API container starts
- **THEN** it SHALL receive the following environment variables:
  - `NODE_ENV=development`
  - `DATABASE_URL` pointing to the PostgreSQL container
  - `REDIS_URL` pointing to the Redis container
  - `JWT_SECRET` for token signing
  - `PORT=3001`

### Requirement: Web Container

The Web service SHALL be containerized with hot-reload support for development.

#### Scenario: Web container configuration
- **WHEN** the Web container is built and started
- **THEN** it SHALL use Node.js 20 Alpine as the base image
- **AND** it SHALL expose port 3000
- **AND** it SHALL mount the `packages/web` directory for live code changes
- **AND** it SHALL use Vite's dev server with HMR enabled
- **AND** code changes SHALL trigger hot module replacement

#### Scenario: Web environment variables
- **WHEN** the Web container starts
- **THEN** it SHALL receive:
  - `VITE_API_URL=http://localhost:3001/api/v1`

### Requirement: PostgreSQL Container

The PostgreSQL service SHALL provide persistent database storage for development.

#### Scenario: PostgreSQL container configuration
- **WHEN** the PostgreSQL container starts
- **THEN** it SHALL use PostgreSQL 15 or later
- **AND** it SHALL create a database named `ccalendar`
- **AND** it SHALL use credentials `postgres:postgres` for development
- **AND** data SHALL be persisted in a named Docker volume
- **AND** the database SHALL be accessible from both API and host machine

#### Scenario: Database initialization
- **WHEN** the PostgreSQL container starts for the first time
- **THEN** the `ccalendar` database SHALL be created automatically
- **AND** the database SHALL be ready to accept Prisma migrations

### Requirement: Redis Container

The Redis service SHALL provide caching and session storage for development.

#### Scenario: Redis container configuration
- **WHEN** the Redis container starts
- **THEN** it SHALL use Redis 7 or later
- **AND** it SHALL expose port 6379
- **AND** data SHALL be persisted in a named Docker volume
- **AND** the service SHALL be accessible from the API container

### Requirement: Volume Management

Docker volumes SHALL persist data between container restarts.

#### Scenario: Data persistence
- **WHEN** containers are stopped and restarted with `docker compose down && docker compose up`
- **THEN** PostgreSQL data SHALL be preserved
- **AND** Redis data SHALL be preserved

#### Scenario: Clean slate development
- **WHEN** `docker compose down -v` is executed
- **THEN** all volumes SHALL be removed
- **AND** the next `docker compose up` SHALL start with fresh data

### Requirement: Network Configuration

All services SHALL communicate over a dedicated Docker network.

#### Scenario: Inter-service communication
- **WHEN** services are running
- **THEN** the API container SHALL connect to PostgreSQL using hostname `db`
- **AND** the API container SHALL connect to Redis using hostname `redis`
- **AND** containers SHALL resolve each other by service name
